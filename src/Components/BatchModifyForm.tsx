/**
 * Batch process modification form component.
 * Allows selecting multiple instances and applying modification instructions.
 *
 * @module
 */
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import InstructionCard from './InstructionCard';
import LoadingSpinner from './LoadingSpinner';
import ModifyFormOptions from './ModifyFormOptions';
import SuccessMessage from './SuccessMessage';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import { getBpmnElements, BpmnElement } from '../utils/bpmnParsing';
import { transformVariables as transformVariablesUtil, VariableInput } from '../utils/variables';

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

interface DryRunResult {
  count: number;
  instances: ProcessInstance[];
}

interface BatchModifyFormProps {
  api: API;
  processDefinitionId: string;
}

/**
 * Batch process modification form component.
 * Allows selecting multiple instances and applying modification instructions.
 */
// eslint-disable-next-line max-lines-per-function -- Form with complex batch modification, dry-run, and instance selection
const BatchModifyForm: React.FC<BatchModifyFormProps> = ({ api, processDefinitionId }) => {
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

  /**
   * Build the query object for instance selection
   */
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

  /**
   * Get specific instance IDs from form data
   */
  const getInstanceIds = (data: ModifyFormData): string[] | null => {
    if (data.instanceSelectionMode === 'specific') {
      return data.specificInstanceIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
    }
    return null;
  };

  /**
   * Run a dry-run query to show affected instances
   */
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
   * Submit the batch modification request
   */
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
          <p className="modify-form__description">
            Apply modification instructions to multiple process instances. Use dry-run mode to preview affected
            instances before executing.
          </p>
        </div>

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
                  {dryRunResult.count > MAX_PREVIEW_INSTANCES && (
                    <li>...and {dryRunResult.count - MAX_PREVIEW_INSTANCES} more</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

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

export default BatchModifyForm;
