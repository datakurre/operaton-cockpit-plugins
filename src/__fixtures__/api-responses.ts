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

/** Mock authorization data. */
export interface MockAuthorization {
  id: string;
  type: number;
  permissions: string[];
  userId: string | null;
  groupId: string | null;
  resourceType: number;
  resourceId: string;
}

/**
 * Creates a mock authorization.
 *
 * @param overrides - Optional overrides
 * @returns Mock authorization object
 */
export function createAuthorization(overrides: Partial<MockAuthorization> = {}): MockAuthorization {
  return {
    id: 'auth-1',
    type: 1,
    permissions: ['ALL'],
    userId: 'demo',
    groupId: null,
    resourceType: 0,
    resourceId: '*',
    ...overrides,
  };
}

/** Default mock authorization. */
export const mockAuthorization = createAuthorization();

/** Mock authorization for a group. */
export const mockGroupAuthorization = createAuthorization({
  id: 'auth-2',
  type: 1,
  permissions: ['READ', 'UPDATE'],
  userId: null,
  groupId: 'camunda-admin',
  resourceType: 6,
  resourceId: '*',
});

/** Mock global authorization. */
export const mockGlobalAuthorization = createAuthorization({
  id: 'auth-3',
  type: 0,
  permissions: ['ACCESS'],
  userId: '*',
  groupId: null,
  resourceType: 0,
  resourceId: '*',
});

/** Mock revoke authorization. */
export const mockRevokeAuthorization = createAuthorization({
  id: 'auth-4',
  type: 2,
  permissions: ['DELETE'],
  userId: 'guest',
  groupId: null,
  resourceType: 6,
  resourceId: 'restricted-process',
});

/** Mock user for identity autocomplete. */
export interface MockUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Creates a mock user.
 *
 * @param overrides - Optional overrides
 * @returns Mock user object
 */
export function createUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    ...overrides,
  };
}

/** Default mock user. */
export const mockUser = createUser();

/** Additional mock users. */
export const mockUsers = [
  createUser(),
  createUser({ id: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com' }),
  createUser({ id: 'john', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
];

/** Mock group for identity autocomplete. */
export interface MockGroup {
  id: string;
  name?: string;
  type?: string;
}

/**
 * Creates a mock group.
 *
 * @param overrides - Optional overrides
 * @returns Mock group object
 */
export function createGroup(overrides: Partial<MockGroup> = {}): MockGroup {
  return {
    id: 'camunda-admin',
    name: 'Camunda Administrators',
    type: 'SYSTEM',
    ...overrides,
  };
}

/** Default mock group. */
export const mockGroup = createGroup();

/** Additional mock groups. */
export const mockGroups = [
  createGroup(),
  createGroup({ id: 'accounting', name: 'Accounting Team', type: 'WORKFLOW' }),
  createGroup({ id: 'sales', name: 'Sales Team', type: 'WORKFLOW' }),
];

// =============================================================================
// Historic Process Instance Mock Factory
// =============================================================================

/**
 * Mock historic process instance matching HistoryService.HistoricProcessInstance.
 */
export interface MockHistoricProcessInstance {
  id: string;
  businessKey?: string;
  processDefinitionId: string;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  processDefinitionVersion?: number;
  rootProcessInstanceId?: string;
  superProcessInstanceId?: string;
  superCaseInstanceId?: string;
  caseInstanceId?: string;
  startTime: string;
  endTime?: string;
  durationInMillis?: number;
  startUserId?: string;
  startActivityId?: string;
  deleteReason?: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'EXTERNALLY_TERMINATED' | 'INTERNALLY_TERMINATED';
  tenantId?: string;
  removalTime?: string;
}

/** Random ID slice start position for generating unique IDs */
const RANDOM_SLICE_START = 2;
const RANDOM_SLICE_LENGTH = 8;
/** Base for random ID generation (alphanumeric) */
const RANDOM_ID_BASE = 36;

/**
 * Creates a mock historic process instance.
 *
 * @param overrides - Optional overrides for instance properties
 * @returns Mock historic process instance object
 */
export function createHistoricProcessInstance(
  overrides: Partial<MockHistoricProcessInstance> = {}
): MockHistoricProcessInstance {
  const randomId = Math.random()
    .toString(RANDOM_ID_BASE)
    .slice(RANDOM_SLICE_START, RANDOM_SLICE_START + RANDOM_SLICE_LENGTH);
  return {
    id: `hist-instance-${randomId}`,
    processDefinitionId: 'my-process:1:deployment-001',
    processDefinitionKey: 'my-process',
    processDefinitionName: 'My Process',
    processDefinitionVersion: 1,
    startTime: '2024-01-01T10:00:00.000Z',
    state: 'COMPLETED',
    endTime: '2024-01-01T12:00:00.000Z',
    durationInMillis: 7200000,
    startUserId: 'admin',
    startActivityId: 'StartEvent_1',
    ...overrides,
  };
}

/** Active historic process instance. */
export const mockActiveHistoricInstance = createHistoricProcessInstance({
  id: 'active-instance-1',
  state: 'ACTIVE',
});

/** Completed historic process instance. */
export const mockCompletedHistoricInstance = createHistoricProcessInstance({
  id: 'completed-instance-1',
  state: 'COMPLETED',
});

/** Terminated historic process instance. */
export const mockTerminatedHistoricInstance = createHistoricProcessInstance({
  id: 'terminated-instance-1',
  state: 'EXTERNALLY_TERMINATED',
  deleteReason: 'Cancelled by admin',
});

/** List of mock historic instances for pagination testing. */
export const mockHistoricInstancesList = [
  createHistoricProcessInstance({ id: 'inst-1', state: 'COMPLETED', startTime: '2024-01-01T10:00:00.000Z' }),
  createHistoricProcessInstance({ id: 'inst-2', state: 'COMPLETED', startTime: '2024-01-01T11:00:00.000Z' }),
  createHistoricProcessInstance({ id: 'inst-3', state: 'ACTIVE', startTime: '2024-01-01T12:00:00.000Z' }),
  createHistoricProcessInstance({ id: 'inst-4', state: 'COMPLETED', startTime: '2024-01-01T13:00:00.000Z' }),
  createHistoricProcessInstance({ id: 'inst-5', state: 'SUSPENDED', startTime: '2024-01-01T14:00:00.000Z' }),
];

// =============================================================================
// Fetch Response Mock Factory
// =============================================================================

/**
 * Mock fetch response options.
 */
export interface MockFetchResponseOptions<T = unknown> {
  status?: number;
  isOk?: boolean;
  data?: T;
  contentType?: string;
}

/**
 * Creates a mock fetch Response object.
 *
 * @param options - Response options
 * @returns Mock Response-like object
 */
export function createMockFetchResponse<T = unknown>(
  options: MockFetchResponseOptions<T> = {}
): {
  status: number;
  ok: boolean;
  headers: Headers;
  json: () => Promise<T>;
} {
  const { status = 200, isOk = true, data = {} as T, contentType = 'application/json' } = options;
  return {
    status,
    ok: isOk,
    headers: new Headers({ 'Content-Type': contentType }),
    // eslint-disable-next-line @typescript-eslint/require-await -- Test mock returns sync value
    json: async () => data,
  };
}

/** Response handler function type */
type ResponseHandler<T> = (url: string, options?: RequestInit) => T | Promise<T>;

/**
 * Creates a mock fetch function that returns the provided response.
 *
 * @param response - Response data or factory function
 * @returns Mock fetch function
 */
export function createMockFetch<T = unknown>(response: T | ResponseHandler<T>): jest.Mock {
  return jest.fn(async (url: string, options?: RequestInit) => {
    const handler = response as ResponseHandler<T>;
    const data = typeof response === 'function' ? await handler(url, options) : response;
    return createMockFetchResponse({ data });
  });
}

/**
 * Creates a mock fetch that handles multiple URL patterns.
 *
 * @param handlers - Map of URL patterns to response data
 * @returns Mock fetch function
 */
export function createMockFetchWithHandlers(handlers: Record<string, unknown>): jest.Mock {
  // eslint-disable-next-line @typescript-eslint/require-await -- Test mock returns sync value
  return jest.fn(async (url: string) => {
    for (const [pattern, data] of Object.entries(handlers)) {
      if (url.includes(pattern)) {
        return createMockFetchResponse({ data });
      }
    }
    return createMockFetchResponse({ status: 404, isOk: false, data: { error: 'Not found' } });
  });
}
