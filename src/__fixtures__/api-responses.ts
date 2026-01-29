/**
 * Mock API responses for tests.
 *
 * @module
 */

/** Mock process instance data. */
export interface MockProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processDefinitionName: string;
  businessKey: string | null;
  state: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'EXTERNALLY_TERMINATED' | 'INTERNALLY_TERMINATED';
  startTime: string;
  endTime: string | null;
  startUserId?: string;
  tenantId?: string | null;
}

/**
 * Creates a mock process instance.
 *
 * @param overrides - Optional overrides for instance properties
 * @returns Mock process instance object
 */
export function createProcessInstance(overrides: Partial<MockProcessInstance> = {}): MockProcessInstance {
  return {
    id: 'instance-123',
    processDefinitionId: 'definition-456',
    processDefinitionKey: 'my-process',
    processDefinitionName: 'My Process',
    businessKey: 'order-789',
    state: 'ACTIVE',
    startTime: '2024-01-01T10:00:00.000Z',
    endTime: null,
    startUserId: 'admin',
    tenantId: null,
    ...overrides,
  };
}

/** Default mock process instance. */
export const mockProcessInstance = createProcessInstance();

/** Completed mock process instance. */
export const mockCompletedProcessInstance = createProcessInstance({
  id: 'instance-completed',
  state: 'COMPLETED',
  endTime: '2024-01-01T12:00:00.000Z',
});

/** Mock process definition data. */
export interface MockProcessDefinition {
  id: string;
  key: string;
  name: string;
  version: number;
  deploymentId: string;
  suspended: boolean;
  tenantId?: string | null;
}

/**
 * Creates a mock process definition.
 *
 * @param overrides - Optional overrides for definition properties
 * @returns Mock process definition object
 */
export function createProcessDefinition(overrides: Partial<MockProcessDefinition> = {}): MockProcessDefinition {
  return {
    id: 'definition-456',
    key: 'my-process',
    name: 'My Process',
    version: 1,
    deploymentId: 'deployment-001',
    suspended: false,
    tenantId: null,
    ...overrides,
  };
}

/** Default mock process definition. */
export const mockProcessDefinition = createProcessDefinition();

/** Mock decision instance data. */
export interface MockDecisionInstance {
  id: string;
  decisionDefinitionId: string;
  decisionDefinitionKey: string;
  decisionDefinitionName: string;
  activityId: string;
  activityInstanceId: string;
  processInstanceId: string;
}

/**
 * Creates a mock decision instance.
 *
 * @param overrides - Optional overrides
 * @returns Mock decision instance object
 */
export function createDecisionInstance(overrides: Partial<MockDecisionInstance> = {}): MockDecisionInstance {
  return {
    id: 'decision-instance-1',
    decisionDefinitionId: 'decision-def-1',
    decisionDefinitionKey: 'check-credit',
    decisionDefinitionName: 'Check Credit',
    activityId: 'BusinessRuleTask_1',
    activityInstanceId: 'business-rule-1',
    processInstanceId: 'instance-123',
    ...overrides,
  };
}

/** Default mock decision instance. */
export const mockDecisionInstance = createDecisionInstance();

/** Mock external task data. */
export interface MockExternalTask {
  id: string;
  activityId: string;
  activityInstanceId: string;
  topicName: string;
  workerId: string;
  lockExpirationTime: string;
  processInstanceId: string;
  processDefinitionId: string;
  retries: number;
}

/**
 * Creates a mock external task.
 *
 * @param overrides - Optional overrides
 * @returns Mock external task object
 */
export function createExternalTask(overrides: Partial<MockExternalTask> = {}): MockExternalTask {
  return {
    id: 'external-task-1',
    activityId: 'ServiceTask_1',
    activityInstanceId: 'service-task-instance-1',
    topicName: 'send-email',
    workerId: 'worker-1',
    lockExpirationTime: '2024-01-01T11:00:00.000Z',
    processInstanceId: 'instance-123',
    processDefinitionId: 'definition-456',
    retries: 3,
    ...overrides,
  };
}

/** Default mock external task. */
export const mockExternalTask = createExternalTask();
