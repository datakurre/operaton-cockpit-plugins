// Styles
import './MessageCorrelationForm.scss';

// React
import React, { useEffect, useState } from 'react';

// Third-party libraries
import { useForm, FormProvider } from 'react-hook-form';

// Local components
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import VariableBuilder from './VariableBuilder';

// Local utilities
import { get, post } from '../utils/api';
import { reloadAngularRoute } from '../utils/angular';
import { getBpmnElements, BpmnMessage } from '../utils/bpmnParsing';
import { RELOAD_DELAY_MS } from '../utils/constants';
import { transformVariables as transformVariablesUtil } from '../utils/variables';

// Types
import { InstancePluginParams } from '../types';

interface Variable {
  name: string;
  type: string;
  value: string | boolean;
  local?: boolean;
}

interface CorrelationFormData {
  messageName: string;
  businessKey: string;
  correlationKeys: Variable[];
  localCorrelationKeys: Variable[];
  processVariables: Variable[];
  processVariablesLocal: Variable[];
}

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const methods = useForm<CorrelationFormData>({
    defaultValues: {
      messageName: '',
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

  // Set a default messageName once messages are loaded so isStartEvent is computed correctly
  useEffect(() => {
    if (messages.length > 0 && methods.getValues('messageName') === '') {
      const first = messages[0];
      if (first !== undefined) {
        methods.setValue('messageName', first.name);
      }
    }
    // methods is a stable reference from useForm
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Generate a fresh business key whenever the user selects a start event message
  useEffect(() => {
    if (isStartEvent) {
      methods.setValue('businessKey', generateUUID());
    }
    // methods is a stable reference from useForm
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartEvent]);

  const transformVariables = (vars: Variable[]): Record<string, { value: unknown; type: string }> =>
    transformVariablesUtil(vars, false);

  const onSubmit = async (data: CorrelationFormData): Promise<void> => {
    try {
      setIsSubmitted(true);
      setError(null);

      const payload: Record<string, unknown> = isStartEvent
        ? {
            messageName: data.messageName,
            businessKey: data.businessKey,
            processVariables: transformVariables(data.processVariables),
          }
        : {
            messageName: data.messageName,
            processInstanceId,
            all: false,
            correlationKeys: transformVariables(data.correlationKeys),
            localCorrelationKeys: transformVariables(data.localCorrelationKeys),
            processVariables: transformVariables(data.processVariables),
            processVariablesLocal: transformVariables(data.processVariablesLocal),
          };

      await post(api, '/message', {}, JSON.stringify(payload));

      // Show success message instead of immediate refresh
      setError(SUCCESS_MESSAGE);

      // Delay refresh to allow user to see success message
      setTimeout(() => {
        reloadAngularRoute();
      }, RELOAD_DELAY_MS);
    } catch (err) {
      setError('Failed to correlate message.');
      console.error(err);
    } finally {
      setIsSubmitted(false);
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

  // Show error during initial load (not post-submission errors/success)
  if (messages.length === 0 && error && error !== SUCCESS_MESSAGE) {
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

        {error && (error === SUCCESS_MESSAGE ? <SuccessMessage message={error} /> : <ErrorMessage message={error} />)}

        <button type="submit" className="btn btn-primary" disabled={isSubmitted}>
          {isSubmitted ? 'Correlating...' : submitLabel}
        </button>
      </form>
    </FormProvider>
  );
};

export default MessageCorrelationForm;
