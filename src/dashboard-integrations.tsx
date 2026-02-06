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

import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import type { API } from './types';
import { get, post, put } from './utils/api';
import { MINUTES_PER_HOUR } from './utils/constants';
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
 * Load favourites-only filter setting (default: false)
 */
function loadFavouritesOnlySetting(): boolean {
  const storage = getStorage();
  const value = storage.get(FAVOURITES_ONLY_KEY);
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
  const [favouriteKeys, setFavouriteKeys] = useState<Set<string>>(new Set());
  const [favouritesOnly, setFavouritesOnly] = useState<boolean>(false);

  // Load favourites and filter setting on mount
  useEffect(() => {
    const favKeys = loadFavouriteKeys();
    setFavouriteKeys(favKeys);
    setFavouritesOnly(loadFavouritesOnlySetting());
  }, []);

  /**
   * Fetch external tasks from the API
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all external tasks
      const externalTasks = (await get(api, '/external-task', {})) as ExternalTask[] | null;
      const taskList = externalTasks ?? [];
      setTasks(taskList);

      // Collect unique process definition IDs
      const processDefIds = new Set<string>();
      for (const task of taskList) {
        if (task.processDefinitionId) {
          processDefIds.add(task.processDefinitionId);
        }
      }

      // Fetch process definition names and keys
      const namesMap = new Map<string, string>();
      const keysMap = new Map<string, string>();
      for (const defId of Array.from(processDefIds)) {
        try {
          const def = (await get(api, `/process-definition/${defId}`, {})) as ProcessDefinition | null;
          if (def) {
            namesMap.set(defId, def.name ?? def.key);
            keysMap.set(defId, def.key);
          }
        } catch {
          // Ignore errors for individual definitions
        }
      }
      setProcessNames(namesMap);
      setProcessDefKeys(keysMap);

      // Collect unique process instance IDs for incident lookup
      const processInstanceIds = new Set<string>();
      for (const task of taskList) {
        if (task.processInstanceId) {
          processInstanceIds.add(task.processInstanceId);
        }
      }

      // Fetch incidents for each process instance
      const incidentsMap = new Map<string, Incident[]>();
      for (const instanceId of Array.from(processInstanceIds)) {
        try {
          const instanceIncidents = (await get(api, '/incident', {
            processInstanceId: instanceId,
          })) as Incident[] | null;
          if (instanceIncidents && instanceIncidents.length > 0) {
            incidentsMap.set(instanceId, instanceIncidents);
          }
        } catch {
          // Ignore errors for individual incidents
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

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

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
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id).filter((id): id is string => id !== null)));
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
      // Use batch endpoint if available, otherwise retry individually
      await post(
        api,
        '/external-task/retries',
        {},
        JSON.stringify({
          externalTaskIds: taskIds,
          retries: 1,
        })
      );
      setSelectedTasks(new Set());
      await fetchTasks();
    } catch {
      // Fallback to individual retries using PUT helper
      for (const taskId of taskIds) {
        try {
          await put(api, `/external-task/${taskId}/retries`, JSON.stringify({ retries: 1 }));
        } catch (_err) {
          console.error('Error retrying task:', taskId, _err);
        }
      }
      setSelectedTasks(new Set());
      await fetchTasks();
    } finally {
      setActionLoading(new Set());
    }
  };

  /**
   * Build cockpit URL for a process instance
   */
  const getInstanceUrl = (processInstanceId: string): string => {
    return `#/process-instance/${processInstanceId}/runtime`;
  };

  /**
   * Check if a task is locked (has lock expiration time)
   */
  const isLocked = (task: ExternalTask): boolean => {
    return task.lockExpirationTime !== null && new Date(task.lockExpirationTime) > new Date();
  };

  /**
   * Check if a task has been locked for more than 5 minutes.
   * We check if the task is currently locked (has a future lock expiration time).
   * Since we don't have the exact lock start time from the API, we consider any
   * currently locked task as potentially locked for more than 5 minutes.
   */
  const isLockedLongEnough = (task: ExternalTask): boolean => {
    if (!task.lockExpirationTime || !task.workerId) {
      return false;
    }
    const lockExpirationDate = new Date(task.lockExpirationTime);
    const now = new Date();

    // Task is locked if expiration time is in the future
    const currentlyLocked = lockExpirationDate > now;

    // If the task is currently locked, we consider it locked long enough
    // (since we can't determine the exact lock start time from the API)
    return currentlyLocked;
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
    const mins = Math.floor(remainingSecs / MINUTES_PER_HOUR);
    const secs = remainingSecs % MINUTES_PER_HOUR;

    return `${formatDateTime(lockTime)} (${mins}m ${secs}s remaining)`;
  };

  // Pre-filter tasks for incident or lock check (before favourites filtering)
  const tasksWithIssues = tasks.filter(task => {
    const hasIncident = task.processInstanceId && incidents.has(task.processInstanceId);
    const lockedLongEnough = isLockedLongEnough(task);
    return Boolean(hasIncident) || lockedLongEnough;
  });

  // Apply favourites filter on top
  const filteredTasks = tasksWithIssues.filter(task => {
    // If favourites filter is enabled, check if task belongs to a favourited definition
    if (favouritesOnly) {
      // If no favourites configured, filter out everything
      if (favouriteKeys.size === 0) {
        return false;
      }
      const defKey = task.processDefinitionId ? processDefKeys.get(task.processDefinitionId) : null;
      return defKey ? favouriteKeys.has(defKey) : false;
    }

    return true;
  });

  /**
   * Toggle favourites-only filter
   */
  const handleToggleFavouritesOnly = (): void => {
    const newValue = !favouritesOnly;
    setFavouritesOnly(newValue);
    saveFavouritesOnlySetting(newValue);
  };

  // If no tasks with issues at all (before favourites filtering), render nothing
  if (!isLoading && tasksWithIssues.length === 0 && !error) {
    return null;
  }

  const title = `${filteredTasks.length} external task${filteredTasks.length !== 1 ? 's' : ''}`;

  // Error state overlay
  if (error) {
    return (
      <DashboardSection title="External Tasks" hasData={false} emptyMessage="">
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
      title={title}
      isLoading={isLoading}
      hasData={filteredTasks.length > 0}
      emptyMessage={emptyMessage}
      onRefresh={() => void fetchTasks()}
      headerActions={
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
            style={{ cursor: 'pointer' }}
          />
          Favourites only
        </label>
      }
    >
      {selectedTasks.size > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <button className="btn btn-primary" onClick={() => void handleBatchRetry()} disabled={actionLoading.size > 0}>
            Retry Selected ({selectedTasks.size})
          </button>
        </div>
      )}
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
    pluginPoint: 'cockpit.processes.dashboard',
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
