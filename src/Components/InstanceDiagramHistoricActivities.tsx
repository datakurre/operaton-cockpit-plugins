import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
import { ToggleHeatmapButton } from './ToggleHeatmapButton';
import { BpmnViewerInstance, HistoricActivityInstance, InstancePluginParams } from '../types';
import { getActivityHistoryPage } from '../utils/api';
import { loadSettings } from '../utils/misc';
import { clearHeatmap, clearSequenceFlow, renderActivities, renderHeatmap, renderSequenceFlow } from '../utils/bpmn';

interface InstanceDiagramHistoricActivitiesProps extends InstancePluginParams {
  viewer: BpmnViewerInstance;
}

/**
 * Component for rendering historic activity overlays, sequence flow toggle,
 * and time heatmap toggle on a process instance diagram.
 * Uses useEffect for async data fetching instead of async IIFE in render.
 */
export const InstanceDiagramHistoricActivities: React.FC<InstanceDiagramHistoricActivitiesProps> = ({
  api,
  processInstanceId,
  viewer,
}) => {
  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // The drawn paths live in a ref rather than in state: the toggle callback has to see
  // its own last write synchronously, or StrictMode's double effect run draws twice and
  // leaks the first set of curves.
  const sequenceFlowRef = useRef<SVGElement[]>([]);
  const heatmapRef = useRef<SVGElement[]>([]);
  const isHeatmapActiveRef = useRef(false);
  const hasOverlaysRendered = useRef(false);

  useEffect(() => {
    const fetchActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const page = await getActivityHistoryPage(api, processInstanceId, loadSettings().maxResults);
        setActivities(page.activities);
        setIsTruncated(page.truncated);
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
      clearHeatmap(heatmapRef.current);
      heatmapRef.current = [];
    },
    []
  );

  const handleToggleSequenceFlow = useCallback(
    (value: boolean): void => {
      if (value) {
        if (sequenceFlowRef.current.length === 0) {
          sequenceFlowRef.current = renderSequenceFlow(viewer, activities, { truncated: isTruncated });
        }
      } else if (sequenceFlowRef.current.length > 0) {
        clearSequenceFlow(sequenceFlowRef.current);
        sequenceFlowRef.current = [];
      }
    },
    [viewer, activities, isTruncated]
  );

  const handleToggleHeatmap = useCallback(
    (value: boolean): void => {
      isHeatmapActiveRef.current = value;
      if (!value) {
        clearHeatmap(heatmapRef.current);
        heatmapRef.current = [];
        return;
      }
      if (heatmapRef.current.length === 0) {
        heatmapRef.current = renderHeatmap(viewer, activities);
      }
    },
    [viewer, activities]
  );

  useEffect(() => {
    if (isHeatmapActiveRef.current && activities.length > 0) {
      clearHeatmap(heatmapRef.current);
      heatmapRef.current = renderHeatmap(viewer, activities);
    }
  }, [viewer, activities]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <ToggleSequenceFlowButton onToggleSequenceFlow={handleToggleSequenceFlow} partial={isTruncated} />
      <ToggleHeatmapButton onToggleHeatmap={handleToggleHeatmap} partial={isTruncated} />
    </>
  );
};

export default InstanceDiagramHistoricActivities;
