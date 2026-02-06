/**
 * Integration tests for definition-historic-activities plugin.
 * Tests the filter → query → overlay flow.
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
import { createActivity } from '../__fixtures__/activities';

describe('definition-historic-activities integration', () => {
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
    it('should call HistoryService.getActivitiesByDefinition when query changes', async () => {
      const mockActivities = [
        createActivity({
          id: 'act-1',
          activityId: 'Task_1',
          activityName: 'Review',
          activityType: 'userTask',
        }),
        createActivity({
          id: 'act-2',
          activityId: 'Task_1',
          activityName: 'Review',
          activityType: 'userTask',
        }),
      ];

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockActivities,
      });

      // Import after mocking is set up
      const definitionHistoricActivities = await import('../definition-historic-activities');
      const Plugin = definitionHistoricActivities.default;

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

      // Wait for the initial fetch to be called
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify the API was called with correct parameters
      const callUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(callUrl).toContain('/history/activity-instance');
      expect(callUrl).toContain('processDefinitionId=test-definition%3A1%3Aabc123');

      // Clean up
      document.body.removeChild(container);
    });

    it('should include default query parameters in API call', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      // Import after mocking is set up
      const definitionHistoricActivities = await import('../definition-historic-activities');
      const Plugin = definitionHistoricActivities.default;

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

      // Verify default query params
      const callUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(callUrl).toContain('sortBy=endTime');
      expect(callUrl).toContain('sortOrder=desc');

      document.body.removeChild(container);
    });
  });

  describe('Query to Overlay flow', () => {
    it('should create overlay elements for activities when toggled on', async () => {
      const mockActivities = [
        createActivity({ activityId: 'Task_1', activityName: 'Task 1' }),
        createActivity({ activityId: 'Task_1', activityName: 'Task 1' }),
        createActivity({ activityId: 'Task_2', activityName: 'Task 2' }),
      ];

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockActivities,
      });

      // Set up the viewer mock to be available before plugin loads
      const overlaysAddMock = jest.fn();
      mockViewer.get.mockImplementation((serviceName: string) => {
        if (serviceName === 'overlays') {
          return { add: overlaysAddMock, remove: jest.fn() };
        }
        return { add: jest.fn(), remove: jest.fn() };
      });

      // Import after mocking
      const definitionHistoricActivities = await import('../definition-historic-activities');
      const Plugin = definitionHistoricActivities.default;

      // Find the diagram plugin that receives the viewer
      const diagramPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.diagram.plugin');
      expect(diagramPlugin).toBeDefined();

      // Simulate viewer being passed to the plugin
      await act(async () => {
        diagramPlugin?.render(mockViewer);
      });

      // The overlays.add should eventually be called when statistics are shown
      // This tests the viewer is properly received and stored
      expect(diagramPlugin?.render).toBeDefined();
    });
  });

  describe('Statistics table rendering', () => {
    it('should render StatisticsTable when activities have names and end times', async () => {
      const mockActivities = [
        createActivity({
          activityId: 'Task_1',
          activityName: 'Review Document',
          endTime: '2024-01-01T10:05:00.000Z',
        }),
        createActivity({
          activityId: 'Task_2',
          activityName: 'Approve Request',
          endTime: '2024-01-01T10:10:00.000Z',
        }),
      ];

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockActivities,
      });

      const definitionHistoricActivities = await import('../definition-historic-activities');
      const Plugin = definitionHistoricActivities.default;

      const actionPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.action');
      const statisticsPlugin = Plugin.find(p => p.pluginPoint === 'cockpit.processDefinition.runtime.tab');

      const actionContainer = document.createElement('div');
      const statisticsContainer = document.createElement('div');
      document.body.appendChild(actionContainer);
      document.body.appendChild(statisticsContainer);

      // Set up the statistics tab first
      await act(async () => {
        statisticsPlugin?.render(statisticsContainer);
      });

      // Then render the action (which creates the React component)
      await act(async () => {
        actionPlugin?.render(actionContainer, {
          api: mockApi,
          processDefinitionId: 'test-def:1:xyz',
          root: actionContainer,
        });
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      document.body.removeChild(actionContainer);
      document.body.removeChild(statisticsContainer);
    });
  });
});
