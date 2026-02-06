/**
 * External Task service abstraction for testability.
 * Provides a single point for external task-related API calls.
 * @module services/ExternalTaskService
 */

import { API, ExternalTask } from '../types';
import { get as apiGet, post as apiPost, put as apiPut } from '../utils/api';

/**
 * Query parameters for external task list
 */
export interface ExternalTaskQueryParams {
  /** Filter by process instance ID */
  processInstanceId?: string;
  /** Filter by process definition ID */
  processDefinitionId?: string;
  /** Filter by activity ID */
  activityId?: string;
  /** Filter by topic name */
  topicName?: string;
  /** Filter by worker ID */
  workerId?: string;
  /** Filter by locked status */
  locked?: boolean;
  /** Filter by not locked status */
  notLocked?: boolean;
  /** Filter by retries remaining */
  withRetriesLeft?: boolean;
  /** Filter by no retries remaining */
  noRetriesLeft?: boolean;
  /** Filter by lock expiration (before timestamp) */
  lockExpirationBefore?: string;
  /** Filter by lock expiration (after timestamp) */
  lockExpirationAfter?: string;
  /** Maximum number of results */
  maxResults?: number;
  /** First result index */
  firstResult?: number;
  /** Sort by field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Topic configuration for fetch and lock request
 */
export interface FetchAndLockTopic {
  topicName: string;
  lockDuration: number;
  variables?: string[];
  localVariables?: boolean;
  businessKey?: string;
  processDefinitionId?: string;
  processDefinitionIdIn?: string[];
  processDefinitionKey?: string;
  processDefinitionKeyIn?: string[];
  processDefinitionVersionTag?: string;
  withoutTenantId?: boolean;
  tenantIdIn?: string[];
  processVariables?: Record<string, unknown>;
}

/**
 * Fetch and lock request for external tasks
 */
export interface FetchAndLockRequest {
  workerId: string;
  maxTasks: number;
  usePriority?: boolean;
  asyncResponseTimeout?: number;
  topics: FetchAndLockTopic[];
}

/**
 * External task service interface for dependency injection
 */
export interface IExternalTaskService {
  /**
   * Get list of external tasks
   */
  getTasks(params?: ExternalTaskQueryParams): Promise<ExternalTask[]>;

  /**
   * Get count of external tasks
   */
  getCount(params?: ExternalTaskQueryParams): Promise<number>;

  /**
   * Unlock an external task
   */
  unlock(taskId: string): Promise<void>;

  /**
   * Set retries for an external task
   */
  setRetries(taskId: string, retries: number): Promise<void>;

  /**
   * Report failure for an external task
   */
  reportFailure(
    taskId: string,
    errorMessage: string,
    errorDetails?: string,
    retries?: number,
    retryTimeout?: number
  ): Promise<void>;

  /**
   * Report BPMN error for an external task
   */
  reportBpmnError(taskId: string, errorCode: string, errorMessage?: string): Promise<void>;

  /**
   * Fetch and lock external tasks
   */
  fetchAndLock(request: FetchAndLockRequest): Promise<ExternalTask[]>;
}

/**
 * Convert query params to string record for API calls
 */
function toStringRecord(params: ExternalTaskQueryParams): Record<string, string> {
  const result: Record<string, string> = {};

  if (params.processInstanceId) {
    result['processInstanceId'] = params.processInstanceId;
  }
  if (params.processDefinitionId) {
    result['processDefinitionId'] = params.processDefinitionId;
  }
  if (params.activityId) {
    result['activityId'] = params.activityId;
  }
  if (params.topicName) {
    result['topicName'] = params.topicName;
  }
  if (params.workerId) {
    result['workerId'] = params.workerId;
  }
  if (params.locked !== undefined) {
    result['locked'] = String(params.locked);
  }
  if (params.notLocked !== undefined) {
    result['notLocked'] = String(params.notLocked);
  }
  if (params.withRetriesLeft !== undefined) {
    result['withRetriesLeft'] = String(params.withRetriesLeft);
  }
  if (params.noRetriesLeft !== undefined) {
    result['noRetriesLeft'] = String(params.noRetriesLeft);
  }
  if (params.lockExpirationBefore) {
    result['lockExpirationBefore'] = params.lockExpirationBefore;
  }
  if (params.lockExpirationAfter) {
    result['lockExpirationAfter'] = params.lockExpirationAfter;
  }
  if (params.maxResults !== undefined) {
    result['maxResults'] = String(params.maxResults);
  }
  if (params.firstResult !== undefined) {
    result['firstResult'] = String(params.firstResult);
  }
  if (params.sortBy) {
    result['sortBy'] = params.sortBy;
  }
  if (params.sortOrder) {
    result['sortOrder'] = params.sortOrder;
  }

  return result;
}

/**
 * Default implementation of the external task service
 */
export class ExternalTaskService implements IExternalTaskService {
  private api: API;

  /**
   * Creates a new ExternalTaskService instance
   * @param api - The API configuration object
   */
  constructor(api: API) {
    this.api = api;
  }

  /**
   * Gets list of external tasks
   * @param params - Optional query parameters
   * @returns Promise resolving to array of external tasks
   */
  async getTasks(params: ExternalTaskQueryParams = {}): Promise<ExternalTask[]> {
    const queryParams = toStringRecord(params);
    const result: unknown = await apiGet(this.api, '/external-task', queryParams);
    return Array.isArray(result) ? (result as ExternalTask[]) : [];
  }

  /**
   * Gets count of external tasks
   * @param params - Optional query parameters
   * @returns Promise resolving to count
   */
  async getCount(params: ExternalTaskQueryParams = {}): Promise<number> {
    const queryParams = toStringRecord(params);
    const result: unknown = await apiGet(this.api, '/external-task/count', queryParams);
    if (typeof result === 'object' && result !== null && 'count' in result) {
      return (result as { count: number }).count;
    }
    return 0;
  }

  /**
   * Unlocks an external task
   * @param taskId - The external task ID
   * @returns Promise resolving when complete
   */
  async unlock(taskId: string): Promise<void> {
    await apiPost(this.api, `/external-task/${taskId}/unlock`);
  }

  /**
   * Sets retries for an external task
   * @param taskId - The external task ID
   * @param retries - Number of retries to set
   * @returns Promise resolving when complete
   */
  async setRetries(taskId: string, retries: number): Promise<void> {
    await apiPut(this.api, `/external-task/${taskId}/retries`, JSON.stringify({ retries }));
  }

  /**
   * Reports a failure for an external task
   * @param taskId - The external task ID
   * @param errorMessage - Error message
   * @param errorDetails - Optional error details
   * @param retries - Optional number of remaining retries
   * @param retryTimeout - Optional retry timeout in milliseconds
   * @returns Promise resolving when complete
   */
  async reportFailure(
    taskId: string,
    errorMessage: string,
    errorDetails?: string,
    retries?: number,
    retryTimeout?: number
  ): Promise<void> {
    const payload: Record<string, unknown> = { errorMessage };

    if (errorDetails !== undefined) {
      payload['errorDetails'] = errorDetails;
    }
    if (retries !== undefined) {
      payload['retries'] = retries;
    }
    if (retryTimeout !== undefined) {
      payload['retryTimeout'] = retryTimeout;
    }

    await apiPost(this.api, `/external-task/${taskId}/failure`, {}, JSON.stringify(payload));
  }

  /**
   * Reports a BPMN error for an external task
   * @param taskId - The external task ID
   * @param errorCode - BPMN error code
   * @param errorMessage - Optional error message
   * @returns Promise resolving when complete
   */
  async reportBpmnError(taskId: string, errorCode: string, errorMessage?: string): Promise<void> {
    const payload: Record<string, unknown> = { errorCode };

    if (errorMessage !== undefined) {
      payload['errorMessage'] = errorMessage;
    }

    await apiPost(this.api, `/external-task/${taskId}/bpmnError`, {}, JSON.stringify(payload));
  }

  /**
   * Fetches and locks external tasks
   * @param request - Fetch and lock request
   * @returns Promise resolving to locked external tasks
   */
  async fetchAndLock(request: FetchAndLockRequest): Promise<ExternalTask[]> {
    const result: unknown = await apiPost(this.api, '/external-task/fetchAndLock', {}, JSON.stringify(request));
    return Array.isArray(result) ? (result as ExternalTask[]) : [];
  }
}

/**
 * Creates a new ExternalTaskService instance
 * @param api - The API configuration object
 * @returns A new ExternalTaskService instance
 */
export function createExternalTaskService(api: API): IExternalTaskService {
  return new ExternalTaskService(api);
}
