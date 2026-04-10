/**
 * Batch signal broadcast form component.
 * Allows broadcasting signals to multiple process instances.
 *
 * @module
 */
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import SuccessMessage from './SuccessMessage';
import VariableBuilder from './VariableBuilder';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import { transformVariables as transformVariablesUtil, VariableInput } from '../utils/variables';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

interface SignalFormData {
  signalName: string;
  processVariables: VariableInput[];
}

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

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

  const methods = useForm<SignalFormData>({
    defaultValues: {
      signalName: '',
      processVariables: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const transformVariables = (vars: VariableInput[]): Record<string, { value: unknown; type: string }> =>
    transformVariablesUtil(vars, true);

  /**
   * Run a dry-run query to show affected instances
   */
  const runDryRun = async (): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setDryRunResult(null);

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

      if (!data.signalName) {
        setError('Please enter a signal name.');
        setIsSubmitting(false);
        return;
      }

      const payload: Record<string, unknown> = {
        name: data.signalName,
        executionId: undefined, // Broadcast to all matching
      };

      if (data.processVariables.length > 0) {
        payload['variables'] = transformVariables(data.processVariables);
      }

      await post(api, '/signal', {}, JSON.stringify(payload));

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
                void runDryRun();
              }}
              disabled={isDryRun}
              minWidth={120}
            >
              {isDryRun ? 'Querying...' : 'Preview Instances'}
            </FormButton>
          </div>

          {dryRunResult && (
            <div className="modify-form__dry-run-result">
              <h5>
                Found {dryRunResult.count} active instance{dryRunResult.count !== 1 ? 's' : ''} for this definition (the
                signal will broadcast engine-wide across all definitions)
              </h5>
              {dryRunResult.instances.length > 0 && (
                <ul className="modify-form__instance-list">
                  {dryRunResult.instances.map(inst => (
                    <li key={inst.id}>
                      {inst.id} {inst.businessKey ? `(${inst.businessKey})` : ''}
                    </li>
                  ))}
                  {dryRunResult.count > MAX_PREVIEW_INSTANCES && (
                    <li>...and {dryRunResult.count - MAX_PREVIEW_INSTANCES} more</li>
                  )}
                </ul>
              )}
            </div>
          )}
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
