/**
 * Process Instance service abstraction for testability.
 * Provides a single point for process instance-related API calls.
 * @module services/ProcessInstanceService
 */

import { API } from '../types';
import { get as apiGet, post as apiPost } from '../utils/api';
import type { VariableInput } from '../utils/variables';
import { transformVariables as transformVariablesUtil } from '../utils/variables';

/**
 * Represents a process instance
 */
export interface ProcessInstance {
  id: string;
  businessKey?: string;
  processDefinitionId: string;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  processDefinitionVersion?: number;
  rootProcessInstanceId?: string;
  caseInstanceId?: string;
  ended?: boolean;
  suspended?: boolean;
  tenantId?: string;
}

/**
 * Represents a historic process instance
 */
export interface HistoricProcessInstance extends ProcessInstance {
  startTime: string;
  endTime?: string;
  durationInMillis?: number;
  startUserId?: string;
  startActivityId?: string;
  deleteReason?: string;
  superProcessInstanceId?: string;
  superCaseInstanceId?: string;
  state: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'EXTERNALLY_TERMINATED' | 'INTERNALLY_TERMINATED';
  removalTime?: string;
}

/**
 * Modification instruction types
 */
export type ModificationInstructionType = 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';

/**
 * Modification instruction
 */
export interface ModificationInstruction {
  type: ModificationInstructionType;
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: VariableInput[];
}

/**
 * Modification instruction payload for API
 */
export interface ModificationInstructionPayload {
  type: string;
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: Record<string, { value: unknown; type: string }>;
}

/**
 * Process modification request
 */
export interface ProcessModificationRequest {
  instructions: ModificationInstruction[];
  annotation?: string;
  skipCustomListeners?: boolean;
  skipIoMappings?: boolean;
}

/**
 * Message correlation keys
 */
export interface CorrelationKey {
  name: string;
  value: string;
  type: string;
}

/**
 * Message correlation request
 */
export interface MessageCorrelationRequest {
  messageName: string;
  processInstanceId?: string;
  correlationKeys?: CorrelationKey[];
  localCorrelationKeys?: CorrelationKey[];
  processVariables?: VariableInput[];
  processVariablesLocal?: VariableInput[];
  resultEnabled?: boolean;
  variablesInResultEnabled?: boolean;
}

/**
 * Message correlation result
 */
export interface MessageCorrelationResult {
  resultType: 'Execution' | 'ProcessDefinition';
  execution?: {
    id: string;
    processInstanceId: string;
  };
  processDefinition?: {
    id: string;
    processDefinitionId: string;
  };
}

/**
 * Query parameters for process instance list
 */
export interface ProcessInstanceQueryParams {
  processDefinitionId?: string;
  processDefinitionKey?: string;
  businessKey?: string;
  active?: boolean;
  suspended?: boolean;
  maxResults?: number;
  firstResult?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Process instance service interface for dependency injection
 */
export interface IProcessInstanceService {
  /**
   * Get a process instance by ID
   */
  getInstance(instanceId: string): Promise<ProcessInstance | null>;

  /**
   * Get a historic process instance by ID
   */
  getHistoricInstance(instanceId: string): Promise<HistoricProcessInstance | null>;

  /**
   * Get list of process instances
   */
  getInstances(params?: ProcessInstanceQueryParams): Promise<ProcessInstance[]>;

  /**
   * Modify a process instance
   */
  modifyInstance(instanceId: string, request: ProcessModificationRequest): Promise<void>;

  /**
   * Correlate a message
   */
  correlateMessage(request: MessageCorrelationRequest): Promise<MessageCorrelationResult[]>;
}

/**
 * Convert query params to string record for API calls
 */
function toStringRecord(params: ProcessInstanceQueryParams): Record<string, string> {
  const result: Record<string, string> = {};

  if (params.processDefinitionId) {
    result['processDefinitionId'] = params.processDefinitionId;
  }
  if (params.processDefinitionKey) {
    result['processDefinitionKey'] = params.processDefinitionKey;
  }
  if (params.businessKey) {
    result['businessKey'] = params.businessKey;
  }
  if (params.active !== undefined) {
    result['active'] = String(params.active);
  }
  if (params.suspended !== undefined) {
    result['suspended'] = String(params.suspended);
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
 * Build modification instruction payload from input
 */
function buildInstructionPayload(inst: ModificationInstruction): ModificationInstructionPayload {
  const payload: ModificationInstructionPayload = { type: inst.type };

  if (inst.activityId !== undefined && inst.activityId !== '') {
    payload.activityId = inst.activityId;
  }
  if (inst.transitionId !== undefined && inst.transitionId !== '') {
    payload.transitionId = inst.transitionId;
  }
  if (inst.activityInstanceId !== undefined && inst.activityInstanceId !== '') {
    payload.activityInstanceId = inst.activityInstanceId;
  }
  if (inst.ancestorActivityInstanceId !== undefined && inst.ancestorActivityInstanceId !== '') {
    payload.ancestorActivityInstanceId = inst.ancestorActivityInstanceId;
  }
  if (inst.variables !== undefined && inst.variables.length > 0) {
    payload.variables = transformVariablesUtil(inst.variables);
  }

  return payload;
}

/**
 * Build correlation keys from array
 */
function buildCorrelationKeys(keys: CorrelationKey[]): Record<string, { value: string; type: string }> {
  const result: Record<string, { value: string; type: string }> = {};
  for (const key of keys) {
    result[key.name] = { value: key.value, type: key.type };
  }
  return result;
}

/**
 * Default implementation of the process instance service
 */
export class ProcessInstanceService implements IProcessInstanceService {
  private api: API;

  /**
   * Creates a new ProcessInstanceService instance
   * @param api - The API configuration object
   */
  constructor(api: API) {
    this.api = api;
  }

  /**
   * Gets a process instance by ID
   * @param instanceId - The process instance ID
   * @returns Promise resolving to process instance or null
   */
  async getInstance(instanceId: string): Promise<ProcessInstance | null> {
    const result: unknown = await apiGet(this.api, `/process-instance/${instanceId}`);
    if (typeof result === 'object' && result !== null) {
      return result as ProcessInstance;
    }
    return null;
  }

  /**
   * Gets a historic process instance by ID
   * @param instanceId - The process instance ID
   * @returns Promise resolving to historic process instance or null
   */
  async getHistoricInstance(instanceId: string): Promise<HistoricProcessInstance | null> {
    const result: unknown = await apiGet(this.api, `/history/process-instance/${instanceId}`);
    if (typeof result === 'object' && result !== null) {
      return result as HistoricProcessInstance;
    }
    return null;
  }

  /**
   * Gets list of process instances
   * @param params - Optional query parameters
   * @returns Promise resolving to array of process instances
   */
  async getInstances(params: ProcessInstanceQueryParams = {}): Promise<ProcessInstance[]> {
    const queryParams = toStringRecord(params);
    const result: unknown = await apiGet(this.api, '/process-instance', queryParams);
    return Array.isArray(result) ? (result as ProcessInstance[]) : [];
  }

  /**
   * Modifies a process instance
   * @param instanceId - The process instance ID
   * @param request - The modification request
   * @returns Promise resolving when complete
   */
  async modifyInstance(instanceId: string, request: ProcessModificationRequest): Promise<void> {
    const payload = {
      skipCustomListeners: request.skipCustomListeners ?? false,
      skipIoMappings: request.skipIoMappings ?? false,
      instructions: request.instructions.map(buildInstructionPayload),
      annotation: request.annotation ?? 'Modified via Cockpit plugin',
    };

    await apiPost(this.api, `/process-instance/${instanceId}/modification`, {}, JSON.stringify(payload));
  }

  /**
   * Correlates a message
   * @param request - The message correlation request
   * @returns Promise resolving to correlation results
   */
  async correlateMessage(request: MessageCorrelationRequest): Promise<MessageCorrelationResult[]> {
    const payload: Record<string, unknown> = {
      messageName: request.messageName,
      resultEnabled: request.resultEnabled ?? true,
      variablesInResultEnabled: request.variablesInResultEnabled ?? false,
    };

    if (request.processInstanceId) {
      payload['processInstanceId'] = request.processInstanceId;
    }

    if (request.correlationKeys && request.correlationKeys.length > 0) {
      payload['correlationKeys'] = buildCorrelationKeys(request.correlationKeys);
    }

    if (request.localCorrelationKeys && request.localCorrelationKeys.length > 0) {
      payload['localCorrelationKeys'] = buildCorrelationKeys(request.localCorrelationKeys);
    }

    if (request.processVariables && request.processVariables.length > 0) {
      payload['processVariables'] = transformVariablesUtil(request.processVariables);
    }

    if (request.processVariablesLocal && request.processVariablesLocal.length > 0) {
      payload['processVariablesLocal'] = transformVariablesUtil(request.processVariablesLocal);
    }

    const result: unknown = await apiPost(this.api, '/message', {}, JSON.stringify(payload));
    return Array.isArray(result) ? (result as MessageCorrelationResult[]) : [];
  }
}

/**
 * Creates a new ProcessInstanceService instance
 * @param api - The API configuration object
 * @returns A new ProcessInstanceService instance
 */
export function createProcessInstanceService(api: API): IProcessInstanceService {
  return new ProcessInstanceService(api);
}
