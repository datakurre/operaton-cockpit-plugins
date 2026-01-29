import type { components } from './operaton';

// =============================================================================
// Re-export API response types from OpenAPI spec for convenient access
// =============================================================================

/**
 * Historic activity instance from `/history/activity-instance` endpoint.
 * Contains details about executed activities including timing and assignee.
 */
export type HistoricActivityInstance = components['schemas']['HistoricActivityInstanceDto'];

/**
 * Historic variable instance from `/history/variable-instance` endpoint.
 * Contains variable name, value, type and scope information.
 */
export type HistoricVariableInstance = components['schemas']['HistoricVariableInstanceDto'];

/**
 * Historic decision instance from `/history/decision-instance` endpoint.
 * Contains evaluated DMN decision details.
 */
export type HistoricDecisionInstance = components['schemas']['HistoricDecisionInstanceDto'];

/**
 * Decision definition from `/decision-definition` endpoint.
 * Contains DMN decision metadata.
 */
export type DecisionDefinition = components['schemas']['DecisionDefinitionDto'];

/**
 * Variable value DTO for decision evaluation input/output.
 */
export type VariableValueDto = components['schemas']['VariableValueDto'];

/**
 * Historic process instance from `/history/process-instance` endpoint.
 * Contains process execution history including start/end times.
 */
export type HistoricProcessInstance = components['schemas']['HistoricProcessInstanceDto'];

/**
 * Process instance from `/process-instance` endpoint.
 * Contains running process instance details.
 */
export type ProcessInstance = components['schemas']['ProcessInstanceDto'];

/**
 * Process definition from `/process-definition` endpoint.
 * Contains BPMN process metadata.
 */
export type ProcessDefinition = components['schemas']['ProcessDefinitionDto'];

/**
 * External task from `/external-task` endpoint.
 * Contains external task details including worker, topic and lock info.
 */
export type ExternalTask = components['schemas']['ExternalTaskDto'];

/**
 * Activity instance from `/process-instance/{id}/activity-instances` endpoint.
 * Contains current activity execution tree.
 */
export type ActivityInstance = components['schemas']['ActivityInstanceDto'];

// =============================================================================
// Plugin API and Parameter Types
// =============================================================================

export interface API {
  adminApi: string;
  baseApi: string;
  engineApi: string;
  engine: string;
  tasklistApi: string;
  CSRFToken: string;
}

export interface RoutePluginParams {
  api: API;
  // Route-specific plugin parameters
}

export interface DefinitionPluginParams {
  root: Element;
  api: API;
  processDefinitionId: string;
}

export interface InstancePluginParams {
  api: API;
  processInstanceId: string;
  processDefinitionId?: string;
  processData?: {
    id: string;
    definitionId?: string;
    processDefinitionId?: string;
    [key: string]: unknown;
  };
}

export interface TaskListPluginParams {
  api: API;
  taskId?: string | undefined;
}

// =============================================================================
// BPMN Viewer Types
// =============================================================================

/**
 * Re-export BPMN viewer types from ViewerService for consistent usage.
 */
export type {
  BpmnViewerInstance,
  BpmnElement,
  Canvas,
  ElementRegistry,
  IViewerService,
  OverlayManager,
} from './services/ViewerService';
