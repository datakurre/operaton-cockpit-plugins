/**
 * Mock activity data for tests.
 *
 * @module
 */

/** Common activity types used in tests. */
export type ActivityType =
  | 'startEvent'
  | 'endEvent'
  | 'userTask'
  | 'serviceTask'
  | 'businessRuleTask'
  | 'callActivity'
  | 'exclusiveGateway'
  | 'parallelGateway';

/** Activity data structure as returned by the history API. */
export interface MockActivity {
  id: string;
  activityId: string;
  activityName: string;
  activityType: ActivityType;
  startTime: string;
  endTime: string | null;
  canceled: boolean;
  processInstanceId: string;
  processDefinitionId: string;
  calledProcessInstanceId?: string;
  durationInMillis?: number;
}

/** Substring start position for generating random IDs */
const RANDOM_ID_SLICE_START = 2;

/**
 * Creates a mock activity with sensible defaults.
 *
 * @param overrides - Optional overrides for activity properties
 * @returns Mock activity object
 */
export function createActivity(overrides: Partial<MockActivity> = {}): MockActivity {
  const id = overrides.id ?? `act-${Math.random().toString(RANDOM_ID_SLICE_START).slice(2)}`;
  return {
    id,
    activityId: 'Task_1',
    activityName: 'Task',
    activityType: 'userTask',
    startTime: '2024-01-01T10:00:00.000Z',
    endTime: '2024-01-01T10:05:00.000Z',
    canceled: false,
    processInstanceId: 'instance-123',
    processDefinitionId: 'definition-456',
    durationInMillis: 300000,
    ...overrides,
  };
}

/** Mock start event activity. */
export const mockStartEvent = createActivity({
  id: 'start-event-1',
  activityId: 'StartEvent_1',
  activityName: 'Start',
  activityType: 'startEvent',
  startTime: '2024-01-01T10:00:00.000Z',
  endTime: '2024-01-01T10:00:01.000Z',
  durationInMillis: 1000,
});

/** Mock user task activity. */
export const mockUserTask = createActivity({
  id: 'user-task-1',
  activityId: 'Task_1',
  activityName: 'Review Document',
  activityType: 'userTask',
  startTime: '2024-01-01T10:00:01.000Z',
  endTime: '2024-01-01T10:05:00.000Z',
  durationInMillis: 299000,
});

/** Mock service task activity. */
export const mockServiceTask = createActivity({
  id: 'service-task-1',
  activityId: 'ServiceTask_1',
  activityName: 'Send Email',
  activityType: 'serviceTask',
  startTime: '2024-01-01T10:05:00.000Z',
  endTime: '2024-01-01T10:05:02.000Z',
  durationInMillis: 2000,
});

/** Mock business rule task activity. */
export const mockBusinessRuleTask = createActivity({
  id: 'business-rule-1',
  activityId: 'BusinessRuleTask_1',
  activityName: 'Check Credit',
  activityType: 'businessRuleTask',
  startTime: '2024-01-01T10:05:02.000Z',
  endTime: '2024-01-01T10:05:03.000Z',
  durationInMillis: 1000,
});

/** Mock call activity. */
export const mockCallActivity = createActivity({
  id: 'call-activity-1',
  activityId: 'CallActivity_1',
  activityName: 'Sub Process',
  activityType: 'callActivity',
  startTime: '2024-01-01T10:05:03.000Z',
  endTime: '2024-01-01T10:10:00.000Z',
  calledProcessInstanceId: 'sub-instance-789',
  durationInMillis: 297000,
});

/** Mock end event activity. */
export const mockEndEvent = createActivity({
  id: 'end-event-1',
  activityId: 'EndEvent_1',
  activityName: 'End',
  activityType: 'endEvent',
  startTime: '2024-01-01T10:10:00.000Z',
  endTime: '2024-01-01T10:10:01.000Z',
  durationInMillis: 1000,
});

/** Mock running activity (no end time). */
export const mockRunningActivity = createActivity({
  id: 'running-task-1',
  activityId: 'Task_2',
  activityName: 'Pending Approval',
  activityType: 'userTask',
  startTime: '2024-01-01T10:00:00.000Z',
  endTime: null,
});

/** Simple process flow: Start -> Task -> End. */
export const mockActivitiesSimpleFlow = [mockStartEvent, mockUserTask, mockEndEvent];

/** Complex process flow with multiple activity types. */
export const mockActivitiesComplexFlow = [
  mockStartEvent,
  mockUserTask,
  mockServiceTask,
  mockBusinessRuleTask,
  mockCallActivity,
  mockEndEvent,
];
