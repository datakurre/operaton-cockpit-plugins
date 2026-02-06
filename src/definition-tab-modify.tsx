/**
 * Definition Tab Modify Plugin
 *
 * Plugin that provides batch modification, message correlation, and signal broadcasting
 * capabilities for process definitions. This is the main entry point that renders tabs
 * for each operation type.
 *
 * @module
 */
import './instance-tab-modify.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import BatchMessageForm from './Components/BatchMessageForm';
import BatchModifyForm from './Components/BatchModifyForm';
import BatchSignalForm from './Components/BatchSignalForm';
import { Tabs, Tab } from './Components/Tabs';
import { DefinitionPluginParams } from './types';

/**
 * Main tab component that organizes the three batch operation forms.
 */
const DefinitionModifyTab: React.FC<Omit<DefinitionPluginParams, 'root'>> = props => {
  return (
    <Tabs>
      <Tab label="Batch Modify">
        <BatchModifyForm {...props} />
      </Tab>
      <Tab label="Message">
        <BatchMessageForm {...props} />
      </Tab>
      <Tab label="Signal">
        <BatchSignalForm {...props} />
      </Tab>
    </Tabs>
  );
};

export default [
  {
    id: 'definitionTabModify',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'Modify',
    },
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <DefinitionModifyTab api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
];
