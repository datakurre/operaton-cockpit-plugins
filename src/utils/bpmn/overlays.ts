/**
 * BPMN overlay rendering utilities.
 *
 * Handles rendering badges and other overlays on BPMN diagram elements.
 * @module
 */
import type { BpmnViewerInstance, HistoricActivityInstance, OverlayManager } from '../../types';

/**
 * Whether an activity is one the instance is currently sitting on: started, not
 * finished, and not canceled.
 * @param activity - Historic activity instance
 * @returns True when the activity is still running
 */
const isRunning = (activity: HistoricActivityInstance): boolean => !activity.endTime && activity.canceled !== true;

/**
 * Draws Cockpit's own blue token badge on the activities a running instance is
 * currently sitting on.
 *
 * The markup is Cockpit's, deliberately: `.badge.instance-count` inside
 * `.activity-bottom-left-position.instances-overlay` picks up the webapp's own styling,
 * so the token matches the runtime view exactly and follows any theming rather than
 * being a lookalike drawn with inline colours. Bottom-left is where Cockpit puts it,
 * which also keeps it clear of the execution-count badge at bottom-right.
 *
 * A finished instance has no unfinished activities, so this draws nothing.
 *
 * @param viewer - The BPMN viewer instance
 * @param activities - Historic activity instances for the process instance
 * @returns The overlay ids created, so they can be removed again
 */
export const renderRunningTokens = (viewer: BpmnViewerInstance, activities: HistoricActivityInstance[]): string[] => {
  const running: Record<string, number> = {};
  for (const activity of activities) {
    if (!isRunning(activity)) {
      continue;
    }
    const elementId = (activity.activityId ?? '').split('#')[0] ?? '';
    if (elementId !== '') {
      running[elementId] = (running[elementId] ?? 0) + 1;
    }
  }

  const overlays = viewer.get('overlays') as OverlayManager;
  const ids: string[] = [];

  for (const elementId of Object.keys(running)) {
    const count = running[elementId] ?? 0;
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-bottom-left-position instances-overlay';
    const badge = document.createElement('span');
    badge.className = 'badge instance-count';
    badge.innerText = String(count);
    badge.title = count === 1 ? 'One running activity instance' : `${count} running activity instances`;
    wrapper.appendChild(badge);

    try {
      ids.push(overlays.add(elementId, { position: { bottom: 0, left: 0 }, html: wrapper }));
    } catch {
      // Silently skip elements that can't have overlays
    }
  }

  return ids;
};

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
