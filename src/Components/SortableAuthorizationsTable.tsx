/**
 * Sortable Authorization Table Component
 *
 * A sortable table for displaying authorization records with react-table.
 * Includes click-to-sort headers with ARIA accessibility support.
 */

/* eslint-disable max-lines-per-function, jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Sortable table with inline actions */
import React, { useMemo } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { TiMinus } from 'react-icons/ti';
import { Column, useSortBy, useTable, CellProps } from 'react-table';

import { Authorization, AuthorizationRow, getAuthTypeLabel, renderIdentityDisplay } from '../utils/authorization';

/** ARIA sort direction value for accessible table headers */
type AriaSortValue = 'ascending' | 'descending' | 'none';

interface SortableAuthorizationsTableProps {
  authorizations: Authorization[];
  onEdit: (auth: Authorization) => void;
  onDelete: (auth: Authorization) => void;
}

/**
 * Sortable authorization table using react-table with click-to-sort headers.
 * Displays type, identity, permissions, resource ID with action buttons.
 */
const SortableAuthorizationsTable: React.FC<SortableAuthorizationsTableProps> = ({
  authorizations,
  onEdit,
  onDelete,
}) => {
  // Convert authorizations to row data
  const data = useMemo<AuthorizationRow[]>(
    () =>
      authorizations.map(
        (auth): AuthorizationRow => ({
          original: auth,
          type: auth.type ?? -1,
          typeLabel: getAuthTypeLabel(auth.type),
          userId: auth.userId ?? '',
          groupId: auth.groupId ?? '',
          identity: auth.userId ?? auth.groupId ?? '-',
          permissions: auth.permissions?.join(', ') ?? '-',
          resourceId: auth.resourceId ?? '*',
        })
      ),
    [authorizations]
  );

  // Define columns for the table
  const columns = useMemo<Column<AuthorizationRow>[]>(
    () => [
      {
        Header: 'Type',
        accessor: 'typeLabel',
        Cell: ({ value }: CellProps<AuthorizationRow, string>) => <span>{value}</span>,
      },
      {
        Header: 'User / Group',
        accessor: 'identity',
        Cell: ({ row }: CellProps<AuthorizationRow, string>) =>
          renderIdentityDisplay(row.original.original.userId, row.original.original.groupId),
      },
      {
        Header: 'Permissions',
        accessor: 'permissions',
        Cell: ({ value }: CellProps<AuthorizationRow, string>) => <span title={value}>{value}</span>,
      },
      {
        Header: 'Resource ID',
        accessor: 'resourceId',
        Cell: ({ value }: CellProps<AuthorizationRow, string>) => <span>{value}</span>,
      },
      {
        Header: 'Action',
        id: 'action',
        disableSortBy: true,
        Cell: ({ row }: CellProps<AuthorizationRow>) => (
          <>
            <a
              onClick={() => {
                onEdit(row.original.original);
              }}
              className="action-link action-edit"
            >
              Edit
            </a>
            <a
              onClick={() => {
                onDelete(row.original.original);
              }}
              className="action-link action-delete"
            >
              Delete
            </a>
          </>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  // Use react-table with sorting
  const tableInstance = useTable({ columns: columns as Column<object>[], data: data as object[] }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  /**
   * Render sort icon based on column sort state
   */
  const renderSortIcon = (isSorted: boolean, isSortedDesc: boolean): React.ReactElement => {
    if (!isSorted) {
      return <TiMinus className="sort-icon" aria-hidden="true" />;
    }
    if (isSortedDesc) {
      return <GoChevronDown className="sort-icon" aria-hidden="true" />;
    }
    return <GoChevronUp className="sort-icon" aria-hidden="true" />;
  };

  return (
    <table className="cam-table" {...getTableProps()} aria-label="Authorizations table">
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
                  disableSortBy?: boolean;
                };
                const { key: columnKey, ...columnProps } = column.getHeaderProps(
                  sortableColumn.disableSortBy !== true ? sortableColumn.getSortByToggleProps() : undefined
                );

                // Determine ARIA sort attribute for accessibility
                let ariaSort: AriaSortValue = 'none';
                if (sortableColumn.isSorted) {
                  ariaSort = sortableColumn.isSortedDesc ? 'descending' : 'ascending';
                }

                return (
                  <th
                    key={columnKey}
                    {...columnProps}
                    aria-sort={sortableColumn.disableSortBy !== true ? ariaSort : undefined}
                    className={sortableColumn.disableSortBy !== true ? 'sortable' : ''}
                  >
                    {column.render('Header')}
                    {sortableColumn.disableSortBy !== true && (
                      <span className="sort-icon-wrapper">
                        {renderSortIcon(sortableColumn.isSorted, sortableColumn.isSortedDesc)}
                      </span>
                    )}
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
          const authRow = row.original as AuthorizationRow;
          return (
            <tr key={rowKey} {...rowProps} className={authRow.original.inUpdate === true ? 'editing' : ''}>
              {row.cells.map(cell => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();
                return (
                  <td key={cellKey} {...cellProps}>
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
};

export default SortableAuthorizationsTable;
