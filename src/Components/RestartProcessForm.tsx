/**
 * Restart form for a finished process instance, shown in its history view.
 *
 * Like the modify forms, it only sends the request its user previewed and acknowledged.
 * The dry run also looks for an earlier restart of the same instance, and after the
 * restart the form navigates only to an instance the engine links back to this one.
 */

/* eslint-disable max-lines-per-function -- Form with loading, dry run and restart logic */
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import ConfirmSubmit from './ConfirmSubmit';
import DryRunResultPreview from './DryRunResultPreview';
import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import SearchableSelect from './SearchableSelect';
import SuccessMessage from './SuccessMessage';
import WarningBox from './WarningBox';
import { useGuardedSubmit } from '../hooks/useGuardedSubmit';
import { get, post } from '../utils/api';
import { getBpmnElements, type BpmnElement } from '../utils/bpmnParsing';
import { SUBMIT_FEEDBACK_DELAY_MS } from '../utils/constants';
import { buildProcessInstanceUrl, formatLabelWithId } from '../utils/formatting';
import { buildRestartRequest, RESTART_AT_DEFAULT_START, type RestartInput } from '../utils/instanceOperations';
import { tryBuild } from '../utils/submitGuard';
import type { API } from '../types';

/** How many recent instances the dry run searches for an earlier restart */
const EARLIER_RESTART_SEARCH_LIMIT = 50;

/** How many recent running instances are searched for the one just restarted */
const NEW_INSTANCE_SEARCH_LIMIT = 10;

/** Historic process instance fields the restart form reads */
interface HistoricInstanceLink {
  id: string;
  restartedProcessInstanceId?: string | null;
}

interface RestartProcessFormProps {
  api: API;
  processDefinitionId: string;
  /** The finished instance to restart. */
  processInstanceId: string;
  /** State of the instance (e.g. EXTERNALLY_TERMINATED). Used to derive termination type. */
  processInstanceState?: string;
  /** Business key of the instance, used to narrow the search for its restarts. */
  processInstanceBusinessKey?: string | null;
}

/**
 * Whether a finished instance completed normally rather than being terminated.
 * @param state - The state string from the API
 * @returns True unless the state says the instance was terminated
 */
function isCompletedNormally(state: string): boolean {
  return !state.includes('TERMINATED');
}

/**
 * Find recent instances the engine records as restarts of the given one.
 * @param api - The API configuration
 * @param params - Query parameters narrowing the search
 * @param processInstanceId - The restarted instance
 * @returns The ids of the matching instances, newest first
 */
async function findRestartsOf(api: API, params: Record<string, string>, processInstanceId: string): Promise<string[]> {
  const instances = (await get(api, '/history/process-instance', {
    sortBy: 'startTime',
    sortOrder: 'desc',
    ...params,
  })) as HistoricInstanceLink[];
  return instances.filter(inst => inst.restartedProcessInstanceId === processInstanceId).map(inst => inst.id);
}

/**
 * Form for restarting one finished process instance.
 */
const RestartProcessForm: React.FC<RestartProcessFormProps> = ({
  api,
  processDefinitionId,
  processInstanceId,
  processInstanceState,
  processInstanceBusinessKey,
}) => {
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [earlierRestarts, setEarlierRestarts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDryRun, setIsDryRun] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const methods = useForm<RestartInput>({
    defaultValues: { startActivityId: '', skipCustomListeners: false, skipIoMappings: false },
  });
  const { control, handleSubmit, register, watch } = methods;

  const formValues = watch();
  const guard = useGuardedSubmit(
    tryBuild(() => buildRestartRequest(formValues, processDefinitionId, processInstanceId))
  );

  const isCompleted = isCompletedNormally(processInstanceState ?? '');
  const searchParams: Record<string, string> = { processDefinitionId };
  if (processInstanceBusinessKey) {
    searchParams['processInstanceBusinessKey'] = processInstanceBusinessKey;
  }

  useEffect(() => {
    const loadActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const { activities: bpmnActivities } = await getBpmnElements(processDefinitionId, api);
        setActivities(bpmnActivities);
      } catch (err) {
        console.error('Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadActivities();
  }, [api, processDefinitionId]);

  /**
   * Show the request, look for earlier restarts, and arm the submit for that request.
   */
  const runDryRun = async (data: RestartInput): Promise<void> => {
    try {
      setIsDryRun(true);
      setError(null);
      setSuccess(null);
      setEarlierRestarts([]);
      guard.clearPreview();

      const request = buildRestartRequest(data, processDefinitionId, processInstanceId);
      if (!request) {
        setError('Please choose where the restarted instance starts.');
        return;
      }

      const restarts = await findRestartsOf(
        api,
        { ...searchParams, maxResults: String(EARLIER_RESTART_SEARCH_LIMIT) },
        processInstanceId
      );
      setEarlierRestarts(restarts);
      guard.markPreviewed(request);
    } catch (err) {
      console.error('Dry run error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to prepare the restart: ${errorMessage}`);
    } finally {
      setIsDryRun(false);
    }
  };

  /**
   * Send the previewed restart, then open the instance it created.
   */
  const onSubmit = async (): Promise<void> => {
    try {
      setError(null);
      setSuccess(null);
      await guard.submit(async request => {
        await post(api, request.path, {}, JSON.stringify(request.payload));

        // The engine links the new instance back to this one; never guess by recency alone.
        const [newInstanceId] = await findRestartsOf(
          api,
          { ...searchParams, unfinished: 'true', maxResults: String(NEW_INSTANCE_SEARCH_LIMIT) },
          processInstanceId
        );
        if (newInstanceId === undefined) {
          setSuccess('Process instance restarted successfully!');
          return;
        }
        setSuccess('Process instance restarted successfully! Navigating to runtime view...');
        setIsNavigating(true);
        setTimeout(() => {
          window.location.href = buildProcessInstanceUrl(window.location.href, newInstanceId);
        }, SUBMIT_FEEDBACK_DELAY_MS);
      });
    } catch (err) {
      console.error('Restart error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to restart process instance: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <div className="modify-form__loading">Loading activities...</div>;
  }

  const acknowledgements = [
    isCompleted
      ? 'I acknowledge that this process completed normally and understand that restarting it may have unintended side effects.'
      : 'I understand this starts a new process instance from the history of this one.',
  ];
  if (earlierRestarts.length > 0) {
    acknowledgements.push('I understand it has already been restarted before.');
  }

  const startOptions = [
    { value: RESTART_AT_DEFAULT_START, label: 'Default start event' },
    ...activities.map(act => ({ value: act.id, label: formatLabelWithId(act.name, act.id) })),
  ];

  return (
    <FormProvider {...methods}>
      <form
        className="modify-form"
        onSubmit={e => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
      >
        <h4>Restart Process Instance</h4>
        <p>Choose where the restarted instance starts. It gets the last variables and the business key of this one.</p>

        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label htmlFor="restart-activity-select">Start At: </label>
          <Controller
            name="startActivityId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                id="restart-activity-select"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                options={startOptions}
                placeholder="-- Select Starting Point --"
                style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
              />
            )}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" {...register('skipCustomListeners')} /> Skip Custom Listeners
          </label>
          <br />
          <label>
            <input type="checkbox" {...register('skipIoMappings')} /> Skip I/O Mappings
          </label>
        </div>

        <div className="modify-form__actions">
          <FormButton
            type="button"
            variant="secondary"
            onClick={() => {
              void handleSubmit(runDryRun)();
            }}
            disabled={isDryRun || isNavigating}
            minWidth={120}
          >
            {isDryRun ? 'Checking...' : 'Dry Run'}
          </FormButton>
        </div>

        <DryRunResultPreview request={guard.previewedRequest} />

        {earlierRestarts.length > 0 && (
          <WarningBox title="Already restarted">
            This instance has already been restarted as {earlierRestarts.join(', ')}. Restarting it again starts another
            instance.
          </WarningBox>
        )}

        <WarningBox>
          Restarting a process instance will create a new execution context. For completed processes, this may cause
          duplicate operations or side effects. Ensure the selected starting activity is appropriate for the process
          state.
        </WarningBox>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <ConfirmSubmit
          guard={guard}
          submitLabel="Restart Instance"
          submittingLabel="Restarting..."
          acknowledgement={acknowledgements.join(' ')}
        />
      </form>
    </FormProvider>
  );
};

export default RestartProcessForm;
