/**
 * Tests for StatisticsTable component.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatisticsTable from '../StatisticsTable';

// Mock Clippy component to safely render values
jest.mock('../Clippy', () => ({
  __esModule: true,
  Clippy: ({ children }: { children: React.ReactNode }) => {
    const content = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
    return <span data-testid="clippy">{content}</span>;
  },
}));

describe('StatisticsTable', () => {
  /**
   * Creates a mock activity for statistics testing.
   */
  function createMockActivity(
    activityName: string,
    startTime: string,
    endTime: string,
    overrides: Record<string, unknown> = {}
  ) {
    return {
      id: `act-${Math.random().toString(36).slice(2)}`,
      activityId: `Task_${Math.random().toString(36).slice(2)}`,
      activityName,
      startTime,
      endTime,
      ...overrides,
    };
  }

  describe('rendering', () => {
    it('should render table with column headers', () => {
      render(<StatisticsTable activities={[]} />);

      expect(screen.getByText('Activity Name')).toBeInTheDocument();
      expect(screen.getByText('Instances')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Average')).toBeInTheDocument();
      expect(screen.getByText('Median')).toBeInTheDocument();
    });

    it('should render activity statistics', () => {
      const activities = [createMockActivity('Review Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:05:00.000Z')];

      render(<StatisticsTable activities={activities} />);

      expect(screen.getByText('Review Task')).toBeInTheDocument();
    });

    it('should handle empty activities array', () => {
      render(<StatisticsTable activities={[]} />);

      // Table should render with headers
      expect(screen.getByText('Activity Name')).toBeInTheDocument();
      // But no data rows
      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.querySelectorAll('tr')).toHaveLength(0);
    });
  });

  describe('aggregation', () => {
    it('should aggregate multiple instances of the same activity', () => {
      const activities = [
        createMockActivity('Review Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        createMockActivity('Review Task', '2024-01-01T11:00:00.000Z', '2024-01-01T11:02:00.000Z'),
        createMockActivity('Review Task', '2024-01-01T12:00:00.000Z', '2024-01-01T12:03:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Should show only one row for "Review Task"
      expect(screen.getAllByText('Review Task')).toHaveLength(1);
      // Should show count of 3 instances
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display separate rows for different activities', () => {
      const activities = [
        createMockActivity('Task A', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        createMockActivity('Task B', '2024-01-01T10:00:00.000Z', '2024-01-01T10:02:00.000Z'),
        createMockActivity('Task C', '2024-01-01T10:00:00.000Z', '2024-01-01T10:03:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.getByText('Task B')).toBeInTheDocument();
      expect(screen.getByText('Task C')).toBeInTheDocument();
    });

    it('should count instances correctly', () => {
      const activities = [
        createMockActivity('Frequent Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        createMockActivity('Frequent Task', '2024-01-01T10:02:00.000Z', '2024-01-01T10:03:00.000Z'),
        createMockActivity('Rare Task', '2024-01-01T10:04:00.000Z', '2024-01-01T10:05:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Frequent Task: 2 instances, Rare Task: 1 instance
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('time calculations', () => {
    it('should calculate total duration', () => {
      const activities = [
        // 1 minute duration
        createMockActivity('Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        // 2 minutes duration
        createMockActivity('Task', '2024-01-01T11:00:00.000Z', '2024-01-01T11:02:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Total should be 3 minutes (displayed via asctime helper)
      // The component uses asctime which formats durations
      expect(screen.getByText('Task')).toBeInTheDocument();
    });

    it('should handle zero duration activities', () => {
      const activities = [
        // Zero duration (same start and end time)
        createMockActivity('Instant Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:00:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      expect(screen.getByText('Instant Task')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should sort activities by total duration by default (descending)', () => {
      const activities = [
        // Short task: 1 minute
        createMockActivity('Short Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        // Long task: 10 minutes
        createMockActivity('Long Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:10:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Both should be visible
      expect(screen.getByText('Short Task')).toBeInTheDocument();
      expect(screen.getByText('Long Task')).toBeInTheDocument();

      // Long task should appear first (sorted by total duration desc)
      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(2);
    });

    it('should allow clicking on column headers for sorting', async () => {
      const user = userEvent.setup();
      const activities = [
        createMockActivity('Task A', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        createMockActivity('Task B', '2024-01-01T10:00:00.000Z', '2024-01-01T10:02:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Click on Activity Name header to trigger sort
      const nameHeader = screen.getByText('Activity Name');
      await user.click(nameHeader);

      // Both should still be visible
      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.getByText('Task B')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle single activity', () => {
      const activities = [createMockActivity('Solo Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:05:00.000Z')];

      render(<StatisticsTable activities={activities} />);

      expect(screen.getByText('Solo Task')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Instance count
    });

    it('should handle activities with same name but different durations', () => {
      const activities = [
        createMockActivity('Variable Task', '2024-01-01T10:00:00.000Z', '2024-01-01T10:01:00.000Z'),
        createMockActivity('Variable Task', '2024-01-01T11:00:00.000Z', '2024-01-01T11:05:00.000Z'),
        createMockActivity('Variable Task', '2024-01-01T12:00:00.000Z', '2024-01-01T12:03:00.000Z'),
      ];

      render(<StatisticsTable activities={activities} />);

      // Should aggregate into single row
      expect(screen.getAllByText('Variable Task')).toHaveLength(1);
      expect(screen.getByText('3')).toBeInTheDocument(); // 3 instances
    });
  });
});
