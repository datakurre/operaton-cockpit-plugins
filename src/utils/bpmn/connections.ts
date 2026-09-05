/**
 * BPMN connection and flow analysis utilities.
 *
 * Handles extraction and analysis of sequence flow connections from historic activities.
 *
 * The engine never tells us which sequence flows were taken, so the executed path is
 * inferred from activity timestamps: a flow counts as traversed once for every pairing
 * of a completed source execution with a later target execution.
 * @module
 */
import type * as BPMNModdle from 'bpmn-moddle';

type Bounds = BPMNModdle.Bounds;

import type { ElementRegistry, HistoricActivityInstance } from '../../types';

/**
 * Coordinate point interface.
 */
export interface XY {
  x: number;
  y: number;
}

/**
 * A bpmn-js connection element, as far as this module needs it.
 */
export interface ConnectionElement {
  id: string;
  source: { id: string; type?: string };
  target: { id: string; type?: string };
  waypoints: XY[];
}

/**
 * A bpmn-js shape element, as far as this module needs it.
 */
interface ConnectionHost {
  incoming?: ConnectionElement[];
  outgoing?: ConnectionElement[];
}

/**
 * A sequence flow that was traversed, with how often it was traversed.
 */
export interface ExecutedConnection {
  /** The bpmn-js connection element, carrying the waypoints to draw. */
  element: ConnectionElement;
  /** Number of times the flow was traversed. Always at least 1. */
  count: number;
}

/**
 * Connection with waypoints for rendering.
 */
export interface DottedConnection {
  waypoints: XY[];
  /** Number of times the token passed through the node. Always at least 1. */
  count: number;
}

/**
 * Gets the midpoint of a BPMN shape.
 * @param shape - Shape bounds with x, y, width, height
 * @returns Center point coordinates
 */
export const getMid = (shape: Bounds): XY => {
  return {
    x: shape.x + shape.width / 2,
    y: shape.y + shape.height / 2,
  };
};

/** Types that should not have dotted connections drawn through them */
const notDottedTypes = ['bpmn:SubProcess'];

/**
 * Sentinel end time for an execution that is still running. Sorts after every ISO
 * timestamp, so an unfinished activity reads as "ended last".
 */
/**
 * Sentinel end time for an execution that is still running. Sorts after every numeric
 * timestamp, so an unfinished activity reads as "ended last".
 */
const STILL_RUNNING = Number.POSITIVE_INFINITY;

/**
 * Converts an activity timestamp to epoch milliseconds.
 * Returns STILL_RUNNING if null, undefined, or unparseable.
 */
function toTimestamp(val: number | string | null | undefined): number {
  if (val === null || val === undefined) {
    return STILL_RUNNING;
  }
  if (typeof val === 'number') {
    return val;
  }
  const parsed = Date.parse(val);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  const num = Number(val);
  return Number.isNaN(num) ? STILL_RUNNING : num;
}

/**
 * Computes dotted connections through the nodes the executed path passes through.
 *
 * These bridge the gap inside a shape — from where an executed flow arrives to where
 * the next executed flow leaves — so the highlighted path reads as continuous, and so
 * loops back through the same node stay visible.
 * @param connections - Executed connections to bridge
 * @returns Array of dotted connection objects with waypoints and traversal counts
 */
export const getDottedConnections = (connections: ExecutedConnection[]): DottedConnection[] => {
  const dottedConnections: DottedConnection[] = [];
  const seen = new Set<string>();

  for (const incoming of connections) {
    const node = incoming.element.target;

    if (notDottedTypes.includes(node.type ?? '')) {
      continue;
    }

    for (const outgoing of connections) {
      if (outgoing.element.source.id !== node.id) {
        continue;
      }

      const key = `${incoming.element.id}->${outgoing.element.id}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      const from = incoming.element.waypoints[incoming.element.waypoints.length - 1];
      const to = outgoing.element.waypoints[0];
      if (!from || !to) {
        continue;
      }

      dottedConnections.push({
        waypoints: [from, getMid(node as unknown as Bounds), to],
        count: Math.min(incoming.count, outgoing.count),
      });
    }
  }

  return dottedConnections;
};

/**
 * Strips the execution scope suffix the engine appends to an activity id
 * (`Task_1#multiInstanceBody`), leaving the diagram element id.
 * @param activityId - Historic activity id
 * @returns The BPMN element id
 */
const toElementId = (activityId: string): string => activityId.split('#')[0] ?? '';

/**
 * Multi-instance bodies wrap the real executions of an activity rather than being one
 * of them, so counting them would inflate every multi-instance activity by one.
 */
const isMultiInstanceBody = (activityId: string): boolean => activityId.endsWith('#multiInstanceBody');

/**
 * A canceled activity did not complete, so nothing flowed out of it. Gateways are the
 * exception: cancelation is recorded on them even when the token passed through.
 * @param activity - Historic activity instance
 * @returns True when the activity was canceled and is not a gateway
 */
const isCanceled = (activity: HistoricActivityInstance): boolean =>
  activity.canceled === true && !(activity.activityType ?? '').endsWith('Gateway');

/**
 * Execution times of the diagram elements an instance visited, indexed by element id.
 * Every array is sorted ascending, so index `n` is the `n`-th execution in time order.
 */
interface ActivityTimeIndex {
  /** End times of completed, uncanceled executions. A flow's source must be one of these. */
  sourceEndTimes: Map<string, number[]>;
  /** End times of uncanceled executions, still-running ones included. A flow's target. */
  targetEndTimes: Map<string, number[]>;
  /** Start times of every execution, used to rank exclusive gateway branches. */
  startTimes: Map<string, number[]>;
  /** End times of every execution, used to rank exclusive gateway branches. */
  endTimes: Map<string, number[]>;
  /** Elements with at least one recorded execution. */
  executedElementIds: Set<string>;
}

/**
 * Appends a time to the array stored under an element id.
 */
function push(times: Map<string, number[]>, elementId: string, time: number): void {
  const existing = times.get(elementId);
  if (existing) {
    existing.push(time);
  } else {
    times.set(elementId, [time]);
  }
}

/**
 * Indexes the execution times of every activity by diagram element id.
 * @param activities - Historic activity instances
 * @returns Sorted time index
 */
function buildActivityTimeIndex(activities: HistoricActivityInstance[]): ActivityTimeIndex {
  const index: ActivityTimeIndex = {
    sourceEndTimes: new Map(),
    targetEndTimes: new Map(),
    startTimes: new Map(),
    endTimes: new Map(),
    executedElementIds: new Set(),
  };

  for (const activity of activities) {
    const activityId = activity.activityId ?? '';
    if (isMultiInstanceBody(activityId)) {
      continue;
    }

    const elementId = toElementId(activityId);
    const endTime = toTimestamp(activity.endTime);

    index.executedElementIds.add(elementId);
    push(index.startTimes, elementId, toTimestamp(activity.startTime));
    push(index.endTimes, elementId, endTime);

    if (isCanceled(activity)) {
      continue;
    }

    push(index.targetEndTimes, elementId, endTime);

    if (activity.endTime) {
      push(index.sourceEndTimes, elementId, toTimestamp(activity.endTime));
    }
  }

  for (const times of [index.sourceEndTimes, index.targetEndTimes, index.startTimes, index.endTimes]) {
    for (const values of Array.from(times.values())) {
      values.sort((a, b) => a - b);
    }
  }

  return index;
}

/**
 * Counts how often a flow was traversed, by greedily pairing each source execution
 * with the earliest later target execution.
 *
 * The pairing is one-to-one, so the count can never exceed either side's execution
 * count: a task that ran three times downstream of a gateway that ran five times
 * yields three traversals, not fifteen.
 *
 * @param sourceEndTimes - Ascending end times of the source's completed executions
 * @param targetEndTimes - Ascending end times of the target's executions
 * @returns Number of traversals, zero when the flow was never taken
 */
export function countTraversals(sourceEndTimes: (number | string)[], targetEndTimes: (number | string)[]): number {
  let source = 0;
  let target = 0;
  let traversals = 0;

  while (source < sourceEndTimes.length && target < targetEndTimes.length) {
    if (toTimestamp(targetEndTimes[target]) >= toTimestamp(sourceEndTimes[source])) {
      traversals++;
      source++;
    }
    target++;
  }

  return traversals;
}

/**
 * Execution parameters for evaluating an exclusive gateway pass.
 */
interface GatewayExecution {
  elementId: string;
  executionIndex: number;
  endTime: number;
}

/**
 * Resolves the outgoing branch taken during a single execution of an exclusive gateway.
 */
function resolveTakenBranch(
  outgoing: ConnectionElement[],
  execution: GatewayExecution,
  index: ActivityTimeIndex,
  targetPointers: Map<string, number>
): ConnectionElement | null {
  let bestConnection: ConnectionElement | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;
  let bestTargetNextPtr = 0;

  for (const connection of outgoing) {
    const targetId = connection.target.id;
    const targetTimes = index.startTimes.get(targetId) ?? [];
    let ptr = targetPointers.get(targetId) ?? 0;

    if (targetId === execution.elementId && ptr <= execution.executionIndex) {
      ptr = execution.executionIndex + 1;
    }

    while (ptr < targetTimes.length && (targetTimes[ptr] ?? 0) < execution.endTime) {
      ptr++;
    }
    targetPointers.set(targetId, ptr);

    if (ptr >= targetTimes.length) {
      continue;
    }

    const delta = (targetTimes[ptr] ?? STILL_RUNNING) - execution.endTime;
    if (delta >= 0 && delta < bestDelta) {
      bestDelta = delta;
      bestConnection = connection;
      bestTargetNextPtr = ptr + 1;
    }
  }

  if (bestConnection) {
    targetPointers.set(bestConnection.target.id, bestTargetNextPtr);
  }

  return bestConnection;
}

/**
 * Gateways narrowed to the single branch taken on each pass.
 *
 * Inclusive gateways are deliberately absent: they may fire several branches from one
 * execution, and the generic traversal pairing already models that correctly — each
 * fired branch pairs with the same gateway execution and scores one, while a branch
 * that never ran has no target executions to pair with and is dropped.
 *
 * Event-based gateways need no narrowing either, confirmed against Operaton 2.2.0 in
 * both directions (message wins, timer wins): the engine records nothing at all for
 * the branches that lost. A losing branch therefore has no target executions to pair
 * with and the generic rule drops it.
 *
 * That observation carries a trap worth naming. The gateway itself comes back with
 * `canceled: true` even though the token passed through it, which is exactly what the
 * gateway escape in `isCanceled` below exists for — without it the gateway would be
 * excluded as a source and the *winning* branch would be dropped along with the
 * losers.
 */
const singleBranchGatewayTypes = ['exclusiveGateway'];

/** Whether an activity record is a gateway narrowed to the single branch it took. */
const isSingleBranchGateway = (activity: HistoricActivityInstance): boolean =>
  singleBranchGatewayTypes.includes(activity.activityType ?? '');

/**
 * Builds a deny list of connections that should not be highlighted for gateways that
 * take a single branch. For each execution of the gateway only the branch that was
 * taken is kept.
 * @param activities - Historic activity instances
 * @param elementRegistry - BPMN element registry
 * @param index - Execution time index
 * @returns Set of connection IDs to exclude from highlighting
 */
function buildConnectionDenyList(
  activities: HistoricActivityInstance[],
  elementRegistry: ElementRegistry,
  index: ActivityTimeIndex
): Set<string> {
  const connectionDenyList = new Set<string>();
  const visited = new Set<string>();

  for (const activity of activities) {
    if (!isSingleBranchGateway(activity)) {
      continue;
    }

    const elementId = toElementId(activity.activityId ?? '');
    if (visited.has(elementId)) {
      continue;
    }
    visited.add(elementId);

    const element = elementRegistry.get(elementId) as unknown as ConnectionHost | undefined;
    const outgoing = element?.outgoing;
    if (!outgoing || outgoing.length === 0) {
      continue;
    }

    const activeConnections = new Set<string>();
    const gatewayEndTimes = index.endTimes.get(elementId) ?? [];
    const targetPointers = new Map<string, number>();

    for (let idx = 0; idx < gatewayEndTimes.length; idx++) {
      const taken = resolveTakenBranch(
        outgoing,
        { elementId, executionIndex: idx, endTime: gatewayEndTimes[idx] ?? STILL_RUNNING },
        index,
        targetPointers
      );
      if (taken) {
        activeConnections.add(taken.id);
      }
    }

    for (const connection of outgoing) {
      if (!activeConnections.has(connection.id) && connection.target.type !== 'bpmn:ParallelGateway') {
        connectionDenyList.add(connection.id);
      }
    }
  }

  return connectionDenyList;
}

/**
 * Resolves the sequence flows an instance actually took, with traversal counts.
 *
 * Analyzes historic activity instances and determines which sequence flows were
 * executed, handling special cases like:
 * - Exclusive gateways (only highlighting the taken path)
 * - Canceled activities (nothing flows out of them, and nothing flows into them)
 * - Multiple executions of the same activity (counted, so loops can be weighted)
 *
 * @param activities - Historic activity instances to analyze
 * @param elementRegistry - BPMN element registry from viewer
 * @returns Executed connections with the number of times each was traversed
 */
export const getExecutedConnections = (
  activities: HistoricActivityInstance[],
  elementRegistry: ElementRegistry
): ExecutedConnection[] => {
  const index = buildActivityTimeIndex(activities);
  const connectionDenyList = buildConnectionDenyList(activities, elementRegistry, index);

  // Every flow touching an executed element is a candidate, scored once below.
  const candidates = new Map<string, ConnectionElement>();
  for (const elementId of Array.from(index.executedElementIds)) {
    const element = elementRegistry.get(elementId) as unknown as ConnectionHost | undefined;
    if (!element) {
      continue;
    }
    for (const connection of [...(element.incoming ?? []), ...(element.outgoing ?? [])]) {
      candidates.set(connection.id, connection);
    }
  }

  const executed: ExecutedConnection[] = [];
  for (const connection of Array.from(candidates.values())) {
    if (connectionDenyList.has(connection.id)) {
      continue;
    }

    const sourceTimes = index.sourceEndTimes.get(connection.source.id) ?? [];
    const rawTargetTimes = index.targetEndTimes.get(connection.target.id) ?? [];
    const targetTimes = connection.source.id === connection.target.id ? rawTargetTimes.slice(1) : rawTargetTimes;

    const count = countTraversals(sourceTimes, targetTimes);

    if (count > 0) {
      executed.push({ element: connection, count });
    }
  }

  return executed;
};
