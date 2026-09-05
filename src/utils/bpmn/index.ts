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
export { countTraversals, getDottedConnections, getExecutedConnections, getMid } from './connections';
export type { ConnectionElement, DottedConnection, ExecutedConnection, XY } from './connections';

// Overlay rendering utilities
export { renderActivities, renderRunningTokens } from './overlays';

// SVG rendering utilities
export { clearSequenceFlow, getStrokeWidth, renderSequenceFlow } from './svg';

// Heatmap rendering utilities
export { aggregateDurations, clearHeatmap, getHeatColor, getIntensity, renderHeatmap } from './heatmap';
export type { HeatmapCell } from './heatmap';
