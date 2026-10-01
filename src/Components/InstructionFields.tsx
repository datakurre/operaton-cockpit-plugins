/**
 * Instruction field components for process modification form.
 * These components render type-specific form fields for each modification instruction type.
 */
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SearchableSelect from './SearchableSelect';
import VariableBuilder from './VariableBuilder';
import { formatLabelWithId } from '../utils/formatting';

/** An activity instance currently active in the process. */
export interface ActiveActivityInstance {
  id: string;
  activityId: string;
  activityName?: string;
  parentActivityInstanceId?: string;
}

/** An async continuation currently waiting between activities in the process. */
export interface ActiveTransitionInstance {
  id: string;
  activityId: string;
  activityName?: string;
  parentActivityInstanceId?: string;
  hasIncident: boolean;
}

/** A BPMN element from the process definition. */
export interface BpmnActivityElement {
  id: string;
  name?: string;
  type: string;
}

/** A sequence flow (transition) from the process definition. */
export interface SequenceFlowElement {
  id: string;
  name?: string;
  sourceRef?: string | undefined;
  targetRef?: string | undefined;
}

/** Common props for instruction field components. */
interface InstructionFieldsProps {
  /** The index of this instruction in the field array. */
  index: number;
  /** Available BPMN activities from the process definition. */
  activities: BpmnActivityElement[];
  /** Currently active activity instances. */
  activeInstances: ActiveActivityInstance[];
  /** Count of active instances per activity ID. */
  activityCounts: Map<string, number>;
}

/** Props for TransitionFields component. */
interface TransitionFieldsProps extends InstructionFieldsProps {
  /** Available sequence flows from the process definition. */
  sequenceFlows: SequenceFlowElement[];
}

/** Props for CancelActivityFields component. */
interface CancelActivityFieldsProps extends InstructionFieldsProps {
  /** Current async continuations that can be canceled. */
  activeTransitionInstances: ActiveTransitionInstance[];
  /** Map of instruction index to cancel method ('activity' or 'activityInstance'). */
  cancelMethods: Map<number, string>;
  /** Callback to update the cancel methods map. */
  setCancelMethods: (methods: Map<number, string>) => void;
  /** Whether this form's API supports canceling one specific activity instance. */
  allowActivityInstanceCancel?: boolean;
  /** Whether this form's API supports canceling one specific transition instance. */
  allowTransitionInstanceCancel?: boolean;
}

/**
 * Format a select option label for an active activity instance: the
 * activity's name (or its id, when unlabeled), followed by the instance id.
 * @param inst - The active activity instance
 * @returns Display label showing both the activity and the instance id
 */
function formatActivityInstanceLabel(inst: ActiveActivityInstance): string {
  return `${formatLabelWithId(inst.activityName, inst.activityId)} (ID: ${inst.id})`;
}

/** Props for the async-continuation cancellation picker. */
interface TransitionInstanceCancelFieldProps {
  index: number;
  activeTransitionInstances: ActiveTransitionInstance[];
}

/**
 * Renders the picker for canceling a specific async continuation.
 */
const TransitionInstanceCancelField: React.FC<TransitionInstanceCancelFieldProps> = ({
  index,
  activeTransitionInstances,
}) => {
  const { control } = useFormContext();

  return (
    <div style={{ marginBottom: '10px' }}>
      <label>Transition Instance (cancel async continuation): </label>
      <Controller
        name={`instructions.${index}.transitionInstanceId`}
        control={control}
        render={({ field }) => (
          <SearchableSelect
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            options={activeTransitionInstances.map(inst => ({
              value: inst.id,
              label:
                `${formatLabelWithId(inst.activityName, inst.activityId)} ` +
                `(transition ID: ${inst.id})${inst.hasIncident ? ' — Incident' : ''}`,
            }))}
            placeholder="-- Select Transition Instance --"
            style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
          />
        )}
      />
    </div>
  );
};

/**
 * Renders fields for starting a transition (sequence flow).
 * Allows selecting a sequence flow and optionally an ancestor activity instance.
 */
export const TransitionFields: React.FC<TransitionFieldsProps> = ({
  index,
  sequenceFlows,
  activities,
  activeInstances,
}) => {
  const { control } = useFormContext();

  const sequenceFlowOptions = sequenceFlows.map(flow => {
    const sourceName = activities.find(a => a.id === flow.sourceRef)?.name ?? flow.sourceRef ?? 'unknown';
    const targetName = activities.find(a => a.id === flow.targetRef)?.name ?? flow.targetRef ?? 'unknown';
    const label = flow.name ?? `${sourceName} → ${targetName}`;
    return { value: flow.id, label: formatLabelWithId(label, flow.id) };
  });

  const ancestorOptions = activeInstances.map(inst => ({
    value: inst.id,
    label: formatActivityInstanceLabel(inst),
  }));

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Sequence Flow (Transition): </label>
        <Controller
          name={`instructions.${index}.transitionId`}
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              options={sequenceFlowOptions}
              placeholder="-- Select Sequence Flow --"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            />
          )}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Ancestor Activity Instance (optional): </label>
        <Controller
          name={`instructions.${index}.ancestorActivityInstanceId`}
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              options={ancestorOptions}
              placeholder="-- None (default scope) --"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            />
          )}
        />
      </div>
    </>
  );
};

/**
 * Renders fields for canceling activity instances.
 * Supports both canceling all instances of an activity or a specific instance.
 */
export const CancelActivityFields: React.FC<CancelActivityFieldsProps> = ({
  index,
  activities,
  activeInstances,
  activityCounts,
  activeTransitionInstances,
  cancelMethods,
  setCancelMethods,
  allowActivityInstanceCancel = true,
  allowTransitionInstanceCancel = true,
}) => {
  const { control, setValue } = useFormContext();
  const currentMethod = cancelMethods.get(index) ?? 'activity';

  const handleMethodChange = (method: string): void => {
    setCancelMethods(new Map(cancelMethods.set(index, method)));
    if (method === 'activity') {
      setValue(`instructions.${index}.activityInstanceId`, '');
      setValue(`instructions.${index}.transitionInstanceId`, '');
    } else if (method === 'activityInstance') {
      setValue(`instructions.${index}.activityId`, '');
      setValue(`instructions.${index}.transitionInstanceId`, '');
    } else if (method === 'transitionInstance') {
      setValue(`instructions.${index}.activityId`, '');
      setValue(`instructions.${index}.activityInstanceId`, '');
    }
  };

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Cancel Method: </label>
        <select
          className="form-control"
          style={{ width: '300px', display: 'inline-block', marginLeft: '10px' }}
          value={currentMethod}
          onChange={e => {
            handleMethodChange(e.target.value);
          }}
        >
          <option value="activity">All instances of activity</option>
          {allowActivityInstanceCancel && <option value="activityInstance">Specific activity instance</option>}
          {allowTransitionInstanceCancel && <option value="transitionInstance">Specific transition instance</option>}
        </select>
      </div>

      {currentMethod === 'activity' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Activity (cancel all instances): </label>
          <Controller
            name={`instructions.${index}.activityId`}
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                options={activities
                  .filter(activity => activityCounts.has(activity.id))
                  .map(activity => ({
                    value: activity.id,
                    label: `${formatLabelWithId(activity.name, activity.id)} — ${activity.type} — ${activityCounts.get(activity.id) ?? 0} active`,
                  }))}
                placeholder="-- Select Active Activity --"
                style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
              />
            )}
          />
        </div>
      )}

      {allowActivityInstanceCancel && currentMethod === 'activityInstance' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Activity Instance (cancel specific): </label>
          <Controller
            name={`instructions.${index}.activityInstanceId`}
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                options={activeInstances.map(inst => ({
                  value: inst.id,
                  label: formatActivityInstanceLabel(inst),
                }))}
                placeholder="-- Select Activity Instance --"
                style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
              />
            )}
          />
        </div>
      )}

      {allowTransitionInstanceCancel && currentMethod === 'transitionInstance' && (
        <TransitionInstanceCancelField index={index} activeTransitionInstances={activeTransitionInstances} />
      )}
    </>
  );
};

/** Props for StartActivityFields component. */
interface StartActivityFieldsProps extends InstructionFieldsProps {
  /** Whether to offer variables for the started activity. */
  showVariables?: boolean;
}

/**
 * Renders fields for starting before or after an activity.
 * Includes activity selection, optional ancestor, and variable configuration.
 */
export const StartActivityFields: React.FC<StartActivityFieldsProps> = ({
  index,
  activities,
  activeInstances,
  showVariables = true,
}) => {
  const { control } = useFormContext();

  const potentialAncestors = activeInstances.filter(inst => {
    const activity = activities.find(a => a.id === inst.activityId);
    return (activity?.type.includes('SubProcess') ?? false) || (activity?.type.includes('Process') ?? false);
  });

  const activityOptions = activities.map(activity => ({
    value: activity.id,
    label: `${formatLabelWithId(activity.name, activity.id)} — ${activity.type}`,
  }));

  const ancestorOptions = potentialAncestors.map(inst => ({
    value: inst.id,
    label: formatActivityInstanceLabel(inst),
  }));

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Activity: </label>
        <Controller
          name={`instructions.${index}.activityId`}
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              options={activityOptions}
              placeholder="-- Select Activity --"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            />
          )}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Ancestor Activity Instance (optional): </label>
        <Controller
          name={`instructions.${index}.ancestorActivityInstanceId`}
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              options={ancestorOptions}
              placeholder="-- None (default scope) --"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            />
          )}
        />
      </div>
      {showVariables && (
        <div style={{ marginBottom: '10px' }}>
          <h5>Variables</h5>
          <VariableBuilder name={`instructions.${index}.variables`} showLocalFlag />
        </div>
      )}
    </>
  );
};
