// Styles
import './instance-tab-modify.scss';

/* eslint-disable max-lines, no-magic-numbers -- Three related batch operation forms with shared UI patterns */

// React
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

// Local components
import ErrorMessage from './Components/ErrorMessage';
import FormButton from './Components/FormButton';
import InstructionCard from './Components/InstructionCard';
import LoadingSpinner from './Components/LoadingSpinner';
import ModifyFormOptions from './Components/ModifyFormOptions';
import SuccessMessage from './Components/SuccessMessage';
import { Tabs, Tab } from './Components/Tabs';
import VariableBuilder from './Components/VariableBuilder';
import WarningBox from './Components/WarningBox';

// Local utilities
import { get, post } from './utils/api';
import { getBpmnElements, BpmnElement, BpmnMessage } from './utils/bpmnParsing';
import { transformVariables as transformVariablesUtil, VariableInput } from './utils/variables';

// Types
import { DefinitionPluginParams, ProcessInstance } from './types';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

interface ModificationInstruction {
  type: 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';
  activityId?: string;
  transitionId?: string;
  variables?: VariableInput[];
  cancelCurrentActiveActivityInstances?: boolean;
}

/** Type for the modification instruction payload to API */
interface ModificationInstructionPayload {
  type: string;
  activityId?: string;
  transitionId?: string;
  variables?: Record<string, { value: unknown; type: string }>;
  cancelCurrentActiveActivityInstances?: boolean;
}

interface ModifyFormData {
  instructions: ModificationInstruction[];
  annotation: string;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
  instanceSelectionMode: 'all' | 'specific' | 'query';
  specificInstanceIds: string;
  queryActivityId: string;
  queryState: string;
}

interface MessageFormData {
  messageName: string;
  processVariables: VariableInput[];
}

interface SignalFormData {
  signalName: string;
  processVariables: VariableInput[];
}

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

/**
 * Batch process modification form component.
 * Allows selecting multiple instances and applying modification instructions.
 */
// eslint-disable-next-line max-lines-per-function -- Form with complex batch modification, dry-run, and instance selection
const BatchModifyForm: React.FC<Omit<DefinitionPluginParams, 'root'>> = ({ api, processDefinitionId }) => {
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [sequenceFlows, setSequenceFlows] = useState<BpmnElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);

  const methods = useForm<ModifyFormData>({
    defaultValues: {
      instructions: [{ type: 'startBeforeActivity', activityId: '', variables: [] }],
      annotation: '',
      skipCustomListeners: false,
      skipIoMappings: false,
      instanceSelectionMode: 'all',
      specificInstanceIds: '',
      queryActivityId: '',
      queryState: 'active',
    },
  });

  const { control, handleSubmit, watch, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions',
  });

  const instanceSelectionMode = watch('instanceSelectionMode');

  useEffect(() => {
    const loadActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { activities, sequenceFlows } = await getBpmnElements(processDefinitionId, api);
        setActivities(activities);
        setSequenceFlows(sequenceFlows);
        setError(null);
      } catch (_err) {
        console.error('Error loading activities:', _err);
        const errorMessage = _err instanceof Error ? _err.message : 'Unknown error';
        setError(`Failed to load process activities: ${errorMessage}. Check console for details.`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadActivities();
  }, [api, processDefinitionId]);

  const transformVariables = (vars: VariableInput[]): Record<string, { value: unknown; type: string }> =>
    transformVariablesUtil(vars, true);

  const buildInstanceQuery = (data: ModifyFormData): object | null => {
    if (data.instanceSelectionMode === 'all') {
      return { processDefinitionId };
    } else if (data.instanceSelectionMode === 'query') {
      const query: Record<string, unknown> = { processDefinitionId };
      if (data.queryActivityId) {
        query['activityIdIn'] = [data.queryActivityId];
      }
      if (data.queryState === 'active') {
        query['active'] = true;
      } else if (data.queryState === 'suspended') {
        query['suspended'] = true;
      }
      return query;
    }
    return null;
  };

  const getInstanceIds = (data: ModifyFormData): string[] | null => {
    if (data.instanceSelectionMode === 'specific') {
      return data.specificInstanceIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    }
    return null;
  };

  const runDryRun = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setDryRunResult(null);

      const instanceIds = getInstanceIds(data);
      const query = buildInstanceQuery(data);

      let instances: ProcessInstance[] = [];

      if (instanceIds) {
        instances = (await get(api, '/process-instance', {
          processInstanceIds: instanceIds.join(','),
        })) as ProcessInstance[];
      } else if (query) {
        instances = (await get(api, '/process-instance', query as Record<string, string>)) as ProcessInstance[];
      }

      setDryRunResult({
        count: instances.length,
        instances: instances.slice(0, MAX_PREVIEW_INSTANCES), // Show first 10
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

  const onSubmit = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);

      const instanceIds = getInstanceIds(data);
      const query = buildInstanceQuery(data);

      if (!instanceIds && !query) {
        setError('Please select instances to modify.');
        setIsSubmitting(false);
        return;
      }

      const payload: Record<string, unknown> = {
        processDefinitionId,
        skipCustomListeners: data.skipCustomListeners,
        skipIoMappings: data.skipIoMappings,
        instructions: data.instructions
          .filter(inst => {
            if (inst.type === 'startTransition') {
              return inst.transitionId !== undefined && inst.transitionId !== '';
            } else if (inst.type === 'cancel') {
              return inst.activityId !== undefined && inst.activityId !== '';
            } else {
              return inst.activityId !== undefined && inst.activityId !== '';
            }
          })
          .map((inst): ModificationInstructionPayload => {
            const instruction: ModificationInstructionPayload = { type: inst.type };
            if (inst.activityId !== undefined && inst.activityId !== '') {
              instruction.activityId = inst.activityId;
            }
            if (inst.transitionId !== undefined && inst.transitionId !== '') {
              instruction.transitionId = inst.transitionId;
            }
            if (inst.type === 'cancel' && inst.cancelCurrentActiveActivityInstances) {
              instruction.cancelCurrentActiveActivityInstances = true;
            }
            if (inst.variables !== undefined && inst.variables.length > 0) {
              instruction.variables = transformVariables(inst.variables);
            }
            return instruction;
          }),
        annotation: data.annotation !== '' ? data.annotation : 'Batch modified via Cockpit plugin',
      };

      if (instanceIds) {
        payload['processInstanceIds'] = instanceIds;
      } else if (query) {
        payload['processInstanceQuery'] = query;
      }

      await post(api, '/modification/executeAsync', {}, JSON.stringify(payload));

      setSuccessMessage(
        `Batch modification submitted successfully! The modification will be executed asynchronously. ` +
          `Check the batch operations view for progress.`
      );
    } catch (err) {
      console.error('Modification error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to execute batch modification: ${errorMessage}. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p>Loading process activities...</p>
        <p className="modify-form__meta-text">Process Definition ID: {processDefinitionId}</p>
      </div>
    );
  }

  if (error && activities.length === 0) {
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
          <h4>Batch Process Modification</h4>
          <p className="modify-form__description">
            Apply modification instructions to multiple process instances. Use dry-run mode to preview affected
            instances before executing.
          </p>
        </div>

        <h4>Instance Selection</h4>
        <div className="modify-form__section">
          <div className="modify-form__field">
            <label htmlFor="instanceSelectionMode">Select Instances By</label>
            <select
              id="instanceSelectionMode"
              {...methods.register('instanceSelectionMode')}
              className="modify-form__input"
            >
              <option value="all">All active instances of this definition</option>
              <option value="query">Query (filter by activity/state)</option>
              <option value="specific">Specific instance IDs</option>
            </select>
          </div>

          {instanceSelectionMode === 'specific' && (
            <div className="modify-form__field">
              <label htmlFor="specificInstanceIds">Instance IDs (comma-separated)</label>
              <textarea
                id="specificInstanceIds"
                {...methods.register('specificInstanceIds')}
                placeholder="instance-id-1, instance-id-2, instance-id-3"
                rows={3}
                className="modify-form__textarea"
              />
            </div>
          )}

          {instanceSelectionMode === 'query' && (
            <>
              <div className="modify-form__field">
                <label htmlFor="queryActivityId">Filter by Activity (optional)</label>
                <select id="queryActivityId" {...methods.register('queryActivityId')} className="modify-form__input">
                  <option value="">Any activity</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name ?? a.id} ({a.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modify-form__field">
                <label htmlFor="queryState">Instance State</label>
                <select id="queryState" {...methods.register('queryState')} className="modify-form__input">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="any">Any</option>
                </select>
              </div>
            </>
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

          {dryRunResult && (
            <div className="modify-form__dry-run-result">
              <h5>
                Found {dryRunResult.count} instance{dryRunResult.count !== 1 ? 's' : ''}
              </h5>
              {dryRunResult.instances.length > 0 && (
                <ul className="modify-form__instance-list">
                  {dryRunResult.instances.map(inst => (
                    <li key={inst.id}>
                      {inst.id} {inst.businessKey ? `(${inst.businessKey})` : ''}
                    </li>
                  ))}
                  {dryRunResult.count > 10 && <li>...and {dryRunResult.count - 10} more</li>}
                </ul>
              )}
            </div>
          )}
        </div>

        <h4>Modification Instructions</h4>

        {fields.map((field, index) => (
          <InstructionCard
            key={field.id}
            fieldId={field.id}
            index={index}
            showRemove={fields.length > 1}
            onRemove={() => {
              remove(index);
            }}
            activities={activities}
            sequenceFlows={sequenceFlows}
            activeInstances={[]}
            activityCounts={new Map()}
            cancelMethods={new Map()}
            setCancelMethods={() => {
              /* no-op for batch modification */
            }}
          />
        ))}

        <div className="modify-form__add-instruction">
          <FormButton
            variant="secondary"
            onClick={() => {
              append({ type: 'startBeforeActivity', activityId: '', variables: [] });
            }}
            minWidth={140}
          >
            Add Another Instruction
          </FormButton>
        </div>

        <ModifyFormOptions />

        <WarningBox>
          Batch modification is a powerful operation that affects multiple process instances simultaneously. Always use
          dry-run mode first to verify the affected instances. The operation will be executed asynchronously as a batch
          job.
        </WarningBox>

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <div className="modify-form__actions">
          <FormButton type="submit" disabled={isSubmitting} variant="primary" minWidth={160}>
            {isSubmitting ? 'Submitting...' : 'Execute Batch Modification'}
          </FormButton>
          <FormButton type="button" variant="secondary" onClick={handleReset} minWidth={100}>
            Reset
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
};

/**
 * Batch message correlation form component.
 * Allows correlating messages to multiple process instances.
 */
// eslint-disable-next-line max-lines-per-function -- Form with message correlation and instance selection
const BatchMessageForm: React.FC<Omit<DefinitionPluginParams, 'root'>> = ({ api, processDefinitionId }) => {
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
        instances: instances.slice(0, 10),
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
          <h4>Batch Message Correlation</h4>
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
                  {dryRunResult.count > 10 && <li>...and {dryRunResult.count - 10} more</li>}
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

/**
 * Batch signal broadcast form component.
 * Allows broadcasting signals to multiple process instances.
 */
// eslint-disable-next-line max-lines-per-function -- Form with signal broadcasting
const BatchSignalForm: React.FC<Omit<DefinitionPluginParams, 'root'>> = ({ api, processDefinitionId }) => {
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
        instances: instances.slice(0, 10),
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
        `Signal "${data.signalName}" broadcast successfully! All matching signal catch events have been triggered.`
      );
    } catch (err) {
      console.error('Signal broadcast error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to broadcast signal: ${errorMessage}. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h4>Broadcast Signal</h4>
          <p className="modify-form__description">
            Broadcast a signal event. The signal will be delivered to all matching signal catch events across all
            process instances.
          </p>
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
                Found {dryRunResult.count} active instance{dryRunResult.count !== 1 ? 's' : ''}
              </h5>
              {dryRunResult.instances.length > 0 && (
                <ul className="modify-form__instance-list">
                  {dryRunResult.instances.map(inst => (
                    <li key={inst.id}>
                      {inst.id} {inst.businessKey ? `(${inst.businessKey})` : ''}
                    </li>
                  ))}
                  {dryRunResult.count > 10 && <li>...and {dryRunResult.count - 10} more</li>}
                </ul>
              )}
            </div>
          )}
        </div>

        <h4>Variables</h4>
        <VariableBuilder name="processVariables" showLocalFlag={false} />

        <WarningBox>
          Signals are broadcast globally and will trigger all matching signal catch events across all process instances,
          not just this process definition. Use with caution in production environments.
        </WarningBox>

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

const DefinitionModifyTab: React.FC<Omit<DefinitionPluginParams, 'root'>> = props => {
  return (
    <Tabs>
      <Tab label="Batch Modify">
        <BatchModifyForm {...props} />
      </Tab>
      <Tab label="Message">
        <BatchMessageForm {...props} />
      </Tab>
      <Tab label="Signal">
        <BatchSignalForm {...props} />
      </Tab>
    </Tabs>
  );
};

export default [
  {
    id: 'definitionTabModify',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'Modify',
    },
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <DefinitionModifyTab api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
];
