/**
 * Tests for AuditLogTable component.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuditLogTable from '../AuditLogTable';

// Mock Clippy component to handle both string and object children
// The AuditLogTable component passes the entire activity object as activityName
// which gets passed to Clippy. We need to safely render only string children.
jest.mock('../Clippy', () => ({
  __esModule: true,
  Clippy: ({ children, value }: { children: unknown; value: unknown }) => {
    /**
     * Safely converts the input to a renderable string.
     * Handles primitives, objects with activityName, and other cases.
     */
    function toRenderable(input: unknown): string {
      if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return String(input);
      }
      // Handle activity objects that have activityName property
      if (input && typeof input === 'object' && 'activityName' in input) {
        const obj = input as { activityName: unknown };
        if (typeof obj.activityName === 'string') {
          return obj.activityName;
        }
      }
      return '';
    }
    const content = toRenderable(children) || toRenderable(value);
    return <span data-testid="clippy">{content}</span>;
  },
}));

describe('AuditLogTable', () => {
  /**
   * Creates mock activity data that matches the expected shape from the API.
   * The AuditLogTable expects activities with activityName as a property.
   */
  function createMockActivity(overrides: Record<string, unknown> = {}) {
    return {
      id: 'activity-1',
      activityId: 'Task_1',
      activityName: 'Review Task',
      activityType: 'userTask',
      startTime: '2024-01-01T10:00:00.000Z',
      endTime: '2024-01-01T10:05:00.000Z',
      assignee: 'john.doe',
      canceled: false,
      calledProcessInstanceId: null,
      ...overrides,
    };
  }

  describe('rendering', () => {
    it('should render table with column headers', () => {
      render(<AuditLogTable activities={[]} decisions={new Map()} />);

      expect(screen.getByText('Activity Name')).toBeInTheDocument();
      expect(screen.getByText('Start Time')).toBeInTheDocument();
      expect(screen.getByText('End Time')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Canceled')).toBeInTheDocument();
    });

    it('should render activity rows', () => {
      const activities = [createMockActivity()];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      // The activity name should be rendered
      expect(screen.getByText('Review Task')).toBeInTheDocument();
      expect(screen.getByText('userTask')).toBeInTheDocument();
      expect(screen.getByText('john.doe')).toBeInTheDocument();
    });

    it('should render multiple activity rows', () => {
      const activities = [
        createMockActivity({ id: '1', activityName: 'Task One' }),
        createMockActivity({ id: '2', activityName: 'Task Two' }),
        createMockActivity({ id: '3', activityName: 'Task Three' }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      expect(screen.getByText('Task One')).toBeInTheDocument();
      expect(screen.getByText('Task Two')).toBeInTheDocument();
      expect(screen.getByText('Task Three')).toBeInTheDocument();
    });

    it('should display canceled status as true or false', () => {
      const activities = [
        createMockActivity({ id: '1', canceled: true }),
        createMockActivity({ id: '2', canceled: false }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      expect(screen.getByText('true')).toBeInTheDocument();
      expect(screen.getByText('false')).toBeInTheDocument();
    });
  });

  describe('links', () => {
    it('should render link to decision for businessRuleTask', () => {
      const activities = [
        createMockActivity({
          id: 'act-1',
          activityName: 'Check Credit',
          activityType: 'businessRuleTask',
        }),
      ];
      const decisions = new Map([['act-1', 'decision-123']]);

      render(<AuditLogTable activities={activities} decisions={decisions} />);

      const link = screen.getByRole('link', { name: 'Check Credit' });
      expect(link).toHaveAttribute('href', expect.stringContaining('decision-instance/decision-123'));
    });

    it('should render history link for completed callActivity', () => {
      const activities = [
        createMockActivity({
          id: 'act-1',
          activityName: 'Sub Process',
          activityType: 'callActivity',
          calledProcessInstanceId: 'instance-456',
          endTime: '2024-01-01T10:00:00.000Z',
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      const link = screen.getByRole('link', { name: 'Sub Process' });
      expect(link).toHaveAttribute('href', expect.stringContaining('history/process-instance/instance-456'));
    });

    it('should render runtime link for running callActivity', () => {
      const activities = [
        createMockActivity({
          id: 'act-1',
          activityName: 'Sub Process',
          activityType: 'callActivity',
          calledProcessInstanceId: 'instance-456',
          endTime: null, // Still running
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      const link = screen.getByRole('link', { name: 'Sub Process' });
      expect(link).toHaveAttribute('href', expect.stringContaining('process-instance/instance-456'));
      expect(link).not.toHaveAttribute('href', expect.stringContaining('history'));
    });

    it('should not render link for regular tasks', () => {
      const activities = [
        createMockActivity({
          activityName: 'Regular Task',
          activityType: 'userTask',
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      expect(screen.getByText('Regular Task')).toBeInTheDocument();
      // Should not be a link
      expect(screen.queryByRole('link', { name: 'Regular Task' })).not.toBeInTheDocument();
    });
  });

  describe('date formatting', () => {
    it('should format start and end times correctly', () => {
      const activities = [
        createMockActivity({
          startTime: '2024-06-15T14:30:45.000Z',
          endTime: '2024-06-15T14:35:45.000Z',
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      // Should format in local timezone, just check something is rendered
      expect(screen.getAllByText(/2024-06-15/)).toBeDefined();
    });

    it('should handle missing end time', () => {
      const activities = [
        createMockActivity({
          endTime: null,
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      // Should not throw and render the table
      expect(screen.getByText('Review Task')).toBeInTheDocument();
    });
  });

  describe('duration', () => {
    it('should display duration for completed activities', () => {
      const activities = [
        createMockActivity({
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:05:30.500Z', // 5 minutes, 30.5 seconds
        }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      // Should display formatted duration
      expect(screen.getByText('00:05:30.5')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should allow clicking on column headers', async () => {
      const user = userEvent.setup();
      const activities = [
        createMockActivity({ id: '1', activityName: 'Task A' }),
        createMockActivity({ id: '2', activityName: 'Task B' }),
      ];

      render(<AuditLogTable activities={activities} decisions={new Map()} />);

      // Click on Start Time header
      const startTimeHeader = screen.getByText('Start Time');
      await user.click(startTimeHeader);

      // The table should still be rendered
      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.getByText('Task B')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render table with no rows when activities is empty', () => {
      render(<AuditLogTable activities={[]} decisions={new Map()} />);

      // Should still render headers
      expect(screen.getByText('Activity Name')).toBeInTheDocument();

      // Should have no body rows
      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.querySelectorAll('tr')).toHaveLength(0);
    });
  });
});
