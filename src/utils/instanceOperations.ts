/**
 * Request building for the operations that act on one process instance: modification,
 * message correlation and restart.
 *
 * Like the batch builders in `batchOperations.ts`, each returns the {@link BatchRequest}
 * that both the preview and the real submit use, so the request previewed is by
 * construction the request sent.
 *
 * @module
 */
import type { BatchRequest } from './batchOperations';
import { transformVariables as transformVariablesUtil, VariableInput } from './variables';

/** Instruction type of a single-instance modification. */
export type InstanceInstructionType = 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';

/** A single-instance modification instruction as held in form state. */
export interface InstanceInstructionInput {
  /** Instruction type */
  type: InstanceInstructionType;
  /** Target activity id */
  activityId?: string;
  /** Target transition id */
  transitionId?: string;
  /** Activity instance to cancel */
  activityInstanceId?: string;
  /** Async continuation to cancel */
  transitionInstanceId?: string;
  /** Activity instance to start the new one under */
  ancestorActivityInstanceId?: string;
  /** Variables to set with the instruction */
  variables?: VariableInput[];
}

/** A single-instance modification instruction as sent to the engine. */
interface InstanceInstructionPayload {
  type: string;
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  transitionInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: Record<string, { value: unknown; type: string }>;
}

/** Everything the single-instance modification form contributes to its request. */
export interface InstanceModificationInput {
  /** Instructions to apply, in order */
  instructions: InstanceInstructionInput[];
  /** Free-text annotation recorded on the modification */
  annotation: string;
  /** Whether to skip custom execution listeners */
  skipCustomListeners: boolean;
  /** Whether to skip input/output mappings */
  skipIoMappings: boolean;
}

/**
 * Whether an instruction names what it needs to be sent.
 * @param instruction - Instruction held in form state
 * @returns True when the instruction is complete
 */
function isComplete(instruction: InstanceInstructionInput): boolean {
  if (instruction.type === 'cancel') {
    return (
      (instruction.activityId !== undefined && instruction.activityId !== '') ||
      (instruction.activityInstanceId !== undefined && instruction.activityInstanceId !== '') ||
      (instruction.transitionInstanceId !== undefined && instruction.transitionInstanceId !== '')
    );
  }
  if (instruction.type === 'startTransition') {
    return instruction.transitionId !== undefined && instruction.transitionId !== '';
  }
  return instruction.activityId !== undefined && instruction.activityId !== '';
}

/**
 * Add the selected cancellation target to an API instruction.
 * @param payload - API instruction being built
 * @param instruction - Instruction held in form state
 */
function addCancelTarget(payload: InstanceInstructionPayload, instruction: InstanceInstructionInput): void {
  if (instruction.transitionInstanceId !== undefined && instruction.transitionInstanceId !== '') {
    payload.transitionInstanceId = instruction.transitionInstanceId;
  } else if (instruction.activityInstanceId !== undefined && instruction.activityInstanceId !== '') {
    payload.activityInstanceId = instruction.activityInstanceId;
  } else if (instruction.activityId !== undefined && instruction.activityId !== '') {
    payload.activityId = instruction.activityId;
  }
}

/**
 * Add the target and optional execution settings for a start instruction.
 * @param payload - API instruction being built
 * @param instruction - Instruction held in form state
 */
function addStartTarget(payload: InstanceInstructionPayload, instruction: InstanceInstructionInput): void {
  const target = instruction.type === 'startTransition' ? instruction.transitionId : instruction.activityId;
  if (target !== undefined && target !== '') {
    if (instruction.type === 'startTransition') {
      payload.transitionId = target;
    } else {
      payload.activityId = target;
    }
  }
  if (instruction.ancestorActivityInstanceId !== undefined && instruction.ancestorActivityInstanceId !== '') {
    payload.ancestorActivityInstanceId = instruction.ancestorActivityInstanceId;
  }
  if (instruction.variables !== undefined && instruction.variables.length > 0) {
    payload.variables = transformVariablesUtil(instruction.variables, true);
  }
}

/**
 * Convert one form instruction into its API representation.
 * @param instruction - Instruction held in form state
 * @returns The instruction as the engine expects it
 */
function toInstructionPayload(instruction: InstanceInstructionInput): InstanceInstructionPayload {
  const payload: InstanceInstructionPayload = { type: instruction.type };
  if (instruction.type === 'cancel') {
    addCancelTarget(payload, instruction);
  } else {
    addStartTarget(payload, instruction);
  }
  return payload;
}

/**
 * Build the modification request for one process instance.
 * @param data - The modification form's state
 * @param processInstanceId - The instance to modify
 * @returns The request, or null when no instruction is complete
 */
export function buildInstanceModificationRequest(
  data: InstanceModificationInput,
  processInstanceId: string
): BatchRequest | null {
  const instructions = data.instructions.filter(isComplete).map(toInstructionPayload);
  if (instructions.length === 0) {
    return null;
  }
  return {
    method: 'POST',
    path: `/process-instance/${processInstanceId}/modification`,
    payload: {
      skipCustomListeners: data.skipCustomListeners,
      skipIoMappings: data.skipIoMappings,
      instructions,
      annotation: data.annotation !== '' ? data.annotation : 'Modified via Cockpit plugin',
    },
  };
}

/** Everything the single-instance message form contributes to its request. */
export interface InstanceMessageInput {
  /** Name of the BPMN message */
  messageName: string;
  /** Whether the message is carried by a start event */
  isStartEvent: boolean;
  /** Business key for the instance a start message creates */
  businessKey: string;
  /** Variables matched against process variables during correlation */
  correlationKeys: VariableInput[];
  /** Variables matched against local variables during correlation */
  localCorrelationKeys: VariableInput[];
  /** Variables set on the process instance */
  processVariables: VariableInput[];
  /** Variables set on the execution that received the message */
  processVariablesLocal: VariableInput[];
}

/**
 * Transform variables for a correlation payload.
 * @param variables - Variables held in form state
 * @returns The variables as the engine expects them
 */
function toVariables(variables: VariableInput[]): Record<string, { value: unknown; type: string }> {
  return transformVariablesUtil(variables, false);
}

/**
 * Build the message request of the single-instance message form.
 *
 * A message on a start event starts a new, unrelated instance; any other message is
 * correlated to exactly this instance.
 * @param data - The message form's state
 * @param processInstanceId - The instance the form is opened on
 * @returns The request, or null when no message is selected
 */
export function buildInstanceMessageRequest(
  data: InstanceMessageInput,
  processInstanceId: string
): BatchRequest | null {
  if (data.messageName === '') {
    return null;
  }
  if (data.isStartEvent) {
    return {
      method: 'POST',
      path: '/message',
      payload: {
        messageName: data.messageName,
        businessKey: data.businessKey,
        processVariables: toVariables(data.processVariables),
      },
    };
  }
  return {
    method: 'POST',
    path: '/message',
    payload: {
      messageName: data.messageName,
      processInstanceId,
      all: false,
      correlationKeys: toVariables(data.correlationKeys),
      localCorrelationKeys: toVariables(data.localCorrelationKeys),
      processVariables: toVariables(data.processVariables),
      processVariablesLocal: toVariables(data.processVariablesLocal),
    },
  };
}

/** Starting point value meaning "the process's default blank start event". */
export const RESTART_AT_DEFAULT_START = '__default_start__';

/** Everything the restart form contributes to its request. */
export interface RestartInput {
  /** Activity to start before, {@link RESTART_AT_DEFAULT_START}, or empty when not chosen */
  startActivityId: string;
  /** Whether to skip custom execution listeners */
  skipCustomListeners: boolean;
  /** Whether to skip input/output mappings */
  skipIoMappings: boolean;
}

/**
 * Build the restart request for one finished process instance.
 *
 * The engine defaults are written out explicitly, so the preview shows that the last
 * set of variables and the business key are carried over.
 * @param data - The restart form's state
 * @param processDefinitionId - The definition the instance belongs to
 * @param processInstanceId - The finished instance to restart
 * @returns The request, or null when no starting point is chosen
 */
export function buildRestartRequest(
  data: RestartInput,
  processDefinitionId: string,
  processInstanceId: string
): BatchRequest | null {
  if (data.startActivityId === '') {
    return null;
  }
  const payload: Record<string, unknown> = {
    processInstanceIds: [processInstanceId],
    initialVariables: false,
    withoutBusinessKey: false,
    skipCustomListeners: data.skipCustomListeners,
    skipIoMappings: data.skipIoMappings,
  };
  if (data.startActivityId !== RESTART_AT_DEFAULT_START) {
    payload['instructions'] = [{ type: 'startBeforeActivity', activityId: data.startActivityId }];
  }
  return { method: 'POST', path: `/process-definition/${processDefinitionId}/restart`, payload };
}
