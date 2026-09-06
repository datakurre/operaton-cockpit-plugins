import queryString from 'query-string';
import { getStorage } from './storage';

/** Time constants for duration calculations */
const TIME_CONSTANTS = {
  MS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  PADDING_THRESHOLD: 10,
  MS_DIVISOR: 100,
} as const;

/** Interface for objects with optional endTime */
interface WithEndTime {
  endTime?: string | null;
}

/** Interface for objects with a name field */
interface WithName {
  name?: string | null;
}

/**
 * Sort activities by end time in descending order (most recent first)
 * Activities without an endTime are treated as current (using Date.now())
 * @param activities - Array of activities with optional endTime
 * @returns New sorted array (does not mutate original)
 */
export const sortActivitiesByEndTime = <T extends WithEndTime>(activities: T[]): T[] => {
  return [...activities].sort((a, b) => {
    const aTime = a.endTime ? new Date(a.endTime).getTime() : Date.now();
    const bTime = b.endTime ? new Date(b.endTime).getTime() : Date.now();
    return bTime - aTime; // Descending order (most recent first)
  });
};

/**
 * Sort items by name in ascending order (alphabetical)
 * @param items - Array of items with optional name field
 * @returns New sorted array (does not mutate original)
 */
export const sortByName = <T extends WithName>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const aName = a.name ?? '';
    const bName = b.name ?? '';
    return aName.localeCompare(bName);
  });
};

/** Interface for decision instances (supports nullable fields from OpenAPI) */
interface DecisionInstance {
  id?: string | null;
  activityInstanceId?: string | null;
}

/**
 * Create a map of activity instance IDs to decision IDs
 * @param decisions - Array of decision instances
 * @returns Map from activityInstanceId to decision id
 */
export const mapDecisionsByActivity = (decisions: DecisionInstance[]): Map<string, string> => {
  return new Map<string, string>(
    decisions
      .filter(
        (d): d is { id: string; activityInstanceId: string } =>
          d.id !== null && d.id !== undefined && d.activityInstanceId !== null && d.activityInstanceId !== undefined
      )
      .map(decision => [decision.activityInstanceId, decision.id])
  );
};

/**
 * Convert a duration in milliseconds to a human-readable time string
 * @param duration - Duration in milliseconds
 * @returns Formatted time string (HH:MM:SS.m)
 */
export const asctime = (duration: number): string => {
  const milliseconds = parseInt(
    String((duration % TIME_CONSTANTS.MS_PER_SECOND) / TIME_CONSTANTS.MS_DIVISOR),
    TIME_CONSTANTS.PADDING_THRESHOLD
  );
  const seconds = Math.floor((duration / TIME_CONSTANTS.MS_PER_SECOND) % TIME_CONSTANTS.SECONDS_PER_MINUTE);
  const minutes = Math.floor(
    (duration / (TIME_CONSTANTS.MS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE)) % TIME_CONSTANTS.MINUTES_PER_HOUR
  );
  const hours = Math.floor(
    (duration / (TIME_CONSTANTS.MS_PER_SECOND * TIME_CONSTANTS.SECONDS_PER_MINUTE * TIME_CONSTANTS.MINUTES_PER_HOUR)) %
      TIME_CONSTANTS.HOURS_PER_DAY
  );

  const hoursStr = hours < TIME_CONSTANTS.PADDING_THRESHOLD ? `0${String(hours)}` : String(hours);
  const minutesStr = minutes < TIME_CONSTANTS.PADDING_THRESHOLD ? `0${String(minutes)}` : String(minutes);
  const secondsStr = seconds < TIME_CONSTANTS.PADDING_THRESHOLD ? `0${String(seconds)}` : String(seconds);

  return `${hoursStr}:${minutesStr}:${secondsStr}.${String(milliseconds)}`;
};

/**
 * Filter an iterable based on a condition
 * @param iterable - Array to filter
 * @param condition - Predicate function
 * @returns Filtered array
 */
export const filter: <T>(iterable: T[], condition: (x: T) => boolean) => T[] = (iterable, condition) => {
  const result = [];
  for (const item of iterable) {
    if (condition(item)) {
      result.push(item);
    }
  }
  return result;
};

/** Plugin settings interface */
export interface PluginSettings {
  autoRefresh: boolean;
  showHistoricBadges: boolean;
  showSequenceFlow: boolean;
  showHeatmap: boolean;
  showInstanceHeatmap: boolean;
  leftPaneSize: number | null;
  topPaneSize: number | null;
  maxResults: number;
}

/** Stored settings shape from localStorage */
interface StoredSettings {
  autoRefresh?: boolean;
  showHistoricBadges?: boolean;
  showSequenceFlow?: boolean;
  showHeatmap?: boolean;
  showInstanceHeatmap?: boolean;
  leftPaneSize?: number;
  topPaneSize?: number;
  maxResults?: number;
}

const SETTINGS_KEY = 'minimal-history-plugin';

/** Default maximum results for API queries */
export const DEFAULT_MAX_RESULTS = 1000;

/** Default settings when none are stored */
const DEFAULT_SETTINGS: PluginSettings = {
  autoRefresh: false,
  showHistoricBadges: false,
  showSequenceFlow: false,
  showHeatmap: false,
  showInstanceHeatmap: false,
  leftPaneSize: null,
  topPaneSize: null,
  maxResults: DEFAULT_MAX_RESULTS,
};

/**
 * Parse stored settings JSON safely
 * @param jsonString - JSON string from localStorage
 * @returns Parsed settings or empty object
 */
function parseStoredSettings(jsonString: string | null): StoredSettings {
  if (jsonString === null) {
    return {};
  }
  try {
    return JSON.parse(jsonString) as StoredSettings;
  } catch {
    return {};
  }
}

/**
 * Load plugin settings from localStorage and URL hash
 * @returns Merged plugin settings
 */
export const loadSettings = (): PluginSettings => {
  const storage = getStorage();
  const hashSplit = location.hash.split('?', 1)[0];
  const parsed = queryString.parse(location.hash.substring((hashSplit ?? '').length + 1));

  const raw = parseStoredSettings(storage.get(SETTINGS_KEY));

  const autoRefreshParam = parsed['autoRefresh'];
  const showHistoricBadgesParam = parsed['showHistoricBadges'];
  const showSequenceFlowParam = parsed['showSequenceFlow'];
  const showHeatmapParam = parsed['showHeatmap'];
  const showInstanceHeatmapParam = parsed['showInstanceHeatmap'];

  const maxResultsParam = parsed['maxResults'];
  const maxResultsValue = typeof maxResultsParam === 'string' ? parseInt(maxResultsParam, 10) : undefined;

  return {
    autoRefresh: raw.autoRefresh === true || autoRefreshParam !== undefined,
    showHistoricBadges: raw.showHistoricBadges === true || showHistoricBadgesParam !== undefined,
    showSequenceFlow: raw.showSequenceFlow === true || showSequenceFlowParam !== undefined,
    showHeatmap: raw.showHeatmap === true || showHeatmapParam !== undefined,
    // Kept separate from showHeatmap: that one drives the definition diagram's
    // statistics button, where it also implies the badges are on. Sharing it would
    // mean switching heat on here silently switched badges on over there.
    showInstanceHeatmap: raw.showInstanceHeatmap === true || showInstanceHeatmapParam !== undefined,
    leftPaneSize: raw.leftPaneSize ?? DEFAULT_SETTINGS.leftPaneSize,
    topPaneSize: raw.topPaneSize ?? DEFAULT_SETTINGS.topPaneSize,
    maxResults: maxResultsValue ?? raw.maxResults ?? DEFAULT_SETTINGS.maxResults,
  };
};

/**
 * Save plugin settings to storage
 * @param settings - The settings to save
 */
export const saveSettings = (settings: PluginSettings): void => {
  const storage = getStorage();
  storage.set(SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Checks whether a process instance is still running (active or suspended, not ended).
 * An instance is considered running if:
 * 1. State is explicitly ACTIVE or SUSPENDED
 * 2. Or endTime is not set, and state is not a terminated/completed state
 *
 * @param instance - Process instance with optional state and endTime
 * @param instance.state - The state of the process instance
 * @param instance.endTime - The end time of the process instance
 * @returns True if the process instance is still running
 */
export const isProcessInstanceRunning = (instance: {
  state?: string | null | undefined;
  endTime?: string | null | undefined;
}): boolean => {
  const stateUpper = instance.state?.toUpperCase();
  if (stateUpper === 'ACTIVE' || stateUpper === 'SUSPENDED') {
    return true;
  }
  if (stateUpper === 'COMPLETED' || stateUpper === 'EXTERNALLY_TERMINATED' || stateUpper === 'INTERNALLY_TERMINATED') {
    return false;
  }
  return !instance.endTime;
};
