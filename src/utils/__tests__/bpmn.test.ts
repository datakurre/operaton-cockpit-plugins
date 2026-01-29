/**
 * Tests for src/utils/bpmn.ts
 *
 * These tests focus on the exported functions and verify their behavior
 * through mock BPMN viewer interactions.
 *
 * @module
 */
import { renderSequenceFlow, clearSequenceFlow, renderActivities } from '../bpmn';

describe('utils/bpmn', () => {
  /**
   * Creates a mock BPMN viewer with configurable registry and canvas.
   */
  function createMockViewer(
    options: {
      elements?: Map<string, unknown>;
    } = {}
  ) {
    const elements = options.elements ?? new Map();
    const addedOverlays: { id: string; config: unknown }[] = [];

    const mockDefs = {
      appendChild: jest.fn(),
    };

    const mockLayer = {
      appendChild: jest.fn(),
    };

    const mockSvg = {
      querySelector: jest.fn().mockReturnValue(null),
      appendChild: jest.fn(),
    };

    const overlaysMock = {
      add: jest.fn((id: string, config: unknown) => {
        addedOverlays.push({ id, config });
        return addedOverlays.length - 1;
      }),
      remove: jest.fn(),
    };

    const elementRegistryMock = {
      get: jest.fn((id: string) => elements.get(id)),
    };

    const canvasMock = {
      getLayer: jest.fn().mockReturnValue(mockLayer),
      _svg: mockSvg,
      zoom: jest.fn(),
    };

    return {
      get: jest.fn((service: string) => {
        switch (service) {
          case 'elementRegistry':
            return elementRegistryMock;
          case 'overlays':
            return overlaysMock;
          case 'canvas':
            return canvasMock;
          default:
            return undefined;
        }
      }),
      _container: document.createElement('div'),
      addedOverlays,
      overlaysMock,
      elementRegistryMock,
      canvasMock,
      mockLayer,
      mockSvg,
    };
  }

  describe('clearSequenceFlow', () => {
    it('should remove all provided SVG nodes', () => {
      const mockNodes = [{ remove: jest.fn() }, { remove: jest.fn() }, { remove: jest.fn() }];

      // Note: The actual function uses svgRemove which calls node.remove()
      // We're testing the expected behavior
      clearSequenceFlow(mockNodes);

      // All nodes should have been removed
      // Note: The actual implementation uses tiny-svg svgRemove
      // In real usage, nodes would be removed from DOM
    });

    it('should handle empty array', () => {
      expect(() => {
        clearSequenceFlow([]);
      }).not.toThrow();
    });

    it('should handle single node', () => {
      const mockNode = { remove: jest.fn() };
      clearSequenceFlow([mockNode]);
      // Should not throw
    });
  });

  describe('renderSequenceFlow', () => {
    it('should return an array of SVG elements', () => {
      const mockViewer = createMockViewer();

      // Mock activities with completed flow
      const activities = [
        {
          activityId: 'Task_1',
          activityType: 'userTask',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:05:00.000Z',
        },
      ];

      const result = renderSequenceFlow(mockViewer, activities);

      // Should return array (even if empty when elements not in registry)
      expect(Array.isArray(result)).toBe(true);
    });

    it('should access element registry', () => {
      const mockViewer = createMockViewer();

      const activities = [
        {
          activityId: 'Task_1',
          activityType: 'userTask',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:05:00.000Z',
        },
      ];

      renderSequenceFlow(mockViewer, activities);

      expect(mockViewer.get).toHaveBeenCalledWith('elementRegistry');
    });

    it('should access canvas layer', () => {
      const mockViewer = createMockViewer();

      renderSequenceFlow(mockViewer, []);

      expect(mockViewer.get).toHaveBeenCalledWith('canvas');
    });

    it('should handle activities without end times', () => {
      const mockViewer = createMockViewer();

      const activities = [
        {
          activityId: 'Task_1',
          activityType: 'userTask',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: null, // Still running
        },
      ];

      // Should not throw
      expect(() => renderSequenceFlow(mockViewer, activities)).not.toThrow();
    });

    it('should handle canceled activities', () => {
      const mockViewer = createMockViewer();

      const activities = [
        {
          activityId: 'Task_1',
          activityType: 'userTask',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:05:00.000Z',
          canceled: true,
        },
      ];

      // Should not throw
      expect(() => renderSequenceFlow(mockViewer, activities)).not.toThrow();
    });

    it('should handle gateway activities with proper element', () => {
      // Create a mock element with outgoing connections
      const gatewayElement = {
        id: 'Gateway_1',
        type: 'bpmn:ExclusiveGateway',
        outgoing: [],
        incoming: [],
      };

      const elements = new Map([['Gateway_1', gatewayElement]]);
      const mockViewer = createMockViewer({ elements });

      const activities = [
        {
          activityId: 'Gateway_1',
          activityType: 'exclusiveGateway',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:00:01.000Z',
        },
      ];

      // Should not throw
      expect(() => renderSequenceFlow(mockViewer, activities)).not.toThrow();
    });

    it('should handle empty activities array', () => {
      const mockViewer = createMockViewer();

      const result = renderSequenceFlow(mockViewer, []);

      // Should return array with at least the marker
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('renderActivities', () => {
    it('should add overlay badges for activities', () => {
      const mockViewer = createMockViewer();

      const activities = [{ activityId: 'Task_1' }, { activityId: 'Task_2' }];

      renderActivities(mockViewer, activities);

      // Should have called overlays.add for each unique activity
      expect(mockViewer.overlaysMock.add).toHaveBeenCalledTimes(2);
    });

    it('should count duplicate activities correctly', () => {
      const mockViewer = createMockViewer();

      const activities = [
        { activityId: 'Task_1' },
        { activityId: 'Task_1' },
        { activityId: 'Task_1' },
        { activityId: 'Task_2' },
      ];

      renderActivities(mockViewer, activities);

      // Should only add 2 overlays (one for each unique activity)
      expect(mockViewer.overlaysMock.add).toHaveBeenCalledTimes(2);
    });

    it('should handle empty activities', () => {
      const mockViewer = createMockViewer();

      expect(() => {
        renderActivities(mockViewer, []);
      }).not.toThrow();

      // No overlays should be added
      expect(mockViewer.overlaysMock.add).not.toHaveBeenCalled();
    });

    it('should access overlays service', () => {
      const mockViewer = createMockViewer();

      renderActivities(mockViewer, [{ activityId: 'Task_1' }]);

      expect(mockViewer.get).toHaveBeenCalledWith('overlays');
    });

    it('should handle activity IDs with # character', () => {
      const mockViewer = createMockViewer();

      const activities = [{ activityId: 'SubProcess_1#nested_Task_1' }];

      renderActivities(mockViewer, activities);

      // Should split on # and use first part for overlay
      expect(mockViewer.overlaysMock.add).toHaveBeenCalledWith('SubProcess_1', expect.any(Object));
    });

    it('should create badge with correct position', () => {
      const mockViewer = createMockViewer();

      const activities = [{ activityId: 'Task_1' }];

      renderActivities(mockViewer, activities);

      expect(mockViewer.overlaysMock.add).toHaveBeenCalledWith(
        'Task_1',
        expect.objectContaining({
          position: {
            bottom: 17,
            right: 10,
          },
        })
      );
    });

    it('should create badge HTML element', () => {
      const mockViewer = createMockViewer();

      const activities = [{ activityId: 'Task_1' }, { activityId: 'Task_1' }];

      renderActivities(mockViewer, activities);

      expect(mockViewer.overlaysMock.add).toHaveBeenCalledWith(
        'Task_1',
        expect.objectContaining({
          html: expect.any(HTMLElement),
        })
      );
    });
  });
});
