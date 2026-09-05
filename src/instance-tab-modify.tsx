// Styles
import './instance-tab-modify.scss';

// React
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

// Local components
import ErrorMessage from './Components/ErrorMessage';
import FormButton from './Components/FormButton';
import InstructionCard from './Components/InstructionCard';
import MessageCorrelationForm from './Components/MessageCorrelationForm';
import ModifyFormOptions from './Components/ModifyFormOptions';
import SuccessMessage from './Components/SuccessMessage';
import { Tabs, Tab } from './Components/Tabs';
import WarningBox from './Components/WarningBox';

// Local utilities
import { get, post } from './utils/api';
import { reloadAngularRoute } from './utils/angular';
import { getBpmnElements, BpmnElement } from './utils/bpmnParsing';
import { SUBMIT_FEEDBACK_DELAY_MS } from './utils/constants';
import { transformVariables as transformVariablesUtil, VariableInput } from './utils/variables';

// Types
import { InstancePluginParams } from './types';
import type { ActiveActivityInstance } from './Components/InstructionFields';

interface ModificationInstruction {
  type: 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: VariableInput[];
}

/** Type for the modification instruction payload to API */
interface ModificationInstructionPayload {
  type: string;
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: Record<string, { value: unknown; type: string }>;
}

interface ModifyFormData {
  instructions: ModificationInstruction[];
  annotation: string;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
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
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const { control, handleSubmit } = methods;

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

        const unfinishedActivityInstances = (await get(api, '/history/activity-instance', {
          processInstanceId,
          unfinished: 'true',
        })) as {
          id: string;
          activityId: string;
          activityName?: string | null;
          parentActivityInstanceId?: string | null;
        }[];

        const allActiveInstances: ActiveActivityInstance[] = unfinishedActivityInstances.map(inst => {
          const result: ActiveActivityInstance = {
            id: inst.id,
            activityId: inst.activityId,
          };
          if (inst.activityName !== null && inst.activityName !== undefined) {
            result.activityName = inst.activityName;
          }
          if (inst.parentActivityInstanceId !== null && inst.parentActivityInstanceId !== undefined) {
            result.parentActivityInstanceId = inst.parentActivityInstanceId;
          }
          return result;
        });

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

  const transformVariables = (vars: VariableInput[]): Record<string, { value: unknown; type: string }> =>
    transformVariablesUtil(vars, true);

  const onSubmit = async (data: ModifyFormData): Promise<void> => {
    try {
      setIsSubmitted(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        skipCustomListeners: data.skipCustomListeners,
        skipIoMappings: data.skipIoMappings,
        instructions: data.instructions
          .filter(inst => {
            if (inst.type === 'startTransition') {
              return inst.transitionId !== undefined && inst.transitionId !== '';
            } else if (inst.type === 'cancel') {
              return (
                (inst.activityInstanceId !== undefined && inst.activityInstanceId !== '') ||
                (inst.activityId !== undefined && inst.activityId !== '')
              );
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
            if (inst.activityInstanceId !== undefined && inst.activityInstanceId !== '') {
              instruction.activityInstanceId = inst.activityInstanceId;
            }
            if (inst.ancestorActivityInstanceId !== undefined && inst.ancestorActivityInstanceId !== '') {
              instruction.ancestorActivityInstanceId = inst.ancestorActivityInstanceId;
            }
            if (inst.variables !== undefined && inst.variables.length > 0) {
              instruction.variables = transformVariables(inst.variables);
            }
            return instruction;
          }),
        annotation: data.annotation !== '' ? data.annotation : 'Modified via Cockpit plugin',
      };

      await post(api, `/process-instance/${processInstanceId}/modification`, {}, JSON.stringify(payload));

      setSuccessMessage('Process instance modified successfully! The page will refresh to show updates.');
      setIsSubmitted(false);

      // Delay refresh to allow user to see success message
      setTimeout(() => {
        reloadAngularRoute();
      }, SUBMIT_FEEDBACK_DELAY_MS);
    } catch (err) {
      console.error('Modification error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to modify process instance: ${errorMessage}. Check console for details.`);
      setIsSubmitted(false);
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

        <WarningBox>
          Process instance modification is a powerful operation that can lead to inconsistent process states. Use with
          extreme care and only if you understand the consequences.
        </WarningBox>

        {error !== null && <ErrorMessage message={error} />}
        {successMessage !== null && <SuccessMessage message={successMessage} />}

        <FormButton type="submit" disabled={isSubmitted} variant="primary" minWidth={160}>
          {isSubmitted ? 'Modifying...' : 'Apply Modifications'}
        </FormButton>
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
