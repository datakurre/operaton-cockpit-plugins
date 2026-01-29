/**
 * Mock for bpmn-js, diagram-js, and related modules.
 *
 * This mock provides all the necessary exports to allow
 * integration tests to run without loading the full BPMN stack.
 *
 * @module
 */

/**
 * Mock BPMN viewer for testing without full diagram stack.
 */
class MockViewer {
  _container = document.createElement('div');
  _modules: Record<string, unknown> = {};

  /**
   * Creates a new mock viewer instance.
   * @param _options - Viewer options (ignored in mock)
   */
  constructor(_options?: Record<string, unknown>) {
    this._modules = {
      overlays: {
        add: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
      },
      canvas: {
        zoom: jest.fn(),
        scroll: jest.fn(),
        viewbox: jest.fn(() => ({ x: 0, y: 0, width: 1000, height: 600 })),
        getGraphics: jest.fn(() => document.createElement('div')),
      },
      elementRegistry: {
        get: jest.fn(() => ({
          id: 'mock-element',
          type: 'bpmn:Task',
        })),
        forEach: jest.fn(),
        getAll: jest.fn(() => []),
      },
    };
  }

  /**
   * Gets a registered module by name.
   * @param serviceName - The name of the service to retrieve
   * @returns The registered module or empty object
   */
  get(serviceName: string): unknown {
    return this._modules[serviceName] ?? {};
  }

  attachTo = jest.fn();
  importXML = jest.fn().mockResolvedValue({ warnings: [] });
  on = jest.fn();
  off = jest.fn();
  destroy = jest.fn();
}

// bpmn-js/lib/util/ModelUtil exports
export const is = jest.fn(() => false);
export const getBusinessObject = jest.fn(() => ({}));
export const isAny = jest.fn(() => false);

// diagram-js/lib/draw/BaseRenderer
/**
 *
 */
export class BaseRenderer {
  canRender = jest.fn(() => false);
  drawShape = jest.fn();
  drawConnection = jest.fn();
}

// inherits-browser
export const inherits = jest.fn();

// bpmn-moddle
/**
 *
 */
export class BPMNModdle {
  fromXML = jest.fn().mockResolvedValue({ rootElement: {} });
  toXML = jest.fn().mockResolvedValue({ xml: '' });
}

// Module.exports style default for CJS compatibility
module.exports = MockViewer;
module.exports.default = MockViewer;
module.exports.is = is;
module.exports.getBusinessObject = getBusinessObject;
module.exports.isAny = isAny;
module.exports.BaseRenderer = BaseRenderer;
module.exports.inherits = inherits;
module.exports.BPMNModdle = BPMNModdle;

// Default export for ESM style imports
export default MockViewer;
