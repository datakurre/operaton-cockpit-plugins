import React from 'react';
import { createRoot } from 'react-dom/client';

import { InstanceDiagramHistoricActivities } from './Components/InstanceDiagramHistoricActivities';
import { InstanceTabAuditLog } from './Components/InstanceTabAuditLog';
import { ViewerButtonsPortal } from './Components/ViewerButtonsPortal';
import { InstancePluginParams } from './types';

/** Interface for BPMN viewer instance */
interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (serviceName: string) => unknown;
}

/** Position configuration for sequence flow toggle button */
const BUTTON_POSITION = { right: '15px', top: '15px' };

/**
 * Wrapper component that renders historic activities with ViewerButtonsPortal.
 * Encapsulates DOM management for cleaner plugin integration.
 */
const InstanceDiagramHistoricActivitiesWrapper: React.FC<InstancePluginParams & { viewer: BpmnViewerInstance }> = ({
  api,
  processInstanceId,
  viewer,
}) => {
  return (
    <ViewerButtonsPortal viewer={viewer} position={BUTTON_POSITION}>
      <InstanceDiagramHistoricActivities api={api} processInstanceId={processInstanceId} viewer={viewer} />
    </ViewerButtonsPortal>
  );
};

export default [
  {
    id: 'instanceDiagramHistoricActivities',
    pluginPoint: 'cockpit.processInstance.diagram.plugin',
    render: (viewer: BpmnViewerInstance, { api, processInstanceId }: InstancePluginParams): void => {
      // Create a minimal mount point for React - the ViewerButtonsPortal
      // inside the wrapper handles button positioning
      const mountPoint = document.createElement('div');
      mountPoint.style.display = 'contents';
      viewer._container.appendChild(mountPoint);
      createRoot(mountPoint).render(
        <React.StrictMode>
          <InstanceDiagramHistoricActivitiesWrapper api={api} processInstanceId={processInstanceId} viewer={viewer} />
        </React.StrictMode>
      );
    },
  },
  {
    id: 'instanceTabHistoricActivities',
    pluginPoint: 'cockpit.processInstance.runtime.tab',
    properties: {
      label: 'Audit Log',
    },
    render: (node: Element, { api, processInstanceId }: InstancePluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <InstanceTabAuditLog api={api} processInstanceId={processInstanceId} />
        </React.StrictMode>
      );
    },
  },
];
