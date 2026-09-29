/**
 * Guarded submit for the forms that change engine state.
 *
 * A form may only send the request its user previewed and acknowledged: submit stays
 * disabled until a dry run exists, becomes disabled again as soon as the form no longer
 * builds the previewed request, and a successful submit clears the preview so the same
 * request cannot be sent twice by a second click.
 *
 * @module
 */
import { useCallback, useRef, useState } from 'react';

import type { BatchRequest } from '../utils/batchOperations';
import { describeRisk, isPreviewCurrent, type SubmitRisk } from '../utils/submitGuard';

/** State and actions of a guarded submit. */
export interface GuardedSubmit {
  /** The request shown by the last dry run */
  previewedRequest: BatchRequest | null;
  /** True when a preview exists but the form now builds a different request */
  isPreviewStale: boolean;
  /** Risk of the previewed request, null without a preview */
  risk: SubmitRisk | null;
  /** Whether the user ticked the acknowledgement */
  isAcknowledged: boolean;
  /** Tick or untick the acknowledgement */
  setAcknowledged: (value: boolean) => void;
  /** True while the request is in flight */
  isSubmitting: boolean;
  /** Whether submit may be pressed now */
  canSubmit: boolean;
  /** Record a dry run's request, with the instance count it found */
  markPreviewed: (request: BatchRequest, affectedCount?: number) => void;
  /** Forget the preview */
  clearPreview: () => void;
  /** Send the previewed request through `send`, at most once */
  submit: (send: (request: BatchRequest) => Promise<void>) => Promise<void>;
}

/**
 * Guard a form's submit behind a current, acknowledged preview.
 * @param currentRequest - The request the form would send right now
 * @returns The guard's state and actions
 */
export function useGuardedSubmit(currentRequest: BatchRequest | null): GuardedSubmit {
  const [previewedRequest, setPreviewedRequest] = useState<BatchRequest | null>(null);
  const [risk, setRisk] = useState<SubmitRisk | null>(null);
  const [isAcknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State updates land on the next render; a ref stops a double click in the same tick.
  const inFlight = useRef(false);

  const isCurrent = isPreviewCurrent(previewedRequest, currentRequest);
  const isBlocked = risk?.blockedReason !== undefined;
  const canSubmit = isCurrent && isAcknowledged && !isBlocked && !isSubmitting;

  const markPreviewed = useCallback((request: BatchRequest, affectedCount?: number): void => {
    setPreviewedRequest(request);
    setRisk(describeRisk(request, affectedCount));
    setAcknowledged(false);
  }, []);

  const clearPreview = useCallback((): void => {
    setPreviewedRequest(null);
    setRisk(null);
    setAcknowledged(false);
  }, []);

  const submit = async (send: (request: BatchRequest) => Promise<void>): Promise<void> => {
    if (inFlight.current || !canSubmit || !previewedRequest) {
      return;
    }
    inFlight.current = true;
    setIsSubmitting(true);
    try {
      await send(previewedRequest);
      // Sent: the same request needs a fresh dry run and acknowledgement to go again.
      clearPreview();
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    previewedRequest,
    isPreviewStale: previewedRequest !== null && !isCurrent,
    risk,
    isAcknowledged,
    setAcknowledged,
    isSubmitting,
    canSubmit,
    markPreviewed,
    clearPreview,
    submit,
  };
}
