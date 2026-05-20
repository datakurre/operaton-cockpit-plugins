/**
 * BPMN connection and flow analysis utilities.
 *
 * Handles extraction and analysis of sequence flow connections from historic activities.
 * @module
 */
import { filter, forEach, map, uniqueBy } from 'min-dash';
import type { Activity, Bounds } from 'bpmn-moddle';

import type { ElementRegistry, HistoricActivityInstance } from '../../types';

/**
 * Coordinate point interface.
 */
export interface XY {
  x: number;
  y: number;
}

/**
 * Connection with waypoints for rendering.
 */
export interface DottedConnection {
  waypoints: XY[];
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
 * Computes dotted connections between activities that share the same element.
 * These represent loops or repeated executions through the same node.
 * @param connections - Array of BPMN connections
 * @returns Array of dotted connection objects with waypoints
 */
export const getDottedConnections = (connections: Activity[]): DottedConnection[] => {
  const dottedConnections: DottedConnection[] = [];

  connections.forEach(connection => {
    const conn = connection as unknown as { target: { type: string }; waypoints: XY[] };
    const { target } = conn;

    connections.forEach(c => {
      const c2 = c as unknown as { source: { type: string }; waypoints: XY[] };
      const { source } = c2;

      if (source === target && !notDottedTypes.includes(source.type)) {
        dottedConnections.push({
          waypoints: [
            conn.waypoints[conn.waypoints.length - 1] as XY,
            getMid(target as unknown as Bounds),
            c2.waypoints[0] as XY,
          ],
        });
      }
    });
  });

  return dottedConnections;
};

/**
 * Builds a map of activity IDs to their end times from historic activities.
 * @param activities - Historic activity instances
 * @returns Map of activity ID to array of end times
 */
function buildEndTimesMap(activities: HistoricActivityInstance[]): Map<string, string[]> {
  const endTimesById = new Map<string, string[]>();
  for (const activity of activities) {
    const activityId = activity.activityId ?? '';
    if (endTimesById.has(activityId)) {
      const endTimes = endTimesById.get(activityId) ?? [];
      endTimes.push(activity.endTime ?? 'Z');
    } else {
      endTimesById.set(activityId, [activity.endTime ?? 'Z']);
    }
  }
  return endTimesById;
}

/**
 * Builds a map of activity IDs to their start times from historic activities.
 * @param activities - Historic activity instances
 * @returns Map of activity ID to array of start times
 */
function buildStartTimesMap(activities: HistoricActivityInstance[]): Map<string, string[]> {
  const startTimesById = new Map<string, string[]>();
  for (const activity of activities) {
    const activityId = activity.activityId ?? '';
    if (startTimesById.has(activityId)) {
      const startTimes = startTimesById.get(activityId) ?? [];
      startTimes.push(activity.startTime ?? 'Z');
    } else {
      startTimesById.set(activityId, [activity.startTime ?? 'Z']);
    }
  }
  return startTimesById;
}

/**
 * Determines which activities are valid (completed and not canceled).
 * @param activities - Historic activity instances
 * @returns Map of activity ID to validity boolean
 */
function buildValidActivityMap(activities: HistoricActivityInstance[]): Map<string, boolean> {
  const validActivity = new Map<string, boolean>();
  for (const activity of activities) {
    if (activity.endTime && !(activity.canceled && !(activity.activityType ?? '').endsWith('Gateway'))) {
      validActivity.set(activity.activityId ?? '', true);
    }
  }
  return validActivity;
}

/**
 * Builds a deny list of connections that should not be highlighted for exclusive gateways.
 * For exclusive gateways, only the first taken path should be highlighted.
 * @param activities - Historic activity instances
 * @param elementRegistry - BPMN element registry
 * @param startTimesById - Map of activity ID to start times
 * @param endTimesById - Map of activity ID to end times
 * @returns Set of connection IDs to exclude from highlighting
 */
function buildConnectionDenyList(
  activities: HistoricActivityInstance[],
  elementRegistry: ElementRegistry,
  startTimesById: Map<string, string[]>,
  endTimesById: Map<string, string[]>
): Set<string> {
  const connectionDenyList = new Set<string>();

  for (const activity of activities) {
    if (activity.activityType !== 'exclusiveGateway') {
      continue;
    }

    const activityId = activity.activityId ?? '';
    const element = elementRegistry.get(activityId) as unknown as Activity | undefined;

    if (!element?.outgoing || element.outgoing.length === 0) {
      continue;
    }

    const activeConnections: string[] = [];
    const myEndTimes = endTimesById.get(activityId) ?? [];

    for (let idx = 0; idx < myEndTimes.length; idx++) {
      const myEndTime = myEndTimes[idx] ?? 'Z';

      // Sort outgoing connections by their target's start time
      (element.outgoing as unknown as { id: string; target: { id: string } }[]).sort((a, b): number => {
        const startTimesA = startTimesById.get(a.target.id) ?? [];
        const startTimesB = startTimesById.get(b.target.id) ?? [];
        const startA = startTimesA[idx] ?? 'Z';
        const startB = startTimesB[idx] ?? 'Z';

        if (startTimesA.length <= idx) {
          return 1;
        } else if (startTimesB.length <= idx) {
          return -1;
        } else if (startA < myEndTime) {
          return 1;
        } else if (startB < myEndTime) {
          return -1;
        } else if (startA > startB) {
          return 1;
        } else if (startA < startB) {
          return -1;
        }
        return 0;
      });

      if (element.outgoing[0]) {
        activeConnections.push(element.outgoing[0].id);
      }
    }

    for (const connection of element.outgoing) {
      const connWithTarget = connection as unknown as { id: string; target?: { type?: string } };
      if (!activeConnections.includes(connection.id) && connWithTarget.target?.type !== 'bpmn:ParallelGateway') {
        connectionDenyList.add(connection.id);
      }
    }
  }

  return connectionDenyList;
}

/**
 * Extracts connected BPMN elements based on historic activities.
 *
 * This function analyzes historic activity instances and determines which
 * sequence flows were actually executed, handling special cases like:
 * - Exclusive gateways (only highlighting the taken path)
 * - Canceled activities
 * - Multiple executions of the same activity
 *
 * @param activities - Historic activity instances to analyze
 * @param elementRegistry - BPMN element registry from viewer
 * @returns Array of connected BPMN activity elements representing executed flows
 */
export const getConnections = (
  activities: HistoricActivityInstance[],
  elementRegistry: ElementRegistry
): Activity[] => {
  const validActivity = buildValidActivityMap(activities);
  const startTimesById = buildStartTimesMap(activities);
  const endTimesById = buildEndTimesMap(activities);
  const connectionDenyList = buildConnectionDenyList(activities, elementRegistry, startTimesById, endTimesById);

  // Build element map
  const elementById = new Map<string, Activity>(
    map(activities, (activity: HistoricActivityInstance): [string, Activity] => {
      const activityId = activity.activityId ?? '';
      const element = elementRegistry.get(activityId) as unknown as Activity | undefined;
      return [activityId, element as Activity];
    })
  );

  /**
   * Gets valid connections for a single activity.
   */
  const getActivityConnections = (activityId: string): Activity[] => {
    const current = elementById.get(activityId) as
      | (Activity & {
          incoming?: { id: string; source: { id: string } }[];
          outgoing?: { id: string; target: { id: string } }[];
        })
      | undefined;
    const currentEndTimesResult = endTimesById.get(activityId);
    const currentEndTimes = currentEndTimesResult ?? [];

    if (!current || !validActivity.get(activityId)) {
      return [];
    }

    // Extract connections before filtering to satisfy type narrowing
    // Use Array.isArray to force TypeScript to narrow the type correctly
    const rawIncoming = current.incoming;
    const rawOutgoing = current.outgoing;
    const incomingList = Array.isArray(rawIncoming) ? rawIncoming : [];
    const outgoingList = Array.isArray(rawOutgoing) ? rawOutgoing : [];

    const incoming = filter(incomingList, (connection: { id: string; source: { id: string } }) => {
      if (connectionDenyList.has(connection.id)) {
        return false;
      }
      const sourceEndTimes = endTimesById.get(connection.source.id);
      let incomingEndTimes: string[] = [];
      if (validActivity.get(connection.source.id)) {
        incomingEndTimes = sourceEndTimes ?? [];
      }
      return incomingEndTimes.reduce(
        (acc: boolean, iET: string) =>
          acc || currentEndTimes.reduce((acc_: boolean, cET: string) => acc_ || iET <= cET, false),
        false
      );
    });

    const outgoing = filter(outgoingList, (connection: { id: string; target: { id: string } }) => {
      if (connectionDenyList.has(connection.id)) {
        return false;
      }
      const targetEndTimes = endTimesById.get(connection.target.id);
      const outgoingEndTimes = targetEndTimes ?? [];
      return outgoingEndTimes.reduce(
        (acc: boolean, oET: string) =>
          acc || currentEndTimes.reduce((acc_: boolean, cET: string) => acc_ || oET >= cET, false),
        false
      );
    });

    return [...incoming, ...outgoing] as unknown as Activity[];
  };

  let connections: Activity[] = [];

  forEach(Array.from(elementById.keys()), (activityId: string) => {
    connections = uniqueBy('id', [...connections, ...getActivityConnections(activityId)]);
  });

  return connections;
};
