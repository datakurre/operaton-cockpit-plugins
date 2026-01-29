import React from 'react';
import { CellProps, Column } from 'react-table';

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
        Cell: ({ value }: CellProps<InstanceRow, Date>) => {
          const formatted = formatDateTime(value);
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
      {
        Header: 'End Time',
        accessor: 'endTime',
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
