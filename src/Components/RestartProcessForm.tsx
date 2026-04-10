/**
 * Restart Terminated Process Form Component
 *
 * Allows restarting externally terminated process instances from a process definition.
 * Based on the Jupyter notebook example in TODO-restart-terminated-process.ipynb.
 */

/* eslint-disable max-lines-per-function -- Form with complex data loading and restart logic */
import React, { useEffect, useState } from 'react';

import ErrorMessage from './ErrorMessage';
import FormButton from './FormButton';
import SelectField from './SelectField';
import SuccessMessage from './SuccessMessage';
import WarningBox from './WarningBox';
import { get, post } from '../utils/api';
import { getBpmnElements, type BpmnElement } from '../utils/bpmnParsing';
import { SUBMIT_FEEDBACK_DELAY_MS } from '../utils/constants';
import { buildProcessInstanceUrl } from '../utils/formatting';
import type { API } from '../types';

/** Historic process instance from API */
interface HistoricProcessInstance {
  id: string;
  businessKey: string | null;
  endTime: string;
  processDefinitionId: string;
  state: string;
  /** Termination type: 'external', 'internal', or 'completed' */
  terminationType?: 'external' | 'internal' | 'completed';
}

interface RestartProcessFormProps {
  api: API;
  processDefinitionId: string;
  /** When provided, skip instance selection and restart this specific instance. */
  processInstanceId?: string;
  /** State of the specific instance (e.g. EXTERNALLY_TERMINATED). Used to derive termination type. */
  processInstanceState?: string;
  /** Business key of the specific instance, used to locate the new instance after restart. */
  processInstanceBusinessKey?: string | null;
}

/**
 * Derive termination type from process instance state string.
 * @param state - The state string from the API
 * @returns The termination type category
 */
function deriveTerminationType(state: string): 'external' | 'internal' | 'completed' {
  if (state.includes('EXTERNALLY_TERMINATED')) return 'external';
  if (state.includes('INTERNALLY_TERMINATED')) return 'internal';
  return 'completed';
}

/**
 * Form for restarting terminated process instances.
 * When processInstanceId is provided, restarts that specific instance directly.
 * Otherwise fetches terminated instances for the definition and allows selecting one.
 */
const RestartProcessForm: React.FC<RestartProcessFormProps> = ({
  api,
  processDefinitionId,
  processInstanceId,
  processInstanceState,
  processInstanceBusinessKey,
}) => {
  const isSingleInstanceMode = processInstanceId !== undefined;
  const [terminatedInstances, setTerminatedInstances] = useState<HistoricProcessInstance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<HistoricProcessInstance | null>(null);
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [isAcknowledgeCompleted, setIsAcknowledgeCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Load BPMN activities (always needed)
        const { activities: bpmnActivities } = await getBpmnElements(processDefinitionId, api);
        setActivities(bpmnActivities);
        if (bpmnActivities.length > 0 && bpmnActivities[0]) {
          setSelectedActivity(bpmnActivities[0].id);
        }

        if (isSingleInstanceMode) {
          // Use the specific instance passed in via props — no list fetch needed
          const terminationType = deriveTerminationType(processInstanceState ?? '');
          setSelectedInstance({
            id: processInstanceId,
            businessKey: processInstanceBusinessKey ?? null,
            endTime: '',
            processDefinitionId,
            state: processInstanceState ?? '',
            terminationType,
          });
        } else {
          // Get process definition to extract key
          const processDefResponse = await get(api, `/process-definition/${processDefinitionId}`);
          const processDefinition = processDefResponse as { key?: string; id: string } | null;
          if (!processDefinition?.key) {
            throw new Error('Could not determine process definition key');
          }

          // Fetch externally terminated, internally terminated, AND completed instances for this process definition
          const [externallyTerminatedResponse, internallyTerminatedResponse, completedResponse] = await Promise.all([
            get(api, '/history/process-instance', {
              processDefinitionKey: processDefinition.key,
              externallyTerminated: 'true',
            }),
            get(api, '/history/process-instance', {
              processDefinitionKey: processDefinition.key,
              internallyTerminated: 'true',
            }),
            get(api, '/history/process-instance', {
              processDefinitionKey: processDefinition.key,
              completed: 'true',
            }),
          ]);
          const externallyTerminated = (externallyTerminatedResponse as HistoricProcessInstance[]).map(inst => ({
            ...inst,
            terminationType: 'external' as const,
          }));
          const internallyTerminated = (internallyTerminatedResponse as HistoricProcessInstance[]).map(inst => ({
            ...inst,
            terminationType: 'internal' as const,
          }));
          const completed = (completedResponse as HistoricProcessInstance[]).filter(
            inst => !inst.state.includes('TERMINATED')
          ).map(inst => ({
            ...inst,
            terminationType: 'completed' as const,
          }));
          // Combine and sort by endTime (most recent first)
          const allInstances = [...externallyTerminated, ...internallyTerminated, ...completed].sort((a, b) => {
            const aTime = a.endTime ? new Date(a.endTime).getTime() : 0;
            const bTime = b.endTime ? new Date(b.endTime).getTime() : 0;
            return bTime - aTime;
          });
          setTerminatedInstances(allInstances);
          if (allInstances.length > 0 && allInstances[0]) {
            setSelectedInstance(allInstances[0]);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [api, processDefinitionId]);

  /**
   * Handle restart submission
   */
  const handleRestart = async (): Promise<void> => {
    if (!selectedInstance || !selectedActivity) {
      setError('Please select an instance and starting activity');
      return;
    }

    // Require acknowledgment for completed processes (not terminated ones)
    if (selectedInstance.terminationType === 'completed' && !isAcknowledgeCompleted) {
      setError('Please acknowledge that this process completed normally before restarting');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // POST to /process-definition/{id}/restart with instructions
      await post(
        api,
        `/process-definition/${selectedInstance.processDefinitionId}/restart`,
        {},
        JSON.stringify({
          processInstanceIds: [selectedInstance.id],
          instructions: [{ type: 'startBeforeActivity', activityId: selectedActivity }],
        })
      );

      // Query for the newly created process instance using history endpoint
      // The restart creates a new instance with the same business key (if present)
      // Use history endpoint to sort by startTime (most recent first)
      const queryBody: {
        processDefinitionId: string;
        unfinished: boolean;
        sorting: { sortBy: string; sortOrder: string }[];
        processInstanceBusinessKey?: string;
      } = {
        processDefinitionId: selectedInstance.processDefinitionId,
        unfinished: true,
        sorting: [{ sortBy: 'startTime', sortOrder: 'desc' }],
      };

      // If the terminated instance had a business key, use it to find the new instance
      if (selectedInstance.businessKey) {
        queryBody.processInstanceBusinessKey = selectedInstance.businessKey;
      }

      const newInstances = (await post(
        api,
        '/history/process-instance?maxResults=1',
        {},
        JSON.stringify(queryBody)
      )) as HistoricProcessInstance[];

      if (newInstances.length > 0 && newInstances[0]) {
        const newInstanceId = newInstances[0].id;
        setSuccess('Process instance restarted successfully! Navigating to runtime view...');

        // Navigate to the runtime view of the new instance after delay
        setTimeout(() => {
          const runtimeUrl = buildProcessInstanceUrl(window.location.href, newInstanceId);
          window.location.href = runtimeUrl;
        }, SUBMIT_FEEDBACK_DELAY_MS);
      } else {
        // Fallback: If we can't find the new instance, show a generic success message
        setSuccess('Process instance restarted successfully!');
      }
    } catch (err) {
      console.error('Restart error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to restart process instance: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="modify-form__loading">{isSingleInstanceMode ? 'Loading activities...' : 'Loading terminated instances and activities...'}</div>;
  }

  if (!isSingleInstanceMode && terminatedInstances.length === 0) {
    return (
      <div className="modify-form__info">
        <p>No terminated or completed process instances found for this process definition.</p>
        <p>
          Externally terminated, internally terminated, and normally completed process instances can be restarted from this view.
        </p>
      </div>
    );
  }

  return (
    <div className="modify-form">
      <h4>Restart Process Instance</h4>
      <p>Select a terminated or completed instance and the activity to restart from.</p>

      {!isSingleInstanceMode && (
        <div className="form-group">
          <SelectField
            label="Terminated or Completed Instance"
            value={selectedInstance ? selectedInstance.id : ''}
            onChange={value => {
              const instance = terminatedInstances.find(i => i.id === value);
              setSelectedInstance(instance ?? null);
              // Reset acknowledge checkbox when changing instances
              setIsAcknowledgeCompleted(false);
            }}
            options={terminatedInstances.map(inst => {
              const statusLabel =
                inst.terminationType === 'external'
                  ? 'EXTERNALLY TERMINATED'
                  : inst.terminationType === 'internal'
                    ? 'INTERNALLY TERMINATED'
                    : 'COMPLETED';
              const baseLabel = inst.businessKey ?? inst.id;
              const endTimeStr = inst.endTime ? new Date(inst.endTime).toLocaleString() : 'N/A';
              return {
                value: inst.id,
                label: `[${statusLabel}] ${baseLabel} (ended ${endTimeStr})`,
              };
            })}
          />
        </div>
      )}

      <div className="form-group">
        <SelectField
          label="Starting Activity"
          value={selectedActivity}
          onChange={value => {
            setSelectedActivity(value);
          }}
          options={activities.map(act => ({
            value: act.id,
            label: act.name ? `${act.name} (${act.id})` : act.id,
          }))}
        />
      </div>

      {selectedInstance?.terminationType === 'completed' && (
        <div className="form-group" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isAcknowledgeCompleted}
              onChange={e => {
                setIsAcknowledgeCompleted(e.target.checked);
              }}
              style={{ cursor: 'pointer' }}
            />
            <span>I acknowledge that this process completed normally and understand that restarting it may have unintended side effects.</span>
          </label>
        </div>
      )}

      <WarningBox>
        Restarting a process instance will create a new execution context. For completed processes, this may cause
        duplicate operations or side effects. Ensure the selected starting activity is appropriate for the process state.
      </WarningBox>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <FormButton
        variant="primary"
        onClick={() => void handleRestart()}
        disabled={
          isSubmitting ||
          !selectedInstance ||
          (selectedInstance.terminationType === 'completed' && !isAcknowledgeCompleted)
        }
        minWidth={160}
      >
        {isSubmitting ? 'Restarting...' : 'Restart Instance'}
      </FormButton>
    </div>
  );
};

export default RestartProcessForm;
