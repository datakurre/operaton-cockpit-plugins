/**
 * Mock for dmn-js module.
 *
 * This mock provides all the necessary exports to allow
 * integration tests to run without loading the full DMN stack.
 *
 * @module
 */

import type { DmnElement, ActiveView } from 'dmn-js';

/** Mock view object. */
interface MockView {
  id: string;
  type: string;
  element: DmnElement;
}

/**
 * Mock DMN viewer for testing without full diagram stack.
 */
class MockDmnViewer {
  _container: HTMLElement | null = null;
  _views: MockView[] = [];

  /**
   * Creates a new mock DMN viewer instance.
   * @param options - Viewer options
   * @param options.container - Container element for the viewer
   */
  constructor(options?: { container?: HTMLElement }) {
    this._container = options?.container ?? null;
    this._views = [
      {
        id: 'decision1',
        type: 'decisionTable',
        element: { id: 'decision1', name: 'Test Decision' } as DmnElement,
      },
    ];
  }

  /**
   * Imports DMN XML.
   * @returns A promise that resolves when import is complete
   */
  importXML(_xml: string): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Gets available views.
   * @returns Array of view objects
   */
  getViews(): ActiveView[] {
    return this._views as unknown as ActiveView[];
  }

  /**
   * Opens a specific view.
   * @returns A promise that resolves when view is opened
   */
  open(_view: ActiveView): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Gets the active view.
   * @returns The active view or null
   */
  getActiveView(): ActiveView | null {
    const firstView = this._views[0];
    return firstView !== undefined ? (firstView as unknown as ActiveView) : null;
  }

  /**
   * Gets the active viewer for the current view.
   * @returns Mock active viewer object
   */
  getActiveViewer(): Record<string, unknown> {
    return {
      get: (serviceName: string): unknown => {
        if (serviceName === 'sheet') {
          return {
            getRoot: (): Record<string, unknown> => ({
              rows: [],
              cols: [],
            }),
          };
        }
        return {};
      },
    };
  }

  /**
   * Destroys the viewer and cleans up resources.
   */
  destroy(): void {
    this._container = null;
  }
}

export default MockDmnViewer;
