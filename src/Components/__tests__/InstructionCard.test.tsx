/**
 * Tests for InstructionCard component.
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import InstructionCard from '../InstructionCard';

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

describe('InstructionCard', () => {
  const defaultProps = {
    fieldId: 'field-0',
    index: 0,
    showRemove: true,
    onRemove: jest.fn(),
    activities: mockActivities,
    sequenceFlows: mockSequenceFlows,
    activeInstances: mockActiveInstances,
    activityCounts: mockActivityCounts,
    cancelMethods: new Map<number, string>(),
    setCancelMethods: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render instruction type selector', () => {
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      // Label is not associated via htmlFor, so use text query
      expect(screen.getByText(/instruction type/i)).toBeInTheDocument();
      // Multiple selects exist, so use getAllByRole
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render all instruction type options', () => {
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      // Find the first select (instruction type)
      const selects = screen.getAllByRole('combobox');
      const typeSelect = selects[0];
      expect(typeSelect).toBeDefined();
      expect(within(typeSelect as HTMLElement).getByText('Start Before Activity')).toBeInTheDocument();
      expect(within(typeSelect as HTMLElement).getByText('Start After Activity')).toBeInTheDocument();
      expect(within(typeSelect as HTMLElement).getByText('Start Transition')).toBeInTheDocument();
      expect(within(typeSelect as HTMLElement).getByText('Cancel Activity Instance')).toBeInTheDocument();
    });

    it('should render remove button when showRemove is true', () => {
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} showRemove />
        </FormWrapper>
      );

      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('should not render remove button when showRemove is false', () => {
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} showRemove={false} />
        </FormWrapper>
      );

      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });
  });

  describe('instruction type switching', () => {
    it('should render StartActivityFields for startBeforeActivity type', () => {
      render(
        <FormWrapper
          defaultValues={{
            instructions: [{ type: 'startBeforeActivity', activityId: '' }],
          }}
        >
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      // StartActivityFields has an Activity selector and Variables section
      expect(screen.getByText(/^activity:$/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /variables/i })).toBeInTheDocument();
    });

    it('should render StartActivityFields for startAfterActivity type', () => {
      render(
        <FormWrapper
          defaultValues={{
            instructions: [{ type: 'startAfterActivity', activityId: '' }],
          }}
        >
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      expect(screen.getByText(/^activity:$/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /variables/i })).toBeInTheDocument();
    });

    it('should render TransitionFields for startTransition type', () => {
      render(
        <FormWrapper
          defaultValues={{
            instructions: [{ type: 'startTransition', transitionId: '' }],
          }}
        >
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      // TransitionFields has a label for Sequence Flow - use getAllByText since there are multiple matches
      expect(screen.getAllByText(/sequence flow/i).length).toBeGreaterThan(0);
    });

    it('should render CancelActivityFields for cancel type', () => {
      render(
        <FormWrapper
          defaultValues={{
            instructions: [{ type: 'cancel', activityId: '' }],
          }}
        >
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      expect(screen.getByText(/cancel method/i)).toBeInTheDocument();
    });
  });

  describe('remove button interaction', () => {
    it('should call onRemove when remove button is clicked', () => {
      const onRemove = jest.fn();
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} onRemove={onRemove} />
        </FormWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /remove/i }));

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('type change handling', () => {
    it('should update instruction type when selector changes', () => {
      render(
        <FormWrapper>
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      // Get the first select (instruction type)
      const selects = screen.getAllByRole('combobox');
      const typeSelect = selects[0] as HTMLSelectElement;
      fireEvent.change(typeSelect, { target: { value: 'startTransition' } });

      expect(screen.getAllByText(/sequence flow/i).length).toBeGreaterThan(0);
    });
  });

  describe('styling', () => {
    it('should have proper card styling', () => {
      const { container } = render(
        <FormWrapper>
          <InstructionCard {...defaultProps} />
        </FormWrapper>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ marginBottom: '15px' });
    });
  });
});
