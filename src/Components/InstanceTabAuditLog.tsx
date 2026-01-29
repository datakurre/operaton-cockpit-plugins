import React, { useEffect, useState } from 'react';
import AuditLogTable from './AuditLogTable';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { InstancePluginParams } from '../types';
import { get } from '../utils/api';
import { sortActivitiesByEndTime, mapDecisionsByActivity } from '../utils/misc';

interface HistoricActivity {
  activityId: string;
  activityInstanceId?: string;
  activityName?: string;
  activityType?: string;
  endTime?: string;
  startTime?: string;
}

interface DecisionInstance {
  id: string;
  activityInstanceId: string;
}

/**
 * Component for rendering the audit log tab on a process instance.
 * Uses useEffect for async data fetching instead of async IIFE in render.
 */
export const InstanceTabAuditLog: React.FC<InstancePluginParams> = ({ api, processInstanceId }) => {
  const [activities, setActivities] = useState<HistoricActivity[]>([]);
  const [decisionByActivity, setDecisionByActivity] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const [activitiesData, decisionsData] = await Promise.all([
          get(api, '/history/activity-instance', { processInstanceId }),
          get(api, '/history/decision-instance', { processInstanceId }),
        ]);

        const decisions = decisionsData as DecisionInstance[];
        const decisionMap = mapDecisionsByActivity(decisions);
        const sortedActivities = sortActivitiesByEndTime(activitiesData as HistoricActivity[]);

        setActivities(sortedActivities);
        setDecisionByActivity(decisionMap);
      } catch (err) {
        console.error('Failed to fetch audit log data:', err);
        setError('Failed to load audit log data.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [api, processInstanceId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message={error} />;
  }

  return <AuditLogTable activities={activities} decisions={decisionByActivity} />;
};

export default InstanceTabAuditLog;
