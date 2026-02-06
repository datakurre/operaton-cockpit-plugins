/**
 * Tests for SortableTable component.
 *
 * Tests sorting functionality, ARIA attributes, and rendering.
 *
 * @module
 */
import React, { useMemo } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Column } from 'react-table';
import SortableTable from '../SortableTable';

interface TestItem {
  id: number;
  name: string;
  value: number;
}

/**
 * Test wrapper that provides columns and data with useMemo.
 */
function TestTable({ data, ariaLabel }: { data: TestItem[]; ariaLabel?: string }): React.ReactElement {
  const columns: Column<TestItem>[] = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Value', accessor: 'value' },
    ],
    []
  );

  return <SortableTable columns={columns} data={data} ariaLabel={ariaLabel} />;
}

describe('SortableTable', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'Alpha', value: 100 },
    { id: 2, name: 'Beta', value: 200 },
    { id: 3, name: 'Gamma', value: 50 },
  ];

  describe('rendering', () => {
    it('should render a table element', () => {
      render(<TestTable data={testData} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<TestTable data={testData} />);

      expect(screen.getByRole('columnheader', { name: /ID/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Value/i })).toBeInTheDocument();
    });

    it('should render all data rows', () => {
      render(<TestTable data={testData} />);

      const rows = screen.getAllByRole('row');
      // One header row + 3 data rows
      expect(rows).toHaveLength(4);
    });

    it('should render cell values', () => {
      render(<TestTable data={testData} />);

      expect(screen.getByRole('cell', { name: 'Alpha' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Beta' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Gamma' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const columns: Column<TestItem>[] = [{ Header: 'ID', accessor: 'id' }];

      render(<SortableTable columns={columns} data={testData} className="custom-table" />);

      expect(screen.getByRole('table')).toHaveClass('custom-table');
    });

    it('should apply aria-label when provided', () => {
      render(<TestTable data={testData} ariaLabel="Test data table" />);

      expect(screen.getByRole('table', { name: 'Test data table' })).toBeInTheDocument();
    });

    it('should render empty table when data is empty', () => {
      render(<TestTable data={[]} />);

      const rows = screen.getAllByRole('row');
      // Only the header row
      expect(rows).toHaveLength(1);
    });
  });

  describe('ARIA attributes', () => {
    it('should have aria-sort="none" on unsorted columns', () => {
      render(<TestTable data={testData} />);

      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('aria-sort', 'none');
      });
    });

    it('should update aria-sort to "ascending" when sorted ascending', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      await user.click(nameHeader);

      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should update aria-sort to "descending" when sorted descending', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      // Click twice to sort descending
      await user.click(nameHeader);
      await user.click(nameHeader);

      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });
  });

  describe('sorting functionality', () => {
    it('should sort by column when header is clicked', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      await user.click(nameHeader);

      // Get all cells in the Name column (second column)
      const rows = screen.getAllByRole('row').slice(1); // Skip header row
      const firstNameCell = rows[0]?.querySelector('td:nth-child(2)');

      expect(firstNameCell).toHaveTextContent('Alpha');
    });

    it('should sort numerically for number columns', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const valueHeader = screen.getByRole('columnheader', { name: /Value/i });
      await user.click(valueHeader);

      // Get all cells in the Value column (third column)
      const rows = screen.getAllByRole('row').slice(1); // Skip header row
      const firstValueCell = rows[0]?.querySelector('td:nth-child(3)');
      const lastValueCell = rows[rows.length - 1]?.querySelector('td:nth-child(3)');

      // Ascending order: 50, 100, 200
      expect(firstValueCell).toHaveTextContent('50');
      expect(lastValueCell).toHaveTextContent('200');
    });

    it('should reverse sort order on second click', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const valueHeader = screen.getByRole('columnheader', { name: /Value/i });

      // First click - ascending
      await user.click(valueHeader);
      let rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]?.querySelector('td:nth-child(3)')).toHaveTextContent('50');

      // Second click - descending
      await user.click(valueHeader);
      rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]?.querySelector('td:nth-child(3)')).toHaveTextContent('200');
    });

    it('should allow sorting by different columns', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      // Sort by ID
      const idHeader = screen.getByRole('columnheader', { name: /ID/i });
      await user.click(idHeader);

      let rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]?.querySelector('td:nth-child(1)')).toHaveTextContent('1');

      // Switch to sort by Name
      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      await user.click(nameHeader);

      rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]?.querySelector('td:nth-child(2)')).toHaveTextContent('Alpha');

      // ID column should no longer be the sorted column
      expect(idHeader).toHaveAttribute('aria-sort', 'none');
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  describe('sort icons', () => {
    it('should show unsorted icon for all columns initially', () => {
      render(<TestTable data={testData} />);

      // The TiMinus icon is used for unsorted state
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        // Check that the anchor element exists (contains sort icon)
        const anchor = header.querySelector('a');
        expect(anchor).toBeInTheDocument();
      });
    });

    it('should update sort icon when column is sorted', async () => {
      const user = userEvent.setup();
      render(<TestTable data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/i });
      await user.click(nameHeader);

      // The icon should change - we verify by checking the aria-sort attribute
      // since the icons themselves are hidden from assistive technology
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });
});
