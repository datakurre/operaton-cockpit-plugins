import './Components/Button.scss';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import FilterBox from './Components/FilterBox';
import Portal from './Components/Portal';
import ErrorMessage from './Components/ErrorMessage';
import StatisticsTable from './Components/StatisticsTable';
import WarningBox from './Components/WarningBox';
import { ToggleHistoryStatisticsButton, type StatisticsMode } from './Components/ToggleHistoryStatisticsButton';
import { createHistoryService } from './services/HistoryService';
import type { BpmnViewerInstance, OverlayManager } from './services/ViewerService';
import { DefinitionPluginParams, HistoricActivityInstance } from './types';
import { capToLimit } from './utils/api';
import { DEFAULT_MAX_RESULTS } from './utils/constants';
import {
  parseActivityInstanceExpressions,
  activityInstanceQueryToRecord,
  getDefaultActivityInstanceQuery,
} from './utils/filterExpressionParsers';
import { createDefinitionFilterSchema, type LegacyExpression, fromLegacyExpressions } from './utils/filterSchema';
import { aggregateDurations, clearHeatmap, renderHeatmap } from './utils/bpmn';
import { asctime, filter } from './utils/misc';

interface PluginState {
  viewer: BpmnViewerInstance | null;
  statistics: Element | null;
}

const initialState: PluginState = {
  viewer: null,
  statistics: null,
};

interface PluginHooks {
  setViewer: (viewer: BpmnViewerInstance | null) => void;
  setStatistics: (node: Element | null) => void;
}

const hooks: PluginHooks = {
  setViewer: (viewer: BpmnViewerInstance | null) => {
    initialState.viewer = viewer;
  },
  setStatistics: (node: Element | null) => {
    initialState.statistics = node;
  },
};

/**
 * Draws one badge per activity: how many times it ran. In `heat` mode, the badge
 * also carries the cumulative duration in its tooltip while the heatmap layer colours the
 * canvas underneath by time.
 * @param overlays - The viewer's overlay manager
 * @param activities - Historic activity instances to summarise
 * @param mode - Which figure the badge should carry
 * @returns The overlay ids created, so they can be removed again
 */
export function renderBadges(
  overlays: OverlayManager,
  activities: HistoricActivityInstance[],
  mode: StatisticsMode
): string[] {
  const counts: Record<string, number> = {};
  for (const activity of activities) {
    const id = activity.activityId;
    if (id !== null && id !== undefined) {
      counts[id.split('#')[0] ?? ''] = (counts[id.split('#')[0] ?? ''] ?? 0) + 1;
    }
  }
  const durations = new Map(aggregateDurations(activities).map(cell => [cell.elementId, cell.totalMillis]));

  const ids: string[] = [];
  for (const elementId of Object.keys(counts)) {
    const overlay = document.createElement('span');
    overlay.className = 'badge';
    overlay.style.cssText = 'background: lightgray;';
    overlay.innerText = String(counts[elementId] ?? 0);
    if (mode === 'heat') {
      const total = durations.get(elementId) ?? 0;
      overlay.title = `Cumulative time in this element: ${asctime(total)}`;
    }
    try {
      ids.push(overlays.add(elementId, { position: { bottom: 17, right: 10 }, html: overlay }));
    } catch {
      // Silently skip elements that can't have overlays
    }
  }
  return ids;
}

/**
 * Plugin component for displaying historic activity statistics on process definitions.
 * Manages filter state, diagram overlays, and statistics table rendering.
 */
// eslint-disable-next-line max-lines-per-function -- Plugin with coordinated state for diagram, overlays, and table
const Plugin: React.FC<DefinitionPluginParams> = ({ root, api, processDefinitionId }) => {
  const [expressions, setExpressions] = useState<LegacyExpression[]>([]);
  const [query, setQuery] = useState<Record<string, string | null>>({});
  const [viewer, setViewer] = useState<BpmnViewerInstance | null>(initialState.viewer);
  const [statistics, setStatistics] = useState<Element | null>(initialState.statistics);
  const [processVersion, setProcessVersion] = useState<number | null>(null);
  const [initialFilterSet, setInitialFilterSet] = useState(false);

  hooks.setViewer = setViewer;
  hooks.setStatistics = setStatistics;

  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // Overlay ids, not elements: bpmn-js keeps a container per overlay that only
  // overlays.remove() takes down, so tracking the HTML leaks one container per
  // activity on every filter change.
  const [overlayIds, setOverlayIds] = useState<string[]>([]);
  const [heatmapNodes, setHeatmapNodes] = useState<SVGElement[]>([]);
  const [mode, setMode] = useState<StatisticsMode>('off');

  // Create history service instance (memoized to avoid recreation on each render)
  const historyService = useMemo(() => createHistoryService(api), [api]);

  // Create filter schema with API for autocomplete (memoized to avoid recreation)
  const definitionFilterSchema = useMemo(() => createDefinitionFilterSchema(api), [api]);

  // Fetch process definition version
  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch(`${api.engineApi}/process-definition/${processDefinitionId}`);
        if (response.ok) {
          const data = (await response.json()) as { version?: number };
          if (data.version !== undefined) {
            setProcessVersion(data.version);
          }
        }
      } catch {
        // Silently fail - continue without version filter
      }
    })();
  }, [api.engineApi, processDefinitionId]);

  // Set initial predefined filter once version is loaded
  useEffect(() => {
    if (!initialFilterSet && processVersion !== null) {
      const MS_PER_SECOND = 1000;
      const SECONDS_PER_HOUR = 3600;
      const HOURS_PER_DAY = 24;
      const DAYS_PER_WEEK = 7;

      const weekAgoMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
      const oneDayMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY;
      const weekAgo = new Date(Date.now() - weekAgoMs).toISOString().split('T')[0] ?? '';
      const tomorrow = new Date(Date.now() + oneDayMs).toISOString().split('T')[0] ?? '';

      const defaultExpressions: LegacyExpression[] = [
        { category: 'started', operator: 'after', value: weekAgo },
        { category: 'finished', operator: 'before', value: tomorrow },
        { category: 'version', operator: '==', value: String(processVersion) },
        { category: 'maxResults', operator: 'is', value: String(DEFAULT_MAX_RESULTS) },
      ];

      setExpressions(defaultExpressions);
      setInitialFilterSet(true);
    }
  }, [processVersion, initialFilterSet]);

  // FETCH

  useEffect(() => {
    if (Object.keys(query).length === 0) {
      return;
    }
    // A slow response for an old filter must not land on top of a newer one, and a
    // request in flight when the tab goes away must not set state on the way out.
    // Held in an object rather than a plain `let` so the flag is read as mutable state
    // shared with the cleanup below, not as a constant the analyser can fold away.
    const request = { cancelled: false };
    void (async () => {
      try {
        // Ask for one more than we mean to use: if it comes back, the engine had more to
        // give and everything on this tab is describing a subset. The query sorts by
        // endTime descending, so the records that fall off the end are the oldest, and
        // the statistics quietly skew towards recent activity.
        const limit = Number(query['maxResults'] ?? DEFAULT_MAX_RESULTS);
        const probe = Number.isFinite(limit) && limit > 0 ? { ...query, maxResults: String(limit + 1) } : query;
        const result = (await historyService.getActivitiesByDefinition(
          processDefinitionId,
          probe
        )) as HistoricActivityInstance[];
        if (request.cancelled) {
          return;
        }
        const page = capToLimit(result, limit);
        setTruncated(page.truncated);
        setActivities(page.activities);
        setFetchError(null);
      } catch (error) {
        // Without this the rejection went nowhere: the tab kept showing the previous
        // figures with no hint that the refresh had failed, so a filter that errors
        // looked like a filter that matched what was already on screen.
        if (!request.cancelled) {
          setFetchError(error instanceof Error ? error.message : String(error));
        }
      }
    })();
    return () => {
      request.cancelled = true;
    };
  }, [historyService, processDefinitionId, query]);

  useEffect(() => {
    if (expressions.length > 0) {
      const parsed = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);
      setQuery(activityInstanceQueryToRecord(parsed));
    } else {
      setQuery(getDefaultActivityInstanceQuery(DEFAULT_MAX_RESULTS));
    }
  }, [expressions]);

  // Overlay

  // The button lives outside React's tree, mounted into the viewer's own container, so
  // it gets its own root. Created once per viewer and kept in a ref: rebuilding it
  // whenever a prop changes would append a second button and orphan the first.
  const buttonRootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!viewer) {
      return;
    }
    const container = document.createElement('div');
    container.className = 'viewer-button-container viewer-button-container--top-60';
    viewer._container.appendChild(container);
    const root = createRoot(container);
    buttonRootRef.current = root;
    return () => {
      buttonRootRef.current = null;
      // Unmounting synchronously from inside an effect cleanup is what React warns
      // about, so let the current commit finish first.
      queueMicrotask(() => {
        root.unmount();
        container.remove();
      });
    };
  }, [viewer]);

  // Re-render rather than remount, so the button picks up a truncation that only shows
  // up once the fetch comes back.
  useEffect(() => {
    buttonRootRef.current?.render(
      <React.StrictMode>
        <ToggleHistoryStatisticsButton
          partial={truncated}
          onToggleHistoryStatistics={(next: StatisticsMode) => {
            setMode(next);
          }}
        />
      </React.StrictMode>
    );
  }, [viewer, truncated]);

  // The table, the badges and the heat all have to describe the same set of records, or
  // a badge reads 3 where the table reads 2 and neither is wrong. Unfinished executions
  // are the ones to leave out: they have no duration to total, average or colour by.
  const finished = useMemo(() => filter(activities, activity => Boolean(activity.endTime)), [activities]);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Note: overlayIds and heatmapNodes are intentionally excluded from deps — the effect
  // replaces them, so including them would loop.
  useEffect(() => {
    const overlays = viewer?.get('overlays') as OverlayManager | undefined;
    for (const id of overlayIds) {
      overlays?.remove(id);
    }
    clearHeatmap(heatmapNodes);

    if (mode === 'off' || viewer === null || finished.length === 0) {
      setOverlayIds([]);
      setHeatmapNodes([]);
      return;
    }

    setOverlayIds(overlays ? renderBadges(overlays, finished, mode) : []);
    setHeatmapNodes(mode === 'heat' ? renderHeatmap(viewer, finished) : []);
  }, [viewer, finished, mode]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Hack to ensure long living HTML node for filter box
  if (statistics && !Array.from(statistics.children).includes(root)) {
    statistics.appendChild(root);
  }

  // Tabs
  return statistics ? (
    <Portal node={root}>
      <FilterBox
        schema={definitionFilterSchema}
        onFilterChange={() => {
          // New format handled by onLegacyFilterChange
        }}
        onLegacyFilterChange={setExpressions}
        placeholder="Add filter..."
        initialExpressions={fromLegacyExpressions(expressions, definitionFilterSchema)}
        storageKey="minimal-history-plugin-saved-searches-definition-activities"
      />
      {fetchError !== null ? <ErrorMessage message={`Could not load activity statistics: ${fetchError}`} /> : null}
      {truncated ? (
        <WarningBox title="Partial statistics">
          The engine returned as many activity records as the query allows, so these figures cover only the most
          recently finished {activities.length}. Older executions are missing from the table, the badges and the heatmap
          alike. Narrow the filter or raise <code>maxResults</code> to see the rest.
        </WarningBox>
      ) : null}
      {finished.length > 0 ? <StatisticsTable activities={finished} /> : null}
    </Portal>
  ) : null;
};

export default [
  {
    id: 'definitionHistoricActivitiesDiagramTokens',
    pluginPoint: 'cockpit.processDefinition.diagram.plugin',
    render: (viewer: BpmnViewerInstance): void => {
      hooks.setViewer(viewer);
    },
  },
  {
    id: 'definitionHistoricActivitiesStatisticsTab',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'Statistics',
    },
    render: (node: Element): void => {
      hooks.setStatistics(node);
    },
  },
  {
    id: 'definitionHistoricActivitiesPlugin',
    pluginPoint: 'cockpit.processDefinition.runtime.action',
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <Plugin root={node} api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
];
