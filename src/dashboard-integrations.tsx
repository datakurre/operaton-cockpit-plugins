/* eslint-disable max-statements, @typescript-eslint/naming-convention -- Complex dashboard with external task management */
/**
 * Dashboard Integrations Plugin
 *
 * This plugin provides a dashboard section that lists all active external tasks.
 * Features:
 * - Table showing process name, task name, topic, worker, lock time, retries
 * - Incident indicator with link to process view
 * - Retry and unlock actions for individual and batch operations
 * - Selection column for batch operations
 */

import './Components/Button.scss';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { API } from './types';
import { get, post, put } from './utils/api';
import { DEFAULT_MAX_RESULTS, SECONDS_PER_MINUTE } from './utils/constants';
import { formatDateTime } from './utils/formatting';
import { getStorage } from './utils/storage';
import ErrorMessage from './Components/ErrorMessage';
import DashboardSection from './Components/DashboardSection';

// =============================================================================
// Storage utilities
// =============================================================================

const FAVOURITES_KEY = 'minimal-history-plugin-favourites';
const FAVOURITES_ONLY_KEY = 'minimal-history-plugin-integrations-favourites-only';

interface FavouriteDefinition {
  key: string;
  name: string | null;
}

/**
 * Load favourite process definition keys from localStorage
 */
function loadFavouriteKeys(): Set<string> {
  const storage = getStorage();
  const raw = storage.get(FAVOURITES_KEY);
  if (!raw) {
    return new Set();
  }
  try {
    const favourites = JSON.parse(raw) as FavouriteDefinition[];
    return new Set(favourites.map(f => f.key));
  } catch {
    return new Set();
  }
}

/**
 * Load favourites-only filter setting (default: true)
 */
function loadFavouritesOnlySetting(): boolean {
  const storage = getStorage();
  const value = storage.get(FAVOURITES_ONLY_KEY);
  // Default to true if no setting exists
  if (value === null) {
    return true;
  }
  return value === 'true';
}

/**
 * Save favourites-only filter setting
 */
function saveFavouritesOnlySetting(enabled: boolean): void {
  const storage = getStorage();
  storage.set(FAVOURITES_ONLY_KEY, enabled ? 'true' : 'false');
}

// =============================================================================
// Types
// =============================================================================

/** External task data from the API */
interface ExternalTask {
  id: string | null;
  activityId: string | null;
  activityInstanceId: string | null;
  errorMessage: string | null;
  executionId: string | null;
  lockExpirationTime: string | null;
  processDefinitionId: string | null;
  processDefinitionKey: string | null;
  processInstanceId: string | null;
  retries: number | null;
  suspended: boolean | null;
  topicName: string | null;
  workerId: string | null;
  priority: number | null;
  tenantId: string | null;
  businessKey: string | null;
}

/** Process definition for name resolution */
interface ProcessDefinition {
  id: string;
  key: string;
  name: string | null;
  version: number;
}

/** Incident data */
interface Incident {
  id: string;
  processInstanceId: string;
  processDefinitionId: string;
  incidentType: string;
  incidentMessage: string | null;
  activityId: string | null;
}

// =============================================================================
// IntegrationsTable Component
// =============================================================================

interface IntegrationsTableProps {
  api: API;
}

/**
 * Main component for the Integrations dashboard section.
 * Displays external tasks with actions for retry and unlock.
 */
// eslint-disable-next-line max-lines-per-function -- Complex dashboard component with cohesive functionality
const IntegrationsTable: React.FC<IntegrationsTableProps> = ({ api }) => {
  const [tasks, setTasks] = useState<ExternalTask[]>([]);
  const [incidents, setIncidents] = useState<Map<string, Incident[]>>(new Map());
  const [processNames, setProcessNames] = useState<Map<string, string>>(new Map());
  const [processDefKeys, setProcessDefKeys] = useState<Map<string, string>>(new Map());
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  // Refreshed on every fetch: the render-time filter below and the server-side filter in
  // fetchTasks have to agree, and starring a definition elsewhere changes the stored set.
  const [favouriteKeys, setFavouriteKeys] = useState<Set<string>>(() => loadFavouriteKeys());
  const [favouritesOnly, setFavouritesOnly] = useState<boolean>(() => loadFavouritesOnlySetting());

  // Replace "Custom Plugins" section title with "Incidents and locked tasks"
  useEffect(() => {
    const titleElement =
      document.querySelector('h1.section-title.col-xs-4.ng-binding') ||
      document.querySelector('h1.section-title.col-sm-4.ng-binding');
    if (titleElement?.textContent === 'Custom Plugins') {
      titleElement.textContent = 'Incidents and retry locks';
      titleElement.classList.remove('col-xs-4');
      titleElement.classList.add('col-xs-8');
    }
  }, []);

  /**
   * Load the external tasks and everything shown alongside them.
   *
   * Three bounded requests, not one per definition and one per instance: the favourites
   * filter is pushed into the external task query, definition names come back in a single
   * `processDefinitionIdIn` lookup, and incidents in a single `processDefinitionKeyIn`
   * lookup that is grouped by instance here.
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check favorites configuration early
      const favKeys = loadFavouriteKeys();
      const favouritesOnlyEnabled = loadFavouritesOnlySetting();
      setFavouriteKeys(favKeys);

      // If favorites filter is enabled but no favorites configured, skip all API calls
      if (favouritesOnlyEnabled && favKeys.size === 0) {
        setTasks([]);
        setProcessNames(new Map());
        setProcessDefKeys(new Map());
        setIncidents(new Map());
        setIsLoading(false);
        return;
      }

      const taskParams: Record<string, string> = { maxResults: String(DEFAULT_MAX_RESULTS) };
      if (favouritesOnlyEnabled) {
        taskParams['processDefinitionKeyIn'] = Array.from(favKeys).join(',');
      }

      const externalTasks = (await get(api, '/external-task', taskParams)) as ExternalTask[] | null;
      const taskList = externalTasks ?? [];
      setTasks(taskList);

      if (taskList.length === 0) {
        setProcessNames(new Map());
        setProcessDefKeys(new Map());
        setIncidents(new Map());
        return;
      }

      const processDefIds = new Set<string>();
      const definitionKeys = new Set<string>();
      for (const task of taskList) {
        if (task.processDefinitionId) {
          processDefIds.add(task.processDefinitionId);
        }
        if (task.processDefinitionKey) {
          definitionKeys.add(task.processDefinitionKey);
        }
      }

      const [definitions, allIncidents] = await Promise.all([
        processDefIds.size > 0
          ? (get(api, '/process-definition', {
              processDefinitionIdIn: Array.from(processDefIds).join(','),
              maxResults: String(DEFAULT_MAX_RESULTS),
            }) as Promise<ProcessDefinition[] | null>)
          : Promise.resolve([]),
        definitionKeys.size > 0
          ? (get(api, '/incident', {
              processDefinitionKeyIn: Array.from(definitionKeys).join(','),
              maxResults: String(DEFAULT_MAX_RESULTS),
            }) as Promise<Incident[] | null>)
          : Promise.resolve([]),
      ]);

      const namesMap = new Map<string, string>();
      const keysMap = new Map<string, string>();
      for (const def of definitions ?? []) {
        namesMap.set(def.id, def.name ?? def.key);
        keysMap.set(def.id, def.key);
      }
      setProcessNames(namesMap);
      setProcessDefKeys(keysMap);

      // /incident has no processInstanceIdIn, so the query is by definition key and the
      // rows are grouped by instance here. Extra instances in the response are harmless:
      // only the instances that have a task are ever looked up.
      const incidentsMap = new Map<string, Incident[]>();
      for (const incident of allIncidents ?? []) {
        const existing = incidentsMap.get(incident.processInstanceId);
        if (existing) {
          existing.push(incident);
        } else {
          incidentsMap.set(incident.processInstanceId, [incident]);
        }
      }
      setIncidents(incidentsMap);
    } catch (_err) {
      setError('Failed to fetch external tasks');
      console.error('Error fetching external tasks:', _err);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Debounced fetch with 300ms delay
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetchTasks = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      void fetchTasks();
    }, 300);
  }, [fetchTasks]);

  useEffect(() => {
    debouncedFetchTasks();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedFetchTasks]);

  /**
   * Check if a task is locked (has lock expiration time)
   */
  const isLocked = (task: ExternalTask): boolean => {
    return task.lockExpirationTime !== null && new Date(task.lockExpirationTime) > new Date();
  };

  /**
   * Check whether a task is currently held by a worker.
   *
   * The API reports when a lock expires but not when it was taken, so how long a task has
   * been held cannot be derived here. This asks only whether it is held right now.
   */
  const isHeldByWorker = (task: ExternalTask): boolean => {
    if (!task.lockExpirationTime || !task.workerId) {
      return false;
    }
    return new Date(task.lockExpirationTime) > new Date();
  };

  /**
   * Format lock expiration time with remaining time
   */
  const formatLockTime = (lockTime: string | null): string => {
    if (!lockTime) {
      return '-';
    }
    const lockDate = new Date(lockTime);
    if (isNaN(lockDate.getTime())) {
      return '-';
    }

    const now = new Date();
    if (lockDate <= now) {
      return `Expired at ${formatDateTime(lockTime)}`;
    }

    const remainingMs = lockDate.getTime() - now.getTime();
    const remainingSecs = Math.floor(remainingMs / 1000);
    const mins = Math.floor(remainingSecs / SECONDS_PER_MINUTE);
    const secs = remainingSecs % SECONDS_PER_MINUTE;

    return `${formatDateTime(lockTime)} (${mins}m ${secs}s remaining)`;
  };

  // Pre-filter tasks for incident or lock check (before favourites filtering)
  const tasksWithIssues = tasks.filter(task => {
    const hasIncident = task.processInstanceId && incidents.has(task.processInstanceId);
    return Boolean(hasIncident) || isHeldByWorker(task);
  });

  // Apply favourites filter on top
  const filteredTasks = tasksWithIssues.filter(task => {
    // If favourites filter is enabled, check if task belongs to a favourited definition
    if (favouritesOnly) {
      // If no favourites configured, filter out everything
      if (favouriteKeys.size === 0) {
        return false;
      }
      // Use processDefinitionKey from external task, fallback to processDefKeys map
      const defKey =
        task.processDefinitionKey ?? (task.processDefinitionId ? processDefKeys.get(task.processDefinitionId) : null);
      return defKey ? favouriteKeys.has(defKey) : false;
    }

    return true;
  });

  // Automatically clear selections that are not visible when favourites filter is enabled
  const prevFavouritesOnlyRef = useRef<boolean>(favouritesOnly);

  useEffect(() => {
    // Only clear invalid selections when switching TO favourites-only mode
    if (favouritesOnly && !prevFavouritesOnlyRef.current && selectedTasks.size > 0) {
      // Reload favourites to get the latest list
      const currentFavouriteKeys = loadFavouriteKeys();

      // Check selections against tasks using processDefinitionKey directly
      const validSelections = new Set<string>();

      for (const taskId of Array.from(selectedTasks)) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          // Use processDefinitionKey from external task, fallback to processDefKeys map
          const defKey =
            task.processDefinitionKey ??
            (task.processDefinitionId ? processDefKeys.get(task.processDefinitionId) : null);
          if (defKey && currentFavouriteKeys.has(defKey)) {
            validSelections.add(taskId);
          }
        }
      }

      // Only update if selections actually changed
      if (validSelections.size !== selectedTasks.size) {
        setSelectedTasks(validSelections);
      }
    }

    prevFavouritesOnlyRef.current = favouritesOnly;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favouritesOnly]);

  /**
   * Toggle selection of a single task
   */
  const handleToggleTask = (taskId: string): void => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  /**
   * Toggle selection of all tasks
   */
  const handleToggleAll = (): void => {
    if (selectedTasks.size === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id).filter((id): id is string => id !== null)));
    }
  };

  /**
   * Retry a single task by setting retries to 1
   */
  const handleRetry = async (taskId: string): Promise<void> => {
    setActionLoading(prev => new Set(prev).add(taskId));
    try {
      await put(api, `/external-task/${taskId}/retries`, JSON.stringify({ retries: 1 }));
      await fetchTasks();
    } catch (_err) {
      console.error('Error retrying task:', _err);
      setError('Failed to retry task');
    } finally {
      setActionLoading(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  /**
   * Unlock a locked task
   */
  const handleUnlock = async (taskId: string): Promise<void> => {
    setActionLoading(prev => new Set(prev).add(taskId));
    try {
      await post(api, `/external-task/${taskId}/unlock`, {}, '');
      await fetchTasks();
    } catch (_err) {
      console.error('Error unlocking task:', _err);
      setError('Failed to unlock task');
    } finally {
      setActionLoading(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  /**
   * Batch retry selected tasks
   */
  const handleBatchRetry = async (): Promise<void> => {
    if (selectedTasks.size === 0) {
      return;
    }

    const taskIds = Array.from(selectedTasks);
    for (const taskId of taskIds) {
      setActionLoading(prev => new Set(prev).add(taskId));
    }

    try {
      // /external-task/retries is PUT-only. It used to be called with POST here, which the
      // engine answered with 405 every time, so the batch never ran and a silent catch fell
      // back to one request per task while hiding real failures such as a denied permission.
      await put(
        api,
        '/external-task/retries',
        JSON.stringify({
          externalTaskIds: taskIds,
          retries: 1,
        })
      );
      setSelectedTasks(new Set());
      await fetchTasks();
    } catch (_err) {
      console.error('Error retrying tasks:', _err);
      setError(`Failed to retry ${taskIds.length} task${taskIds.length !== 1 ? 's' : ''}`);
    } finally {
      setActionLoading(prev => {
        const next = new Set(prev);
        for (const taskId of taskIds) {
          next.delete(taskId);
        }
        return next;
      });
    }
  };

  /**
   * Build cockpit URL for a process instance
   */
  const getInstanceUrl = (processInstanceId: string): string => {
    return `#/process-instance/${processInstanceId}/runtime`;
  };

  /**
   * Toggle favourites-only filter
   */
  const handleToggleFavouritesOnly = (): void => {
    const newValue = !favouritesOnly;
    setFavouritesOnly(newValue);
    saveFavouritesOnlySetting(newValue);
    debouncedFetchTasks();
  };

  // Error state overlay
  if (error) {
    return (
      <DashboardSection title="External Tasks" hasData={false} emptyMessage="" useWrapper={false}>
        <ErrorMessage message={error} />
        <button className="btn btn-default" onClick={() => void fetchTasks()}>
          Retry
        </button>
      </DashboardSection>
    );
  }

  let emptyMessage = 'No external tasks with incidents or locked for more than 5 minutes.';
  if (favouritesOnly && favouriteKeys.size === 0) {
    emptyMessage = 'No favourites configured. Star a process definition to add it to favourites.';
  } else if (favouritesOnly) {
    emptyMessage = 'No external tasks from favourited process definitions.';
  }

  return (
    <DashboardSection
      title=""
      isLoading={isLoading}
      hasData={filteredTasks.length > 0}
      emptyMessage={emptyMessage}
      onRefresh={() => void fetchTasks()}
      useWrapper={false}
      headerActions={
        <>
          {selectedTasks.size > 0 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => void handleBatchRetry()}
              disabled={actionLoading.size > 0}
            >
              Retry Selected ({selectedTasks.size})
            </button>
          )}
          <div style={{ flex: 1 }} />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: 0,
              fontWeight: 'normal',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={favouritesOnly}
              onChange={handleToggleFavouritesOnly}
              style={{ cursor: 'pointer', margin: 0, verticalAlign: 'middle' }}
            />
            <span style={{ lineHeight: '1' }}>Favourites only</span>
          </label>
        </>
      }
    >
      <table className="cam-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }}>
              <input
                type="checkbox"
                checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                onChange={handleToggleAll}
                title="Select all"
              />
            </th>
            <th>Process</th>
            <th>Activity</th>
            <th>Topic</th>
            <th>Worker</th>
            <th>Lock Expires</th>
            <th>Retries</th>
            <th>Incident</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => {
            const taskId = task.id ?? '';
            const processName = task.processDefinitionId
              ? (processNames.get(task.processDefinitionId) ?? task.processDefinitionKey)
              : '-';
            const taskIncidents = task.processInstanceId ? (incidents.get(task.processInstanceId) ?? []) : [];
            const hasIncident = taskIncidents.length > 0;
            const locked = isLocked(task);
            const loading = actionLoading.has(taskId);

            return (
              <tr key={taskId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(taskId)}
                    onChange={() => {
                      handleToggleTask(taskId);
                    }}
                  />
                </td>
                <td>
                  {task.processInstanceId ? (
                    <a href={getInstanceUrl(task.processInstanceId)}>{processName}</a>
                  ) : (
                    processName
                  )}
                </td>
                <td>{task.activityId ?? '-'}</td>
                <td>{task.topicName ?? '-'}</td>
                <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.workerId ?? '-'}
                </td>
                <td>{formatLockTime(task.lockExpirationTime)}</td>
                <td>{task.retries ?? 0}</td>
                <td>
                  {hasIncident ? (
                    <span
                      style={{ color: 'red', cursor: 'pointer' }}
                      title={taskIncidents[0]?.incidentMessage ?? 'Incident'}
                    >
                      ⚠️ Yes
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {(() => {
                      if (hasIncident) {
                        return (
                          <button
                            className="btn btn-xs btn-default"
                            onClick={() => {
                              void handleRetry(taskId);
                            }}
                            disabled={loading}
                            title="Set retries to 1"
                          >
                            {loading ? '...' : 'Retry'}
                          </button>
                        );
                      }
                      if (locked) {
                        return (
                          <button
                            className="btn btn-xs btn-default"
                            onClick={() => {
                              void handleUnlock(taskId);
                            }}
                            disabled={loading}
                            title="Unlock task"
                          >
                            {loading ? '...' : 'Unlock'}
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DashboardSection>
  );
};

// =============================================================================
// Plugin Export
// =============================================================================

interface DashboardParams {
  api: API;
}

export default [
  {
    id: 'dashboardIntegrationsDashboard',
    pluginPoint: 'cockpit.dashboard',
    priority: 10,
    render: (node: Element, { api }: DashboardParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <IntegrationsTable api={api} />
        </React.StrictMode>
      );
    },
  },
];
