import React from 'react';
import { createRoot } from 'react-dom/client';

import { TasklistTabAuditLog } from './Components/TasklistTabAuditLog';
import { TaskListPluginParams } from './types';

export default [
  {
    id: 'tasklistTabAuditLog',
    pluginPoint: 'tasklist.task.detail',
    properties: {
      label: 'Audit Log',
    },
    render: (node: Element, { api, taskId }: TaskListPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <TasklistTabAuditLog api={api} taskId={taskId} />
        </React.StrictMode>
      );
    },
  },
];
