/**
 * Batch message correlation form component.
 * Allows correlating messages to multiple process instances.
 *
 * @module
 */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import VariableBuilder from './VariableBuilder';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import { getBpmnElements, BpmnMessage } from '../utils/bpmnParsing';
import { transformVariables as transformVariablesUtil, VariableInput } from '../utils/variables';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

interface MessageFormData {
  messageName: string;
  processVariables: VariableInput[];
}

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

interface BatchMessageFormProps {
  api: API;
  processDefinitionId: string;
}

/**
 * Batch message correlation form component.
 * Allows correlating messages to multiple process instances.
 */
const BatchMessageForm: React.FC<BatchMessageFormProps> = ({ api, processDefinitionId }) => {
  const [messages, setMessages] = useState<BpmnMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);

  const methods = useForm<MessageFormData>({
    defaultValues: {
      messageName: '',
      processVariables: [],
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const loadMessages = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { messages } = await getBpmnElements(processDefinitionId, api);
        setMessages(messages);
        setError(null);
      } catch (_err) {
        console.error('Error loading messages:', _err);
        const errorMessage = _err instanceof Error ? _err.message : 'Unknown error';
        setError(`Failed to load BPMN messages: ${errorMessage}. Check console for details.`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMessages();
  }, [api, processDefinitionId]);

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
   * Submit the message correlation request
   */
  const onSubmit = async (data: MessageFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);

      if (!data.messageName) {
        setError('Please select a message to correlate.');
        setIsSubmitting(false);
        return;
      }

      const payload: Record<string, unknown> = {
        messageName: data.messageName,
        processInstanceQuery: {
          processDefinitionId,
        },
      };

      if (data.processVariables.length > 0) {
        payload['variables'] = transformVariables(data.processVariables);
      }

      await post(api, '/process-instance/message-async', {}, JSON.stringify(payload));

      setSuccessMessage(
        `Message "${data.messageName}" correlation submitted successfully as a batch operation! ` +
          `Check the batch operations view for progress.`
      );
    } catch (err) {
      console.error('Message correlation error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to correlate message: ${errorMessage}. Check console for details.`);
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

  if (isLoading) {
    return (
      <div className="modify-form__loading">
        <LoadingSpinner />
        <p>Loading BPMN messages...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="modify-form__error">
        <ErrorMessage message={error} />
      </div>
    );
  }

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
          <p className="modify-form__description">
            Correlate a message asynchronously to all active instances of this process definition. The message will be
            delivered as a batch operation.
          </p>
        </div>

        <div className="modify-form__section">
          <div className="modify-form__field">
            <label htmlFor="messageName">Message</label>
            <select id="messageName" {...methods.register('messageName')} className="modify-form__input">
              <option value="">Select a message...</option>
              {messages.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {messages.length === 0 && (
            <p className="modify-form__hint">No message events found in this process definition.</p>
          )}

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
                Found {dryRunResult.count} active instance{dryRunResult.count !== 1 ? 's' : ''}
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

        <h4>Process Variables</h4>
        <VariableBuilder name="processVariables" showLocalFlag={false} />

        <WarningBox>
          This message will be correlated asynchronously to ALL active instances of this process definition as a batch
          operation. Make sure the message name and variables are correct before submitting.
        </WarningBox>

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <div className="modify-form__actions">
          <FormButton type="submit" disabled={isSubmitting} variant="primary" minWidth={160}>
            {isSubmitting ? 'Correlating...' : 'Correlate Message'}
          </FormButton>
          <FormButton type="button" variant="secondary" onClick={handleReset} minWidth={100}>
            Reset
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default BatchMessageForm;
