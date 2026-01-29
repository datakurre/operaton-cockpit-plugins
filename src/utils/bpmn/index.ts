/**
 * BPMN utilities for diagram rendering and analysis.
 *
 * This module provides utilities for:
 * - Analyzing sequence flow connections from historic activities
 * - Rendering overlays (badges) on BPMN elements
 * - Rendering SVG sequence flow highlights
 *
 * @module
 */

// Connection analysis utilities
export { getConnections, getDottedConnections, getMid } from './connections';
export type { DottedConnection, XY } from './connections';

// Overlay rendering utilities
export { renderActivities } from './overlays';

// SVG rendering utilities
export { clearSequenceFlow, renderSequenceFlow } from './svg';
