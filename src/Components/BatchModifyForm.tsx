/**
 * Batch process modification form component.
 * Allows selecting multiple instances and applying modification instructions.
 *
 * @module
 */
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import ConfirmSubmit from './ConfirmSubmit';
import DryRunResultPreview, { type DryRunResult } from './DryRunResultPreview';
import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import InstanceSelectionFields from './InstanceSelectionFields';
import InstructionCard from './InstructionCard';
import LoadingSpinner from './LoadingSpinner';
import ModifyFormOptions from './ModifyFormOptions';
import SuccessMessage from './SuccessMessage';
import WarningBox from './WarningBox';
import { useGuardedSubmit } from '../hooks/useGuardedSubmit';
import type { API } from '../types';
import { post } from '../utils/api';
import { buildModificationRequest, type ModificationRequestInput } from '../utils/batchOperations';
import { getBpmnElements, BpmnElement } from '../utils/bpmnParsing';
import { describeLookupProblem, lookupTargetInstances } from '../utils/instanceLookup';
import { tryBuild } from '../utils/submitGuard';
import { createHistoryService } from '../services/HistoryService';

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
  const [activityCounts, setActivityCounts] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
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

  const { control, handleSubmit, reset, watch } = methods;

  const formValues = watch();
  const guard = useGuardedSubmit(tryBuild(() => buildModificationRequest(formValues, processDefinitionId)));

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

        // Non-fatal: this only feeds the "cancel all instances of activity" picker's
        // per-activity counts. A failure here shouldn't block the rest of the form.
        try {
          const stats = await createHistoryService(api).getActivityStatistics(processDefinitionId);
          const counts = new Map<string, number>();
          for (const stat of stats) {
            if (stat.id !== undefined && stat.instances !== undefined) {
              counts.set(stat.id, stat.instances);
            }
          }
          setActivityCounts(counts);
        } catch (statsErr) {
          console.error('Error loading activity statistics:', statsErr);
        }
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
   * run would send. Only a dry run that found every targeted instance arms the submit.
   */
  const runDryRun = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setSuccessMessage(null);
      setDryRunResult(null);
      guard.clearPreview();

      const request = buildModificationRequest(data, processDefinitionId);
      if (!request) {
        setError('Please select instances to modify.');
        return;
      }

      const lookup = await lookupTargetInstances(api, data, processDefinitionId);
      setDryRunResult({
        count: lookup.instances.length,
        instances: lookup.instances.slice(0, MAX_PREVIEW_INSTANCES),
      });

      const problem = describeLookupProblem(lookup);
      if (problem !== null) {
        setError(problem);
        return;
      }
      guard.markPreviewed(request, lookup.instances.length);
    } catch (err) {
      console.error('Dry run error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to query instances: ${errorMessage}. Check console for details.`);
    } finally {
      setIsDryRun(false);
    }
  };

  /**
   * Submit the previewed batch modification request
   */
  const onSubmit = async (): Promise<void> => {
    try {
      setError(null);
      setSuccessMessage(null);
      await guard.submit(async request => {
        await post(api, request.path, {}, JSON.stringify(request.payload));
        setDryRunResult(null);
        setSuccessMessage(
          `Batch modification submitted successfully! The modification will be executed asynchronously. ` +
            `Check the batch operations view for progress.`
        );
      });
    } catch (err) {
      console.error('Modification error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to execute batch modification: ${errorMessage}. Check console for details.`);
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
    guard.clearPreview();
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

          <DryRunResultPreview
            result={dryRunResult}
            request={guard.previewedRequest}
            maxInstances={MAX_PREVIEW_INSTANCES}
          />
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
            activityCounts={activityCounts}
            cancelMethods={new Map()}
            setCancelMethods={() => {
              /* no-op for batch modification */
            }}
            showVariables={false}
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
          Batch modification is a powerful operation that affects multiple process instances simultaneously. Run the dry
          run first to review the affected instances and the request; submit stays disabled until you have. The
          operation will be executed asynchronously as a batch job. Batches that only cancel are refused, because they
          can end every targeted instance.
        </WarningBox>

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <ConfirmSubmit guard={guard} submitLabel="Execute Batch Modification" submittingLabel="Submitting...">
          <FormButton type="button" variant="secondary" onClick={handleReset} minWidth={100}>
            Reset
          </FormButton>
        </ConfirmSubmit>
      </form>
    </FormProvider>
  );
};

export default BatchModifyForm;
