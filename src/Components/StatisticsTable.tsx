import React from 'react';
import { CellProps, Column } from 'react-table';

import { HistoricActivityInstance } from '../types';
import { asctime } from '../utils/misc';
import { Clippy } from './Clippy';
import SortableTable from './SortableTable';

/**
 * Row data structure for the statistics table.
 * Contains aggregated timing metrics per activity.
 */
interface StatRow {
  /** Name of the activity */
  activityName: string;
  /** Number of times this activity was executed */
  instances: number;
  /** Total duration (formatted as human-readable string) */
  duration: string;
  /** Average duration (formatted as human-readable string) */
  average: string;
  /** Median duration (formatted as human-readable string) */
  median: string;
}

interface Props {
  activities: HistoricActivityInstance[];
}

/**
 * Statistics table displaying aggregated activity timing metrics
 * including instance counts, total/average/median durations.
 */
const StatisticsTable: React.FC<Props> = ({ activities }) => {
  const columns = React.useMemo<Column<StatRow>[]>(
    () => [
      {
        Header: 'Activity Name',
        accessor: 'activityName',
        Cell: ({ value }: CellProps<StatRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Instances',
        accessor: 'instances',
        Cell: ({ value }: CellProps<StatRow, number>) => <Clippy value={String(value)}>{value}</Clippy>,
      },
      {
        Header: 'Total',
        accessor: 'duration',
        Cell: ({ value }: CellProps<StatRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Average',
        accessor: 'average',
        Cell: ({ value }: CellProps<StatRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Median',
        accessor: 'median',
        Cell: ({ value }: CellProps<StatRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
    ],
    []
  );
  const counter = React.useMemo(() => {
    const counter: Record<string, number> = {};
    for (const activity of activities) {
      const name = activity.activityName ?? '';
      const current = counter[name];
      counter[name] = current !== undefined ? current + 1 : 1;
    }
    return counter;
  }, [activities]);
  const [totals, durations] = React.useMemo(() => {
    const totals: Record<string, number> = {};
    const durations: Record<string, number[]> = {};
    for (const activity of activities) {
      const activityName = activity.activityName ?? '';
      const duration = new Date(activity.endTime ?? 0).getTime() - new Date(activity.startTime ?? 0).getTime();
      totals[activityName] = (totals[activityName] ?? 0) + duration;
      const existingDurations = durations[activityName];
      if (existingDurations === undefined) {
        durations[activityName] = [duration];
      } else {
        existingDurations.push(duration);
      }
    }
    return [totals, durations];
  }, [activities]);
  const activityNames = React.useMemo(() => {
    const activityNames = Object.keys(durations);
    activityNames.sort((a, b) => {
      const totalA = totals[a] ?? 0;
      const totalB = totals[b] ?? 0;
      if (totalA > totalB) {
        return -1;
      } else if (totalA < totalB) {
        return 1;
      }
      return 0;
    });
    return activityNames;
  }, [durations, totals]);
  const data = React.useMemo<StatRow[]>(
    () =>
      activityNames.map((activityName: string): StatRow => {
        const activityDurations = durations[activityName] ?? [];
        activityDurations.sort((a: number, b: number) => {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          }
          return 0;
        });
        const total = totals[activityName] ?? 0;
        const count = counter[activityName] ?? 1;
        const median = activityDurations[Math.floor(activityDurations.length / 2)] ?? 0;
        return {
          activityName,
          instances: count,
          duration: asctime(total),
          average: asctime(total / count),
          median: asctime(median),
        };
      }),
    [activityNames, counter, durations, totals]
  );

  return <SortableTable<StatRow> columns={columns} data={data} ariaLabel="Activity statistics table" />;
};

export default StatisticsTable;
