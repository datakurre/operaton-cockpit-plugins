import React, { useEffect, useState } from 'react';
import AuditLogTable from './AuditLogTable';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { HistoricActivityInstance, TaskListPluginParams } from '../types';
import { getTask, getActivities, getDecisions } from '../utils/api';
import { sortActivitiesByEndTime, mapDecisionsByActivity } from '../utils/misc';

/**
 * Component for rendering the audit log tab on a tasklist task.
 * Uses useEffect for async data fetching instead of async IIFE in render.
 */
export const TasklistTabAuditLog: React.FC<TaskListPluginParams> = ({ api, taskId }) => {
  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [decisionByActivity, setDecisionByActivity] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId === undefined) {
      setIsLoading(false);
      return;
    }

    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const { processInstanceId } = await getTask(api, taskId);

        const [activitiesData, decisionsData] = await Promise.all([
          getActivities(api, processInstanceId),
          getDecisions(api, processInstanceId),
        ]);

        const decisionMap = mapDecisionsByActivity(decisionsData);
        const sortedActivities = sortActivitiesByEndTime(activitiesData);

        setActivities(sortedActivities);
        setDecisionByActivity(decisionMap);
      } catch (err) {
        console.error('Failed to fetch tasklist audit log data:', err);
        setError('Failed to load audit log data.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [api, taskId]);

  if (taskId === undefined) {
    return <div className="alert alert-info">No task selected.</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message={error} />;
  }

  return <AuditLogTable activities={activities} decisions={decisionByActivity} />;
};

export default TasklistTabAuditLog;
