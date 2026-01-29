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
import { getConnections, getDottedConnections, XY } from './connections';

/** Fill color for sequence flow highlighting */
const FILL = '#52B415';

/** Marker SVG attributes configuration */
const MARKER_ATTRS = {
  id: 'arrow',
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
 * Creates and appends the arrow marker definition to the SVG defs element.
 * @param defs - The defs element to append to
 * @returns The created marker element
 */
function createArrowMarker(defs: SVGElement): SVGMarkerElement {
  const marker = svgCreate('marker');
  const path = svgCreate('path');
  svgAttr(marker, MARKER_ATTRS);
  svgAttr(path, ARROW_PATH_ATTRS);
  svgAppend(marker, path);
  svgAppend(defs, marker);
  return marker;
}

/**
 * Renders sequence flow highlighting on the BPMN diagram based on historic activities.
 * Draws colored arrows showing the execution path through the process.
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
  const connections = getConnections(activities, registry);
  const paths: SVGElement[] = [];

  // Query for existing defs element - cast SVG to HTMLElement for domQuery which expects HTMLElement
  let defs = domQuery('defs', canvas._svg as unknown as HTMLElement) as SVGElement | null;
  if (defs === null) {
    defs = svgCreate('defs') as SVGElement;
    svgAppend(canvas._svg, defs);
  }

  const marker = createArrowMarker(defs);
  paths.push(marker);

  for (const connection of connections) {
    const connWithWaypoints = connection as unknown as { waypoints: XY[] };
    const curve = createCurve(connWithWaypoints.waypoints, {
      markerEnd: 'url(#arrow)',
      stroke: FILL,
      strokeWidth: 4,
    });
    svgAppend(layer, curve);
    paths.push(curve);
  }

  const dottedConnections = getDottedConnections(connections);
  for (const connection of dottedConnections) {
    const curve = createCurve(connection.waypoints, {
      strokeDasharray: '1 8',
      strokeLinecap: 'round',
      stroke: FILL,
      strokeWidth: 4,
    });
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
