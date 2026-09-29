/**
 * Dry run lookup of the process instances a batch form targets.
 *
 * @module
 */
import { get } from './api';
import { buildInstanceLookupParams, findMissingInstanceIds, type InstanceSelection } from './batchOperations';
import type { API, ProcessInstance } from '../types';

/** What a dry run found for an instance selection. */
export interface TargetLookup {
  /** Running instances matching the selection */
  instances: ProcessInstance[];
  /** Entered ids not found as running instances of this definition */
  missingIds: string[];
}

/**
 * Read back the running instances a selection targets.
 * @param api - The API configuration
 * @param selection - The form's instance selection
 * @param processDefinitionId - The definition the form is scoped to
 * @returns The instances found, and the entered ids that were not
 */
export async function lookupTargetInstances(
  api: API,
  selection: InstanceSelection,
  processDefinitionId: string
): Promise<TargetLookup> {
  const params = buildInstanceLookupParams(selection, processDefinitionId);
  const instances = params ? ((await get(api, '/process-instance', params)) as ProcessInstance[]) : [];
  const foundIds = instances.map(instance => instance.id).filter((id): id is string => typeof id === 'string');
  const missingIds = findMissingInstanceIds(selection, foundIds);
  return { instances, missingIds };
}

/**
 * Explain why a lookup result must not be sent, if it must not.
 * @param lookup - The dry run lookup result
 * @returns The problem to show, or null when the request may be sent
 */
export function describeLookupProblem(lookup: TargetLookup): string | null {
  if (lookup.missingIds.length > 0) {
    return (
      `Not found as running instances of this process definition: ${lookup.missingIds.join(', ')}. ` +
      'Remove them or correct them before sending.'
    );
  }
  if (lookup.instances.length === 0) {
    return 'No instances found matching the selection criteria.';
  }
  return null;
}
