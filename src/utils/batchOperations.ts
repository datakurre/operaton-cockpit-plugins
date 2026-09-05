/**
 * Targeting and request building for the definition-level batch operations.
 *
 * The forms in the definition "Modify" tab all follow the same shape: pick a set of
 * process instances, describe an operation, then POST it. Both the dry run and the real
 * run go through the builders here, so the request previewed is by construction the
 * request sent.
 *
 * @module
 */
import { transformVariables as transformVariablesUtil, VariableInput } from './variables';

/** How a form selects the process instances an operation applies to. */
export interface InstanceSelection {
  /** Selection strategy chosen in the form */
  instanceSelectionMode: 'all' | 'specific' | 'query';
  /** Comma-separated instance ids, used when the mode is `specific` */
  specificInstanceIds: string;
  /** Optional activity to filter on, used when the mode is `query` */
  queryActivityId: string;
  /** Instance state to filter on, used when the mode is `query` */
  queryState: string;
}

/** A request a batch form would send, used both to preview and to execute it. */
export interface BatchRequest {
  /** HTTP method */
  method: 'POST' | 'PUT';
  /** Engine API path, relative to the engine base */
  path: string;
  /** JSON request body */
  payload: Record<string, unknown>;
}

/** A modification instruction as sent to the engine. */
export interface ModificationInstructionPayload {
  /** Instruction type */
  type: string;
  /** Target activity id */
  activityId?: string;
  /** Target transition id */
  transitionId?: string;
  /** Whether to cancel currently active instances of the activity */
  cancelCurrentActiveActivityInstances?: boolean;
  /** Variables to set with the instruction */
  variables?: Record<string, { value: unknown; type: string }>;
}

/** A modification instruction as held in form state. */
export interface ModificationInstructionInput {
  /** Instruction type */
  type: 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';
  /** Target activity id */
  activityId?: string;
  /** Target transition id */
  transitionId?: string;
  /** Whether to cancel currently active instances of the activity */
  cancelCurrentActiveActivityInstances?: boolean;
  /** Variables to set with the instruction */
  variables?: VariableInput[];
}

/**
 * Split the comma-separated instance ids entered in the form.
 * @param selection - The form's instance selection
 * @returns The ids, or null when the form is not selecting by id
 */
export function getSelectedInstanceIds(selection: InstanceSelection): string[] | null {
  if (selection.instanceSelectionMode !== 'specific') {
    return null;
  }
  const ids = selection.specificInstanceIds
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);
  return ids.length > 0 ? ids : null;
}

/**
 * Build the process instance query describing the selected instances.
 * @param selection - The form's instance selection
 * @param processDefinitionId - The definition the form is scoped to
 * @returns The query object, or null when the form is selecting by id
 */
export function buildInstanceQuery(
  selection: InstanceSelection,
  processDefinitionId: string
): Record<string, unknown> | null {
  if (selection.instanceSelectionMode === 'all') {
    return { processDefinitionId };
  }
  if (selection.instanceSelectionMode === 'query') {
    const query: Record<string, unknown> = { processDefinitionId };
    if (selection.queryActivityId) {
      query['activityIdIn'] = [selection.queryActivityId];
    }
    if (selection.queryState === 'active') {
      query['active'] = true;
    } else if (selection.queryState === 'suspended') {
      query['suspended'] = true;
    }
    return query;
  }
  return null;
}

/**
 * Build the query string parameters that list the selected instances.
 *
 * Used by the dry run, which reads the instances back with `GET /process-instance`.
 * @param selection - The form's instance selection
 * @param processDefinitionId - The definition the form is scoped to
 * @returns Query parameters, or null when nothing is selected
 */
export function buildInstanceLookupParams(
  selection: InstanceSelection,
  processDefinitionId: string
): Record<string, string> | null {
  const instanceIds = getSelectedInstanceIds(selection);
  if (instanceIds) {
    return { processInstanceIds: instanceIds.join(',') };
  }

  const query = buildInstanceQuery(selection, processDefinitionId);
  if (!query) {
    return null;
  }

  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      params[key] = value.join(',');
    } else if (typeof value === 'boolean') {
      params[key] = value ? 'true' : 'false';
    } else if (typeof value === 'string') {
      params[key] = value;
    }
  }
  return params;
}

/**
 * Add the selected instances to a payload that supports both targeting styles.
 * @param payload - The payload to extend, modified in place
 * @param selection - The form's instance selection
 * @param processDefinitionId - The definition the form is scoped to
 * @returns True when a target was set, false when the selection is empty
 */
function applyInstanceTarget(
  payload: Record<string, unknown>,
  selection: InstanceSelection,
  processDefinitionId: string
): boolean {
  const instanceIds = getSelectedInstanceIds(selection);
  if (instanceIds) {
    payload['processInstanceIds'] = instanceIds;
    return true;
  }
  const query = buildInstanceQuery(selection, processDefinitionId);
  if (query) {
    payload['processInstanceQuery'] = query;
    return true;
  }
  return false;
}

/**
 * Keep only the instructions that name the activity or transition they need.
 * @param instructions - Instructions held in form state
 * @returns The instructions that are complete enough to send
 */
function keepCompleteInstructions(instructions: ModificationInstructionInput[]): ModificationInstructionInput[] {
  return instructions.filter(instruction => {
    if (instruction.type === 'startTransition') {
      return instruction.transitionId !== undefined && instruction.transitionId !== '';
    }
    return instruction.activityId !== undefined && instruction.activityId !== '';
  });
}

/**
 * Convert one form instruction into its API representation.
 * @param instruction - Instruction held in form state
 * @returns The instruction as the engine expects it
 */
function toInstructionPayload(instruction: ModificationInstructionInput): ModificationInstructionPayload {
  const payload: ModificationInstructionPayload = { type: instruction.type };
  if (instruction.activityId !== undefined && instruction.activityId !== '') {
    payload.activityId = instruction.activityId;
  }
  if (instruction.transitionId !== undefined && instruction.transitionId !== '') {
    payload.transitionId = instruction.transitionId;
  }
  if (instruction.type === 'cancel' && instruction.cancelCurrentActiveActivityInstances === true) {
    payload.cancelCurrentActiveActivityInstances = true;
  }
  if (instruction.variables !== undefined && instruction.variables.length > 0) {
    payload.variables = transformVariablesUtil(instruction.variables, true);
  }
  return payload;
}

/** Everything the batch modification form contributes to its request. */
export interface ModificationRequestInput extends InstanceSelection {
  /** Instructions to apply */
  instructions: ModificationInstructionInput[];
  /** Free-text annotation recorded on the batch */
  annotation: string;
  /** Whether to skip custom execution listeners */
  skipCustomListeners: boolean;
  /** Whether to skip input/output mappings */
  skipIoMappings: boolean;
}

/**
 * Build the asynchronous batch modification request.
 * @param data - The batch modification form's state
 * @param processDefinitionId - The definition the form is scoped to
 * @returns The request, or null when no instances are selected
 */
export function buildModificationRequest(
  data: ModificationRequestInput,
  processDefinitionId: string
): BatchRequest | null {
  const payload: Record<string, unknown> = {
    processDefinitionId,
    skipCustomListeners: data.skipCustomListeners,
    skipIoMappings: data.skipIoMappings,
    instructions: keepCompleteInstructions(data.instructions).map(toInstructionPayload),
    annotation: data.annotation !== '' ? data.annotation : 'Batch modified via Cockpit plugin',
  };

  if (!applyInstanceTarget(payload, data, processDefinitionId)) {
    return null;
  }

  return { method: 'POST', path: '/modification/executeAsync', payload };
}

/** Everything the message form contributes to its request. */
export interface MessageRequestInput extends InstanceSelection {
  /** Name of the BPMN message */
  messageName: string;
  /** Whether the message is carried by a start event */
  isStartEvent: boolean;
  /** Business key for the instance a start message creates */
  businessKey: string;
  /** Variables to deliver with the message */
  processVariables: VariableInput[];
}

/**
 * Build the message request.
 *
 * A message on a start event starts one new instance and takes no instance target; any
 * other message is correlated asynchronously to the selected instances.
 * @param data - The message form's state
 * @param processDefinitionId - The definition the form is scoped to
 * @returns The request, or null when the message name or the instance target is missing
 */
export function buildMessageRequest(data: MessageRequestInput, processDefinitionId: string): BatchRequest | null {
  if (data.messageName === '') {
    return null;
  }

  const variables = data.processVariables.length > 0 ? transformVariablesUtil(data.processVariables, true) : undefined;

  if (data.isStartEvent) {
    const payload: Record<string, unknown> = { messageName: data.messageName };
    if (data.businessKey !== '') {
      payload['businessKey'] = data.businessKey;
    }
    if (variables !== undefined) {
      payload['processVariables'] = variables;
    }
    return { method: 'POST', path: '/message', payload };
  }

  const payload: Record<string, unknown> = { messageName: data.messageName };
  if (!applyInstanceTarget(payload, data, processDefinitionId)) {
    return null;
  }
  if (variables !== undefined) {
    payload['variables'] = variables;
  }
  return { method: 'POST', path: '/process-instance/message-async', payload };
}

/** Everything the signal form contributes to its request. */
export interface SignalRequestInput {
  /** Name of the signal to broadcast */
  signalName: string;
  /** Variables to deliver with the signal */
  processVariables: VariableInput[];
}

/**
 * Build the signal broadcast request.
 *
 * No execution id is set, so the engine delivers the signal to every matching catch event
 * in every deployed definition, not only the one the form is scoped to.
 * @param data - The signal form's state
 * @returns The request, or null when the signal name is missing
 */
export function buildSignalRequest(data: SignalRequestInput): BatchRequest | null {
  if (data.signalName === '') {
    return null;
  }
  const payload: Record<string, unknown> = { name: data.signalName };
  if (data.processVariables.length > 0) {
    payload['variables'] = transformVariablesUtil(data.processVariables, true);
  }
  return { method: 'POST', path: '/signal', payload };
}
