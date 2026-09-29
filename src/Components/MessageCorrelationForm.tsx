// Styles
import './MessageCorrelationForm.scss';

// React
import React, { useEffect, useState } from 'react';

// Third-party libraries
import { useForm, FormProvider } from 'react-hook-form';

// Local components
import ConfirmSubmit from './ConfirmSubmit';
import DryRunResultPreview from './DryRunResultPreview';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import VariableBuilder from './VariableBuilder';
import WarningBox from './WarningBox';

// Local hooks and utilities
import { useGuardedSubmit } from '../hooks/useGuardedSubmit';
import { get, post } from '../utils/api';
import { reloadAngularRoute } from '../utils/angular';
import { getBpmnElements, BpmnMessage } from '../utils/bpmnParsing';
import { RELOAD_DELAY_MS } from '../utils/constants';
import { buildInstanceMessageRequest, type InstanceMessageInput } from '../utils/instanceOperations';
import { tryBuild } from '../utils/submitGuard';

// Types
import { InstancePluginParams } from '../types';

type CorrelationFormData = InstanceMessageInput;

/** Success message shown after correlating a message */
const SUCCESS_MESSAGE = 'Message correlated successfully! The page will refresh to show updates.';

/**
 * Generate a UUID v4 string for use as a default business key.
 * @returns A UUID v4 string
 */
function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Form component for correlating messages to process instances.
 * This component is intentionally cohesive - splitting it would fragment the form logic.
 */
// eslint-disable-next-line max-lines-per-function -- Form component with cohesive state management
const MessageCorrelationForm: React.FC<InstancePluginParams> = ({
  api,
  processInstanceId,
  processDefinitionId,
  processData,
}) => {
  const [messages, setMessages] = useState<BpmnMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const methods = useForm<CorrelationFormData>({
    defaultValues: {
      messageName: '',
      isStartEvent: false,
      businessKey: '',
      correlationKeys: [],
      localCorrelationKeys: [],
      processVariables: [],
      processVariablesLocal: [],
    },
  });

  const watchedMessageName = methods.watch('messageName');
  const selectedMessage = messages.find(msg => msg.name === watchedMessageName);
  const isStartEvent = selectedMessage?.isStartEvent === true;

  const formValues = methods.watch();
  const guard = useGuardedSubmit(tryBuild(() => buildInstanceMessageRequest(formValues, processInstanceId)));

  useEffect(() => {
    const loadMessages = async (): Promise<void> => {
      try {
        setIsLoading(true);
        let defId: string | undefined =
          processDefinitionId ?? processData?.definitionId ?? processData?.processDefinitionId;
        if (defId === undefined || defId === '') {
          const instanceData = (await get(api, `/process-instance/${processInstanceId}`)) as {
            definitionId?: string;
          };
          defId = instanceData.definitionId;
        }

        if (defId !== undefined && defId !== '') {
          const { messages: allMessages } = await getBpmnElements(defId, api);
          setMessages(allMessages);
        } else {
          throw new Error('Could not determine process definition ID.');
        }
      } catch (err) {
        setError('Failed to load BPMN messages.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void loadMessages();
  }, [api, processInstanceId, processDefinitionId, processData]);

  // Keep the derived flag in form state so the request builder sees it, and give a start
  // message a fresh business key. No message is preselected: sending one is a choice.
  useEffect(() => {
    methods.setValue('isStartEvent', isStartEvent);
    if (isStartEvent) {
      methods.setValue('businessKey', generateUUID());
    }
    // methods is a stable reference from useForm
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartEvent]);

  /**
   * Show the request a real run would send, and arm the submit for exactly that request.
   */
  const runDryRun = (data: CorrelationFormData): void => {
    setError(null);
    setSuccessMessage(null);
    guard.clearPreview();
    const request = buildInstanceMessageRequest(data, processInstanceId);
    if (!request) {
      setError('Please select a message.');
      return;
    }
    guard.markPreviewed(request);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setError(null);
      setSuccessMessage(null);
      await guard.submit(async request => {
        await post(api, request.path, {}, JSON.stringify(request.payload));
        setSuccessMessage(SUCCESS_MESSAGE);
        // The sent preview is cleared; keep the dry run disabled too until the view reloads.
        setIsReloading(true);
        setTimeout(() => {
          reloadAngularRoute();
        }, RELOAD_DELAY_MS);
      });
    } catch (err) {
      setError('Failed to correlate message.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <p>Loading messages...</p>;
  }

  if (messages.length === 0 && !error) {
    return (
      <div className="message-correlation-form">
        <p>No message events found in the process definition.</p>
        <p className="message-correlation-form__info-text">
          Message correlation requires the process to have message start events, intermediate catch events, message
          boundary events, or receive tasks.
        </p>
      </div>
    );
  }

  // Show error during initial load
  if (messages.length === 0 && error) {
    return (
      <div className="message-correlation-form">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const submitLabel = isStartEvent ? 'Start Process Instance' : 'Correlate Message';

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => {
          void methods.handleSubmit(onSubmit)(e);
        }}
        className="message-correlation-form"
      >
        <div className="form-group">
          <label>Message Name</label>
          <select {...methods.register('messageName')} className="form-control">
            <option value="">Select a message...</option>
            {messages.map(msg => (
              <option key={msg.id} value={msg.name}>
                {msg.name}
                {msg.isStartEvent ? ' (Start Event)' : ''}
              </option>
            ))}
          </select>
        </div>

        {isStartEvent && (
          <div className="form-group">
            <label htmlFor="businessKey">Business Key</label>
            <input
              id="businessKey"
              type="text"
              {...methods.register('businessKey')}
              className="form-control"
              placeholder="Enter business key"
            />
            <small className="form-text text-muted">
              A unique key to identify the new process instance. Defaults to a generated UUID.
            </small>
          </div>
        )}

        <div className="form-group">
          <h5>Process Variables</h5>
          <VariableBuilder name="processVariables" showLocalFlag={false} />
        </div>

        {!isStartEvent && (
          <>
            <div className="form-group">
              <h5>Process Variables Local</h5>
              <VariableBuilder name="processVariablesLocal" showLocalFlag={false} />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={showAdvancedOptions}
                  onChange={() => {
                    setShowAdvancedOptions(!showAdvancedOptions);
                  }}
                />{' '}
                Advanced Correlation Options
              </label>
            </div>

            {showAdvancedOptions && (
              <>
                <div className="form-group">
                  <h5>Correlation Keys</h5>
                  <VariableBuilder name="correlationKeys" showLocalFlag={false} />
                </div>
                <div className="form-group">
                  <h5>Local Correlation Keys</h5>
                  <VariableBuilder name="localCorrelationKeys" showLocalFlag={false} />
                </div>
              </>
            )}
          </>
        )}

        {isStartEvent && (
          <WarningBox>
            This message is configured on a start event. Sending it starts a new process instance, which is not related
            to the instance you are viewing.
          </WarningBox>
        )}

        <div className="form-group">
          <button
            type="button"
            className="btn btn-default"
            disabled={isReloading}
            onClick={() => {
              void methods.handleSubmit(runDryRun)();
            }}
          >
            Dry Run
          </button>
        </div>

        <DryRunResultPreview request={guard.previewedRequest} />

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <ConfirmSubmit guard={guard} submitLabel={submitLabel} submittingLabel="Correlating..." />
      </form>
    </FormProvider>
  );
};

export default MessageCorrelationForm;
