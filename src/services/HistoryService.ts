/**
 * History service abstraction for testability.
 * Provides a single point for history-related API calls.
 * @module services/HistoryService
 */

import { API } from '../types';
import { get as apiGet, setFetchFunction, resetFetchFunction } from '../utils/api';
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
 * History service interface for dependency injection
 */
export interface IHistoryService {
  getActivities(instanceId: string, params?: Record<string, string>): Promise<HistoricActivity[]>;
  getVariables(instanceId: string, params?: Record<string, string>): Promise<HistoricVariable[]>;
  getDecisions(instanceId: string, params?: Record<string, string>): Promise<HistoricDecision[]>;
  getActivityStatistics(processDefinitionId: string, params?: Record<string, string>): Promise<unknown[]>;
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
