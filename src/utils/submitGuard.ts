/**
 * Pure rules behind the guarded submit of every state-changing form.
 *
 * A form may only send the request its user has previewed and acknowledged. These
 * helpers decide whether a preview still matches what submit would send, and how risky
 * that request is, so the rules are testable without rendering a form.
 *
 * @module
 */
import type { BatchRequest } from './batchOperations';

/** How far a request reaches, from the narrowest to the widest. */
export type RiskLevel = 'single' | 'creates-instance' | 'ends-instances' | 'mass' | 'engine-wide';

/** What a form tells its user before they may submit a request. */
export interface SubmitRisk {
  /** How far the request reaches */
  level: RiskLevel;
  /** Statement the user must tick before submitting */
  acknowledgement: string;
  /** When set, the request must not be sent at all, and this says why */
  blockedReason?: string;
}

/** Instruction types that start something, as opposed to cancelling it. */
const START_INSTRUCTION_TYPES: readonly string[] = ['startBeforeActivity', 'startAfterActivity', 'startTransition'];

/**
 * Serialize a request for comparison.
 *
 * The builders are deterministic, so two builds of the same form state serialize to the
 * same string.
 * @param request - The request, or null when the form cannot build one
 * @returns The serialized request, or null
 */
export function requestKey(request: BatchRequest | null): string | null {
  if (!request) {
    return null;
  }
  return JSON.stringify({ method: request.method, path: request.path, payload: request.payload });
}

/**
 * Whether the previewed request is still the one submit would send.
 * @param previewed - The request shown by the last dry run
 * @param current - The request the form would send now
 * @returns True when both exist and are identical
 */
export function isPreviewCurrent(previewed: BatchRequest | null, current: BatchRequest | null): boolean {
  const previewedKey = requestKey(previewed);
  return previewedKey !== null && previewedKey === requestKey(current);
}

/**
 * Whether a set of modification instructions only cancels.
 *
 * Cancelling without starting anything removes tokens and can end every process instance
 * whose only token was cancelled.
 * @param instructions - The instructions of a modification request
 * @returns True when there is a cancel instruction and no start instruction
 */
export function isCancelOnly(instructions: readonly { type: string }[]): boolean {
  const hasCancel = instructions.some(instruction => instruction.type === 'cancel');
  const hasStart = instructions.some(instruction => START_INSTRUCTION_TYPES.includes(instruction.type));
  return hasCancel && !hasStart;
}

/**
 * Read the instructions of a modification payload.
 * @param payload - A request payload
 * @returns The instructions, or an empty list
 */
function instructionsOf(payload: Record<string, unknown>): { type: string }[] {
  const instructions = payload['instructions'];
  return Array.isArray(instructions) ? (instructions as { type: string }[]) : [];
}

/**
 * Describe how many instances a mass request reaches.
 * @param affectedCount - Instances found by the dry run, when known
 * @returns A phrase naming the instances
 */
function describeTargets(affectedCount: number | undefined): string {
  if (affectedCount === undefined) {
    return 'the selected process instances';
  }
  return `${affectedCount} process instance${affectedCount === 1 ? '' : 's'}`;
}

/**
 * Describe the risk of a request, and whether it may be sent at all.
 * @param request - The request the form would send
 * @param affectedCount - Instances found by the dry run, for requests that target instances
 * @returns The risk level and the statement the user must acknowledge
 */
export function describeRisk(request: BatchRequest, affectedCount?: number): SubmitRisk {
  const { path, payload } = request;

  if (path === '/signal') {
    return {
      level: 'engine-wide',
      acknowledgement:
        'I understand this signal is delivered to every matching catch event in the engine, not only to this definition.',
    };
  }

  if (path === '/modification/executeAsync') {
    if (isCancelOnly(instructionsOf(payload))) {
      return {
        level: 'ends-instances',
        acknowledgement: '',
        blockedReason:
          'A batch that only cancels removes tokens without starting new ones and can end every targeted process ' +
          'instance. Add a start instruction to move the tokens instead; cancelling instances in bulk is not ' +
          'offered here.',
      };
    }
    return {
      level: 'mass',
      acknowledgement: `I have reviewed the request above and want to modify ${describeTargets(affectedCount)}.`,
    };
  }

  if (path === '/process-instance/message-async') {
    return {
      level: 'mass',
      acknowledgement: `I have reviewed the request above and want to correlate the message to ${describeTargets(affectedCount)}.`,
    };
  }

  if (path === '/message' && payload['processInstanceId'] === undefined) {
    return {
      level: 'creates-instance',
      acknowledgement: 'I understand this message starts a new process instance.',
    };
  }

  if (path.endsWith('/restart')) {
    return {
      level: 'creates-instance',
      acknowledgement: 'I understand this starts a new process instance from the history of this one.',
    };
  }

  if (path.endsWith('/modification') && isCancelOnly(instructionsOf(payload))) {
    return {
      level: 'ends-instances',
      acknowledgement:
        'I understand that cancelling without starting anything ends this process instance if no other activity ' +
        'stays active.',
    };
  }

  return { level: 'single', acknowledgement: 'I have reviewed the request above.' };
}

/**
 * Build a request, treating a builder failure as "nothing to send".
 *
 * Forms rebuild their request on every render to compare it with the preview, so a
 * builder must never throw into rendering.
 * @param build - The builder call
 * @returns The request, or null when the builder cannot build one
 */
export function tryBuild(build: () => BatchRequest | null): BatchRequest | null {
  try {
    return build();
  } catch {
    return null;
  }
}
