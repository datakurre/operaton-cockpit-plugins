/**
 * ViewerService abstraction for testability.
 * Wraps the BPMN viewer to allow mocking in tests.
 * @module services/ViewerService
 */

/**
 * Interface for overlay manager
 */
export interface OverlayManager {
  add: (
    elementId: string,
    options: { position: { top?: number; bottom?: number; left?: number; right?: number }; html: HTMLElement }
  ) => string;
  remove: (overlayId: string) => void;
  clear: (elementId?: string) => void;
}

/**
 * Interface for element registry
 */
export interface ElementRegistry {
  get: (elementId: string) => BpmnElement | undefined;
  getAll: () => BpmnElement[];
  forEach: (callback: (element: BpmnElement) => void) => void;
}

/**
 * Interface for BPMN element
 */
export interface BpmnElement {
  id: string;
  type: string;
  businessObject?: Record<string, unknown>;
  di?: Record<string, unknown>;
  parent?: BpmnElement;
  children?: BpmnElement[];
  waypoints?: { x: number; y: number }[];
}

/**
 * Interface for canvas
 */
export interface Canvas {
  zoom: (level?: number | 'fit-viewport', center?: { x: number; y: number }) => number;
  scroll: (delta: { dx: number; dy: number }) => void;
  viewbox: () => { x: number; y: number; width: number; height: number };
  getContainer: () => HTMLElement;
  getDefaultLayer: () => SVGElement;
  getLayer: (name: string, priority?: number) => SVGElement;
  _svg: SVGElement;
}

/**
 * Interface for the BPMN viewer
 */
export interface IViewerService {
  /** Gets the overlay manager */
  getOverlays: () => OverlayManager;
  /** Gets the element registry */
  getElementRegistry: () => ElementRegistry;
  /** Gets the canvas */
  getCanvas: () => Canvas;
  /** Gets the viewer container element */
  getContainer: () => HTMLElement;
  /** Gets any service by name from the viewer */
  get: (serviceName: string) => unknown;
  /** Attaches the viewer to an element */
  attachTo: (element: HTMLElement) => void;
  /** Detaches the viewer from its container */
  detach: () => void;
}

/**
 * Default implementation of the viewer service that wraps a real viewer
 */
export class ViewerService implements IViewerService {
  private viewer: BpmnViewerInstance;

  /**
   * Creates a new ViewerService instance
   * @param viewer - The BPMN viewer instance
   */
  constructor(viewer: BpmnViewerInstance) {
    this.viewer = viewer;
  }

  /**
   * Gets the overlay manager
   */
  getOverlays(): OverlayManager {
    return this.viewer.get('overlays') as OverlayManager;
  }

  /**
   * Gets the element registry
   */
  getElementRegistry(): ElementRegistry {
    return this.viewer.get('elementRegistry') as ElementRegistry;
  }

  /**
   * Gets the canvas
   */
  getCanvas(): Canvas {
    return this.viewer.get('canvas') as Canvas;
  }

  /**
   * Gets the viewer container element
   */
  getContainer(): HTMLElement {
    return this.viewer._container;
  }

  /**
   * Gets any service by name from the viewer
   */
  get(serviceName: string): unknown {
    return this.viewer.get(serviceName);
  }

  /**
   * Attaches the viewer to an element
   */
  attachTo(element: HTMLElement): void {
    if (typeof this.viewer.attachTo === 'function') {
      this.viewer.attachTo(element);
    }
  }

  /**
   * Detaches the viewer from its container
   */
  detach(): void {
    if (typeof this.viewer.detach === 'function') {
      this.viewer.detach();
    }
  }
}

/**
 * Raw BPMN viewer instance type (the underlying bpmn-js viewer)
 */
export interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (name: string) => unknown;
  attachTo?: (element: HTMLElement) => void;
  detach?: () => void;
}

/**
 * Creates a new ViewerService instance
 * @param viewer - The BPMN viewer instance
 * @returns A new ViewerService instance
 */
export function createViewerService(viewer: BpmnViewerInstance): IViewerService {
  return new ViewerService(viewer);
}

/**
 * Creates a mock viewer service for testing
 * @param overrides - Optional partial implementation to override
 * @returns A mock ViewerService for testing
 */
export function createMockViewerService(overrides?: Partial<IViewerService>): IViewerService {
  const container = document.createElement('div');
  const mockOverlays: OverlayManager = {
    add: jest.fn().mockReturnValue('overlay-1'),
    remove: jest.fn(),
    clear: jest.fn(),
  };
  const mockElementRegistry: ElementRegistry = {
    get: jest.fn().mockReturnValue(undefined),
    getAll: jest.fn().mockReturnValue([]),
    forEach: jest.fn(),
  };
  const mockCanvas: Canvas = {
    zoom: jest.fn().mockReturnValue(1),
    scroll: jest.fn(),
    viewbox: jest.fn().mockReturnValue({ x: 0, y: 0, width: 1000, height: 500 }),
    getContainer: jest.fn().mockReturnValue(container),
    getDefaultLayer: jest.fn().mockReturnValue(document.createElementNS('http://www.w3.org/2000/svg', 'g')),
    getLayer: jest.fn().mockReturnValue(document.createElementNS('http://www.w3.org/2000/svg', 'g')),
    _svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  };

  return {
    getOverlays: jest.fn().mockReturnValue(mockOverlays),
    getElementRegistry: jest.fn().mockReturnValue(mockElementRegistry),
    getCanvas: jest.fn().mockReturnValue(mockCanvas),
    getContainer: jest.fn().mockReturnValue(container),
    get: jest.fn().mockReturnValue(undefined),
    attachTo: jest.fn(),
    detach: jest.fn(),
    ...overrides,
  };
}
