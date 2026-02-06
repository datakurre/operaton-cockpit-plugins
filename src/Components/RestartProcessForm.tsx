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
}

interface RestartProcessFormProps {
  api: API;
  processDefinitionId: string;
}

/**
 * Form for restarting terminated process instances.
 * Fetches terminated instances and allows selecting one to restart from a specific activity.
 */
const RestartProcessForm: React.FC<RestartProcessFormProps> = ({ api, processDefinitionId }) => {
  const [terminatedInstances, setTerminatedInstances] = useState<HistoricProcessInstance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<HistoricProcessInstance | null>(null);
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load terminated instances and BPMN activities on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Get process definition to extract key
        const processDefResponse = await get(api, `/process-definition/${processDefinitionId}`);
        const processDefinition = processDefResponse as { key?: string; id: string } | null;
        if (!processDefinition?.key) {
          throw new Error('Could not determine process definition key');
        }

        // Fetch externally terminated instances for this process definition
        const terminatedResponse = await get(api, '/history/process-instance', {
          processDefinitionKey: processDefinition.key,
          externallyTerminated: 'true',
        });
        const terminated = (terminatedResponse as HistoricProcessInstance[]) ?? [];
        setTerminatedInstances(terminated);

        // Load BPMN XML to get available activities
        const { activities: bpmnActivities } = await getBpmnElements(processDefinitionId, api);
        setActivities(bpmnActivities);

        // Auto-select first instance and activity if available
        if (terminated.length > 0 && terminated[0]) {
          setSelectedInstance(terminated[0]);
        }
        if (bpmnActivities.length > 0 && bpmnActivities[0]) {
          setSelectedActivity(bpmnActivities[0].id);
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
    return <div className="modify-form__loading">Loading terminated instances and activities...</div>;
  }

  if (terminatedInstances.length === 0) {
    return (
      <div className="modify-form__info">
        <p>No externally terminated process instances found for this process definition.</p>
        <p>
          Process instances must be terminated externally (e.g., via API or external task failure) to appear here for
          restart.
        </p>
      </div>
    );
  }

  return (
    <div className="modify-form">
      <h4>Restart Terminated Process Instance</h4>
      <p>Select a terminated instance and the activity to restart from.</p>

      <div className="form-group">
        <SelectField
          label="Terminated Instance"
          value={selectedInstance ? selectedInstance.id : ''}
          onChange={value => {
            const instance = terminatedInstances.find(i => i.id === value);
            setSelectedInstance(instance || null);
          }}
          options={terminatedInstances.map(inst => ({
            value: inst.id,
            label: inst.businessKey
              ? `${inst.businessKey} (ended ${inst.endTime})`
              : `${inst.id} (ended ${inst.endTime})`,
          }))}
        />
      </div>

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

      <WarningBox>
        Restarting a process instance will create a new execution context. Ensure the selected starting activity is
        appropriate for the process state.
      </WarningBox>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <FormButton
        variant="primary"
        onClick={() => void handleRestart()}
        disabled={isSubmitting || !selectedInstance}
        minWidth={160}
      >
        {isSubmitting ? 'Restarting...' : 'Restart Instance'}
      </FormButton>
    </div>
  );
};

export default RestartProcessForm;
