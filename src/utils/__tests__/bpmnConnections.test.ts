/**
 * Tests for src/utils/bpmn/connections.ts
 *
 * The executed path is inferred from activity timestamps against the diagram graph, so
 * these tests drive the real resolution logic through a hand-built element registry
 * rather than a bpmn-js viewer.
 *
 * @module
 */
import { countTraversals, getDottedConnections, getExecutedConnections, getMid } from '../bpmn/connections';
import type { ExecutedConnection } from '../bpmn/connections';
import type { ElementRegistry, HistoricActivityInstance } from '../../types';

interface FakeShape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  incoming: FakeFlow[];
  outgoing: FakeFlow[];
}

interface FakeFlow {
  id: string;
  type: string;
  source: FakeShape;
  target: FakeShape;
  waypoints: { x: number; y: number }[];
}

/**
 * Builds an element registry over a small graph, wiring incoming/outgoing on both ends
 * of every flow the way bpmn-js does.
 */
function buildGraph(
  shapes: { id: string; type?: string }[],
  flows: { id: string; source: string; target: string }[]
): { registry: ElementRegistry; shapes: Record<string, FakeShape>; flows: Record<string, FakeFlow> } {
  const shapesById: Record<string, FakeShape> = {};
  shapes.forEach((shape, position) => {
    shapesById[shape.id] = {
      id: shape.id,
      type: shape.type ?? 'bpmn:Task',
      x: position * 100,
      y: 0,
      width: 80,
      height: 60,
      incoming: [],
      outgoing: [],
    };
  });

  const flowsById: Record<string, FakeFlow> = {};
  for (const flow of flows) {
    const source = shapesById[flow.source] as FakeShape;
    const target = shapesById[flow.target] as FakeShape;
    const element: FakeFlow = {
      id: flow.id,
      type: 'bpmn:SequenceFlow',
      source,
      target,
      waypoints: [
        { x: source.x + source.width, y: source.y + source.height / 2 },
        { x: target.x, y: target.y + target.height / 2 },
      ],
    };
    source.outgoing.push(element);
    target.incoming.push(element);
    flowsById[flow.id] = element;
  }

  const registry = {
    get: (id: string) => (shapesById[id] ?? flowsById[id]) as never,
    getAll: () => [] as never[],
    forEach: () => undefined,
  } as unknown as ElementRegistry;

  return { registry, shapes: shapesById, flows: flowsById };
}

/** Builds a historic activity record at whole-minute timestamps. */
function activity(
  activityId: string,
  startMinute: number,
  endMinute: number | null,
  extra: Partial<HistoricActivityInstance> = {}
): HistoricActivityInstance {
  const at = (minute: number): string => `2024-01-01T10:${String(minute).padStart(2, '0')}:00.000+0000`;
  return {
    activityId,
    activityType: 'userTask',
    startTime: at(startMinute),
    endTime: endMinute === null ? null : at(endMinute),
    ...extra,
  } as HistoricActivityInstance;
}

/** Maps resolved connections to `id: count` for readable assertions. */
function countsById(connections: ExecutedConnection[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const connection of connections) {
    counts[connection.element.id] = connection.count;
  }
  return counts;
}

describe('utils/bpmn/connections', () => {
  describe('getMid', () => {
    it('returns the centre of a shape', () => {
      expect(getMid({ x: 10, y: 20, width: 100, height: 60 } as never)).toEqual({ x: 60, y: 50 });
    });
  });

  describe('countTraversals', () => {
    it('pairs each source execution with a later target execution', () => {
      expect(countTraversals(['1', '3', '5'], ['2', '4', '6'])).toBe(3);
    });

    it('never exceeds the smaller side', () => {
      expect(countTraversals(['1', '2', '3', '4', '5'], ['6'])).toBe(1);
      expect(countTraversals(['1'], ['2', '3', '4', '5'])).toBe(1);
    });

    it('ignores target executions that finished before the source did', () => {
      expect(countTraversals(['5'], ['1', '2', '3'])).toBe(0);
    });

    it('returns zero when either side never executed', () => {
      expect(countTraversals([], ['1'])).toBe(0);
      expect(countTraversals(['1'], [])).toBe(0);
    });
  });

  describe('getExecutedConnections', () => {
    it('resolves a linear path', () => {
      const { registry } = buildGraph(
        [{ id: 'Start_1', type: 'bpmn:StartEvent' }, { id: 'Task_1' }, { id: 'End_1', type: 'bpmn:EndEvent' }],
        [
          { id: 'Flow_1', source: 'Start_1', target: 'Task_1' },
          { id: 'Flow_2', source: 'Task_1', target: 'End_1' },
        ]
      );

      const connections = getExecutedConnections(
        [activity('Start_1', 1, 1), activity('Task_1', 1, 3), activity('End_1', 3, 3)],
        registry
      );

      expect(countsById(connections)).toEqual({ Flow_1: 1, Flow_2: 1 });
    });

    it('highlights only the branch an exclusive gateway took', () => {
      const { registry } = buildGraph(
        [{ id: 'Gateway_1', type: 'bpmn:ExclusiveGateway' }, { id: 'Task_Approved' }, { id: 'Task_Rejected' }],
        [
          { id: 'Flow_Approved', source: 'Gateway_1', target: 'Task_Approved' },
          { id: 'Flow_Rejected', source: 'Gateway_1', target: 'Task_Rejected' },
        ]
      );

      const connections = getExecutedConnections(
        [activity('Gateway_1', 1, 1, { activityType: 'exclusiveGateway' }), activity('Task_Approved', 2, 3)],
        registry
      );

      expect(countsById(connections)).toEqual({ Flow_Approved: 1 });
    });

    it('does not reorder the outgoing flows of the shared bpmn-js model', () => {
      const { registry, shapes } = buildGraph(
        [{ id: 'Gateway_1', type: 'bpmn:ExclusiveGateway' }, { id: 'Task_A' }, { id: 'Task_B' }],
        [
          { id: 'Flow_A', source: 'Gateway_1', target: 'Task_A' },
          { id: 'Flow_B', source: 'Gateway_1', target: 'Task_B' },
        ]
      );

      getExecutedConnections(
        [activity('Gateway_1', 1, 1, { activityType: 'exclusiveGateway' }), activity('Task_B', 2, 3)],
        registry
      );

      expect((shapes['Gateway_1'] as FakeShape).outgoing.map(flow => flow.id)).toEqual(['Flow_A', 'Flow_B']);
    });

    it('counts every traversal of a loop', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [
          { id: 'Flow_Forward', source: 'Task_A', target: 'Task_B' },
          { id: 'Flow_Back', source: 'Task_B', target: 'Task_A' },
        ]
      );

      const connections = getExecutedConnections(
        [
          activity('Task_A', 1, 1),
          activity('Task_B', 2, 2),
          activity('Task_A', 3, 3),
          activity('Task_B', 4, 4),
          activity('Task_A', 5, 5),
          activity('Task_B', 6, 6),
        ],
        registry
      );

      // Three passes forward, two returns between them.
      expect(countsById(connections)).toEqual({ Flow_Forward: 3, Flow_Back: 2 });
    });

    it('draws no flow into a canceled activity', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [{ id: 'Flow_1', source: 'Task_A', target: 'Task_B' }]
      );

      const connections = getExecutedConnections(
        [activity('Task_A', 1, 1), activity('Task_B', 2, 3, { canceled: true })],
        registry
      );

      expect(countsById(connections)).toEqual({});
    });

    it('draws no flow out of a canceled activity', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [{ id: 'Flow_1', source: 'Task_A', target: 'Task_B' }]
      );

      const connections = getExecutedConnections(
        [activity('Task_A', 1, 2, { canceled: true }), activity('Task_B', 2, 3)],
        registry
      );

      expect(countsById(connections)).toEqual({});
    });

    it('still draws the flow into the activity a token is sitting on', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [{ id: 'Flow_1', source: 'Task_A', target: 'Task_B' }]
      );

      const connections = getExecutedConnections([activity('Task_A', 1, 1), activity('Task_B', 2, null)], registry);

      expect(countsById(connections)).toEqual({ Flow_1: 1 });
    });

    it('resolves activity ids that carry an execution scope suffix', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [{ id: 'Flow_1', source: 'Task_A', target: 'Task_B' }]
      );

      const connections = getExecutedConnections(
        [activity('Task_A#scope', 1, 1), activity('Task_B#scope', 2, 3)],
        registry
      );

      expect(countsById(connections)).toEqual({ Flow_1: 1 });
    });

    it('does not count the multi-instance body as an execution of its activity', () => {
      const { registry } = buildGraph(
        [{ id: 'Task_MI' }, { id: 'Task_After' }],
        [{ id: 'Flow_1', source: 'Task_MI', target: 'Task_After' }]
      );

      const connections = getExecutedConnections(
        [
          activity('Task_MI', 1, 1),
          activity('Task_MI', 2, 2),
          activity('Task_MI#multiInstanceBody', 1, 3),
          activity('Task_After', 4, 5),
          activity('Task_After', 6, 7),
          activity('Task_After', 8, 9),
        ],
        registry
      );

      // Two real instances ran, so the flow out of them was taken twice — not three
      // times, which is what counting the wrapping body would give.
      expect(countsById(connections)).toEqual({ Flow_1: 2 });
    });

    it('ignores activities that are not on the diagram', () => {
      const { registry } = buildGraph([{ id: 'Task_A' }], []);

      expect(getExecutedConnections([activity('Task_Gone', 1, 2)], registry)).toEqual([]);
    });

    it('returns nothing for an instance with no activities', () => {
      const { registry } = buildGraph([{ id: 'Task_A' }], []);

      expect(getExecutedConnections([], registry)).toEqual([]);
    });
  });

  describe('getDottedConnections', () => {
    it('bridges an incoming and an outgoing flow through a node', () => {
      const { flows } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }, { id: 'Task_C' }],
        [
          { id: 'Flow_In', source: 'Task_A', target: 'Task_B' },
          { id: 'Flow_Out', source: 'Task_B', target: 'Task_C' },
        ]
      );

      const dotted = getDottedConnections([
        { element: flows['Flow_In'] as never, count: 3 },
        { element: flows['Flow_Out'] as never, count: 2 },
      ]);

      expect(dotted).toHaveLength(1);
      expect(dotted[0]?.waypoints).toHaveLength(3);
      // The stub cannot have carried more tokens than either leg did.
      expect(dotted[0]?.count).toBe(2);
    });

    it('does not bridge through a subprocess', () => {
      const { flows } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Sub_1', type: 'bpmn:SubProcess' }, { id: 'Task_C' }],
        [
          { id: 'Flow_In', source: 'Task_A', target: 'Sub_1' },
          { id: 'Flow_Out', source: 'Sub_1', target: 'Task_C' },
        ]
      );

      const dotted = getDottedConnections([
        { element: flows['Flow_In'] as never, count: 1 },
        { element: flows['Flow_Out'] as never, count: 1 },
      ]);

      expect(dotted).toEqual([]);
    });

    it('emits each incoming/outgoing pair once', () => {
      const { flows } = buildGraph(
        [{ id: 'Task_A' }, { id: 'Task_B' }],
        [
          { id: 'Flow_Forward', source: 'Task_A', target: 'Task_B' },
          { id: 'Flow_Back', source: 'Task_B', target: 'Task_A' },
        ]
      );

      const dotted = getDottedConnections([
        { element: flows['Flow_Forward'] as never, count: 2 },
        { element: flows['Flow_Back'] as never, count: 2 },
      ]);

      // One stub through Task_B, one through Task_A.
      expect(dotted).toHaveLength(2);
    });
  });
});
