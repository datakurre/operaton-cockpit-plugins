/**
 * BPMN utilities for diagram rendering and analysis.
 *
 * This file re-exports from the modular bpmn/ directory for backwards compatibility.
 * For new code, prefer importing directly from 'utils/bpmn/connections', 'utils/bpmn/overlays', or 'utils/bpmn/svg'.
 *
 * @module
 */

// Re-export all utilities for backwards compatibility
export { clearSequenceFlow, getConnections, renderActivities, renderSequenceFlow } from './bpmn/index';
export type { DottedConnection, XY } from './bpmn/index';
