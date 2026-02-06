import React from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { TiMinus } from 'react-icons/ti';
import { Column, useSortBy, useTable } from 'react-table';

/** ARIA sort direction value for accessible table headers */
type AriaSortValue = 'ascending' | 'descending' | 'none';

/** Sort indicator color used consistently across all sortable tables */
const SORT_INDICATOR_COLOR = '#155cb5';

interface SortableTableProps<T extends object> {
  /** Column definitions for react-table */
  columns: Column<T>[];
  /** Table data array */
  data: T[];
  /** Optional CSS class to apply to the table */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Generic sortable table component that wraps react-table with consistent
 * sorting UI, ARIA attributes, and styling.
 *
 * @example
 * ```tsx
 * const columns = useMemo(() => [
 *   { Header: 'Name', accessor: 'name' },
 *   { Header: 'Value', accessor: 'value' },
 * ], []);
 *
 * <SortableTable columns={columns} data={items} />
 * ```
 */
export default function SortableTable<T extends object>({
  columns,
  data,
  className = 'cam-table',
  ariaLabel,
}: SortableTableProps<T>): React.ReactElement {
  const tableInstance = useTable({ columns: columns as Column<object>[], data: data as object[] }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <table className={className} {...getTableProps()} aria-label={ariaLabel}>
      <thead>
        {headerGroups.map(headerGroup => {
          const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={headerGroupKey} {...headerGroupProps}>
              {headerGroup.headers.map(column => {
                const sortableColumn = column as typeof column & {
                  getSortByToggleProps: () => object;
                  isSorted: boolean;
                  isSortedDesc: boolean;
                };
                const { key: columnKey, ...columnProps } = column.getHeaderProps(sortableColumn.getSortByToggleProps());

                // Determine ARIA sort attribute for accessibility
                let ariaSort: AriaSortValue = 'none';
                if (sortableColumn.isSorted) {
                  ariaSort = sortableColumn.isSortedDesc ? 'descending' : 'ascending';
                }

                // Render appropriate sort icon based on column state
                const renderSortIcon = (): React.ReactElement => {
                  if (!sortableColumn.isSorted) {
                    return <TiMinus style={{ color: SORT_INDICATOR_COLOR }} aria-hidden="true" />;
                  }
                  if (sortableColumn.isSortedDesc) {
                    return <GoChevronDown style={{ color: SORT_INDICATOR_COLOR }} aria-hidden="true" />;
                  }
                  return <GoChevronUp style={{ color: SORT_INDICATOR_COLOR }} aria-hidden="true" />;
                };

                return (
                  <th key={columnKey} {...columnProps} aria-sort={ariaSort} className={(column as any).headerClassName}>
                    <span className={`${(column as any).headerClassName ? `${(column as any).headerClassName}-label` : ''}`}>
                      {column.render('Header')}
                    </span>
                    <a style={{ marginLeft: '5px' }}>{renderSortIcon()}</a>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          const { key: rowKey, ...rowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...rowProps}>
              {row.cells.map(cell => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();
                const cellClassName = (cell.column as any).className;
                return (
                  <td key={cellKey} {...cellProps} className={cellClassName}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
