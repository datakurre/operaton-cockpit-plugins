/**
 * Batch process modification form component.
 * Allows selecting multiple instances and applying modification instructions.
 *
 * @module
 */
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import DryRunResultPreview, { type DryRunResult } from './DryRunResultPreview';
import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import InstanceSelectionFields from './InstanceSelectionFields';
import InstructionCard from './InstructionCard';
import LoadingSpinner from './LoadingSpinner';
import ModifyFormOptions from './ModifyFormOptions';
import SuccessMessage from './SuccessMessage';
import WarningBox from './WarningBox';
import type { API } from '../types';
import { ProcessInstance } from '../types';
import { get, post } from '../utils/api';
import {
  buildInstanceLookupParams,
  buildModificationRequest,
  type BatchRequest,
  type ModificationRequestInput,
} from '../utils/batchOperations';
import { getBpmnElements, BpmnElement } from '../utils/bpmnParsing';

/** Maximum number of instances to show in dry-run preview */
const MAX_PREVIEW_INSTANCES = 10;

type ModifyFormData = ModificationRequestInput;

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
  const [dryRunRequest, setDryRunRequest] = useState<BatchRequest | null>(null);

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

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions',
  });

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

  /**
   * Run a dry run: read back the targeted instances and show the request that a real
   * run would send. Both use the same builders as onSubmit, so the preview cannot drift
   * from what is actually posted.
   */
  const runDryRun = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildModificationRequest(data, processDefinitionId);
      if (!request) {
        setError('Please select instances to modify.');
        return;
      }
      setDryRunRequest(request);

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
   * Submit the batch modification request
   */
  const onSubmit = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);
      setDryRunRequest(null);

      const request = buildModificationRequest(data, processDefinitionId);
      if (!request) {
        setError('Please select instances to modify.');
        setIsSubmitting(false);
        return;
      }

      await post(api, request.path, {}, JSON.stringify(request.payload));

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
    setDryRunRequest(null);
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
            Apply modification instructions to multiple process instances. Use dry run to see which instances would be
            affected and the exact request that would be sent.
          </p>
        </div>

        <div className="modify-form__section">
          <InstanceSelectionFields activities={activities} />

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

          <DryRunResultPreview result={dryRunResult} request={dryRunRequest} maxInstances={MAX_PREVIEW_INSTANCES} />
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
