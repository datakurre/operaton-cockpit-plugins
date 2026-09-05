/**
 * Definition-level message form.
 *
 * A message carried by a start event starts one new process instance and takes a business
 * key; any other message is correlated asynchronously to a selected set of running
 * instances. Both paths preview the request they would send before it is sent.
 *
 * @module
 */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DryRunResultPreview, { type DryRunResult } from './DryRunResultPreview';
import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import InstanceSelectionFields from './InstanceSelectionFields';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessage from './SuccessMessage';
import VariableBuilder from './VariableBuilder';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import {
  buildInstanceLookupParams,
  buildMessageRequest,
  type BatchRequest,
  type MessageRequestInput,
} from '../utils/batchOperations';
import { getBpmnElements, BpmnElement, BpmnMessage } from '../utils/bpmnParsing';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

/** Radix used when deriving a business key from the clock */
const BUSINESS_KEY_RADIX = 36;

/** Length of the random suffix in a generated business key */
const BUSINESS_KEY_SUFFIX_LENGTH = 8;

/**
 * Generate a business key for an instance started from a message.
 *
 * Without a business key an instance started here cannot be found again afterwards, so
 * the field is pre-filled rather than left empty.
 * @returns A generated business key
 */
function generateBusinessKey(): string {
  const stamp = Date.now().toString(BUSINESS_KEY_RADIX);
  const random = Math.random().toString(BUSINESS_KEY_RADIX).slice(2, BUSINESS_KEY_SUFFIX_LENGTH);
  return `message-${stamp}-${random}`;
}

type MessageFormData = MessageRequestInput;

interface BatchMessageFormProps {
  api: API;
  processDefinitionId: string;
}

/**
 * Form for sending a BPMN message from a process definition.
 */
// eslint-disable-next-line max-lines-per-function -- Two message paths with targeting, dry run and validation
const BatchMessageForm: React.FC<BatchMessageFormProps> = ({ api, processDefinitionId }) => {
  const [messages, setMessages] = useState<BpmnMessage[]>([]);
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [dryRunRequest, setDryRunRequest] = useState<BatchRequest | null>(null);

  const methods = useForm<MessageFormData>({
    defaultValues: {
      messageName: '',
      isStartEvent: false,
      businessKey: '',
      processVariables: [],
      instanceSelectionMode: 'all',
      specificInstanceIds: '',
      queryActivityId: '',
      queryState: 'active',
    },
  });

  const { handleSubmit, reset, watch, setValue } = methods;

  const selectedMessageName = watch('messageName');
  const selectedMessage = messages.find(m => m.name === selectedMessageName);
  const isStartEvent = selectedMessage?.isStartEvent === true;

  useEffect(() => {
    const loadDefinition = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { messages: allMessages, activities: allActivities } = await getBpmnElements(processDefinitionId, api);
        setMessages(allMessages);
        setActivities(allActivities);
        setError(null);
      } catch (_err) {
        console.error('Error loading messages:', _err);
        const errorMessage = _err instanceof Error ? _err.message : 'Unknown error';
        setError(`Failed to load BPMN messages: ${errorMessage}. Check console for details.`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDefinition();
  }, [api, processDefinitionId]);

  // Keep the derived flag in form state so the request builders see it, and give a start
  // message a business key to start with.
  useEffect(() => {
    setValue('isStartEvent', isStartEvent);
    if (isStartEvent) {
      setValue('businessKey', generateBusinessKey());
    }
    setDryRunResult(null);
    setDryRunRequest(null);
  }, [isStartEvent, setValue]);

  /**
   * Preview the request, and for a correlation also the instances it would reach.
   *
   * The request comes from the same builder onSubmit uses, so the preview cannot drift
   * from what is actually posted.
   */
  const runDryRun = async (data: MessageFormData): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildMessageRequest(data, processDefinitionId);
      if (!request) {
        setError(
          data.messageName === ''
            ? 'Please select a message to send.'
            : 'Please select the instances to correlate the message to.'
        );
        return;
      }
      setDryRunRequest(request);

      // A start message creates an instance rather than targeting existing ones.
      if (data.isStartEvent) {
        return;
      }

      const params = buildInstanceLookupParams(data, processDefinitionId);
      const instances = params ? ((await get(api, '/process-instance', params)) as ProcessInstance[]) : [];

      setDryRunResult({
        count: instances.length,
        instances: instances.slice(0, MAX_PREVIEW_INSTANCES),
      });

      if (instances.length === 0) {
        setError('No instances found matching the selection criteria.');
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
   * Send the message.
   */
  const onSubmit = async (data: MessageFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildMessageRequest(data, processDefinitionId);
      if (!request) {
        setError(
          data.messageName === ''
            ? 'Please select a message to send.'
            : 'Please select the instances to correlate the message to.'
        );
        return;
      }

      await post(api, request.path, {}, JSON.stringify(request.payload));

      if (data.isStartEvent) {
        const startedWith = data.businessKey !== '' ? ` with business key "${data.businessKey}"` : '';
        setSuccessMessage(`Message "${data.messageName}" sent. A new process instance was started${startedWith}.`);
      } else {
        setSuccessMessage(
          `Message "${data.messageName}" correlation submitted as a batch operation. ` +
            `Check the batch operations view for progress.`
        );
      }
    } catch (err) {
      console.error('Message correlation error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to send message: ${errorMessage}. Check console for details.`);
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

  if (isLoading) {
    return (
      <div className="modify-form__loading">
        <LoadingSpinner />
        <p>Loading BPMN messages...</p>
      </div>
    );
  }

  if (error !== null && messages.length === 0) {
    return (
      <div className="modify-form__error">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const submitLabel = isStartEvent ? 'Start Process Instance' : 'Correlate Message';

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
            {isStartEvent
              ? 'This message is configured on a start event. Sending it starts one new process instance; ' +
                'no running instances are involved.'
              : 'Correlate a message asynchronously to running instances of this process definition. ' +
                'Choose which instances below, then use dry run to check the request before sending it.'}
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
                  {m.isStartEvent ? ' (start event)' : ''}
                </option>
              ))}
            </select>
          </div>

          {messages.length === 0 && (
            <p className="modify-form__hint">No message events found in this process definition.</p>
          )}

          {isStartEvent ? (
            <div className="modify-form__field">
              <label htmlFor="businessKey">Business Key</label>
              <input
                id="businessKey"
                type="text"
                {...methods.register('businessKey')}
                className="modify-form__input"
                placeholder="Business key for the new instance"
              />
              <p className="modify-form__hint">
                Identifies the instance this message starts. Pre-filled so the new instance can be found again; replace
                it with your own if you have one.
              </p>
            </div>
          ) : (
            <InstanceSelectionFields activities={activities} label="Correlate To" />
          )}

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
            instanceLabel="active instance"
          />
        </div>

        <h4>Process Variables</h4>
        <VariableBuilder name="processVariables" showLocalFlag={false} />

        {isStartEvent ? (
          <WarningBox>
            This message is configured on a start event. Sending it will start a new process instance.
          </WarningBox>
        ) : (
          <WarningBox>
            The message will be correlated asynchronously, as a batch operation, to every instance matching the
            selection above. Run a dry run first and check both the instance list and the request.
          </WarningBox>
        )}

        {error !== null && <ErrorMessage message={error} />}
        {successMessage !== null && <SuccessMessage message={successMessage} />}

        <div className="modify-form__actions">
          <FormButton type="submit" disabled={isSubmitting} variant="primary" minWidth={160}>
            {isSubmitting ? 'Sending...' : submitLabel}
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
