/**
 * Instruction field components for process modification form.
 * These components render type-specific form fields for each modification instruction type.
 */
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import VariableBuilder from './VariableBuilder';

/** An activity instance currently active in the process. */
export interface ActiveActivityInstance {
  id: string;
  activityId: string;
  activityName?: string;
  parentActivityInstanceId?: string;
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
  /** Map of instruction index to cancel method ('activity' or 'activityInstance'). */
  cancelMethods: Map<number, string>;
  /** Callback to update the cancel methods map. */
  setCancelMethods: (methods: Map<number, string>) => void;
}

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

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Sequence Flow (Transition): </label>
        <Controller
          name={`instructions.${index}.transitionId`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="form-control"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="">-- Select Sequence Flow --</option>
              {sequenceFlows.map(flow => {
                const sourceName = activities.find(a => a.id === flow.sourceRef)?.name ?? flow.sourceRef ?? 'unknown';
                const targetName = activities.find(a => a.id === flow.targetRef)?.name ?? flow.targetRef ?? 'unknown';
                return (
                  <option key={flow.id} value={flow.id}>
                    {flow.name ?? `${sourceName} → ${targetName}`}
                  </option>
                );
              })}
            </select>
          )}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Ancestor Activity Instance (optional): </label>
        <Controller
          name={`instructions.${index}.ancestorActivityInstanceId`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="form-control"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="">-- None (default scope) --</option>
              {activeInstances.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.activityName ?? inst.activityId} (ID: {inst.id})
                </option>
              ))}
            </select>
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
  cancelMethods,
  setCancelMethods,
}) => {
  const { control, setValue } = useFormContext();
  const currentMethod = cancelMethods.get(index) ?? 'activity';

  const handleMethodChange = (method: string): void => {
    setCancelMethods(new Map(cancelMethods.set(index, method)));
    if (method === 'activity') {
      setValue(`instructions.${index}.activityInstanceId`, '');
    } else if (method === 'activityInstance') {
      setValue(`instructions.${index}.activityId`, '');
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
          <option value="activityInstance">Specific activity instance</option>
        </select>
      </div>

      {currentMethod === 'activity' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Activity (cancel all instances): </label>
          <Controller
            name={`instructions.${index}.activityId`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="form-control"
                style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
              >
                <option value="">-- Select Active Activity --</option>
                {activities
                  .filter(activity => activityCounts.has(activity.id))
                  .map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name} ({activity.type}) - {activityCounts.get(activity.id) ?? 0} active
                    </option>
                  ))}
              </select>
            )}
          />
        </div>
      )}

      {currentMethod === 'activityInstance' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Activity Instance (cancel specific): </label>
          <Controller
            name={`instructions.${index}.activityInstanceId`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="form-control"
                style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
              >
                <option value="">-- Select Activity Instance --</option>
                {activeInstances.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.activityName ?? inst.activityId} (ID: {inst.id})
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      )}
    </>
  );
};

/**
 * Renders fields for starting before or after an activity.
 * Includes activity selection, optional ancestor, and variable configuration.
 */
export const StartActivityFields: React.FC<InstructionFieldsProps> = ({ index, activities, activeInstances }) => {
  const { control } = useFormContext();

  const potentialAncestors = activeInstances.filter(inst => {
    const activity = activities.find(a => a.id === inst.activityId);
    return (activity?.type.includes('SubProcess') ?? false) || (activity?.type.includes('Process') ?? false);
  });

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Activity: </label>
        <Controller
          name={`instructions.${index}.activityId`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="form-control"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="">-- Select Activity --</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} ({activity.type})
                </option>
              ))}
            </select>
          )}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Ancestor Activity Instance (optional): </label>
        <Controller
          name={`instructions.${index}.ancestorActivityInstanceId`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="form-control"
              style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="">-- None (default scope) --</option>
              {potentialAncestors.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.activityName ?? inst.activityId} (ID: {inst.id})
                </option>
              ))}
            </select>
          )}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <h5>Variables</h5>
        <VariableBuilder name={`instructions.${index}.variables`} showLocalFlag />
      </div>
    </>
  );
};
