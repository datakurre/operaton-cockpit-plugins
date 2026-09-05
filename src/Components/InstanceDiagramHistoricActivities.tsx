import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
import { BpmnViewerInstance, HistoricActivityInstance, InstancePluginParams } from '../types';
import { get } from '../utils/api';
import { clearSequenceFlow, renderActivities, renderSequenceFlow } from '../utils/bpmn';

interface InstanceDiagramHistoricActivitiesProps extends InstancePluginParams {
  viewer: BpmnViewerInstance;
}

/**
 * Component for rendering historic activity overlays and sequence flow toggle on a process instance diagram.
 * Uses useEffect for async data fetching instead of async IIFE in render.
 */
export const InstanceDiagramHistoricActivities: React.FC<InstanceDiagramHistoricActivitiesProps> = ({
  api,
  processInstanceId,
  viewer,
}) => {
  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // The drawn paths live in a ref rather than in state: the toggle callback has to see
  // its own last write synchronously, or StrictMode's double effect run draws twice and
  // leaks the first set of curves.
  const sequenceFlowRef = useRef<SVGElement[]>([]);
  const hasOverlaysRendered = useRef(false);

  useEffect(() => {
    const fetchActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await get(api, '/history/activity-instance', { processInstanceId });
        setActivities(data as HistoricActivityInstance[]);
      } catch (err) {
        console.error('Failed to fetch historic activities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchActivities();
  }, [api, processInstanceId]);

  useEffect(() => {
    if (isLoading || hasOverlaysRendered.current || activities.length === 0) {
      return;
    }
    renderActivities(viewer, activities);
    hasOverlaysRendered.current = true;
  }, [isLoading, activities, viewer]);

  useEffect(
    () => (): void => {
      clearSequenceFlow(sequenceFlowRef.current);
      sequenceFlowRef.current = [];
    },
    []
  );

  const handleToggleSequenceFlow = useCallback(
    (value: boolean): void => {
      if (value) {
        if (sequenceFlowRef.current.length === 0) {
          sequenceFlowRef.current = renderSequenceFlow(viewer, activities);
        }
      } else if (sequenceFlowRef.current.length > 0) {
        clearSequenceFlow(sequenceFlowRef.current);
        sequenceFlowRef.current = [];
      }
    },
    [viewer, activities]
  );

  if (isLoading) {
    return null;
  }

  return <ToggleSequenceFlowButton onToggleSequenceFlow={handleToggleSequenceFlow} />;
};

export default InstanceDiagramHistoricActivities;
