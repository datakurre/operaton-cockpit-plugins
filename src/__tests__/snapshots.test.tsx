/**
 * Snapshot tests for complex UI components.
 * These tests capture the rendered output to detect unintended changes.
 */
import { render } from '@testing-library/react';
import React from 'react';

import AuditLogTable from '../Components/AuditLogTable';
import BreadcrumbsPanel from '../Components/BreadcrumbsPanel';
import { Clippy } from '../Components/Clippy';
import { ErrorMessage } from '../Components/ErrorMessage';
import { FormButton } from '../Components/FormButton';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import Pagination from '../Components/Pagination';
import ProcessInfoPanel from '../Components/ProcessInfoPanel';
import { SelectField } from '../Components/SelectField';
import { SuccessMessage } from '../Components/SuccessMessage';
import { Tabs, Tab } from '../Components/Tabs';
import { WarningBox } from '../Components/WarningBox';

describe('Snapshot Tests', () => {
  describe('Feedback Components', () => {
    it('ErrorMessage renders correctly', () => {
      const { container } = render(<ErrorMessage message="Something went wrong" />);
      expect(container).toMatchSnapshot();
    });

    it('SuccessMessage renders correctly', () => {
      const { container } = render(<SuccessMessage message="Operation completed" />);
      expect(container).toMatchSnapshot();
    });

    it('LoadingSpinner renders correctly', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container).toMatchSnapshot();
    });

    it('LoadingSpinner with custom message renders correctly', () => {
      const { container } = render(<LoadingSpinner message="Please wait..." />);
      expect(container).toMatchSnapshot();
    });

    it('WarningBox renders correctly', () => {
      const { container } = render(
        <WarningBox>This is a warning about process modification</WarningBox>
      );
      expect(container).toMatchSnapshot();
    });

    it('WarningBox with custom title renders correctly', () => {
      const { container } = render(
        <WarningBox title="Caution">Be careful with this operation</WarningBox>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Form Components', () => {
    it('FormButton primary variant renders correctly', () => {
      const { container } = render(
        <FormButton variant="primary" onClick={() => {}}>
          Submit
        </FormButton>
      );
      expect(container).toMatchSnapshot();
    });

    it('FormButton all variants render correctly', () => {
      const { container } = render(
        <div>
          <FormButton variant="primary" onClick={() => {}}>Primary</FormButton>
          <FormButton variant="secondary" onClick={() => {}}>Secondary</FormButton>
          <FormButton variant="danger" onClick={() => {}}>Danger</FormButton>
          <FormButton variant="success" onClick={() => {}}>Success</FormButton>
        </div>
      );
      expect(container).toMatchSnapshot();
    });

    it('FormButton disabled state renders correctly', () => {
      const { container } = render(
        <FormButton variant="primary" onClick={() => {}} disabled>
          Disabled
        </FormButton>
      );
      expect(container).toMatchSnapshot();
    });

    it('SelectField renders correctly', () => {
      const { container } = render(
        <SelectField
          label="Select Resource"
          name="resource"
          value="process-instance"
          onChange={() => {}}
          options={[
            { value: 'process-instance', label: 'Process Instance' },
            { value: 'process-definition', label: 'Process Definition' },
            { value: 'task', label: 'Task' },
          ]}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('SelectField with placeholder renders correctly', () => {
      const { container } = render(
        <SelectField
          label="Select Type"
          name="type"
          value=""
          onChange={() => {}}
          options={[{ value: 'a', label: 'Option A' }]}
          placeholder="Choose an option"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Navigation Components', () => {
    it('Tabs renders correctly', () => {
      const { container } = render(
        <Tabs>
          <Tab label="Modify">Modify content</Tab>
          <Tab label="Message">Message content</Tab>
          <Tab label="Signal">Signal content</Tab>
        </Tabs>
      );
      expect(container).toMatchSnapshot();
    });

    it('Pagination renders correctly', () => {
      const { container } = render(
        <Pagination currentPage={1} total={100} perPage={10} onPage={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });

    it('Pagination middle page renders correctly', () => {
      const { container } = render(
        <Pagination currentPage={5} total={100} perPage={10} onPage={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });

    it('Pagination last page renders correctly', () => {
      const { container } = render(
        <Pagination currentPage={10} total={100} perPage={10} onPage={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Utility Components', () => {
    it('Clippy renders correctly', () => {
      const { container } = render(<Clippy value="text-to-copy">Click to copy</Clippy>);
      expect(container).toMatchSnapshot();
    });

    it('BreadcrumbsPanel renders correctly', () => {
      const items = [
        { label: 'Dashboard', href: '#/' },
        { label: 'Processes', href: '#/processes/' },
        { label: 'My Process', href: '#/process-definition/123/runtime', suffix: 'instance-abc : History' },
      ];
      const { container } = render(<BreadcrumbsPanel items={items} />);
      expect(container).toMatchSnapshot();
    });

    it('BreadcrumbsPanel legacy props renders correctly', () => {
      const { container } = render(
        <BreadcrumbsPanel
          processDefinitionId="process:1:abc"
          processDefinitionName="Order Process"
          processInstanceId="instance-123"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Table Components', () => {
    it('AuditLogTable empty state renders correctly', () => {
      const { container } = render(
        <AuditLogTable activities={[]} decisions={new Map()} />
      );
      expect(container).toMatchSnapshot();
    });

    it('AuditLogTable with activities renders correctly', () => {
      const activities = [
        {
          id: 'activity-1',
          activityId: 'startEvent',
          activityName: 'Start',
          activityType: 'startEvent',
          startTime: '2024-01-15T10:00:00.000+0000',
          endTime: '2024-01-15T10:00:01.000+0000',
          durationInMillis: 1000,
          assignee: null,
          canceled: false,
          completeScope: false,
          processDefinitionId: 'process:1:abc',
          processInstanceId: 'instance-123',
          executionId: 'exec-1',
          calledProcessInstanceId: null,
        },
        {
          id: 'activity-2',
          activityId: 'userTask',
          activityName: 'Review Document',
          activityType: 'userTask',
          startTime: '2024-01-15T10:00:01.000+0000',
          endTime: '2024-01-15T11:30:00.000+0000',
          durationInMillis: 5399000,
          assignee: 'admin',
          canceled: false,
          completeScope: false,
          processDefinitionId: 'process:1:abc',
          processInstanceId: 'instance-123',
          executionId: 'exec-2',
          calledProcessInstanceId: null,
        },
      ];

      const { container } = render(
        <AuditLogTable activities={activities} decisions={new Map()} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Process Components', () => {
    it('ProcessInfoPanel renders correctly', () => {
      const instance = {
        id: 'instance-123',
        businessKey: 'ORDER-2024-001',
        processDefinitionVersion: 1,
        processDefinitionId: 'orderProcess:1:abc',
        processDefinitionKey: 'orderProcess',
        processDefinitionName: 'Order Process',
        tenantId: null,
        superProcessInstanceId: null,
        state: 'ACTIVE',
      };

      const definition = {
        deploymentId: 'deploy-123',
        resource: 'order-process.bpmn',
      };

      const { container } = render(
        <ProcessInfoPanel instance={instance} definition={definition} />
      );
      expect(container).toMatchSnapshot();
    });

    it('ProcessInfoPanel with null values renders correctly', () => {
      const instance = {
        id: 'instance-456',
        businessKey: null,
        processDefinitionVersion: 2,
        processDefinitionId: 'orderProcess:2:def',
        processDefinitionKey: 'orderProcess',
        processDefinitionName: 'Order Process',
        tenantId: 'tenant-1',
        superProcessInstanceId: 'parent-instance-789',
        state: 'COMPLETED',
      };

      const definition = {
        deploymentId: null,
        resource: null,
      };

      const { container } = render(
        <ProcessInfoPanel instance={instance} definition={definition} />
      );
      expect(container).toMatchSnapshot();
    });
  });

});
