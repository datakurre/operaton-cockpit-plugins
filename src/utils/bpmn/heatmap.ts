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
  HEATMAP_ALPHA_EXPONENT,
  HEATMAP_ALPHA_SLOPE,
  HEATMAP_BLOOM,
  HEATMAP_BLUR,
  HEATMAP_DENSITY_GAIN,
  HEATMAP_GAMMA,
  HEATMAP_LAYER_INDEX,
  HEATMAP_MIN_DENSITY,
  HEATMAP_MIN_RADIUS,
  HEATMAP_OPACITY,
  HEATMAP_PATH_WIDTH,
  HEATMAP_RADIUS_SCALE,
  HEATMAP_RAMP_SAMPLES,
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

/** Shape bounds and connection waypoints, as far as the heatmap needs them. */
interface Bounds {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  outgoing?: { id: string; target: { id: string }; waypoints?: { x: number; y: number }[] }[];
}

/**
 * Builds the filter that turns the density field into heat.
 *
 * This is the part that makes the map continuous rather than a scatter of coloured
 * discs. Everything below is drawn in plain white at varying opacity, so overlapping
 * contributions compose into one greyscale density field; only then is that field
 * blurred and mapped through the colour ramp. Colouring each blob separately, as the
 * first version did, cannot merge neighbours — two warm elements stay two warm spots
 * instead of becoming one warm region.
 *
 * The chain is: blur, copy alpha into every channel, then transfer each channel
 * through a table sampled from the ramp. Because the tables are indexed by the same
 * density value, the result is the ramp colour for that density.
 *
 * @param defs - The defs element to append to
 * @param id - Unique filter id
 * @returns The created filter
 */
function createHeatFilter(defs: SVGElement, id: string): SVGElement {
  const filterEl = svgCreate('filter');
  svgAttr(filterEl, {
    id,
    x: '-25%',
    y: '-25%',
    width: '150%',
    height: '150%',
    // Without this the browser interpolates in linearRGB and the ramp washes out.
    'color-interpolation-filters': 'sRGB',
  });

  const blur = svgCreate('feGaussianBlur');
  svgAttr(blur, { in: 'SourceGraphic', stdDeviation: HEATMAP_BLUR, result: 'density' });
  svgAppend(filterEl, blur);

  // Copy the density (alpha) into R, G and B so the transfer tables below all read it.
  const spread = svgCreate('feColorMatrix');
  svgAttr(spread, {
    in: 'density',
    type: 'matrix',
    // The gain in every row lifts the blurred peak back to the top of the ramp.
    values: `0 0 0 ${HEATMAP_DENSITY_GAIN} 0  0 0 0 ${HEATMAP_DENSITY_GAIN} 0  0 0 0 ${HEATMAP_DENSITY_GAIN} 0  0 0 0 ${HEATMAP_DENSITY_GAIN} 0`,
    result: 'grey',
  });
  svgAppend(filterEl, spread);

  const channels: number[][] = [[], [], []];
  const alphas: number[] = [];
  for (let sample = 0; sample < HEATMAP_RAMP_SAMPLES; sample++) {
    const along = sample / (HEATMAP_RAMP_SAMPLES - 1);
    const rgb = /rgb\((\d+), (\d+), (\d+)\)/.exec(getHeatColor(along));
    for (let channel = 0; channel < channels.length; channel++) {
      (channels[channel] as number[]).push(Number(rgb?.[channel + 1] ?? 0) / MAX_CHANNEL);
    }
    // Cold density fades out rather than hazing blue across the whole canvas.
    alphas.push(Math.min(1, Math.pow(along, HEATMAP_ALPHA_EXPONENT) * HEATMAP_ALPHA_SLOPE));
  }

  const transfer = svgCreate('feComponentTransfer');
  svgAttr(transfer, { in: 'grey' });
  (['feFuncR', 'feFuncG', 'feFuncB'] as const).forEach((name, channel) => {
    const func = svgCreate(name);
    svgAttr(func, { type: 'table', tableValues: (channels[channel] as number[]).join(' ') });
    svgAppend(transfer, func);
  });
  const funcA = svgCreate('feFuncA');
  svgAttr(funcA, { type: 'table', tableValues: alphas.join(' ') });
  svgAppend(transfer, funcA);
  svgAppend(filterEl, transfer);

  svgAppend(defs, filterEl);
  return filterEl;
}

/**
 * The single radial gradient every density blob is painted with: opaque white at the
 * centre, transparent at the rim. One definition serves every blob because intensity
 * is carried by the blob's own opacity, not by its colour.
 */
function createDensityGradient(defs: SVGElement, id: string): SVGElement {
  const gradient = svgCreate('radialGradient');
  svgAttr(gradient, { id });
  const inner = svgCreate('stop');
  svgAttr(inner, { offset: '0%', 'stop-color': 'white', 'stop-opacity': 1 });
  const outer = svgCreate('stop');
  svgAttr(outer, { offset: '100%', 'stop-color': 'white', 'stop-opacity': 0 });
  svgAppend(gradient, inner);
  svgAppend(gradient, outer);
  svgAppend(defs, gradient);
  return gradient;
}

/** Largest value of an RGB channel, for normalising ramp samples into transfer tables. */
const MAX_CHANNEL = 255;

/**
 * Density contributed by an element, floored so an executed-but-quick element still
 * joins the field instead of leaving a hole in it.
 */
function densityOf(intensity: number): number {
  return HEATMAP_MIN_DENSITY + (1 - HEATMAP_MIN_DENSITY) * intensity;
}

/** One flow's endpoints and the densities to fade between. */
interface FlowSmear {
  start: { x: number; y: number };
  end: { x: number; y: number };
  from: number;
  to: number;
}

/**
 * The gradient fading a flow from its source's density to its target's.
 */
function createFlowGradient(defs: SVGElement, id: string, smear: FlowSmear): SVGElement {
  const gradient = svgCreate('linearGradient');
  svgAttr(gradient, {
    id,
    gradientUnits: 'userSpaceOnUse',
    x1: smear.start.x,
    y1: smear.start.y,
    x2: smear.end.x,
    y2: smear.end.y,
  });
  const first = svgCreate('stop');
  svgAttr(first, { offset: '0%', 'stop-color': 'white', 'stop-opacity': smear.from });
  const last = svgCreate('stop');
  svgAttr(last, { offset: '100%', 'stop-color': 'white', 'stop-opacity': smear.to });
  svgAppend(gradient, first);
  svgAppend(gradient, last);
  svgAppend(defs, gradient);
  return gradient;
}

/**
 * The thick soft stroke that carries a flow's density along its waypoints.
 */
function createFlowSmear(waypoints: { x: number; y: number }[], gradientId: string): SVGElement {
  const line = svgCreate('path');
  svgAttr(line, {
    d: waypoints.map((point, at) => `${at === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
    fill: 'none',
    stroke: `url(#${gradientId})`,
    'stroke-width': HEATMAP_PATH_WIDTH,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  return line;
}

/**
 * Smears density along the sequence flows between heated elements.
 *
 * Flows carry no duration of their own, so this is interpolation rather than
 * measurement: the smear fades from the source's density to the target's. It exists to
 * close the gaps between elements so the map reads as one field, and it never invents
 * a hot spot — a flow can only be as warm as the elements it joins.
 *
 * @param group - The density group to draw into
 * @param defs - Where the per-flow gradients go
 * @param registry - BPMN element registry
 * @param density - Density per element id
 * @param sequence - Render sequence, for unique gradient ids
 * @returns The gradients created, for cleanup
 */
function appendFlowDensity(
  group: SVGElement,
  defs: SVGElement,
  registry: ElementRegistry,
  density: Map<string, number>,
  sequence: number
): SVGElement[] {
  const created: SVGElement[] = [];
  let index = 0;

  for (const elementId of Array.from(density.keys())) {
    const element = registry.get(elementId) as unknown as Bounds | undefined;
    for (const flow of element?.outgoing ?? []) {
      const from = density.get(elementId);
      const to = density.get(flow.target.id);
      const waypoints = flow.waypoints ?? [];
      const start = waypoints[0];
      const end = waypoints[waypoints.length - 1];
      if (from === undefined || to === undefined || start === undefined || end === undefined) {
        continue;
      }

      const gradientId = `history-heatmap-flow-${sequence}-${index++}`;
      created.push(createFlowGradient(defs, gradientId, { start, end, from, to }));
      svgAppend(group, createFlowSmear(waypoints, gradientId));
    }
  }

  return created;
}

/**
 * The density blob for one element, or null when it has no bounds to sit on.
 */
function createDensityBlob(
  registry: ElementRegistry,
  cell: HeatmapCell,
  maxMillis: number,
  gradientId: string
): SVGElement | null {
  const element = registry.get(cell.elementId) as unknown as Bounds | undefined;
  const width = element?.width;
  const height = element?.height;
  if (element === undefined || width === undefined || height === undefined) {
    return null;
  }

  const intensity = getIntensity(cell.totalMillis, maxMillis);
  // Hot spots bloom a little wider as well as denser, so they read first.
  const spread = 1 - HEATMAP_BLOOM + HEATMAP_BLOOM * intensity;
  const radius = Math.max(HEATMAP_MIN_RADIUS, (Math.max(width, height) / 2) * HEATMAP_RADIUS_SCALE) * spread;

  const blob = svgCreate('ellipse');
  svgAttr(blob, {
    cx: (element.x ?? 0) + width / 2,
    cy: (element.y ?? 0) + height / 2,
    rx: radius,
    ry: radius,
    fill: `url(#${gradientId})`,
    opacity: densityOf(intensity),
  });
  return blob;
}

/** The shared definitions one render needs, and the nodes to clean up afterwards. */
interface HeatDefs {
  filterId: string;
  gradientId: string;
  nodes: SVGElement[];
}

/**
 * Creates the colourising filter and the shared density gradient for one render.
 * Ids carry the render sequence so two diagrams on a page cannot share them.
 * @param defs - The defs element to append to
 * @param sequence - This render's sequence number
 * @returns The ids to reference and the nodes to remove later
 */
function prepareHeatDefs(defs: SVGElement, sequence: number): HeatDefs {
  const filterId = `history-heatmap-filter-${sequence}`;
  const gradientId = `history-heatmap-density-${sequence}`;
  return {
    filterId,
    gradientId,
    nodes: [createHeatFilter(defs, filterId), createDensityGradient(defs, gradientId)],
  };
}

/**
 * Renders the heatmap layer over the diagram.
 *
 * Blobs and flow smears are drawn in diagram coordinates on their own canvas layer, so
 * panning and zooming carry them along without any redraw.
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
  const { filterId, gradientId, nodes } = prepareHeatDefs(defs, sequence);
  added.push(...nodes);

  const group = svgCreate('g');
  svgAttr(group, {
    class: 'history-heatmap',
    filter: `url(#${filterId})`,
    opacity: HEATMAP_OPACITY,
    'pointer-events': 'none',
  });

  const density = new Map<string, number>();
  for (const cell of cells) {
    density.set(cell.elementId, densityOf(getIntensity(cell.totalMillis, maxMillis)));
  }

  // Flows go down first so element blobs sit over their joins.
  added.push(...appendFlowDensity(group, defs, registry, density, sequence));

  for (const cell of cells) {
    const blob = createDensityBlob(registry, cell, maxMillis, gradientId);
    if (blob) {
      svgAppend(group, blob);
    }
  }

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
