import React from 'react';
import { ToggleAutoRefreshButton } from './ToggleAutoRefreshButton';
import { ViewerButtonsPortal, BpmnViewer } from './ViewerButtonsPortal';
import { InstancePluginParams } from '../types';

interface InstanceDiagramAutoRefreshProps extends InstancePluginParams {
  viewer: BpmnViewer;
}

/** Position configuration for auto-refresh button */
const BUTTON_POSITION = { right: '15px', bottom: '165px' };

/**
 * Wrapper component for ToggleAutoRefreshButton on a process instance diagram.
 * Uses ViewerButtonsPortal for consistent DOM management via React portals.
 *
 * @param props - Component props
 * @param props.api - API configuration object
 * @param props.processInstanceId - The process instance ID
 * @param props.viewer - BPMN viewer instance
 * @returns Portal with toggle button, or null if viewer is not available
 */
export const InstanceDiagramAutoRefresh: React.FC<InstanceDiagramAutoRefreshProps> = ({
  api,
  processInstanceId,
  viewer,
}) => {
  return (
    <ViewerButtonsPortal viewer={viewer} position={BUTTON_POSITION}>
      <ToggleAutoRefreshButton api={api} processInstanceId={processInstanceId} />
    </ViewerButtonsPortal>
  );
};

export default InstanceDiagramAutoRefresh;
