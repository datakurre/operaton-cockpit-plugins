/**
 * BPMN SVG rendering utilities.
 *
 * Handles rendering sequence flow paths and other SVG elements on the BPMN diagram.
 * @module
 */
import { query as domQuery } from 'min-dom';
import { createCurve } from 'svg-curves';
import { append as svgAppend, attr as svgAttr, create as svgCreate, remove as svgRemove } from 'tiny-svg';

import type { BpmnViewerInstance, Canvas, ElementRegistry, HistoricActivityInstance } from '../../types';
import {
  EXECUTED_PATH_STROKE_WIDTH,
  EXECUTED_PATH_STROKE_WIDTH_MAX,
  EXECUTED_PATH_STROKE_WIDTH_STEP,
} from '../constants';
import { getDottedConnections, getExecutedConnections } from './connections';

/** Fill color for sequence flow highlighting */
const FILL = '#52B415';

/** Class set on every path this module draws, so the overlay stays identifiable */
const EXECUTED_PATH_CLASS = 'executed-sequence-flow';

/** Marker SVG attributes configuration */
const MARKER_ATTRS = {
  viewBox: '0 0 10 10',
  refX: 7,
  refY: 5,
  markerWidth: 4,
  markerHeight: 4,
  orient: 'auto-start-reverse',
};

/** Arrow path attributes configuration */
const ARROW_PATH_ATTRS = {
  d: 'M 0 0 L 10 5 L 0 10 z',
  fill: FILL,
  stroke: 'blue',
  strokeWidth: 0,
};

/**
 * Counter behind the per-render marker id. Two viewers can share a document — the
 * instance diagram and the history route — so a fixed id would make one steal the
 * other's arrowheads.
 */
let markerSequence = 0;

/**
 * Scales the stroke width with the number of traversals, logarithmically so that a
 * long-running loop stays a line rather than becoming a slab.
 * @param count - Number of times the flow was traversed
 * @returns Stroke width in diagram units, capped at EXECUTED_PATH_STROKE_WIDTH_MAX
 */
export const getStrokeWidth = (count: number): number => {
  if (count <= 1) {
    return EXECUTED_PATH_STROKE_WIDTH;
  }
  const width = EXECUTED_PATH_STROKE_WIDTH + EXECUTED_PATH_STROKE_WIDTH_STEP * Math.log2(count);
  return Math.min(EXECUTED_PATH_STROKE_WIDTH_MAX, Math.round(width));
};

/**
 * Adds a native tooltip naming the exact traversal count, since the stroke width only
 * shows it approximately and saturates at the cap.
 * @param path - The path element to describe
 * @param count - Number of times the flow was traversed
 */
function appendTraversalTitle(path: SVGElement, count: number): void {
  const title = svgCreate('title');
  title.textContent = count === 1 ? 'Executed once' : `Executed ${count} times`;
  svgAppend(path, title);
}

/**
 * Creates and appends the arrow marker definition to the SVG defs element.
 * @param defs - The defs element to append to
 * @param id - Unique id to reference the marker by
 * @returns The created marker element
 */
function createArrowMarker(defs: SVGElement, id: string): SVGMarkerElement {
  const marker = svgCreate('marker');
  const path = svgCreate('path');
  svgAttr(marker, { ...MARKER_ATTRS, id });
  svgAttr(path, ARROW_PATH_ATTRS);
  svgAppend(marker, path);
  svgAppend(defs, marker);
  return marker;
}

/**
 * Finds the SVG's defs element, creating it when the diagram has none yet.
 * @param canvas - The viewer canvas
 * @returns The defs element to hold marker definitions
 */
function resolveDefs(canvas: Canvas): SVGElement {
  // Cast SVG to HTMLElement for domQuery, which expects HTMLElement
  const existing = domQuery('defs', canvas._svg as unknown as HTMLElement) as SVGElement | null;
  if (existing !== null) {
    return existing;
  }
  const defs = svgCreate('defs') as SVGElement;
  svgAppend(canvas._svg, defs);
  return defs;
}

/**
 * Renders sequence flow highlighting on the BPMN diagram based on historic activities.
 * Draws colored arrows showing the execution path through the process, weighted by how
 * often each flow was traversed.
 * @param viewer - The BPMN viewer instance
 * @param activities - Historic activity instances to visualize
 * @returns Array of SVG elements that were added (for later cleanup)
 */
export const renderSequenceFlow = (
  viewer: BpmnViewerInstance,
  activities: HistoricActivityInstance[]
): SVGElement[] => {
  const registry = viewer.get('elementRegistry') as ElementRegistry;
  const canvas = viewer.get('canvas') as Canvas;
  const layer = canvas.getLayer('processInstance', 1);
  const connections = getExecutedConnections(activities, registry);
  const paths: SVGElement[] = [];

  const markerId = `executed-path-arrow-${markerSequence++}`;
  const marker = createArrowMarker(resolveDefs(canvas), markerId);
  paths.push(marker);

  for (const { element, count } of connections) {
    // The arrowhead inherits strokeWidth units, so it grows with the line.
    const curve = createCurve(element.waypoints, {
      markerEnd: `url(#${markerId})`,
      stroke: FILL,
      strokeWidth: getStrokeWidth(count),
    });
    svgAttr(curve, { class: EXECUTED_PATH_CLASS });
    appendTraversalTitle(curve, count);
    svgAppend(layer, curve);
    paths.push(curve);
  }

  const dottedConnections = getDottedConnections(connections);
  for (const { waypoints, count } of dottedConnections) {
    const curve = createCurve(waypoints, {
      strokeDasharray: '1 8',
      strokeLinecap: 'round',
      stroke: FILL,
      strokeWidth: getStrokeWidth(count),
    });
    svgAttr(curve, { class: EXECUTED_PATH_CLASS });
    appendTraversalTitle(curve, count);
    svgAppend(layer, curve);
    paths.push(curve);
  }

  return paths;
};

/**
 * Removes SVG elements that were previously added to the diagram.
 * @param nodes - Array of SVG elements to remove
 */
export const clearSequenceFlow = (nodes: SVGElement[]): void => {
  for (const node of nodes) {
    svgRemove(node);
  }
};
