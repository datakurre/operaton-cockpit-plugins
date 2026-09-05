/**
 * Integration tests for the two Cockpit dashboard plugins.
 *
 * Covers the request shapes and rendering decisions that were previously wrong:
 * the favourites statistics call, its suspended-definition indicator, and the
 * external task batch retry verb.
 *
 * @module
 */
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { setFetchFunction, resetFetchFunction, clearApiCache } from '../utils/api';
import { mockApi } from '../__mocks__/api';
import { setStorage, MemoryStorage } from '../utils/storage';

const FAVOURITES_KEY = 'minimal-history-plugin-favourites';
const FAVOURITES_ONLY_KEY = 'minimal-history-plugin-integrations-favourites-only';

/**
 * Build a fetch Response stub carrying a JSON payload.
 */
function jsonResponse(payload: unknown): unknown {
  return {
    status: 200,
    ok: true,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  };
}

describe('dashboard plugins', () => {
  let mockFetch: jest.Mock;
  let storage: MemoryStorage;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
    clearApiCache();
    storage = new MemoryStorage();
    setStorage(storage);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('dashboard-favourites statistics request', () => {
    it('does not send a definition filter the endpoint cannot honour', async () => {
      storage.set(FAVOURITES_KEY, JSON.stringify([{ key: 'invoice', name: 'Invoice' }]));

      mockFetch.mockImplementation(async () => jsonResponse([]));

      const { default: Plugin } = await import('../dashboard-favourites');
      const dashboard = Plugin.find(p => p.pluginPoint === 'cockpit.processes.dashboard');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        dashboard?.render(container, { api: mockApi });
      });

      const statsCall = mockFetch.mock.calls.find((c: string[]) => c[0]?.includes('/process-definition/statistics'));
      expect(statsCall).toBeDefined();
      // /process-definition/statistics accepts only failedJobs, incidents, incidentsForType
      // and rootIncidents. processDefinitionKeyIn was silently ignored by the engine.
      expect(statsCall?.[0]).not.toContain('processDefinitionKeyIn');
      expect(statsCall?.[0]).toContain('incidents=true');

      document.body.removeChild(container);
    });

    it('marks a suspended definition as suspended rather than healthy', async () => {
      storage.set(FAVOURITES_KEY, JSON.stringify([{ key: 'suspended-proc', name: 'Suspended' }]));

      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/process-definition/statistics')) {
          return jsonResponse([
            {
              id: 'suspended-proc:1:dep',
              instances: 2,
              failedJobs: 0,
              incidents: [],
              definition: { id: 'suspended-proc:1:dep', key: 'suspended-proc', version: 1, suspended: true },
            },
          ]);
        }
        return jsonResponse([]);
      });

      const { default: Plugin } = await import('../dashboard-favourites');
      const dashboard = Plugin.find(p => p.pluginPoint === 'cockpit.processes.dashboard');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        dashboard?.render(container, { api: mockApi });
      });

      // Previously the State cell only branched on incidents, so a suspended definition
      // fell through to the healthy green circle.
      await act(async () => {
        await Promise.resolve();
      });
      expect(container.querySelector('[aria-label="Suspended"]')).not.toBeNull();
      expect(container.querySelector('.circle-green')).toBeNull();

      document.body.removeChild(container);
    });
  });

  describe('dashboard-integrations request shape', () => {
    it('loads tasks, definitions and incidents in three bounded calls', async () => {
      storage.set(FAVOURITES_KEY, JSON.stringify([{ key: 'proc', name: 'Proc' }]));
      storage.set(FAVOURITES_ONLY_KEY, 'true');

      const task = {
        id: 'task-1',
        processDefinitionId: 'proc:1:dep',
        processDefinitionKey: 'proc',
        processInstanceId: 'pi-1',
        lockExpirationTime: new Date(Date.now() + 600000).toISOString(),
        workerId: 'worker-1',
        retries: 0,
        topicName: 'topic',
        activityId: 'act',
        activityInstanceId: 'ai',
        errorMessage: null,
        executionId: 'ex',
        suspended: false,
        priority: 0,
        tenantId: null,
        businessKey: null,
      };

      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/external-task')) {
          return jsonResponse([task]);
        }
        if (url.includes('/process-definition')) {
          return jsonResponse([{ id: 'proc:1:dep', key: 'proc', name: 'Proc', version: 1 }]);
        }
        if (url.includes('/incident')) {
          return jsonResponse([]);
        }
        return jsonResponse({});
      });

      const { default: Plugin } = await import('../dashboard-integrations');
      const dashboard = Plugin.find(p => p.pluginPoint === 'cockpit.dashboard');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        dashboard?.render(container, { api: mockApi });
      });
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 350));
      });

      const urls = mockFetch.mock.calls.map((c: string[]) => c[0] ?? '');

      // The favourites filter is applied by the engine, and the query is bounded.
      const taskCall = urls.find(u => u.includes('/external-task'));
      expect(taskCall).toContain('processDefinitionKeyIn=proc');
      expect(taskCall).toContain('maxResults=');

      // One definition lookup for all ids, not one per id.
      const defCalls = urls.filter(u => u.includes('/process-definition'));
      expect(defCalls).toHaveLength(1);
      expect(defCalls[0]).toContain('processDefinitionIdIn=');

      // One incident lookup for all keys, not one per process instance.
      const incidentCalls = urls.filter(u => u.includes('/incident'));
      expect(incidentCalls).toHaveLength(1);
      expect(incidentCalls[0]).toContain('processDefinitionKeyIn=proc');

      document.body.removeChild(container);
    });
  });

  describe('dashboard-integrations batch retry', () => {
    it('sets retries with PUT on the batch endpoint', async () => {
      // Favourites filter off, so the plugin does not short-circuit before fetching.
      storage.set(FAVOURITES_ONLY_KEY, 'false');

      const lockedTask = {
        id: 'task-1',
        activityId: 'act',
        activityInstanceId: 'ai',
        errorMessage: null,
        executionId: 'ex',
        lockExpirationTime: new Date(Date.now() + 600000).toISOString(),
        processDefinitionId: 'proc:1:dep',
        processDefinitionKey: 'proc',
        processInstanceId: 'pi-1',
        retries: 0,
        suspended: false,
        topicName: 'topic',
        workerId: 'worker-1',
        priority: 0,
        tenantId: null,
        businessKey: null,
      };

      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/external-task') && !url.includes('/retries')) {
          return jsonResponse([lockedTask]);
        }
        if (url.includes('/process-definition/')) {
          return jsonResponse({ id: 'proc:1:dep', key: 'proc', name: 'Proc', version: 1 });
        }
        if (url.includes('/incident')) {
          return jsonResponse([]);
        }
        return jsonResponse({});
      });

      const { default: Plugin } = await import('../dashboard-integrations');
      const dashboard = Plugin.find(p => p.pluginPoint === 'cockpit.dashboard');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        dashboard?.render(container, { api: mockApi });
      });

      // The list is fetched behind a 300ms debounce.
      await act(async () => {
        jest.advanceTimersByTime?.(0);
        await new Promise(resolve => setTimeout(resolve, 350));
      });

      // Not just any checkbox: the header also carries the "Favourites only" toggle.
      const selectAll = container.querySelector<HTMLInputElement>('input[type="checkbox"][title="Select all"]');
      expect(selectAll).not.toBeNull();
      await act(async () => {
        selectAll?.click();
      });

      const retryButton = Array.from(container.querySelectorAll('button')).find(b =>
        /retry/i.test(b.textContent ?? '')
      );
      expect(retryButton).toBeDefined();
      await act(async () => {
        retryButton?.click();
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const batchCall = mockFetch.mock.calls.find((c: string[]) => c[0]?.includes('/external-task/retries'));
      expect(batchCall).toBeDefined();
      // /external-task/retries is PUT-only; POST used to 405 and fall back to N requests.
      expect((batchCall?.[1] as RequestInit)?.method?.toUpperCase()).toBe('PUT');
      expect(JSON.parse((batchCall?.[1] as RequestInit)?.body as string)).toEqual({
        externalTaskIds: ['task-1'],
        retries: 1,
      });

      document.body.removeChild(container);
    });
  });
});
