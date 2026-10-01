// Styles
import './instance-tab-modify.scss';

// React
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

// Local components
import ConfirmSubmit from './Components/ConfirmSubmit';
import DryRunResultPreview from './Components/DryRunResultPreview';
import ErrorMessage from './Components/ErrorMessage';
import FormButton from './Components/FormButton';
import InstructionCard from './Components/InstructionCard';
import MessageCorrelationForm from './Components/MessageCorrelationForm';
import ModifyFormOptions from './Components/ModifyFormOptions';
import SuccessMessage from './Components/SuccessMessage';
import { Tabs, Tab } from './Components/Tabs';
import WarningBox from './Components/WarningBox';

// Local hooks and utilities
import { useGuardedSubmit } from './hooks/useGuardedSubmit';
import { get, post } from './utils/api';
import { reloadAngularRoute } from './utils/angular';
import { getBpmnElements, BpmnElement } from './utils/bpmnParsing';
import { SUBMIT_FEEDBACK_DELAY_MS } from './utils/constants';
import { buildInstanceModificationRequest, type InstanceModificationInput } from './utils/instanceOperations';
import { tryBuild } from './utils/submitGuard';

// Types
import type { ActivityInstance, InstancePluginParams } from './types';
import type { ActiveActivityInstance } from './Components/InstructionFields';

type ModifyFormData = InstanceModificationInput;

/**
 * Flatten the runtime activity-instance tree into the selectable instances.
 * @param tree - Runtime activity-instance tree returned by the engine
 * @returns Activity instances accepted by modification instructions
 */
function collectActiveActivityInstances(tree: ActivityInstance): ActiveActivityInstance[] {
  const instances: ActiveActivityInstance[] = [];
  const visit = (activityInstance: ActivityInstance): void => {
    if (activityInstance.id && activityInstance.activityId) {
      const instance: ActiveActivityInstance = {
        id: activityInstance.id,
        activityId: activityInstance.activityId,
      };
      const activityName = activityInstance.activityName ?? activityInstance.name;
      if (activityName !== null && activityName !== undefined) {
        instance.activityName = activityName;
      }
      if (
        activityInstance.parentActivityInstanceId !== null &&
        activityInstance.parentActivityInstanceId !== undefined
      ) {
        instance.parentActivityInstanceId = activityInstance.parentActivityInstanceId;
      }
      instances.push(instance);
    }
    activityInstance.childActivityInstances?.forEach(visit);
  };

  visit(tree);
  return instances;
}

/**
 * Process modification form component.
 * Allows adding/removing modification instructions and submitting to the API.
 */
// eslint-disable-next-line max-lines-per-function -- Form with complex instruction builder and validation logic
const ModifyForm: React.FC<InstancePluginParams> = ({ api, processInstanceId, processDefinitionId, processData }) => {
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [sequenceFlows, setSequenceFlows] = useState<BpmnElement[]>([]);
  const [activeInstances, setActiveInstances] = useState<ActiveActivityInstance[]>([]);
  const [activityCounts, setActivityCounts] = useState<Map<string, number>>(new Map());
  const [cancelMethods, setCancelMethods] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actualProcessDefId, setActualProcessDefId] = useState<string | null>(null);

  const methods = useForm<ModifyFormData>({
    defaultValues: {
      instructions: [{ type: 'startBeforeActivity', activityId: '', variables: [] }],
      annotation: '',
      skipCustomListeners: false,
      skipIoMappings: false,
    },
  });

  const { control, handleSubmit, watch } = methods;

  const formValues = watch();
  const guard = useGuardedSubmit(tryBuild(() => buildInstanceModificationRequest(formValues, processInstanceId)));

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    const loadActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        let defId: string | undefined =
          processDefinitionId ?? processData?.definitionId ?? processData?.processDefinitionId;
        if (defId === undefined || defId === '') {
          const instanceData = (await get(api, `/process-instance/${processInstanceId}`)) as {
            definitionId?: string;
          } | null;
          defId = instanceData?.definitionId;
        }
        if (defId === undefined || defId === '') {
          throw new Error('Could not determine process definition ID');
        }
        setActualProcessDefId(defId);

        const { activities, sequenceFlows } = await getBpmnElements(defId, api);
        setActivities(activities);
        setSequenceFlows(sequenceFlows);

        const activityInstanceTree = (await get(
          api,
          `/process-instance/${processInstanceId}/activity-instances`
        )) as ActivityInstance;
        const allActiveInstances = collectActiveActivityInstances(activityInstanceTree);

        const counts = new Map<string, number>();
        allActiveInstances.forEach(inst => {
          counts.set(inst.activityId, (counts.get(inst.activityId) ?? 0) + 1);
        });

        setActiveInstances(allActiveInstances);
        setActivityCounts(counts);
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
  }, [api, processInstanceId, processDefinitionId, processData]);

  /**
   * Show the request a real run would send, and arm the submit for exactly that request.
   */
  const runDryRun = (data: ModifyFormData): void => {
    setError(null);
    setSuccessMessage(null);
    guard.clearPreview();
    const request = buildInstanceModificationRequest(data, processInstanceId);
    if (!request) {
      setError('Please complete at least one instruction.');
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
        setSuccessMessage('Process instance modified successfully! The page will refresh to show updates.');
        // The sent preview is cleared; keep the dry run disabled too until the view reloads.
        setIsReloading(true);
        setTimeout(() => {
          reloadAngularRoute();
        }, SUBMIT_FEEDBACK_DELAY_MS);
      });
    } catch (err) {
      console.error('Modification error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to modify process instance: ${errorMessage}. Check console for details.`);
    }
  };

  if (isLoading) {
    return (
      <div className="modify-form__loading">
        <p>Loading process activities...</p>
        <p className="modify-form__meta-text">Process Instance ID: {processInstanceId}</p>
        <p className="modify-form__meta-text">Process Definition ID: {actualProcessDefId ?? 'fetching...'}</p>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="modify-form__error">
        <strong>Error:</strong> {error}
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
            activeInstances={activeInstances}
            activityCounts={activityCounts}
            cancelMethods={cancelMethods}
            setCancelMethods={setCancelMethods}
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

        <div className="modify-form__actions">
          <FormButton
            type="button"
            variant="secondary"
            onClick={() => {
              void handleSubmit(runDryRun)();
            }}
            disabled={isReloading}
            minWidth={120}
          >
            Dry Run
          </FormButton>
        </div>

        <DryRunResultPreview request={guard.previewedRequest} />

        <WarningBox>
          Process instance modification is a powerful operation that can lead to inconsistent process states. Use with
          extreme care and only if you understand the consequences.
        </WarningBox>

        {error !== null && <ErrorMessage message={error} />}
        {successMessage !== null && <SuccessMessage message={successMessage} />}

        <ConfirmSubmit guard={guard} submitLabel="Apply Modifications" submittingLabel="Modifying..." />
      </form>
    </FormProvider>
  );
};

const ModifyTab: React.FC<InstancePluginParams> = props => {
  return (
    <Tabs>
      <Tab label="Modify Instance">
        <ModifyForm {...props} />
      </Tab>
      <Tab label="Correlate Message">
        <MessageCorrelationForm {...props} />
      </Tab>
    </Tabs>
  );
};

export default [
  {
    id: 'instanceTabModify',
    pluginPoint: 'cockpit.processInstance.runtime.tab',
    properties: {
      label: 'Modify',
    },
    render: (node: Element, { api, processInstanceId, processData }: InstancePluginParams): void => {
      // Get the process definition ID from processData
      const processDefinitionId = processData?.definitionId ?? processData?.processDefinitionId ?? '';
      const safeProcessData = processData ?? { id: processInstanceId };

      createRoot(node).render(
        <React.StrictMode>
          <ModifyTab
            api={api}
            processInstanceId={processInstanceId}
            processDefinitionId={processDefinitionId}
            processData={safeProcessData}
          />
        </React.StrictMode>
      );
    },
  },
];
