/**
 * Tests for the ViewerService abstraction.
 *
 * @module
 */
import { ViewerService, createViewerService, createMockViewerService, BpmnViewerInstance } from '../ViewerService';

describe('ViewerService', () => {
  let mockViewerInstance: BpmnViewerInstance;
  let container: HTMLDivElement;
  let mockOverlays: { add: jest.Mock; remove: jest.Mock; clear: jest.Mock };
  let mockElementRegistry: { get: jest.Mock; getAll: jest.Mock; forEach: jest.Mock };
  let mockCanvas: { zoom: jest.Mock; scroll: jest.Mock; viewbox: jest.Mock; getContainer: jest.Mock };

  beforeEach(() => {
    container = document.createElement('div');
    mockOverlays = {
      add: jest.fn().mockReturnValue('overlay-id-1'),
      remove: jest.fn(),
      clear: jest.fn(),
    };
    mockElementRegistry = {
      get: jest.fn().mockReturnValue({ id: 'element-1', type: 'task' }),
      getAll: jest.fn().mockReturnValue([]),
      forEach: jest.fn(),
    };
    mockCanvas = {
      zoom: jest.fn().mockReturnValue(1),
      scroll: jest.fn(),
      viewbox: jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 }),
      getContainer: jest.fn().mockReturnValue(container),
    };

    mockViewerInstance = {
      _container: container,
      get: jest.fn((name: string) => {
        if (name === 'overlays') {
          return mockOverlays;
        }
        if (name === 'elementRegistry') {
          return mockElementRegistry;
        }
        if (name === 'canvas') {
          return mockCanvas;
        }
        return undefined;
      }),
      attachTo: jest.fn(),
      detach: jest.fn(),
    };
  });

  describe('ViewerService class', () => {
    it('should wrap a viewer instance', () => {
      const service = new ViewerService(mockViewerInstance);
      expect(service).toBeInstanceOf(ViewerService);
    });

    it('should return overlays from getOverlays()', () => {
      const service = new ViewerService(mockViewerInstance);
      const overlays = service.getOverlays();
      expect(overlays).toBe(mockOverlays);
    });

    it('should return element registry from getElementRegistry()', () => {
      const service = new ViewerService(mockViewerInstance);
      const registry = service.getElementRegistry();
      expect(registry).toBe(mockElementRegistry);
    });

    it('should return canvas from getCanvas()', () => {
      const service = new ViewerService(mockViewerInstance);
      const canvas = service.getCanvas();
      expect(canvas).toBe(mockCanvas);
    });

    it('should return container from getContainer()', () => {
      const service = new ViewerService(mockViewerInstance);
      const result = service.getContainer();
      expect(result).toBe(container);
    });

    it('should call viewer.get for generic services', () => {
      const service = new ViewerService(mockViewerInstance);
      service.get('customService');
      expect(mockViewerInstance.get).toHaveBeenCalledWith('customService');
    });

    it('should call attachTo on the viewer', () => {
      const service = new ViewerService(mockViewerInstance);
      const newContainer = document.createElement('div');
      service.attachTo(newContainer);
      expect(mockViewerInstance.attachTo).toHaveBeenCalledWith(newContainer);
    });

    it('should call detach on the viewer', () => {
      const service = new ViewerService(mockViewerInstance);
      service.detach();
      expect(mockViewerInstance.detach).toHaveBeenCalled();
    });

    it('should handle viewer without attachTo method', () => {
      const minimalViewer: BpmnViewerInstance = {
        _container: container,
        get: jest.fn(),
      };
      const service = new ViewerService(minimalViewer);

      // Should not throw
      expect(() => {
        service.attachTo(container);
      }).not.toThrow();
    });

    it('should handle viewer without detach method', () => {
      const minimalViewer: BpmnViewerInstance = {
        _container: container,
        get: jest.fn(),
      };
      const service = new ViewerService(minimalViewer);

      // Should not throw
      expect(() => {
        service.detach();
      }).not.toThrow();
    });
  });

  describe('createViewerService', () => {
    it('should create a ViewerService instance', () => {
      const service = createViewerService(mockViewerInstance);
      expect(service).toBeInstanceOf(ViewerService);
    });
  });

  describe('createMockViewerService', () => {
    it('should create a mock service with all methods', () => {
      const mockService = createMockViewerService();

      expect(mockService.getOverlays).toBeDefined();
      expect(mockService.getElementRegistry).toBeDefined();
      expect(mockService.getCanvas).toBeDefined();
      expect(mockService.getContainer).toBeDefined();
      expect(mockService.get).toBeDefined();
      expect(mockService.attachTo).toBeDefined();
      expect(mockService.detach).toBeDefined();
    });

    it('should return mock overlays', () => {
      const mockService = createMockViewerService();
      const overlays = mockService.getOverlays();

      expect(overlays.add).toBeDefined();
      expect(overlays.remove).toBeDefined();
      expect(overlays.clear).toBeDefined();
    });

    it('should allow overriding methods', () => {
      const customGetContainer = jest.fn().mockReturnValue(document.createElement('section'));
      const mockService = createMockViewerService({
        getContainer: customGetContainer,
      });

      const container = mockService.getContainer();
      expect(customGetContainer).toHaveBeenCalled();
      expect(container.tagName).toBe('SECTION');
    });

    it('should provide working mock overlay methods', () => {
      const mockService = createMockViewerService();
      const overlays = mockService.getOverlays();

      const overlayId = overlays.add('element-1', {
        position: { top: 10, left: 10 },
        html: document.createElement('div'),
      });

      expect(overlayId).toBe('overlay-1');
      expect(overlays.add).toHaveBeenCalled();
    });
  });
});
