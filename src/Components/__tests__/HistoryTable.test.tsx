/**
 * Tests for HistoryTable component.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryTable from '../HistoryTable';

// Mock Clippy component to safely render string or undefined values
jest.mock('../Clippy', () => ({
  __esModule: true,
  Clippy: ({ children, value }: { children: React.ReactNode; value: unknown }) => {
    const content = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
    return <span data-testid="clippy">{children ?? content}</span>;
  },
}));

describe('HistoryTable', () => {
  /**
   * Creates a mock process instance for testing.
   */
  function createMockInstance(overrides: Record<string, unknown> = {}) {
    return {
      id: 'instance-123',
      state: 'COMPLETED',
      businessKey: 'order-456',
      startTime: '2024-01-01T10:00:00.000Z',
      endTime: '2024-01-01T10:30:00.000Z',
      ...overrides,
    };
  }

  describe('rendering', () => {
    it('should render table with column headers', () => {
      render(<HistoryTable instances={[]} />);

      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Instance ID')).toBeInTheDocument();
      expect(screen.getByText('Start Time')).toBeInTheDocument();
      expect(screen.getByText('End Time')).toBeInTheDocument();
      expect(screen.getByText('Business Key')).toBeInTheDocument();
    });

    it('should render instance rows', () => {
      const instances = [createMockInstance()];

      render(<HistoryTable instances={instances} />);

      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('instance-123')).toBeInTheDocument();
      expect(screen.getByText('order-456')).toBeInTheDocument();
    });

    it('should render multiple instance rows', () => {
      const instances = [
        createMockInstance({ id: 'inst-1', businessKey: 'key-1' }),
        createMockInstance({ id: 'inst-2', businessKey: 'key-2' }),
        createMockInstance({ id: 'inst-3', businessKey: 'key-3' }),
      ];

      render(<HistoryTable instances={instances} />);

      expect(screen.getByText('inst-1')).toBeInTheDocument();
      expect(screen.getByText('inst-2')).toBeInTheDocument();
      expect(screen.getByText('inst-3')).toBeInTheDocument();
      expect(screen.getByText('key-1')).toBeInTheDocument();
      expect(screen.getByText('key-2')).toBeInTheDocument();
      expect(screen.getByText('key-3')).toBeInTheDocument();
    });

    it('should handle empty instances array', () => {
      render(<HistoryTable instances={[]} />);

      // Table should still render with headers
      expect(screen.getByText('State')).toBeInTheDocument();
      // But no data rows
      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.querySelectorAll('tr')).toHaveLength(0);
    });
  });

  describe('links', () => {
    it('should render instance ID as a history link', () => {
      const instances = [createMockInstance({ id: 'instance-abc' })];

      render(<HistoryTable instances={instances} />);

      const link = screen.getByRole('link', { name: 'instance-abc' });
      expect(link).toHaveAttribute('href', '#/history/process-instance/instance-abc');
    });
  });

  describe('date formatting', () => {
    it('should format start and end times correctly', () => {
      const instances = [
        createMockInstance({
          startTime: '2024-06-15T14:30:45.000Z',
          endTime: '2024-06-15T15:45:30.000Z',
        }),
      ];

      render(<HistoryTable instances={instances} />);

      // Moment.js formats in local time, so we check the format pattern
      const cells = screen.getAllByTestId('clippy');
      // Find cells with date-like content
      const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      const dateCells = cells.filter(cell => datePattern.test(cell.textContent ?? ''));
      expect(dateCells.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle missing end time for running instances', () => {
      const instances = [
        createMockInstance({
          state: 'ACTIVE',
          endTime: null,
        }),
      ];

      render(<HistoryTable instances={instances} />);

      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  describe('states', () => {
    it('should display various process states', () => {
      const instances = [
        createMockInstance({ id: '1', state: 'COMPLETED' }),
        createMockInstance({ id: '2', state: 'ACTIVE' }),
        createMockInstance({ id: '3', state: 'SUSPENDED' }),
        createMockInstance({ id: '4', state: 'INTERNALLY_TERMINATED' }),
      ];

      render(<HistoryTable instances={instances} />);

      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('SUSPENDED')).toBeInTheDocument();
      expect(screen.getByText('INTERNALLY_TERMINATED')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should allow clicking on column headers for sorting', async () => {
      const user = userEvent.setup();
      const instances = [
        createMockInstance({ id: 'a-instance', state: 'COMPLETED' }),
        createMockInstance({ id: 'b-instance', state: 'ACTIVE' }),
      ];

      render(<HistoryTable instances={instances} />);

      // Click on State header to trigger sort
      const stateHeader = screen.getByText('State');
      await user.click(stateHeader);

      // Both instances should still be visible after sorting
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  describe('business key', () => {
    it('should display business key when present', () => {
      const instances = [createMockInstance({ businessKey: 'ORDER-12345' })];

      render(<HistoryTable instances={instances} />);

      expect(screen.getByText('ORDER-12345')).toBeInTheDocument();
    });

    it('should handle missing business key', () => {
      const instances = [createMockInstance({ businessKey: null })];

      render(<HistoryTable instances={instances} />);

      // Table should still render without errors
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });
  });
});
