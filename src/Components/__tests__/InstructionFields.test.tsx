/**
 * Tests for InstructionFields components.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { StartActivityFields, CancelActivityFields, TransitionFields } from '../InstructionFields';

// Test data
const mockActivities = [
  { id: 'task1', name: 'User Task 1', type: 'userTask' },
  { id: 'task2', name: 'Service Task 2', type: 'serviceTask' },
  { id: 'subprocess1', name: 'Sub Process', type: 'subProcess' },
];

const mockSequenceFlows = [
  { id: 'flow1', name: 'Flow 1', sourceRef: 'task1', targetRef: 'task2' },
  { id: 'flow2', sourceRef: 'task2', targetRef: 'subprocess1' },
];

const mockActiveInstances = [
  { id: 'instance1', activityId: 'task1', activityName: 'User Task 1' },
  { id: 'instance2', activityId: 'task2', activityName: 'Service Task 2' },
  { id: 'subprocess-instance', activityId: 'subprocess1', activityName: 'Sub Process' },
];

const mockActivityCounts = new Map([
  ['task1', 1],
  ['task2', 2],
]);

/** Wrapper component providing form context. */
interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}

const FormWrapper: React.FC<WrapperProps> = ({ children, defaultValues }) => {
  const methods = useForm({
    defaultValues: defaultValues ?? {
      instructions: [{ type: 'startBeforeActivity', activityId: '' }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('StartActivityFields', () => {
  const defaultProps = {
    index: 0,
    activities: mockActivities,
    activeInstances: mockActiveInstances,
    activityCounts: mockActivityCounts,
  };

  it('should render activity selector', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText(/^activity:$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('-- Select Activity --')).toBeInTheDocument();
  });

  it('should render all activities in the dropdown, showing name and id', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    // Opening the combobox reveals its option list
    fireEvent.focus(screen.getAllByRole('combobox')[0] as HTMLElement);

    expect(screen.getByText('User Task 1 (task1) — userTask')).toBeInTheDocument();
    expect(screen.getByText('Service Task 2 (task2) — serviceTask')).toBeInTheDocument();
    expect(screen.getByText('Sub Process (subprocess1) — subProcess')).toBeInTheDocument();
  });

  it('should fall back to the id alone for an unlabeled activity', () => {
    const unlabeledActivities = [{ id: 'task9', type: 'userTask' }];
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} activities={unlabeledActivities} />
      </FormWrapper>
    );

    fireEvent.focus(screen.getAllByRole('combobox')[0] as HTMLElement);

    expect(screen.getByText('task9 — userTask')).toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it('should render ancestor activity instance selector', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText(/ancestor activity instance/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('-- None (default scope) --')).toBeInTheDocument();
  });

  it('should filter ancestors to subprocess types only', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    // SubProcess instance should be available as ancestor
    // Other instances should not be (userTask, serviceTask are not subprocess)
    fireEvent.focus(screen.getAllByRole('combobox')[1] as HTMLElement);
    // Only the placeholder ("None") plus subprocess1 should appear
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('should render variables section', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByRole('heading', { name: /variables/i })).toBeInTheDocument();
  });

  it('should have Add Variable button', () => {
    render(
      <FormWrapper>
        <StartActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByRole('button', { name: /add variable/i })).toBeInTheDocument();
  });
});

describe('TransitionFields', () => {
  const defaultProps = {
    index: 0,
    sequenceFlows: mockSequenceFlows,
    activities: mockActivities,
    activeInstances: mockActiveInstances,
    activityCounts: mockActivityCounts,
  };

  it('should render sequence flow selector', () => {
    render(
      <FormWrapper>
        <TransitionFields {...defaultProps} />
      </FormWrapper>
    );

    // Multiple matches for "sequence flow" text, use getAllByText
    expect(screen.getAllByText(/sequence flow/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('-- Select Sequence Flow --')).toBeInTheDocument();
  });

  it('should render sequence flows with names and id when available', () => {
    render(
      <FormWrapper>
        <TransitionFields {...defaultProps} />
      </FormWrapper>
    );

    fireEvent.focus(screen.getAllByRole('combobox')[0] as HTMLElement);

    // flow1 has a name; its id is still shown for disambiguation
    expect(screen.getByText('Flow 1 (flow1)')).toBeInTheDocument();
  });

  it('should render sequence flows with source/target and id when no name', () => {
    render(
      <FormWrapper>
        <TransitionFields {...defaultProps} />
      </FormWrapper>
    );

    fireEvent.focus(screen.getAllByRole('combobox')[0] as HTMLElement);

    // flow2 has no name, should show "sourceActivityName → targetActivityName (id)"
    expect(screen.getByText('Service Task 2 → Sub Process (flow2)')).toBeInTheDocument();
  });

  it('should render ancestor activity instance selector', () => {
    render(
      <FormWrapper>
        <TransitionFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText(/ancestor activity instance/i)).toBeInTheDocument();
  });

  it('should show all active instances as potential ancestors', () => {
    render(
      <FormWrapper>
        <TransitionFields {...defaultProps} />
      </FormWrapper>
    );

    fireEvent.focus(screen.getAllByRole('combobox')[1] as HTMLElement);

    // All instances should be available as ancestors
    expect(screen.getByText(/User Task 1 \(task1\) \(ID: instance1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Service Task 2 \(task2\) \(ID: instance2\)/)).toBeInTheDocument();
  });
});

describe('CancelActivityFields', () => {
  const defaultProps = {
    index: 0,
    activities: mockActivities,
    activeInstances: mockActiveInstances,
    activityCounts: mockActivityCounts,
    cancelMethods: new Map<number, string>(),
    setCancelMethods: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cancel method selector', () => {
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText(/cancel method/i)).toBeInTheDocument();
  });

  it('should render cancel method options', () => {
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText('All instances of activity')).toBeInTheDocument();
    expect(screen.getByText('Specific activity instance')).toBeInTheDocument();
  });

  it('should show activity selector when method is "activity" (default)', () => {
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByText(/cancel all instances/i)).toBeInTheDocument();
  });

  it('should only show activities with active instances, with name, id and count', () => {
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} />
      </FormWrapper>
    );

    // The activity combobox is the second one (after "Cancel Method")
    fireEvent.focus(screen.getAllByRole('combobox')[1] as HTMLElement);

    expect(screen.getByText(/User Task 1 \(task1\).*1 active/)).toBeInTheDocument();
    expect(screen.getByText(/Service Task 2 \(task2\).*2 active/)).toBeInTheDocument();
    // subprocess1 is not in activityCounts, so it should not appear
    expect(screen.queryByText(/Sub Process/)).not.toBeInTheDocument();
  });

  it('should switch to activity instance selector when method changes', () => {
    const cancelMethods = new Map<number, string>([[0, 'activityInstance']]);
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} cancelMethods={cancelMethods} />
      </FormWrapper>
    );

    expect(screen.getByText(/cancel specific/i)).toBeInTheDocument();
  });

  it('should call setCancelMethods when method changes', () => {
    const setCancelMethods = jest.fn();
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} setCancelMethods={setCancelMethods} />
      </FormWrapper>
    );

    // Get the cancel method select (first one, still a native select)
    const selects = screen.getAllByRole('combobox');
    const methodSelect = selects[0] as HTMLSelectElement;
    fireEvent.change(methodSelect, { target: { value: 'activityInstance' } });

    expect(setCancelMethods).toHaveBeenCalledTimes(1);
  });

  it('should show all active instances when method is activityInstance', () => {
    const cancelMethods = new Map<number, string>([[0, 'activityInstance']]);
    render(
      <FormWrapper>
        <CancelActivityFields {...defaultProps} cancelMethods={cancelMethods} />
      </FormWrapper>
    );

    // The activity instance combobox is the second one (after "Cancel Method")
    fireEvent.focus(screen.getAllByRole('combobox')[1] as HTMLElement);

    expect(screen.getByText(/User Task 1 \(task1\) \(ID: instance1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Service Task 2 \(task2\) \(ID: instance2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Sub Process \(subprocess1\) \(ID: subprocess-instance\)/)).toBeInTheDocument();
  });
});
