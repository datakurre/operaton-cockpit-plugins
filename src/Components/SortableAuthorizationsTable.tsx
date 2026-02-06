/**
 * Sortable Authorization Table Component
 *
 * A sortable table for displaying authorization records with react-table.
 * Includes click-to-sort headers with ARIA accessibility support.
 */

/* eslint-disable max-lines-per-function, jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Sortable table with inline actions */
import React, { useMemo } from 'react';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { TiMinus } from 'react-icons/ti';
import { Column, useSortBy, useTable, CellProps } from 'react-table';

import {
  Authorization,
  AuthorizationRow,
  getAuthTypeLabel,
  getResourceTypeName,
  renderIdentityDisplay,
  renderResourceIdDisplay,
  ResourceValidationMap,
  ResolvedIdMap,
  ResourceUrlOptions,
} from '../utils/authorization';

/** ARIA sort direction value for accessible table headers */
type AriaSortValue = 'ascending' | 'descending' | 'none';

interface SortableAuthorizationsTableProps {
  authorizations: Authorization[];
  onEdit: (auth: Authorization) => void;
  onClone: (auth: Authorization) => void;
  onDelete: (auth: Authorization) => void;
  /** Optional map of resource IDs to their validation status */
  validationState?: ResourceValidationMap;
  /** Optional map of resource IDs to their resolved IDs (for keys -> actual IDs) */
  resolvedIds?: ResolvedIdMap;
  /** Optional cockpit base URL for cross-app navigation */
  cockpitBaseUrl?: string | undefined;
  /** Optional tasklist base URL for cross-app navigation */
  tasklistBaseUrl?: string | undefined;
  /** Whether to show action buttons (default: true) */
  showActions?: boolean;
  /** Whether to show resource type column (default: false) */
  showResourceType?: boolean;
}

/**
 * Sortable authorization table using react-table with click-to-sort headers.
 * Displays type, identity, permissions, resource ID with action buttons.
 */
const SortableAuthorizationsTable: React.FC<SortableAuthorizationsTableProps> = ({
  authorizations,
  onEdit,
  onClone,
  onDelete,
  validationState,
  resolvedIds,
  cockpitBaseUrl,
  tasklistBaseUrl,
  showActions = true,
  showResourceType = false,
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
          resourceType: auth.resourceType ?? null,
          resourceTypeName: getResourceTypeName(auth.resourceType ?? null),
        })
      ),
    [authorizations]
  );

  // Define columns for the table
  const columns = useMemo<Column<AuthorizationRow>[]>(() => {
    const baseColumns: Column<AuthorizationRow>[] = [];

    // Conditionally add Resource Type column first
    if (showResourceType) {
      baseColumns.push({
        Header: 'Resource Type',
        accessor: 'resourceTypeName',
        Cell: ({ value }: CellProps<AuthorizationRow, string>) => <span>{value}</span>,
      });
    }

    // Add remaining columns
    baseColumns.push(
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
        Cell: ({ row }: CellProps<AuthorizationRow, string>) => {
          const resourceId = row.original.original.resourceId;
          const status = resourceId && validationState ? validationState[resourceId] : undefined;
          const urlOptions: ResourceUrlOptions = {
            cockpitBaseUrl,
            tasklistBaseUrl,
            resolvedId: resourceId && resolvedIds ? resolvedIds[resourceId] : undefined,
          };
          return renderResourceIdDisplay(row.original.original.resourceType, resourceId, status, urlOptions);
        },
      }
    );

    // Only add Action column if showActions is true
    if (showActions) {
      baseColumns.push({
        Header: 'Action',
        id: 'action',
        // @ts-expect-error - disableSortBy exists in useSortBy plugin but not in base Column type
        disableSortBy: true,
        Cell: ({ row }: CellProps<AuthorizationRow>) => (
          <>
            <a
              onClick={() => {
                onEdit(row.original.original);
              }}
              className="action-link action-edit"
              title="Edit authorization"
            >
              <FaEdit className="action-icon" aria-hidden="true" /> Edit
            </a>
            <a
              onClick={() => {
                onClone(row.original.original);
              }}
              className="action-link action-clone"
              title="Clone authorization"
            >
              <FaCopy className="action-icon" aria-hidden="true" /> Clone
            </a>
            <a
              onClick={() => {
                onDelete(row.original.original);
              }}
              className="action-link action-delete"
              title="Delete authorization"
            >
              <FaTrash className="action-icon" aria-hidden="true" /> Delete
            </a>
          </>
        ),
      });
    }

    return baseColumns;
  }, [
    onEdit,
    onClone,
    onDelete,
    validationState,
    resolvedIds,
    cockpitBaseUrl,
    tasklistBaseUrl,
    showActions,
    showResourceType,
  ]);

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
