import './Components/Button.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { InstanceDiagramAutoRefresh } from './Components/InstanceDiagramAutoRefresh';
import { InstancePluginParams } from './types';

/** Interface for BPMN viewer instance */
interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (serviceName: string) => unknown;
}

export default [
  {
    id: 'instanceDiagramAutoRefresh',
    pluginPoint: 'cockpit.processInstance.diagram.plugin',
    render: (viewer: BpmnViewerInstance, { api, processInstanceId }: InstancePluginParams): void => {
      // Create a minimal mount point for React - the ViewerButtonsPortal
      // inside InstanceDiagramAutoRefresh handles button positioning
      const mountPoint = document.createElement('div');
      mountPoint.style.display = 'contents';
      viewer._container.appendChild(mountPoint);
      createRoot(mountPoint).render(
        <React.StrictMode>
          <InstanceDiagramAutoRefresh api={api} processInstanceId={processInstanceId} viewer={viewer} />
        </React.StrictMode>
      );
    },
  },
];
