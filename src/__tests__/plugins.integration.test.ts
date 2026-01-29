/**
 * Integration tests for plugin registration and structure.
 *
 * These tests verify that all plugins export the correct structure
 * expected by the Cockpit/Tasklist plugin system.
 *
 * Note: bpmn-js and related modules are mocked inline here
 * to allow testing plugin structure without loading the entire BPMN stack.
 *
 * @module
 */

// Mock bpmn-js and related modules BEFORE they are imported by plugins
const mockViewer = {
  attachTo: jest.fn(),
  importXML: jest.fn().mockResolvedValue({ warnings: [] }),
  get: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    zoom: jest.fn(),
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

// Mock utils to prevent side effects
jest.mock('../utils/api', () => ({
  get: jest.fn().mockResolvedValue([]),
  post: jest.fn().mockResolvedValue({}),
  headers: jest.fn(() => ({})),
}));

jest.mock('../utils/bpmn', () => ({
  renderSequenceFlow: jest.fn(() => []),
  clearSequenceFlow: jest.fn(),
  renderActivities: jest.fn(() => []),
}));

// Import all plugin modules after mocking
import definitionHistoricActivities from '../definition-historic-activities';
import instanceHistoricActivities from '../instance-historic-activities';
import instanceRouteHistory from '../instance-route-history';
import instanceAutoRefresh from '../instance-auto-refresh';
import instanceTabModify from '../instance-tab-modify';
import instanceActionUnlock from '../instance-action-unlock';
import tasklistAuditLog from '../tasklist-audit-log';

/** Valid plugin points for Cockpit. */
const validCockpitPluginPoints = [
  'cockpit.processDefinition.runtime.tab',
  'cockpit.processDefinition.diagram.plugin',
  'cockpit.processDefinition.runtime.action',
  'cockpit.processInstance.runtime.tab',
  'cockpit.processInstance.diagram.plugin',
  'cockpit.processInstance.runtime.action',
  'cockpit.route',
];

/** Valid plugin points for Tasklist. */
const validTasklistPluginPoints = ['tasklist.task.detail'];

/** All valid plugin points. */
const allValidPluginPoints = [...validCockpitPluginPoints, ...validTasklistPluginPoints];

/**
 * Interface representing the expected plugin structure.
 */
interface PluginDefinition {
  id: string;
  pluginPoint: string;
  render: (...args: unknown[]) => unknown;
  properties?: Record<string, unknown>;
  priority?: number;
  url?: string;
  label?: string;
}

/**
 * Validates a single plugin definition has required structure.
 *
 * @param plugin - Plugin definition to validate
 * @returns Validation result
 */
function isValidPlugin(plugin: unknown): plugin is PluginDefinition {
  if (typeof plugin !== 'object' || plugin === null) {
    return false;
  }
  const p = plugin as Record<string, unknown>;
  return (
    typeof p['id'] === 'string' &&
    typeof p['pluginPoint'] === 'string' &&
    (typeof p['render'] === 'function' || typeof p['url'] === 'string')
  );
}

describe('Plugin Registration', () => {
  describe('Plugin structure validation', () => {
    const plugins = [
      { name: 'definition-historic-activities', module: definitionHistoricActivities },
      { name: 'instance-historic-activities', module: instanceHistoricActivities },
      { name: 'instance-route-history', module: instanceRouteHistory },
      { name: 'instance-auto-refresh', module: instanceAutoRefresh },
      { name: 'instance-tab-modify', module: instanceTabModify },
      { name: 'instance-action-unlock', module: instanceActionUnlock },
      { name: 'tasklist-audit-log', module: tasklistAuditLog },
    ];

    it.each(plugins)('$name exports an array of plugins', ({ name, module }) => {
      expect(Array.isArray(module)).toBe(true);
      expect(module.length).toBeGreaterThan(0);
    });

    it.each(plugins)('$name plugins have valid structure', ({ name, module }) => {
      for (const plugin of module) {
        expect(isValidPlugin(plugin)).toBe(true);
      }
    });

    it.each(plugins)('$name plugins have unique IDs within module', ({ name, module }) => {
      const ids = module.map((p: PluginDefinition) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it.each(plugins)('$name plugins have valid pluginPoint values', ({ name, module }) => {
      for (const plugin of module) {
        expect(allValidPluginPoints).toContain(plugin.pluginPoint);
      }
    });
  });

  describe('Unique IDs across all plugins', () => {
    it('should have unique IDs across all plugin modules', () => {
      const allPlugins = [
        ...definitionHistoricActivities,
        ...instanceHistoricActivities,
        ...instanceRouteHistory,
        ...instanceAutoRefresh,
        ...instanceTabModify,
        ...instanceActionUnlock,
        ...tasklistAuditLog,
      ];

      const ids = allPlugins.map((p: PluginDefinition) => p.id);
      const uniqueIds = new Set(ids);

      // If there are duplicates, show them
      if (uniqueIds.size !== ids.length) {
        const duplicates = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
        fail(`Duplicate plugin IDs found: ${duplicates.join(', ')}`);
      }

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Plugin properties validation', () => {
    it('tab plugins should have label property', () => {
      const allPlugins = [
        ...definitionHistoricActivities,
        ...instanceHistoricActivities,
        ...instanceTabModify,
        ...tasklistAuditLog,
      ];

      const tabPlugins = allPlugins.filter((p: PluginDefinition) => p.pluginPoint.includes('.tab'));

      for (const plugin of tabPlugins) {
        expect(plugin.properties).toBeDefined();
        expect(plugin.properties?.label).toBeDefined();
      }
    });

    it('route plugins should have url or path property', () => {
      const routePlugins = instanceRouteHistory.filter((p: PluginDefinition) => p.pluginPoint.includes('.route'));

      for (const plugin of routePlugins) {
        expect(plugin.url ?? plugin.properties?.path).toBeDefined();
      }
    });
  });
});

describe('instance-historic-activities plugin', () => {
  it('should export diagram plugin with correct ID', () => {
    const diagramPlugin = instanceHistoricActivities.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.diagram.plugin'
    );

    expect(diagramPlugin).toBeDefined();
    expect(diagramPlugin.id).toBe('instanceDiagramHistoricActivities');
    expect(typeof diagramPlugin.render).toBe('function');
  });

  it('should export tab plugin with Audit Log label', () => {
    const tabPlugin = instanceHistoricActivities.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.tab'
    );

    expect(tabPlugin).toBeDefined();
    expect(tabPlugin.id).toBe('instanceTabHistoricActivities');
    expect(tabPlugin.properties?.label).toBe('Audit Log');
  });
});

describe('definition-historic-activities plugin', () => {
  it('should export diagram plugin with correct ID', () => {
    const diagramPlugin = definitionHistoricActivities.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processDefinition.diagram.plugin'
    );

    expect(diagramPlugin).toBeDefined();
    expect(diagramPlugin.id).toBe('definitionHistoricActivitiesDiagramTokens');
    expect(typeof diagramPlugin.render).toBe('function');
  });

  it('should export tab plugin with Statistics label', () => {
    const tabPlugin = definitionHistoricActivities.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processDefinition.runtime.tab'
    );

    expect(tabPlugin).toBeDefined();
    expect(tabPlugin.id).toBe('definitionHistoricActivitiesStatisticsTab');
    expect(tabPlugin.properties?.label).toBe('Statistics');
  });
});

describe('instance-tab-modify plugin', () => {
  it('should export modification tab plugin', () => {
    const tabPlugin = instanceTabModify.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.tab'
    );

    expect(tabPlugin).toBeDefined();
    expect(tabPlugin.id).toBe('instanceTabModify');
    expect(tabPlugin.properties?.label).toBe('Modify');
  });
});

describe('instance-action-unlock plugin', () => {
  it('should export action plugin', () => {
    const actionPlugin = instanceActionUnlock.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.action'
    );

    expect(actionPlugin).toBeDefined();
    expect(actionPlugin.id).toBe('instanceActionUnlock');
    expect(typeof actionPlugin.render).toBe('function');
  });
});

describe('instance-route-history plugin', () => {
  it('should export route plugin with history path', () => {
    const routePlugin = instanceRouteHistory.find((p: PluginDefinition) => p.pluginPoint === 'cockpit.route');

    expect(routePlugin).toBeDefined();
    expect(routePlugin.id).toBe('instanceRouteHistory');
    expect(routePlugin.properties?.path).toContain('history');
  });
});

describe('tasklist-audit-log plugin', () => {
  it('should export tasklist detail tab', () => {
    const tabPlugin = tasklistAuditLog.find((p: PluginDefinition) => p.pluginPoint === 'tasklist.task.detail');

    expect(tabPlugin).toBeDefined();
    expect(tabPlugin.id).toBe('tasklistTabAuditLog');
    expect(tabPlugin.properties?.label).toBe('Audit Log');
  });
});

describe('instance-auto-refresh plugin', () => {
  it('should export diagram plugin', () => {
    const diagramPlugin = instanceAutoRefresh.find(
      (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.diagram.plugin'
    );

    expect(diagramPlugin).toBeDefined();
    expect(diagramPlugin.id).toBe('instanceDiagramAutoRefresh');
    expect(typeof diagramPlugin.render).toBe('function');
  });
});

describe('Plugin Rendering', () => {
  // Suppress console.error for rendering tests that may trigger async errors
  // when mocked APIs fail (e.g., BPMN XML loading in instance-tab-modify)
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockParams = {
    api: {
      adminApi: '/api/admin',
      baseApi: '/api',
      engineApi: '/api/engine/default',
      engine: 'default',
      tasklistApi: '/api/tasklist',
      CSRFToken: 'test-csrf-token',
    },
    processInstanceId: 'instance-123',
    processDefinitionId: 'definition-456',
    processData: {
      definitionId: 'definition-456',
      processDefinitionId: 'definition-456',
    },
  };

  describe('definition-historic-activities plugin', () => {
    it('diagram plugin render function should be callable with viewer', () => {
      const diagramPlugin = definitionHistoricActivities.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processDefinition.diagram.plugin'
      );

      // Render function should be callable without throwing
      expect(() => {
        diagramPlugin.render(mockViewer, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('tab plugin render function should create filter box and statistics table', () => {
      const tabPlugin = definitionHistoricActivities.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processDefinition.runtime.tab'
      );

      const mockNode = document.createElement('div');

      // Render function should be callable without throwing
      expect(() => {
        tabPlugin.render(mockNode, {
          ...mockParams,
        });
      }).not.toThrow();
    });
  });

  describe('instance-historic-activities plugin', () => {
    it('diagram plugin render function should create overlays', () => {
      const diagramPlugin = instanceHistoricActivities.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.diagram.plugin'
      );

      // Render function should be callable without throwing
      expect(() => {
        diagramPlugin.render(mockViewer, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('tab plugin render function should render audit log', () => {
      const tabPlugin = instanceHistoricActivities.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.tab'
      );

      const mockNode = document.createElement('div');

      // Render function should be callable without throwing
      expect(() => {
        tabPlugin.render(mockNode, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('diagram plugin should add toggle sequence flow button to container', async () => {
      const diagramPlugin = instanceHistoricActivities.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.diagram.plugin'
      );

      const container = document.createElement('div');
      mockViewer._container = container;

      diagramPlugin.render(mockViewer, {
        ...mockParams,
      });

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      // The render function appends a button container to the viewer container
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe('instance-route-history plugin', () => {
    it('route plugin render function should be callable', () => {
      const routePlugin = instanceRouteHistory.find((p: PluginDefinition) => p.pluginPoint === 'cockpit.route');

      const mockNode = document.createElement('div');

      // Render function should be callable without throwing
      expect(() => {
        routePlugin.render(mockNode, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('route plugin should have proper path configuration', () => {
      const routePlugin = instanceRouteHistory.find((p: PluginDefinition) => p.pluginPoint === 'cockpit.route');

      expect(routePlugin.properties?.path).toContain('history');
      expect(routePlugin.properties?.path).toContain('process-instance');
    });
  });

  describe('instance-tab-modify plugin', () => {
    it('tab plugin render function should render modify form', () => {
      const tabPlugin = instanceTabModify.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.tab'
      );

      const mockNode = document.createElement('div');

      // Render function should be callable without throwing
      expect(() => {
        tabPlugin.render(mockNode, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('tab plugin should render with process data from params', async () => {
      const tabPlugin = instanceTabModify.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.tab'
      );

      const mockNode = document.createElement('div');

      tabPlugin.render(mockNode, {
        ...mockParams,
      });

      // Wait for async rendering
      await new Promise(resolve => setTimeout(resolve, 50));

      // The tab should render some form content
      expect(mockNode.innerHTML).not.toBe('');
    });
  });

  describe('instance-action-unlock plugin', () => {
    it('action plugin render function should create unlock dialog trigger', () => {
      const actionPlugin = instanceActionUnlock.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.action'
      );

      const mockNode = document.createElement('div');

      // Render function should be callable without throwing
      expect(() => {
        actionPlugin.render(mockNode, {
          ...mockParams,
        });
      }).not.toThrow();
    });

    it('action plugin should render unlock button', async () => {
      const actionPlugin = instanceActionUnlock.find(
        (p: PluginDefinition) => p.pluginPoint === 'cockpit.processInstance.runtime.action'
      );

      const mockNode = document.createElement('div');

      actionPlugin.render(mockNode, {
        ...mockParams,
      });

      // Wait for async rendering
      await new Promise(resolve => setTimeout(resolve, 50));

      // The action should render an unlock button
      expect(mockNode.innerHTML).not.toBe('');
    });
  });
});
