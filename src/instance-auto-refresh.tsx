import React from 'react';
import { createRoot } from 'react-dom/client';

import { ToggleAutoRefreshButton } from './Components/ToggleAutoRefeshButton';
import { InstancePluginParams } from './types';

export default [
  {
    id: 'instanceDiagramAutoRefresh',
    pluginPoint: 'cockpit.processInstance.diagram.plugin',
    render: (viewer: any, { api, processInstanceId }: InstancePluginParams) => {
      (async () => {
        const toggleAutoRefreshButton = document.createElement('div');
        toggleAutoRefreshButton.style.cssText = `
          position: absolute;
          right: 15px;
          bottom: 115px;
        `;
        viewer._container.appendChild(toggleAutoRefreshButton);
        createRoot(toggleAutoRefreshButton!).render(
          <React.StrictMode>
            <ToggleAutoRefreshButton api={api} processInstanceId={processInstanceId} />
          </React.StrictMode>
        );
      })();
    },
  },
];
