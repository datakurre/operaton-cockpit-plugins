/**
 * Integration tests for instance-route-history plugin.
 * Tests the filter → query → pagination flow.
 *
 * @module
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock bpmn-js and related modules
const mockViewer = {
  attachTo: jest.fn(),
  importXML: jest.fn().mockResolvedValue({ warnings: [] }),
  get: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    zoom: jest.fn(),
    setColor: jest.fn(),
    getGraphics: jest.fn(),
  })),
  _container: document.createElement('div'),
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('bpmn-js/lib/NavigatedViewer', () => {
  return jest.fn().mockImplementation(() => mockViewer);
});
jest.mock('bpmn-js/lib/features/modeling', () => ({}));
jest.mock('diagram-js/lib/features/tooltips', () => ({}));
jest.mock('camunda-bpmn-js-behaviors/lib/camunda-platform', () => ({}));
jest.mock('camunda-bpmn-moddle/resources/camunda.json', () => ({}));
jest.mock('../RobotModule', () => ({}));

import { setFetchFunction, resetFetchFunction } from '../services/HistoryService';
import { mockApi } from '../__mocks__/api';

/**
 * Create a mock historic process instance.
 */
function createMockInstance(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    id: `instance-${Math.random().toString(36).slice(2)}`,
    processDefinitionId: 'test-definition:1:abc123',
    processDefinitionKey: 'test-definition',
    processDefinitionName: 'Test Process',
    businessKey: null,
    startTime: '2024-01-01T10:00:00.000Z',
    endTime: '2024-01-01T10:30:00.000Z',
    state: 'COMPLETED',
    ...overrides,
  };
}

describe('instance-route-history integration', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('Filter to Query flow', () => {
    it('should call HistoryService.queryProcessInstances when query changes', async () => {
      const mockInstances = [
        createMockInstance({ id: 'inst-1', state: 'COMPLETED' }),
        createMockInstance({ id: 'inst-2', state: 'ACTIVE' }),
      ];

      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/count')) {
          return {
            status: 200,
            ok: true,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ count: 2 }),
          };
        }
        return {
          status: 200,
          ok: true,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => mockInstances,
        };
      });

      // Import after mocking is set up
      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      // Find the action plugin
      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      expect(actionPlugin).toBeDefined();

      // Create a container for rendering
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Render the plugin
      await act(async () => {
        actionPlugin?.render(container, {
          api: mockApi,
          processDefinitionId: 'test-definition:1:abc123',
          root: container,
        });
      });

      // Wait for the fetch calls (count + query)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify count API was called at least once
      const countCall = mockFetch.mock.calls.find((c: string[]) => c[0]?.includes('/count'));
      expect(countCall).toBeDefined();
      expect(countCall?.[0]).toContain('/history/process-instance/count');

      // Verify query API was called with pagination at least once
      const queryCall = mockFetch.mock.calls.find(
        (c: string[]) => c[0]?.includes('/history/process-instance') && !c[0]?.includes('/count')
      );
      expect(queryCall).toBeDefined();
      expect(queryCall?.[0]).toContain('maxResults=');
      expect(queryCall?.[0]).toContain('firstResult=');

      // Clean up
      document.body.removeChild(container);
    });

    it('should pass correct processDefinitionId in query body', async () => {
      mockFetch.mockImplementation(async () => ({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 0 }),
      }));

      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        actionPlugin?.render(container, {
          api: mockApi,
          processDefinitionId: 'my-process:2:deployment-xyz',
          root: container,
        });
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Find the POST call and verify body contains processDefinitionId
      const postCall = mockFetch.mock.calls[0];
      const options = postCall?.[1] as RequestInit;
      const body = JSON.parse(options?.body as string);
      expect(body.processDefinitionId).toBe('my-process:2:deployment-xyz');

      document.body.removeChild(container);
    });

    it('should convert processInstanceBusinessKeyIn from string to array in API body', async () => {
      mockFetch.mockImplementation(async () => ({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 0 }),
      }));

      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        actionPlugin?.render(container, {
          api: mockApi,
          processDefinitionId: 'my-process:1:abc',
          root: container,
        });
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      document.body.removeChild(container);
    });
  });

  describe('Query with version filter', () => {
    it('should use processDefinitionKey when all versions are queried', async () => {
      mockFetch.mockImplementation(async () => ({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 5 }),
      }));

      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        actionPlugin?.render(container, {
          api: mockApi,
          processDefinitionId: 'versioned-process:3:deploy-123',
          root: container,
        });
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Initial query should use processDefinitionId (not key)
      const postCall = mockFetch.mock.calls[0];
      const options = postCall?.[1] as RequestInit;
      const body = JSON.parse(options?.body as string);
      expect(body.processDefinitionId).toBe('versioned-process:3:deploy-123');
      expect(body.processDefinitionKey).toBeUndefined();

      document.body.removeChild(container);
    });
  });

  describe('matchesVersionFilter', () => {
    /**
     * Load the exported predicate from the plugin module.
     */
    async function loadMatcher(): Promise<
      (id: string | null | undefined, filter: { operator: string; value: number }) => boolean
    > {
      const mod = await import('../instance-route-history');
      return mod.matchesVersionFilter as unknown as (
        id: string | null | undefined,
        filter: { operator: string; value: number }
      ) => boolean;
    }

    it.each([
      ['eq', 3, 'p:3:dep', true],
      ['eq', 3, 'p:4:dep', false],
      ['lt', 3, 'p:2:dep', true],
      ['lt', 3, 'p:3:dep', false],
      ['lte', 3, 'p:3:dep', true],
      ['gt', 3, 'p:4:dep', true],
      ['gt', 3, 'p:3:dep', false],
      ['gte', 3, 'p:3:dep', true],
    ])('applies %s %d to %s', async (operator, value, definitionId, expected) => {
      const matchesVersionFilter = await loadMatcher();
      expect(
        matchesVersionFilter(definitionId as string, { operator: operator as string, value: value as number })
      ).toBe(expected);
    });

    it('rejects ids it cannot read a version from', async () => {
      const matchesVersionFilter = await loadMatcher();
      const filter = { operator: 'eq', value: 1 };
      expect(matchesVersionFilter(null, filter)).toBe(false);
      expect(matchesVersionFilter(undefined, filter)).toBe(false);
      expect(matchesVersionFilter('', filter)).toBe(false);
      expect(matchesVersionFilter('no-version', filter)).toBe(false);
      expect(matchesVersionFilter('p:notanumber:dep', filter)).toBe(false);
    });
  });

  describe('Pagination flow', () => {
    it('should include pagination params in query', async () => {
      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/count')) {
          return {
            status: 200,
            ok: true,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ count: 100 }),
          };
        }
        return {
          status: 200,
          ok: true,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => [],
        };
      });

      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      const container = document.createElement('div');
      document.body.appendChild(container);

      await act(async () => {
        actionPlugin?.render(container, {
          api: mockApi,
          processDefinitionId: 'test-def:1:xyz',
          root: container,
        });
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Find the query call (not count)
      const queryCall = mockFetch.mock.calls.find((c: string[]) => !c[0]?.includes('/count'));
      expect(queryCall?.[0]).toContain('maxResults=');
      expect(queryCall?.[0]).toContain('firstResult=0');

      document.body.removeChild(container);
    });
  });

  describe('History route rendering', () => {
    it('should export a route plugin for /history/process-instance/:id', async () => {
      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const routePlugin = Plugin.find(p => p.pluginPoint === 'cockpit.route');
      expect(routePlugin).toBeDefined();
      expect(routePlugin?.properties?.path).toBe('/history/process-instance/:id');
    });

    it('should export a diagram toggle plugin', async () => {
      const instanceRouteHistory = await import('../instance-route-history');
      const Plugin = instanceRouteHistory.default;

      const diagramPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processInstance.diagram.plugin');
      expect(diagramPlugin).toBeDefined();
      expect(diagramPlugin?.render).toBeInstanceOf(Function);
    });
  });
});
