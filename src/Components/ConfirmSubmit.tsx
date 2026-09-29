/**
 * Submit area of a guarded form: says why submit is disabled, asks for the
 * acknowledgement, and renders the submit button.
 *
 * @module
 */
import React from 'react';

import FormButton from './FormButton';
import WarningBox from './WarningBox';
import type { GuardedSubmit } from '../hooks/useGuardedSubmit';

interface ConfirmSubmitProps {
  /** The form's guarded submit */
  guard: GuardedSubmit;
  /** Label of the submit button */
  submitLabel: string;
  /** Label of the submit button while the request is in flight */
  submittingLabel: string;
  /** Replaces the acknowledgement derived from the request's risk */
  acknowledgement?: string | undefined;
  /** Extra content after the submit button, e.g. a reset button */
  children?: React.ReactNode;
}

/**
 * Renders the preview status, acknowledgement checkbox and submit button.
 */
const ConfirmSubmit: React.FC<ConfirmSubmitProps> = ({
  guard,
  submitLabel,
  submittingLabel,
  acknowledgement,
  children,
}) => {
  const { previewedRequest, isPreviewStale, risk } = guard;
  const blockedReason = risk?.blockedReason;
  const acknowledgementText = acknowledgement ?? risk?.acknowledgement ?? '';

  return (
    <div className="modify-form__confirm">
      {previewedRequest === null && (
        <p className="modify-form__hint">Run a dry run to review the request before sending it.</p>
      )}

      {isPreviewStale && (
        <WarningBox title="Preview out of date">
          The form has changed since the dry run. Run the dry run again to review the request that would now be sent.
        </WarningBox>
      )}

      {blockedReason !== undefined && <WarningBox title="Not allowed">{blockedReason}</WarningBox>}

      {previewedRequest !== null && !isPreviewStale && blockedReason === undefined && (
        <div className="modify-form__field">
          <label className="modify-form__acknowledgement">
            <input
              type="checkbox"
              checked={guard.isAcknowledged}
              onChange={e => {
                guard.setAcknowledged(e.target.checked);
              }}
            />{' '}
            {acknowledgementText}
          </label>
        </div>
      )}

      <div className="modify-form__actions">
        <FormButton type="submit" disabled={!guard.canSubmit} variant="primary" minWidth={160}>
          {guard.isSubmitting ? submittingLabel : submitLabel}
        </FormButton>
        {children}
      </div>
    </div>
  );
};

export default ConfirmSubmit;
