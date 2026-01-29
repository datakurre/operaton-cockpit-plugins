import React, { useEffect, useState } from 'react';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
import { InstancePluginParams } from '../types';
import { OverlayManager } from '../services/ViewerService';
import { get } from '../utils/api';
import { clearSequenceFlow, renderSequenceFlow } from '../utils/bpmn';

interface HistoricActivity {
  activityId: string;
  activityName?: string;
  activityType?: string;
  endTime?: string;
  startTime?: string;
}

/** Interface for BPMN viewer instance */
interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (serviceName: string) => unknown;
}

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
  const [activities, setActivities] = useState<HistoricActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sequenceFlow, setSequenceFlow] = useState<SVGElement[]>([]);
  const [hasOverlaysRendered, setHasOverlaysRendered] = useState(false);

  useEffect(() => {
    const fetchActivities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const data = await get(api, '/history/activity-instance', { processInstanceId });
        setActivities(data as HistoricActivity[]);
      } catch (err) {
        console.error('Failed to fetch historic activities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchActivities();
  }, [api, processInstanceId]);

  useEffect(() => {
    if (isLoading || hasOverlaysRendered || activities.length === 0) {
      return;
    }

    const overlays = viewer.get('overlays') as OverlayManager;

    const counter: Record<string, number> = {};
    for (const activity of activities) {
      const id = activity.activityId;
      counter[id] = counter[id] !== undefined ? counter[id] + 1 : 1;
    }

    const seen: Record<string, boolean> = {};
    for (const activity of activities) {
      const id = activity.activityId;
      if (seen[id] === true) {
        continue;
      } else {
        seen[id] = true;
      }

      const overlay = document.createElement('span');
      overlay.innerText = String(counter[id] ?? 0);
      overlay.className = 'badge';
      overlay.style.cssText = `
        background: lightgray;
      `;
      const elementId = id.split('#')[0];
      if (elementId !== undefined) {
        overlays.add(elementId, {
          position: {
            bottom: 17,
            right: 10,
          },
          html: overlay,
        });
      }
    }

    setHasOverlaysRendered(true);
  }, [isLoading, activities, viewer, hasOverlaysRendered]);

  const handleToggleSequenceFlow = (value: boolean): void => {
    if (value) {
      if (sequenceFlow.length === 0) {
        const newSequenceFlow = renderSequenceFlow(
          viewer as unknown as { get: (s: string) => unknown; _container: HTMLElement },
          activities
        );
        setSequenceFlow(newSequenceFlow);
      }
    } else {
      if (sequenceFlow.length > 0) {
        clearSequenceFlow(sequenceFlow);
        setSequenceFlow([]);
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return <ToggleSequenceFlowButton onToggleSequenceFlow={handleToggleSequenceFlow} />;
};

export default InstanceDiagramHistoricActivities;
