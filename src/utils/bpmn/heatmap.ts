/**
 * BPMN heatmap rendering.
 *
 * Shades the diagram by how much cumulative time each element consumed, so the parts
 * of a process that cost the most are visible at a glance rather than having to be
 * read out of a table.
 * @module
 */
import { append as svgAppend, attr as svgAttr, create as svgCreate, remove as svgRemove } from 'tiny-svg';

import type { BpmnViewerInstance, Canvas, ElementRegistry, HistoricActivityInstance } from '../../types';
import {
  HEATMAP_BLOOM,
  HEATMAP_BLUR,
  HEATMAP_CORE,
  HEATMAP_GAMMA,
  HEATMAP_LAYER_INDEX,
  HEATMAP_MIN_ALPHA,
  HEATMAP_MIN_RADIUS,
  HEATMAP_OPACITY,
  HEATMAP_RADIUS_SCALE,
} from '../constants';
import { resolveDefs } from './svg';

/** A diagram element and the total time spent in it. */
export interface HeatmapCell {
  elementId: string;
  /** Summed duration of every execution of the element, in milliseconds. */
  totalMillis: number;
}

/**
 * Colour ramp, cold to hot. Chosen to read as heat rather than as status: it avoids
 * the executed path's green at both ends, so the two overlays can be on together.
 */
/* eslint-disable no-magic-numbers -- channel values of a colour ramp are data */
const HEAT_RAMP: { stop: number; rgb: [number, number, number] }[] = [
  { stop: 0, rgb: [43, 92, 214] },
  { stop: 0.35, rgb: [38, 190, 198] },
  { stop: 0.6, rgb: [122, 201, 67] },
  { stop: 0.8, rgb: [240, 196, 42] },
  { stop: 1, rgb: [216, 44, 32] },
];
/* eslint-enable no-magic-numbers */

/** Counter behind per-render ids, so two diagrams on one page cannot share defs. */
let heatmapSequence = 0;

/**
 * Strips the execution scope suffix the engine appends to an activity id.
 */
const toElementId = (activityId: string): string => activityId.split('#')[0] ?? '';

/**
 * Multi-instance bodies span their instances, so counting both double-counts the time.
 */
const isMultiInstanceBody = (activityId: string): boolean => activityId.endsWith('#multiInstanceBody');

/**
 * Milliseconds an activity occupied, preferring the engine's own figure and falling
 * back to the timestamps when it is absent.
 * @param activity - Historic activity instance
 * @returns Duration in milliseconds, or 0 when it cannot be determined
 */
function durationOf(activity: HistoricActivityInstance): number {
  if (typeof activity.durationInMillis === 'number') {
    return activity.durationInMillis;
  }
  if (!activity.startTime || !activity.endTime) {
    return 0;
  }
  const elapsed = Date.parse(activity.endTime) - Date.parse(activity.startTime);
  return Number.isNaN(elapsed) ? 0 : elapsed;
}

/**
 * Sums the time spent per diagram element.
 *
 * Still-running activities contribute nothing: they have no duration yet, and guessing
 * one would make the hottest spot of a diagram the thing that simply has not finished.
 *
 * @param activities - Historic activity instances to aggregate
 * @returns One cell per element that consumed time, hottest first
 */
export function aggregateDurations(activities: HistoricActivityInstance[]): HeatmapCell[] {
  const totals = new Map<string, number>();

  for (const activity of activities) {
    const activityId = activity.activityId ?? '';
    if (activityId === '' || isMultiInstanceBody(activityId)) {
      continue;
    }
    const elementId = toElementId(activityId);
    totals.set(elementId, (totals.get(elementId) ?? 0) + durationOf(activity));
  }

  const cells: HeatmapCell[] = [];
  for (const entry of Array.from(totals.entries())) {
    if (entry[1] > 0) {
      cells.push({ elementId: entry[0], totalMillis: entry[1] });
    }
  }
  cells.sort((a, b) => b.totalMillis - a.totalMillis);
  return cells;
}

/**
 * Maps a 0..1 intensity onto the ramp.
 * @param intensity - Normalised heat, clamped to 0..1
 * @returns An `rgb()` colour string
 */
export function getHeatColor(intensity: number): string {
  const t = Math.min(1, Math.max(0, intensity));
  let lower = HEAT_RAMP[0] as (typeof HEAT_RAMP)[number];
  let upper = HEAT_RAMP[HEAT_RAMP.length - 1] as (typeof HEAT_RAMP)[number];

  for (let i = 0; i < HEAT_RAMP.length - 1; i++) {
    const a = HEAT_RAMP[i] as (typeof HEAT_RAMP)[number];
    const b = HEAT_RAMP[i + 1] as (typeof HEAT_RAMP)[number];
    if (t >= a.stop && t <= b.stop) {
      lower = a;
      upper = b;
      break;
    }
  }

  const span = upper.stop - lower.stop;
  const ratio = span === 0 ? 0 : (t - lower.stop) / span;
  const channel = (index: number): number =>
    Math.round((lower.rgb[index] ?? 0) + ((upper.rgb[index] ?? 0) - (lower.rgb[index] ?? 0)) * ratio);

  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

/**
 * Normalises a total against the hottest element.
 *
 * Time per activity is heavy-tailed — one waiting user task can dwarf every service
 * task in the process — so a straight ratio would leave everything but the worst
 * offender uniformly cold. The gamma lifts the middle without reordering anything.
 *
 * @param totalMillis - This element's total
 * @param maxMillis - The hottest element's total
 * @returns Intensity in 0..1
 */
export function getIntensity(totalMillis: number, maxMillis: number): number {
  if (maxMillis <= 0) {
    return 0;
  }
  return Math.pow(Math.min(1, totalMillis / maxMillis), HEATMAP_GAMMA);
}

/** Shape bounds, as far as the heatmap needs them. */
interface Bounds {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/** Gradient stops per blob, from the hot core out to the transparent rim. */
const BLOB_STOPS = 6;

/** Decimal places kept on a stop's opacity. */
const ALPHA_PRECISION = 3;

/**
 * Builds the radial gradient a single blob is painted with.
 *
 * The ramp is walked *within* each blob rather than one flat hue per element: the core
 * sits at the element's own intensity and cools outwards through the ramp to a
 * transparent rim. That is what makes a hot element read as a hot spot — a red core
 * inside a yellow-green halo — instead of a uniformly tinted disc.
 *
 * @param defs - The defs element to append to
 * @param id - Unique gradient id
 * @param intensity - The element's normalised heat
 * @returns The created gradient
 */
function createBlobGradient(defs: SVGElement, id: string, intensity: number): SVGElement {
  const gradient = svgCreate('radialGradient');
  svgAttr(gradient, { id });

  // Alpha carries intensity as well as the colour does. Without it a barely-used
  // element paints just as solidly as the worst offender, only in blue, and the
  // diagram reads as uniformly busy instead of pointing at the slow parts.
  const weight = HEATMAP_MIN_ALPHA + (1 - HEATMAP_MIN_ALPHA) * intensity;

  for (let step = 0; step < BLOB_STOPS; step++) {
    const along = step / (BLOB_STOPS - 1);
    const stop = svgCreate('stop');
    svgAttr(stop, {
      offset: `${Math.round(along * 100)}%`,
      'stop-color': getHeatColor(intensity * Math.pow(1 - along, HEATMAP_CORE)),
      'stop-opacity': ((1 - along) * weight).toFixed(ALPHA_PRECISION),
    });
    svgAppend(gradient, stop);
  }

  svgAppend(defs, gradient);
  return gradient;
}

/**
 * Renders the heatmap layer over the diagram.
 *
 * Blobs are drawn in diagram coordinates on their own canvas layer, so panning and
 * zooming carry them along without any redraw, and the whole group is blurred as one
 * so neighbouring hot spots merge instead of reading as separate discs.
 *
 * @param viewer - The BPMN viewer instance
 * @param activities - Historic activity instances to visualise
 * @returns The SVG nodes added, for later cleanup
 */
export const renderHeatmap = (viewer: BpmnViewerInstance, activities: HistoricActivityInstance[]): SVGElement[] => {
  const registry = viewer.get('elementRegistry') as ElementRegistry;
  const canvas = viewer.get('canvas') as Canvas;
  const cells = aggregateDurations(activities);
  const added: SVGElement[] = [];

  if (cells.length === 0) {
    return added;
  }

  const maxMillis = cells[0]?.totalMillis ?? 0;
  const defs = resolveDefs(canvas);
  const sequence = heatmapSequence++;

  const filterId = `history-heatmap-blur-${sequence}`;
  const filterEl = svgCreate('filter');
  svgAttr(filterEl, { id: filterId, x: '-50%', y: '-50%', width: '200%', height: '200%' });
  const blur = svgCreate('feGaussianBlur');
  svgAttr(blur, { stdDeviation: HEATMAP_BLUR });
  svgAppend(filterEl, blur);
  svgAppend(defs, filterEl);
  added.push(filterEl);

  const group = svgCreate('g');
  svgAttr(group, {
    class: 'history-heatmap',
    filter: `url(#${filterId})`,
    opacity: HEATMAP_OPACITY,
    'pointer-events': 'none',
  });

  cells.forEach((cell, index) => {
    const element = registry.get(cell.elementId) as unknown as Bounds | undefined;
    const width = element?.width;
    const height = element?.height;
    if (element === undefined || width === undefined || height === undefined) {
      return;
    }

    const intensity = getIntensity(cell.totalMillis, maxMillis);
    const gradientId = `history-heatmap-blob-${sequence}-${index}`;
    added.push(createBlobGradient(defs, gradientId, intensity));

    // Hot spots bloom a little wider as well as brighter, so they read first.
    const spread = 1 - HEATMAP_BLOOM + HEATMAP_BLOOM * intensity;
    const radius = Math.max(HEATMAP_MIN_RADIUS, (Math.max(width, height) / 2) * HEATMAP_RADIUS_SCALE) * spread;
    const blob = svgCreate('ellipse');
    svgAttr(blob, {
      cx: (element.x ?? 0) + width / 2,
      cy: (element.y ?? 0) + height / 2,
      rx: radius,
      ry: radius,
      fill: `url(#${gradientId})`,
    });
    svgAppend(group, blob);
  });

  svgAppend(canvas.getLayer('historyHeatmap', HEATMAP_LAYER_INDEX), group);
  added.push(group);
  return added;
};

/**
 * Removes heatmap nodes previously added to the diagram.
 * @param nodes - The nodes returned by renderHeatmap
 */
export const clearHeatmap = (nodes: SVGElement[]): void => {
  for (const node of nodes) {
    svgRemove(node);
  }
};
