/**
 * History service abstraction for testability.
 * Provides a single point for history-related API calls.
 * @module services/HistoryService
 */

import { API } from '../types';
import { get as apiGet, post as apiPost, setFetchFunction, resetFetchFunction } from '../utils/api';
import type { FetchFunction } from '../utils/api';

/**
 * Represents a historic activity instance
 */
export interface HistoricActivity {
  id: string;
  activityId: string;
  activityName?: string;
  activityType: string;
  processInstanceId: string;
  processDefinitionId: string;
  startTime: string;
  endTime?: string;
  durationInMillis?: number;
  canceled?: boolean;
  completeScope?: boolean;
  parentActivityInstanceId?: string;
  calledProcessInstanceId?: string;
  calledCaseInstanceId?: string;
  taskId?: string;
  assignee?: string;
  tenantId?: string;
  removalTime?: string;
  rootProcessInstanceId?: string;
}

/**
 * Represents a historic variable instance
 */
export interface HistoricVariable {
  id: string;
  name: string;
  type: string;
  value: unknown;
  processInstanceId?: string;
  processDefinitionId?: string;
  activityInstanceId?: string;
  caseInstanceId?: string;
  caseDefinitionId?: string;
  taskId?: string;
  executionId?: string;
  createTime?: string;
  tenantId?: string;
  removalTime?: string;
  rootProcessInstanceId?: string;
  state?: string;
}

/**
 * Represents a historic decision instance
 */
export interface HistoricDecision {
  id: string;
  decisionDefinitionId: string;
  decisionDefinitionKey: string;
  decisionDefinitionName?: string;
  evaluationTime: string;
  processDefinitionId?: string;
  processDefinitionKey?: string;
  processInstanceId?: string;
  caseDefinitionId?: string;
  caseDefinitionKey?: string;
  caseInstanceId?: string;
  activityId?: string;
  activityInstanceId?: string;
  userId?: string;
  inputs?: unknown[];
  outputs?: unknown[];
  collectResultValue?: number;
  tenantId?: string;
  removalTime?: string;
  rootProcessInstanceId?: string;
}

/**
 * Represents a historic process instance
 */
export interface HistoricProcessInstance {
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

/**
 * Query parameters for historic process instance queries (used with POST endpoint).
 * These are the parameters that can be passed directly to the API body.
 */
export interface HistoricProcessInstanceQueryParams {
  processDefinitionId?: string;
  processDefinitionKey?: string;
  processInstanceBusinessKey?: string;
  processInstanceBusinessKeyLike?: string;
  startedAfter?: string;
  finishedBefore?: string;
  finished?: boolean;
  unfinished?: boolean;
  withIncidents?: boolean;
  incidentType?: string;
  incidentStatus?: string;
  startedBy?: string;
  tenantIdIn?: string[];
  state?: string;
  executedActivityIdIn?: string[];
  activeActivityIdIn?: string[];
  active?: boolean;
  suspended?: boolean;
  completed?: boolean;
  externallyTerminated?: boolean;
  internallyTerminated?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  variables?: Array<{ name: string; operator: string; value: string }>;
  variableNamesIgnoreCase?: boolean;
  variableValuesIgnoreCase?: boolean;
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  maxResults?: number;
  firstResult?: number;
}

/**
 * Result of a count query
 */
export interface CountResult {
  count: number;
}

/**
 * History service interface for dependency injection
 */
export interface IHistoryService {
  getActivities(instanceId: string, params?: Record<string, string>): Promise<HistoricActivity[]>;
  getActivitiesByDefinition(
    processDefinitionId: string,
    params?: Record<string, string | boolean | null | undefined>
  ): Promise<HistoricActivity[]>;
  getVariables(instanceId: string, params?: Record<string, string>): Promise<HistoricVariable[]>;
  getDecisions(instanceId: string, params?: Record<string, string>): Promise<HistoricDecision[]>;
  getActivityStatistics(processDefinitionId: string, params?: Record<string, string>): Promise<unknown[]>;
  /**
   * Query historic process instances using POST endpoint.
   * Supports complex filters like variable values.
   */
  queryProcessInstances(
    query: HistoricProcessInstanceQueryParams,
    pagination?: PaginationParams
  ): Promise<HistoricProcessInstance[]>;
  /**
   * Count historic process instances matching a query.
   */
  countProcessInstances(query: HistoricProcessInstanceQueryParams): Promise<number>;
}

/**
 * Default implementation of the history service
 */
export class HistoryService implements IHistoryService {
  private api: API;

  /**
   * Creates a new HistoryService instance
   * @param api - The API configuration object
   */
  constructor(api: API) {
    this.api = api;
  }

  /**
   * Gets historic activity instances for a process instance
   * @param instanceId - The process instance ID
   * @param params - Optional query parameters
   * @returns Promise resolving to array of historic activities
   */
  async getActivities(instanceId: string, params: Record<string, string> = {}): Promise<HistoricActivity[]> {
    const result: unknown = await apiGet(this.api, '/history/activity-instance', {
      processInstanceId: instanceId,
      ...params,
    });
    return Array.isArray(result) ? (result as HistoricActivity[]) : [];
  }

  /**
   * Gets historic activity instances for a process definition.
   * Used for statistics overlays on process definition diagrams.
   * @param processDefinitionId - The process definition ID
   * @param params - Optional query parameters (supports all FilterBox query params)
   * @returns Promise resolving to array of historic activities
   */
  async getActivitiesByDefinition(
    processDefinitionId: string,
    params: Record<string, string | boolean | null | undefined> = {}
  ): Promise<HistoricActivity[]> {
    // Filter out null/undefined values and convert booleans to strings for API
    const cleanedParams: Record<string, string> = { processDefinitionId };
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        cleanedParams[key] = typeof value === 'boolean' ? String(value) : value;
      }
    }
    const result: unknown = await apiGet(this.api, '/history/activity-instance', cleanedParams);
    return Array.isArray(result) ? (result as HistoricActivity[]) : [];
  }

  /**
   * Gets historic variable instances for a process instance
   * @param instanceId - The process instance ID
   * @param params - Optional query parameters
   * @returns Promise resolving to array of historic variables
   */
  async getVariables(instanceId: string, params: Record<string, string> = {}): Promise<HistoricVariable[]> {
    const result: unknown = await apiGet(this.api, '/history/variable-instance', {
      processInstanceId: instanceId,
      ...params,
    });
    return Array.isArray(result) ? (result as HistoricVariable[]) : [];
  }

  /**
   * Gets historic decision instances for a process instance
   * @param instanceId - The process instance ID
   * @param params - Optional query parameters
   * @returns Promise resolving to array of historic decisions
   */
  async getDecisions(instanceId: string, params: Record<string, string> = {}): Promise<HistoricDecision[]> {
    const result: unknown = await apiGet(this.api, '/history/decision-instance', {
      processInstanceId: instanceId,
      ...params,
    });
    return Array.isArray(result) ? (result as HistoricDecision[]) : [];
  }

  /**
   * Gets activity statistics for a process definition
   * @param processDefinitionId - The process definition ID
   * @param params - Optional query parameters
   * @returns Promise resolving to array of activity statistics
   */
  async getActivityStatistics(processDefinitionId: string, params: Record<string, string> = {}): Promise<unknown[]> {
    const result: unknown = await apiGet(this.api, `/process-definition/${processDefinitionId}/statistics`, params);
    return Array.isArray(result) ? (result as unknown[]) : [];
  }

  /**
   * Query historic process instances using POST endpoint.
   * Supports complex filters like variable values.
   * @param query - Query parameters for filtering
   * @param pagination - Optional pagination parameters
   * @returns Promise resolving to array of historic process instances
   */
  async queryProcessInstances(
    query: HistoricProcessInstanceQueryParams,
    pagination?: PaginationParams
  ): Promise<HistoricProcessInstance[]> {
    const queryParams: Record<string, string> = {};
    if (pagination?.maxResults !== undefined) {
      queryParams['maxResults'] = String(pagination.maxResults);
    }
    if (pagination?.firstResult !== undefined) {
      queryParams['firstResult'] = String(pagination.firstResult);
    }
    const result: unknown = await apiPost(
      this.api,
      '/history/process-instance',
      queryParams,
      JSON.stringify(query)
    );
    return Array.isArray(result) ? (result as HistoricProcessInstance[]) : [];
  }

  /**
   * Count historic process instances matching a query.
   * @param query - Query parameters for filtering
   * @returns Promise resolving to the count
   */
  async countProcessInstances(query: HistoricProcessInstanceQueryParams): Promise<number> {
    const result: unknown = await apiPost(this.api, '/history/process-instance/count', {}, JSON.stringify(query));
    if (result && typeof result === 'object' && 'count' in result) {
      return (result as CountResult).count;
    }
    return 0;
  }
}

/**
 * Creates a new HistoryService instance
 * @param api - The API configuration object
 * @returns A new HistoryService instance
 */
export function createHistoryService(api: API): IHistoryService {
  return new HistoryService(api);
}

// Re-export fetch injection utilities for convenience
export { setFetchFunction, resetFetchFunction };
export type { FetchFunction };
