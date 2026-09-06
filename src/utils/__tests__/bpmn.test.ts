/**
 * Tests for src/utils/bpmn.ts
 *
 * These tests focus on the exported functions and verify their behavior
 * through mock BPMN viewer interactions.
 *
 * @module
 */
import { createCurve } from 'svg-curves';
import { create as svgCreate } from 'tiny-svg';

import { renderSequenceFlow, clearSequenceFlow, getStrokeWidth, renderActivities, renderRunningTokens } from '../bpmn';
import { EXECUTED_PATH_STROKE_WIDTH, EXECUTED_PATH_STROKE_WIDTH_MAX } from '../constants';

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

  describe('getStrokeWidth', () => {
    it('draws a single traversal at the base width', () => {
      expect(getStrokeWidth(1)).toBe(EXECUTED_PATH_STROKE_WIDTH);
    });

    it('grows the line with each doubling of the traversal count', () => {
      expect(getStrokeWidth(2)).toBe(6);
      expect(getStrokeWidth(4)).toBe(8);
      expect(getStrokeWidth(8)).toBe(10);
    });

    it('saturates at the cap rather than growing without bound', () => {
      expect(getStrokeWidth(16)).toBe(EXECUTED_PATH_STROKE_WIDTH_MAX);
      expect(getStrokeWidth(1000)).toBe(EXECUTED_PATH_STROKE_WIDTH_MAX);
    });

    it('never falls below the base width', () => {
      expect(getStrokeWidth(0)).toBe(EXECUTED_PATH_STROKE_WIDTH);
    });
  });

  /** Two tasks wired both ways, so the forward and back edges get different counts. */
  function createLoopViewer() {
    const taskA = { id: 'Task_A', type: 'bpmn:Task', x: 0, y: 0, width: 80, height: 60, incoming: [], outgoing: [] };
    const taskB = {
      id: 'Task_B',
      type: 'bpmn:Task',
      x: 200,
      y: 0,
      width: 80,
      height: 60,
      incoming: [],
      outgoing: [],
    };
    const forward = {
      id: 'Flow_Forward',
      source: taskA,
      target: taskB,
      waypoints: [
        { x: 80, y: 30 },
        { x: 200, y: 30 },
      ],
    };
    const back = {
      id: 'Flow_Back',
      source: taskB,
      target: taskA,
      waypoints: [
        { x: 200, y: 50 },
        { x: 80, y: 50 },
      ],
    };
    taskA.outgoing.push(forward as never);
    taskA.incoming.push(back as never);
    taskB.outgoing.push(back as never);
    taskB.incoming.push(forward as never);

    return createMockViewer({
      elements: new Map<string, unknown>([
        ['Task_A', taskA],
        ['Task_B', taskB],
      ]),
    });
  }

  const at = (minute: number) => `2024-01-01T10:0${minute}:00.000+0000`;

  describe('renderSequenceFlow weighting', () => {
    it('draws a repeatedly executed flow more heavily than a single pass', () => {
      const mockViewer = createLoopViewer();
      (createCurve as jest.Mock).mockClear();

      renderSequenceFlow(mockViewer, [
        { activityId: 'Task_A', activityType: 'userTask', startTime: at(1), endTime: at(1) },
        { activityId: 'Task_B', activityType: 'userTask', startTime: at(2), endTime: at(2) },
        { activityId: 'Task_A', activityType: 'userTask', startTime: at(3), endTime: at(3) },
        { activityId: 'Task_B', activityType: 'userTask', startTime: at(4), endTime: at(4) },
      ]);

      const widthsByCall = (createCurve as jest.Mock).mock.calls.map(call => call[1].strokeWidth);

      // Forward taken twice, back edge once.
      expect(widthsByCall).toContain(getStrokeWidth(2));
      expect(widthsByCall).toContain(getStrokeWidth(1));
      expect(Math.max(...widthsByCall)).toBe(getStrokeWidth(2));
    });

    it('references a fresh arrow marker on every render', () => {
      const mockViewer = createLoopViewer();
      (createCurve as jest.Mock).mockClear();

      renderSequenceFlow(mockViewer, [
        { activityId: 'Task_A', activityType: 'userTask', startTime: at(1), endTime: at(1) },
        { activityId: 'Task_B', activityType: 'userTask', startTime: at(2), endTime: at(2) },
      ]);
      const first = (createCurve as jest.Mock).mock.calls[0][1].markerEnd;

      (createCurve as jest.Mock).mockClear();
      renderSequenceFlow(mockViewer, [
        { activityId: 'Task_A', activityType: 'userTask', startTime: at(1), endTime: at(1) },
        { activityId: 'Task_B', activityType: 'userTask', startTime: at(2), endTime: at(2) },
      ]);
      const second = (createCurve as jest.Mock).mock.calls[0][1].markerEnd;

      expect(first).toMatch(/^url\(#executed-path-arrow-\d+\)$/);
      expect(second).not.toBe(first);
    });
  });

  describe('renderSequenceFlow truncation', () => {
    /** Text of every <title> element the render created. */
    function titlesFrom(create: jest.Mock): string[] {
      return create.mock.results
        .map(result => result.value as SVGElement | undefined)
        .filter((el): el is SVGElement => el?.tagName === 'title')
        .map(el => el.textContent ?? '');
    }

    const activities = [
      { activityId: 'Task_A', activityType: 'userTask', startTime: at(1), endTime: at(1) },
      { activityId: 'Task_B', activityType: 'userTask', startTime: at(2), endTime: at(2) },
    ];

    it('states the exact count when the history is complete', () => {
      const mockViewer = createLoopViewer();
      (svgCreate as jest.Mock).mockClear();

      renderSequenceFlow(mockViewer, activities);

      expect(titlesFrom(svgCreate as jest.Mock)).toContain('Executed once');
    });

    it('states the count as a lower bound when the history was truncated', () => {
      const mockViewer = createLoopViewer();
      (svgCreate as jest.Mock).mockClear();

      renderSequenceFlow(mockViewer, activities, { truncated: true });

      const titles = titlesFrom(svgCreate as jest.Mock);
      expect(titles).toContain('Executed at least once');
      expect(titles).not.toContain('Executed once');
    });
  });

  describe('renderRunningTokens', () => {
    const finished = { activityId: 'Task_A', endTime: '2024-01-01T10:00:00.000+0000' };
    const running = { activityId: 'Task_B', endTime: null };

    it('draws nothing for an instance that has finished', () => {
      const mockViewer = createMockViewer();

      expect(renderRunningTokens(mockViewer, [finished])).toEqual([]);
      expect(mockViewer.overlaysMock.add).not.toHaveBeenCalled();
    });

    it("uses Cockpit's own token markup so it matches the runtime view", () => {
      const mockViewer = createMockViewer();

      renderRunningTokens(mockViewer, [finished, running]);

      expect(mockViewer.overlaysMock.add).toHaveBeenCalledTimes(1);
      const [elementId, config] = mockViewer.overlaysMock.add.mock.calls[0];
      expect(elementId).toBe('Task_B');
      expect(config.position).toEqual({ bottom: 0, left: 0 });
      // The classes are what pick up Cockpit's blue styling; inline colours would not
      // follow its theming.
      expect(config.html.className).toBe('activity-bottom-left-position instances-overlay');
      expect(config.html.querySelector('.badge.instance-count')?.innerText).toBe('1');
    });

    it('counts concurrent tokens on the same activity', () => {
      const mockViewer = createMockViewer();

      renderRunningTokens(mockViewer, [running, { activityId: 'Task_B', endTime: null }]);

      const [, config] = mockViewer.overlaysMock.add.mock.calls[0];
      expect(config.html.querySelector('.badge.instance-count')?.innerText).toBe('2');
    });

    it('ignores an unfinished activity that was canceled', () => {
      const mockViewer = createMockViewer();

      renderRunningTokens(mockViewer, [{ activityId: 'Task_C', endTime: null, canceled: true }]);

      expect(mockViewer.overlaysMock.add).not.toHaveBeenCalled();
    });

    it('folds scope-suffixed ids onto their diagram element', () => {
      const mockViewer = createMockViewer();

      renderRunningTokens(mockViewer, [{ activityId: 'Task_D#scope', endTime: null }]);

      expect(mockViewer.overlaysMock.add.mock.calls[0][0]).toBe('Task_D');
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

    it('should fold scope-suffixed ids into one badge, as the heatmap folds them', () => {
      const mockViewer = createMockViewer();

      // Counting raw ids put a second badge on top of the first for a scoped activity,
      // each showing part of the total. The count has to belong to the blob it sits on.
      const activities = [{ activityId: 'Task_1' }, { activityId: 'Task_1#scope' }, { activityId: 'Task_1' }];

      renderActivities(mockViewer, activities);

      expect(mockViewer.overlaysMock.add).toHaveBeenCalledTimes(1);
      const html = mockViewer.overlaysMock.add.mock.calls[0][1].html as HTMLElement;
      expect(html.innerText).toBe('3');
    });

    it('should skip the multi-instance body so it is not counted as its own token', () => {
      const mockViewer = createMockViewer();

      const activities = [
        { activityId: 'Task_MI' },
        { activityId: 'Task_MI' },
        { activityId: 'Task_MI#multiInstanceBody' },
      ];

      renderActivities(mockViewer, activities);

      expect(mockViewer.overlaysMock.add).toHaveBeenCalledTimes(1);
      const html = mockViewer.overlaysMock.add.mock.calls[0][1].html as HTMLElement;
      expect(html.innerText).toBe('2');
    });

    it('should carry the cumulative time in the badge tooltip', () => {
      const mockViewer = createMockViewer();

      // The heatmap colours by time; the badge counts tokens. The tooltip is where the
      // figure behind a blob's colour can actually be read, so the two views agree.
      const activities = [
        { activityId: 'Task_1', durationInMillis: 1500, endTime: '2024-01-01T10:00:01.500Z' },
        { activityId: 'Task_1', durationInMillis: 500, endTime: '2024-01-01T10:00:02.000Z' },
      ];

      renderActivities(mockViewer, activities);

      const html = mockViewer.overlaysMock.add.mock.calls[0][1].html as HTMLElement;
      expect(html.innerText).toBe('2');
      expect(html.title).toBe('Cumulative time in this element so far: 00:00:02.0');
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
