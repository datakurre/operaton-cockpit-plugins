import React from 'react';
import { CellProps, Column } from 'react-table';

import { HistoricActivityInstance } from '../types';
import { formatDateTime } from '../utils/formatting';
import { asctime } from '../utils/misc';
import { Clippy } from './Clippy';
import SortableTable from './SortableTable';

/**
 * Nested activity info structure used in the activity name column accessor.
 * Contains data needed to render links to related instances.
 */
interface ActivityNameValue {
  activityName: string;
  activityType: string;
  id: string;
  calledProcessInstanceId: string;
  endTime: string | null;
}

/**
 * Row data structure for the audit log table.
 * Derived from HistoricActivityInstance with formatted dates.
 */
interface ActivityRow {
  /** Full activity object for extracting linked instance data */
  activityName: ActivityNameValue;
  /** Start time as Date object for sorting */
  startDate: Date;
  /** End time as Date object or null if not ended */
  endDate: Date | null;
  /** Human-readable duration string */
  duration: string;
  /** Activity type (e.g., userTask, serviceTask) */
  type: string;
  /** User assigned to the activity (for user tasks) */
  assignee: string;
  /** Whether the activity was canceled */
  canceled: string;
}

interface Props {
  activities: HistoricActivityInstance[];
  decisions: Map<string, string>;
}

/**
 * Audit log table displaying historic activity instances with timing,
 * assignee, and navigation links to related process/decision instances.
 */
const AuditLogTable: React.FC<Props> = ({ activities, decisions }) => {
  const columns = React.useMemo<Column<ActivityRow>[]>(
    () => [
      {
        Header: 'Activity Name',
        accessor: (row: ActivityRow): ActivityNameValue => row.activityName,
        Cell: ({ value }: CellProps<ActivityRow, ActivityNameValue>) => {
          const baseUrl = `${window.location.href.split('#')[0] ?? ''}/`
            .replace(/\/+$/, '/')
            .replace(/\/app\/tasklist\//, '/app/cockpit/');
          if (value.activityType === 'businessRuleTask' && decisions.has(value.id)) {
            return <a href={`${baseUrl}#/decision-instance/${decisions.get(value.id) ?? ''}`}>{value.activityName}</a>;
          } else if (value.activityType === 'callActivity' && value.calledProcessInstanceId && value.endTime) {
            return (
              <a href={`${baseUrl}#/history/process-instance/${value.calledProcessInstanceId}`}>{value.activityName}</a>
            );
          } else if (value.activityType === 'callActivity' && value.calledProcessInstanceId) {
            return <a href={`${baseUrl}#/process-instance/${value.calledProcessInstanceId}`}>{value.activityName}</a>;
          }
          return <Clippy value={value.activityName}>{value.activityName}</Clippy>;
        },
      },
      {
        Header: 'Start Time',
        accessor: 'startDate',
        Cell: ({ value }: CellProps<ActivityRow, Date>) => {
          const formatted = formatDateTime(value);
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
      {
        Header: 'End Time',
        accessor: 'endDate',
        Cell: ({ value }: CellProps<ActivityRow, Date | null>) => {
          const formatted = value ? formatDateTime(value) : '';
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        Cell: ({ value }: CellProps<ActivityRow, string>) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }: CellProps<ActivityRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'User',
        accessor: 'assignee',
        Cell: ({ value }: CellProps<ActivityRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Canceled',
        accessor: 'canceled',
        Cell: ({ value }: CellProps<ActivityRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
    ],
    [decisions]
  );
  const data = React.useMemo<ActivityRow[]>(
    () =>
      activities.map((activity: HistoricActivityInstance): ActivityRow => {
        const startTime = activity.startTime ? new Date(activity.startTime) : new Date(0);
        const endTime = activity.endTime ? new Date(activity.endTime) : null;
        return {
          activityName: {
            activityName: activity.activityName ?? '',
            activityType: activity.activityType ?? '',
            id: activity.id ?? '',
            calledProcessInstanceId: activity.calledProcessInstanceId ?? '',
            endTime: activity.endTime ?? null,
          },
          startDate: startTime,
          endDate: endTime,
          duration: endTime ? asctime(endTime.getTime() - startTime.getTime()) : '',
          type: activity.activityType ?? '',
          assignee: activity.assignee ?? '',
          canceled: activity.canceled ? 'true' : 'false',
        };
      }),
    [activities]
  );

  return <SortableTable<ActivityRow> columns={columns} data={data} ariaLabel="Audit log table" />;
};

export default AuditLogTable;
