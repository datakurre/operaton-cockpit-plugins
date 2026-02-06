import React from 'react';
import { CellProps, Column, SortByFn } from 'react-table';

import { HistoricProcessInstance } from '../types';
import { formatDateTime } from '../utils/formatting';
import { Clippy } from './Clippy';
import SortableTable from './SortableTable';

/**
 * Row data structure for the history table.
 * Derived from HistoricProcessInstance with formatted dates.
 */
interface InstanceRow {
  /** Process instance state (ACTIVE, COMPLETED, etc.) */
  state: string;
  /** Process instance ID */
  id: string;
  /** Optional business key */
  businessKey: string;
  /** Start time as Date object for sorting */
  startTime: Date;
  /** End time as Date object or null if still running */
  endTime: Date | null;
}

/**
 * Custom sort function for Date columns.
 * Handles null values by treating them as either "far future" (for endTime)
 * or properly comparing Date objects.
 */
const dateSortFn: SortByFn<InstanceRow> = (rowA, rowB, columnId) => {
  const a = rowA.values[columnId] as Date | null;
  const b = rowB.values[columnId] as Date | null;
  
  // Handle null values - null is treated as "far future" for endTime
  // This keeps running processes (no end time) at one end of the sort
  if (a === null && b === null) return 0;
  if (a === null) return 1; // null goes to end
  if (b === null) return -1; // null goes to end
  
  // Compare Date objects using timestamps
  return a.getTime() - b.getTime();
};

interface Props {
  instances: HistoricProcessInstance[];
}

/**
 * History table displaying historic process instances with state,
 * timing information, and links to instance details.
 */
const HistoryTable: React.FC<Props> = ({ instances }) => {
  const columns = React.useMemo<Column<InstanceRow>[]>(
    () => [
      {
        Header: 'State',
        accessor: 'state',
        Cell: ({ value }: CellProps<InstanceRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Instance ID',
        accessor: 'id',
        Cell: ({ value }: CellProps<InstanceRow, string>) => (
          <Clippy value={value}>
            <a href={`#/history/process-instance/${value}`}>{value}</a>
          </Clippy>
        ),
      },
      {
        Header: 'Start Time',
        accessor: 'startTime',
        sortType: dateSortFn,
        Cell: ({ value }: CellProps<InstanceRow, Date>) => {
          const formatted = formatDateTime(value);
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
      {
        Header: 'End Time',
        accessor: 'endTime',
        sortType: dateSortFn,
        Cell: ({ value }: CellProps<InstanceRow, Date | null>) => {
          const formatted = value ? formatDateTime(value) : '';
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
      {
        Header: 'Business Key',
        accessor: 'businessKey',
        Cell: ({ value }: CellProps<InstanceRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
    ],
    []
  );
  const data = React.useMemo<InstanceRow[]>(
    () =>
      instances.map((instance: HistoricProcessInstance): InstanceRow => {
        return {
          state: instance.state ?? '',
          id: instance.id ?? '',
          businessKey: instance.businessKey ?? '',
          startTime: instance.startTime ? new Date(instance.startTime) : new Date(0),
          endTime: instance.endTime ? new Date(instance.endTime) : null,
        };
      }),
    [instances]
  );

  return <SortableTable<InstanceRow> columns={columns} data={data} ariaLabel="Process instance history table" />;
};

export default HistoryTable;
