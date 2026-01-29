/**
 * BPMN overlay rendering utilities.
 *
 * Handles rendering badges and other overlays on BPMN diagram elements.
 * @module
 */
import type { BpmnViewerInstance, HistoricActivityInstance, OverlayManager } from '../../types';

/**
 * Renders activity count badges on the BPMN diagram overlays.
 * Shows how many times each activity was executed.
 * @param viewer - The BPMN viewer instance
 * @param activities - Historic activity instances to count
 */
export const renderActivities = (viewer: BpmnViewerInstance, activities: HistoricActivityInstance[]): void => {
  const counter: Record<string, number> = {};
  for (const activity of activities) {
    const id = activity.activityId ?? '';
    const current = counter[id];
    counter[id] = current !== undefined ? current + 1 : 1;
  }

  const seen: Record<string, boolean> = {};
  const overlays = viewer.get('overlays') as OverlayManager;
  for (const activity of activities) {
    const id = activity.activityId ?? '';
    if (seen[id]) {
      continue;
    } else {
      seen[id] = true;
    }

    const overlay = document.createElement('span');
    overlay.innerText = String(counter[id] ?? 0);
    overlay.className = 'badge';
    overlay.style.cssText = `
      background: lightgray;
      border: 1px solid #143d52;
      color: #143d52;
    `;
    overlays.add(id.split('#')[0] ?? '', {
      position: {
        bottom: 17,
        right: 10,
      },
      html: overlay,
    });
  }
};
