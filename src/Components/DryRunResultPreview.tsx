/**
 * Dry run result preview component.
 * Displays a list of process instances that would be affected by a batch operation.
 *
 * @module
 */
import React from 'react';
import { ProcessInstance } from '../types';

/** Maximum number of instances to show in preview */
const MAX_PREVIEW_INSTANCES = 10;

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

interface DryRunResultPreviewProps {
  result: DryRunResult;
  maxInstances?: number;
}

/**
 * Displays a preview of instances affected by a batch operation.
 */
const DryRunResultPreview: React.FC<DryRunResultPreviewProps> = ({ result, maxInstances = MAX_PREVIEW_INSTANCES }) => {
  const pluralSuffix = result.count !== 1 ? 's' : '';

  return (
    <div className="modify-form__dry-run-result">
      <h5>
        Found {result.count} instance{pluralSuffix}
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
    </div>
  );
};

export default DryRunResultPreview;
export type { DryRunResult };
