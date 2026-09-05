/**
 * Batch signal broadcast form component.
 * Allows broadcasting signals to multiple process instances.
 *
 * @module
 */
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DryRunResultPreview, { type DryRunResult } from './DryRunResultPreview';
import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import SuccessMessage from './SuccessMessage';
import VariableBuilder from './VariableBuilder';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import { buildSignalRequest, type BatchRequest, type SignalRequestInput } from '../utils/batchOperations';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

type SignalFormData = SignalRequestInput;

interface BatchSignalFormProps {
  api: API;
  processDefinitionId: string;
}

/**
 * Batch signal broadcast form component.
 * Allows broadcasting signals to multiple process instances.
 */
const BatchSignalForm: React.FC<BatchSignalFormProps> = ({ api, processDefinitionId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [dryRunRequest, setDryRunRequest] = useState<BatchRequest | null>(null);

  const methods = useForm<SignalFormData>({
    defaultValues: {
      signalName: '',
      processVariables: [],
    },
  });

  const { handleSubmit, reset } = methods;

  /**
   * Preview the broadcast: the request it would send, and the instances of *this*
   * definition, which is only part of what a signal reaches.
   */
  const runDryRun = async (data: SignalFormData): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildSignalRequest(data);
      if (!request) {
        setError('Please enter a signal name.');
        return;
      }
      setDryRunRequest(request);

      const instances = (await get(api, '/process-instance', {
        processDefinitionId,
      })) as ProcessInstance[];

      setDryRunResult({
        count: instances.length,
        instances: instances.slice(0, MAX_PREVIEW_INSTANCES),
      });

      if (instances.length === 0) {
        setError('No active instances found for this definition.');
      }
    } catch (err) {
      console.error('Dry run error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to query instances: ${errorMessage}. Check console for details.`);
    } finally {
      setIsDryRun(false);
    }
  };

  /**
   * Submit the signal broadcast request
   */
  const onSubmit = async (data: SignalFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildSignalRequest(data);
      if (!request) {
        setError('Please enter a signal name.');
        setIsSubmitting(false);
        return;
      }

      await post(api, request.path, {}, JSON.stringify(request.payload));

      setSuccessMessage(
        `Signal "${data.signalName}" broadcast engine-wide. All matching signal catch events across all process definitions have been triggered.`
      );
    } catch (err) {
      console.error('Signal broadcast error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to broadcast signal: ${errorMessage}. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset the form to initial state
   */
  const handleReset = (): void => {
    reset();
    setError(null);
    setSuccessMessage(null);
    setDryRunResult(null);
    setDryRunRequest(null);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        className="modify-form"
      >
        <div className="modify-form__header">
          <WarningBox title="Engine-Wide Broadcast">
            Signals are delivered to ALL matching signal catch events across ALL process definitions and instances in
            the engine — not only instances of this process definition. Ensure the signal name is unique or that
            engine-wide delivery is intentional.
          </WarningBox>
        </div>

        <div className="modify-form__section">
          <div className="modify-form__field">
            <label htmlFor="signalName">Signal Name</label>
            <input
              id="signalName"
              type="text"
              {...methods.register('signalName', { required: true })}
              placeholder="Enter signal name"
              className="modify-form__input"
            />
          </div>

          <div className="modify-form__actions">
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                void handleSubmit(runDryRun)();
              }}
              disabled={isDryRun}
              minWidth={120}
            >
              {isDryRun ? 'Querying...' : 'Dry Run'}
            </FormButton>
          </div>

          <DryRunResultPreview
            result={dryRunResult}
            request={dryRunRequest}
            maxInstances={MAX_PREVIEW_INSTANCES}
            instanceLabel="active instance of this definition"
            instanceNote={
              'This list covers this definition only. The broadcast reaches every matching signal catch event ' +
              'in every deployed definition, so the real reach is wider than shown.'
            }
          />
        </div>

        <h4>Variables</h4>
        <VariableBuilder name="processVariables" showLocalFlag={false} />

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <div className="modify-form__actions">
          <FormButton type="submit" disabled={isSubmitting} variant="primary" minWidth={160}>
            {isSubmitting ? 'Broadcasting...' : 'Broadcast Signal'}
          </FormButton>
          <FormButton type="button" variant="secondary" onClick={handleReset} minWidth={100}>
            Reset
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default BatchSignalForm;
