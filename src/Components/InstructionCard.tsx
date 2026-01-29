/**
 * InstructionCard component for process modification.
 * Wraps each modification instruction with type selector and controls.
 */
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormButton from './FormButton';
import {
  StartActivityFields,
  CancelActivityFields,
  TransitionFields,
  type ActiveActivityInstance,
  type BpmnActivityElement,
  type SequenceFlowElement,
} from './InstructionFields';

/** Props for the InstructionCard component. */
interface InstructionCardProps {
  /** Unique key for the field array item. */
  fieldId: string;
  /** The index of this instruction in the field array. */
  index: number;
  /** Whether to show the remove button (hidden if only one instruction). */
  showRemove: boolean;
  /** Callback to remove this instruction. */
  onRemove: () => void;
  /** Available BPMN activities from the process definition. */
  activities: BpmnActivityElement[];
  /** Available sequence flows from the process definition. */
  sequenceFlows: SequenceFlowElement[];
  /** Currently active activity instances. */
  activeInstances: ActiveActivityInstance[];
  /** Count of active instances per activity ID. */
  activityCounts: Map<string, number>;
  /** Map of instruction index to cancel method. */
  cancelMethods: Map<number, string>;
  /** Callback to update the cancel methods map. */
  setCancelMethods: (methods: Map<number, string>) => void;
}

/**
 * Renders a single modification instruction card.
 * Includes type selector and type-specific fields for the instruction.
 */
const InstructionCard: React.FC<InstructionCardProps> = ({
  fieldId,
  index,
  showRemove,
  onRemove,
  activities,
  sequenceFlows,
  activeInstances,
  activityCounts,
  cancelMethods,
  setCancelMethods,
}) => {
  const { control, watch } = useFormContext();
  const instructionType = watch(`instructions.${index}.type`) as string;

  const renderInstructionFields = (): React.ReactElement => {
    if (instructionType === 'startTransition') {
      return (
        <TransitionFields
          index={index}
          sequenceFlows={sequenceFlows}
          activities={activities}
          activeInstances={activeInstances}
          activityCounts={activityCounts}
        />
      );
    }

    if (instructionType === 'cancel') {
      return (
        <CancelActivityFields
          index={index}
          activities={activities}
          activeInstances={activeInstances}
          activityCounts={activityCounts}
          cancelMethods={cancelMethods}
          setCancelMethods={setCancelMethods}
        />
      );
    }

    // Default: startBeforeActivity or startAfterActivity
    return (
      <StartActivityFields
        index={index}
        activities={activities}
        activeInstances={activeInstances}
        activityCounts={activityCounts}
      />
    );
  };

  return (
    <div
      key={fieldId}
      style={{
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <label>Instruction Type: </label>
        <Controller
          name={`instructions.${index}.type`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="form-control"
              style={{ width: '300px', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value="startBeforeActivity">Start Before Activity</option>
              <option value="startAfterActivity">Start After Activity</option>
              <option value="startTransition">Start Transition</option>
              <option value="cancel">Cancel Activity Instance</option>
            </select>
          )}
        />
        {showRemove && (
          <span style={{ marginLeft: '10px' }}>
            <FormButton variant="secondary" onClick={onRemove}>
              Remove
            </FormButton>
          </span>
        )}
      </div>

      {renderInstructionFields()}
    </div>
  );
};

export default InstructionCard;
