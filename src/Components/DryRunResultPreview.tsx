/**
 * Dry run preview for the batch operation forms.
 *
 * Shows both halves of a dry run: which process instances the operation would reach, and
 * the request it would send. The request matters as much as the instance list - the
 * instructions, the variables and their types, and whether the target is a fixed list of
 * ids or an open-ended query are all decided there, and none of it is visible from a count.
 *
 * @module
 */
import React from 'react';
import { ProcessInstance } from '../types';
import type { BatchRequest } from '../utils/batchOperations';

/** Maximum number of instances to show in preview */
const MAX_PREVIEW_INSTANCES = 10;

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

interface DryRunResultPreviewProps {
  /** Instances the operation would reach, when the operation targets instances */
  result?: DryRunResult | null;
  /** The request the real run would send */
  request?: BatchRequest | null;
  /** Label for what the instance list contains */
  instanceLabel?: string;
  /** Note rendered under the instance list, for scope the list cannot show */
  instanceNote?: string;
  /** How many instances to list before summarising the rest */
  maxInstances?: number;
}

/**
 * Displays a preview of a batch operation: affected instances and the request body.
 */
const DryRunResultPreview: React.FC<DryRunResultPreviewProps> = ({
  result,
  request,
  instanceLabel = 'instance',
  instanceNote,
  maxInstances = MAX_PREVIEW_INSTANCES,
}) => {
  if (!result && !request) {
    return null;
  }

  return (
    <div className="modify-form__dry-run-result">
      {result && (
        <>
          <h5>
            Found {result.count} {instanceLabel}
            {result.count !== 1 ? 's' : ''}
          </h5>
          {result.instances.length > 0 && (
            <ul className="modify-form__instance-list">
              {result.instances.map(inst => (
                <li key={inst.id}>
                  {inst.id} {inst.businessKey ? `(${inst.businessKey})` : ''}
                </li>
              ))}
              {result.count > maxInstances && <li>...and {result.count - maxInstances} more</li>}
            </ul>
          )}
          {instanceNote !== undefined && <p className="modify-form__hint">{instanceNote}</p>}
        </>
      )}

      {request && (
        <>
          <h5>Request that would be sent</h5>
          <pre className="modify-form__request-preview" aria-label="Request preview">
            {request.method} {request.path}
            {'\n'}
            {JSON.stringify(request.payload, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default DryRunResultPreview;
export type { DryRunResult };
