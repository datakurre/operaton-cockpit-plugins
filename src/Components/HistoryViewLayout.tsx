/**
 * HistoryViewLayout component for the process instance history view.
 * Provides the resizable pane layout with BPMN viewer, info panel, and tabs.
 */
import 'allotment/dist/style.css';

import { Allotment } from 'allotment';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import AuditLogTable from './AuditLogTable';
import BPMNViewer from './BPMN';
import Container from './Container';
import ProcessInfoPanel, { type ProcessInstance } from './ProcessInfoPanel';
import VariablesTable from './VariablesTable';
import { loadSettings, saveSettings } from '../utils/misc';
import type { components } from '../operaton';

type HistoricProcessInstance = components['schemas']['HistoricProcessInstanceDto'];
type ProcessDefinitionDto = components['schemas']['ProcessDefinitionDto'];

/** Activity data with id and optional endTime (supports nullable OpenAPI fields). */
interface ActivityData {
  id?: string | null;
  endTime?: string | null;
  [key: string]: unknown;
}

/** Variable data with name (supports nullable OpenAPI fields). */
interface VariableData {
  name?: string | null;
  [key: string]: unknown;
}

/** Props for HistoryViewLayout component. */
interface HistoryViewLayoutProps {
  /** The historic process instance for display (simplified type). */
  instance: ProcessInstance;
  /** The historic process instance from API (full type for VariablesTable). */
  historicInstance: HistoricProcessInstance;
  /** The process definition (from OpenAPI, allows nullable fields). */
  definition: ProcessDefinitionDto;
  /** BPMN diagram XML. */
  diagramXML: string;
  /** Sorted activities for audit log and diagram overlays. */
  activities: ActivityData[];
  /** Sorted variables for variables table. */
  variables: VariableData[];
  /** Map of activity ID to activity data. */
  activityById: Map<string, ActivityData>;
  /** Map of activity instance ID to decision ID. */
  decisionByActivity: Map<string, string>;
}

/**
 * Renders the history view layout with resizable panes.
 * Contains process info panel, BPMN viewer, and audit log/variables tabs.
 */
const HistoryViewLayout: React.FC<HistoryViewLayoutProps> = ({
  instance,
  historicInstance,
  definition,
  diagramXML,
  activities,
  variables,
  activityById,
  decisionByActivity,
}) => {
  const settings = loadSettings();

  return (
    <Container>
      <Allotment
        vertical
        onChange={(numbers: number[]) => {
          saveSettings({
            ...loadSettings(),
            topPaneSize: numbers[0] ?? null,
          });
        }}
      >
        <Allotment.Pane preferredSize={settings.topPaneSize ?? '66%'}>
          <Allotment
            vertical={false}
            onChange={(numbers: number[]) => {
              saveSettings({
                ...loadSettings(),
                leftPaneSize: numbers[0] ?? null,
              });
            }}
          >
            <Allotment.Pane preferredSize={settings.leftPaneSize ?? '33%'}>
              <ProcessInfoPanel instance={instance} definition={definition} />
            </Allotment.Pane>
            <Allotment.Pane>
              <BPMNViewer
                activities={activities}
                diagramXML={diagramXML}
                className="ctn-content"
                style={{ width: '100%', height: '100%' }}
                showRuntimeToggle={instance.state === 'ACTIVE'}
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane>
          <Tabs className="ctn-row ctn-content-bottom ctn-tabbed" selectedTabClassName="active">
            <TabList className="nav nav-tabs">
              <Tab>
                <span role="button" tabIndex={0}>
                  Audit Log
                </span>
              </Tab>
              <Tab>
                <span role="button" tabIndex={0}>
                  Variables
                </span>
              </Tab>
            </TabList>
            <TabPanel className="ctn-tabbed-content ctn-scroll">
              <AuditLogTable activities={activities} decisions={decisionByActivity} />
            </TabPanel>
            <TabPanel className="ctn-tabbed-content ctn-scroll">
              <VariablesTable instance={historicInstance} activities={activityById} variables={variables} />
            </TabPanel>
          </Tabs>
        </Allotment.Pane>
      </Allotment>
    </Container>
  );
};

export default HistoryViewLayout;
