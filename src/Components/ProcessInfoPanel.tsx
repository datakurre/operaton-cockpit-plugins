/**
 * ProcessInfoPanel component for displaying process instance metadata.
 * Displays key-value pairs with copy-to-clipboard functionality.
 */
import React from 'react';
import { Clippy } from './Clippy';

/** Properties of a historic process instance for display. */
interface ProcessInstance {
  id: string;
  businessKey?: string | null;
  processDefinitionVersion?: number;
  processDefinitionId: string;
  processDefinitionKey?: string;
  processDefinitionName?: string;
  tenantId?: string | null;
  superProcessInstanceId?: string | null;
  state?: string;
}

/** Properties of a process definition for display (supports nullable OpenAPI fields). */
export interface ProcessDefinition {
  deploymentId?: string | null;
  resource?: string | null;
}

/** Props for ProcessInfoPanel component. */
interface ProcessInfoPanelProps {
  /** The historic process instance data. */
  instance: ProcessInstance;
  /** The process definition data. */
  definition: ProcessDefinition;
}

/**
 * Renders a panel showing process instance information.
 * Each field includes a copy-to-clipboard button.
 */
const ProcessInfoPanel: React.FC<ProcessInfoPanelProps> = ({ instance, definition }) => {
  return (
    <div className="ctn-column">
      <dl className="process-information">
        <dt>
          <Clippy value={instance.id}>Instance ID:</Clippy>
        </dt>
        <dd>{instance.id}</dd>
        <dt>
          <Clippy value={instance.businessKey ?? 'null'}>Business Key:</Clippy>
        </dt>
        <dd>{instance.businessKey ?? <code>null</code>}</dd>
        <dt>
          <Clippy value={String(instance.processDefinitionVersion)}>Definition Version:</Clippy>
        </dt>
        <dd>{instance.processDefinitionVersion}</dd>
        <dt>
          <Clippy value={instance.processDefinitionId}>Definition ID:</Clippy>
        </dt>
        <dd>
          <a href={`#/process-definition/${instance.processDefinitionId}/runtime`}>{instance.processDefinitionId}</a>
        </dd>
        <dt>
          <Clippy value={instance.processDefinitionKey ?? ''}>Definition Key:</Clippy>
        </dt>
        <dd>{instance.processDefinitionKey}</dd>
        <dt>
          <Clippy value={instance.processDefinitionName ?? ''}>Definition Name:</Clippy>
        </dt>
        <dd>{instance.processDefinitionName}</dd>
        <dt>
          <Clippy value={instance.tenantId ?? 'null'}>Tenant ID:</Clippy>
        </dt>
        <dd>{instance.tenantId ?? <code>null</code>}</dd>
        <dt>
          <Clippy value={definition.deploymentId ?? ''}>Deployment ID:</Clippy>
        </dt>
        <dd>
          <a
            href={`#/repository?deployment=${definition.deploymentId ?? ''}&resourceName=${definition.resource ?? ''}&deploymentsQuery=%5B%7B%22type%22%3A%22id%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A%22${definition.deploymentId ?? ''}%22%7D%5D`}
          >
            {definition.deploymentId}
          </a>
        </dd>
        <dt>
          <Clippy value={instance.superProcessInstanceId ?? 'null'}>Super Process instance ID:</Clippy>
        </dt>
        <dd>
          {instance.superProcessInstanceId ? (
            <a href={`#/history/process-instance/${instance.superProcessInstanceId}`}>
              {instance.superProcessInstanceId}
            </a>
          ) : (
            <code>null</code>
          )}
        </dd>
        <dt>
          <Clippy value={instance.state ?? ''}>State:</Clippy>
        </dt>
        <dd>{instance.state}</dd>
      </dl>
    </div>
  );
};

export default ProcessInfoPanel;
export type { ProcessInstance };
