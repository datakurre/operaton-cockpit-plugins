/**
 * HistoryViewLayout component for the process instance history view.
 * Provides the resizable pane layout with BPMN viewer, info panel, and tabs.
 */
import 'allotment/dist/style.css';

import { Allotment, AllotmentHandle } from 'allotment';
import React, { useRef, useState } from 'react';
import { GoChevronLeft, GoChevronRight, GoChevronUp, GoChevronDown } from 'react-icons/go';

import AuditLogTable from './AuditLogTable';
import BPMNViewer from './BPMN';
import Container from './Container';
import ProcessInfoPanel, { type ProcessInstance } from './ProcessInfoPanel';
import { Tab, Tabs } from './Tabs';
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

/** Minimum pane size when collapsed (in pixels) */
const MIN_PANE_SIZE = 50;
/** Default expanded size for info panel (percentage) */
const INFO_EXPANDED_SIZE = 300;

/**
 * Renders the history view layout with resizable panes.
 * Contains process info panel, BPMN viewer, and audit log/variables tabs.
 * Includes chevron buttons to quickly expand/collapse panes.
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
  const horizontalRef = useRef<AllotmentHandle>(null);
  const verticalRef = useRef<AllotmentHandle>(null);

  const [infoPaneCollapsed, setInfoPaneCollapsed] = useState(
    typeof settings.leftPaneSize === 'number' && settings.leftPaneSize <= MIN_PANE_SIZE
  );
  const [tabsPaneCollapsed, setTabsPaneCollapsed] = useState(() => {
    const containerHeight = 600;
    return typeof settings.topPaneSize === 'number' && settings.topPaneSize > containerHeight * 0.8;
  });

  /** Toggle the left info panel between collapsed and expanded */
  const toggleInfoPanel = (): void => {
    const newSize = infoPaneCollapsed ? INFO_EXPANDED_SIZE : MIN_PANE_SIZE;
    horizontalRef.current?.resize([newSize]);
    saveSettings({ ...loadSettings(), leftPaneSize: newSize });
    setInfoPaneCollapsed(!infoPaneCollapsed);
  };

  /** Toggle the bottom tabs panel between collapsed and expanded */
  const toggleTabsPanel = (): void => {
    const containerHeight = 600;
    const topSize = tabsPaneCollapsed ? containerHeight * 0.5 : containerHeight * 0.85;
    verticalRef.current?.resize([topSize]);
    saveSettings({ ...loadSettings(), topPaneSize: topSize });
    setTabsPaneCollapsed(!tabsPaneCollapsed);
  };

  return (
    <Container>
      <Allotment
        ref={horizontalRef}
        vertical={false}
        onChange={(numbers: number[]) => {
          saveSettings({
            ...loadSettings(),
            leftPaneSize: numbers[0] ?? null,
          });
        }}
      >
        <Allotment.Pane preferredSize={settings.leftPaneSize ?? '33%'} minSize={MIN_PANE_SIZE}>
          <div style={{ height: '100%', position: 'relative' }}>
            <ProcessInfoPanel instance={instance} definition={definition} />
            {/* Chevron to collapse/expand info panel */}
            <button
              type="button"
              onClick={toggleInfoPanel}
              style={{
                position: 'absolute',
                right: 0,
                top: '10px',
                background: 'white',
                border: '1px solid #ccc',
                borderRight: 'none',
                borderRadius: '3px 0 0 3px',
                color: '#333',
                cursor: 'pointer',
                padding: '4px 3px',
                lineHeight: '1',
                zIndex: 10,
                boxShadow: '-2px 2px 4px rgba(0,0,0,0.1)',
              }}
              title={infoPaneCollapsed ? 'Expand info panel' : 'Collapse info panel'}
              aria-label={infoPaneCollapsed ? 'Expand info panel' : 'Collapse info panel'}
            >
              {infoPaneCollapsed ? <GoChevronRight /> : <GoChevronLeft />}
            </button>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <Allotment
            ref={verticalRef}
            vertical
            onChange={(numbers: number[]) => {
              saveSettings({
                ...loadSettings(),
                topPaneSize: numbers[0] ?? null,
              });
            }}
          >
            <Allotment.Pane preferredSize={settings.topPaneSize ?? '66%'}>
              <div style={{ height: '100%', position: 'relative' }}>
                <BPMNViewer
                  activities={activities}
                  diagramXML={diagramXML}
                  className="ctn-content"
                  style={{ width: '100%', height: '100%' }}
                  showRuntimeToggle={instance.state === 'ACTIVE'}
                />
                {/* Chevron to collapse/expand tabs panel */}
                <button
                  type="button"
                  onClick={toggleTabsPanel}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    bottom: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderBottom: 'none',
                    borderRadius: '3px 3px 0 0',
                    color: '#333',
                    cursor: 'pointer',
                    padding: '3px 4px',
                    lineHeight: '1',
                    zIndex: 10,
                    boxShadow: '2px -2px 4px rgba(0,0,0,0.1)',
                  }}
                  title={tabsPaneCollapsed ? 'Expand tabs panel' : 'Collapse tabs panel'}
                  aria-label={tabsPaneCollapsed ? 'Expand tabs panel' : 'Collapse tabs panel'}
                >
                  {tabsPaneCollapsed ? <GoChevronUp /> : <GoChevronDown />}
                </button>
              </div>
            </Allotment.Pane>
            <Allotment.Pane minSize={MIN_PANE_SIZE}>
              <div className="ctn-row ctn-content-bottom ctn-tabbed" style={{ height: '100%', position: 'relative' }}>
                <Tabs>
                  <Tab label="Audit Log">
                    <AuditLogTable activities={activities} decisions={decisionByActivity} />
                  </Tab>
                  <Tab label="Variables">
                    <VariablesTable instance={historicInstance} activities={activityById} variables={variables} />
                  </Tab>
                </Tabs>
              </div>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </Container>
  );
};

export default HistoryViewLayout;
