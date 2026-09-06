/**
 * BPMN overlay rendering utilities.
 *
 * Handles rendering badges and other overlays on BPMN diagram elements.
 * @module
 */
import type { BpmnViewerInstance, HistoricActivityInstance, OverlayManager } from '../../types';
import { asctime } from '../misc';
import { aggregateDurations } from './heatmap';

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
 *
 * The badge is the token count for the element — how many times a token has been
 * through it — and its tooltip carries the cumulative time those tokens spent there.
 * That pairing is deliberate: the heatmap colours by time, and the badge is where the
 * figure behind a blob can actually be read. It matches the definition diagram's
 * statistics badges, so the same element means the same thing on every view.
 *
 * Ids are folded exactly as the heatmap folds them — execution scope suffixes stripped,
 * multi-instance bodies skipped — so the count belongs to the blob it sits on. Counting
 * raw ids instead put a second badge on top of the first for any scoped activity, each
 * showing part of the total.
 *
 * @param viewer - The BPMN viewer instance
 * @param activities - Historic activity instances to count
 */
export const renderActivities = (viewer: BpmnViewerInstance, activities: HistoricActivityInstance[]): void => {
  const counter: Record<string, number> = {};
  for (const activity of activities) {
    const activityId = activity.activityId ?? '';
    if (activityId === '' || activityId.endsWith('#multiInstanceBody')) {
      continue;
    }
    const elementId = activityId.split('#')[0] ?? '';
    counter[elementId] = (counter[elementId] ?? 0) + 1;
  }

  const totals = new Map(aggregateDurations(activities).map(cell => [cell.elementId, cell.totalMillis]));
  const overlays = viewer.get('overlays') as OverlayManager;

  for (const elementId of Object.keys(counter)) {
    const overlay = document.createElement('span');
    overlay.innerText = String(counter[elementId] ?? 0);
    overlay.className = 'badge';
    // "so far" because a token still sitting on the element is counted too.
    overlay.title = `Cumulative time in this element so far: ${asctime(totals.get(elementId) ?? 0)}`;
    overlay.style.cssText = `
      background: lightgray;
      border: 1px solid #143d52;
      color: #143d52;
    `;
    try {
      overlays.add(elementId, {
        position: {
          bottom: 17,
          right: 10,
        },
        html: overlay,
      });
    } catch {
      // Silently skip elements that can't have overlays
    }
  }
};
