/**
 * HistoryViewLayout component for the process instance history view.
 * Provides the resizable pane layout with BPMN viewer, info panel, and tabs.
 */
import 'allotment/dist/style.css';

import { Allotment, AllotmentHandle } from 'allotment';
import React, { useRef } from 'react';
import { GoChevronLeft, GoChevronRight, GoChevronUp } from 'react-icons/go';

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

  /** Toggle the left info panel between collapsed and expanded */
  const toggleInfoPanel = (): void => {
    const currentSize = settings.leftPaneSize ?? INFO_EXPANDED_SIZE;
    const isCollapsed = typeof currentSize === 'number' && currentSize <= MIN_PANE_SIZE;
    const newSize = isCollapsed ? INFO_EXPANDED_SIZE : MIN_PANE_SIZE;
    horizontalRef.current?.resize([newSize]);
    saveSettings({ ...loadSettings(), leftPaneSize: newSize });
  };

  /** Toggle the bottom tabs panel between collapsed and expanded */
  const toggleTabsPanel = (): void => {
    const currentSize = settings.topPaneSize;
    // If tabs are collapsed (top pane takes most space), expand tabs
    // If tabs are expanded, collapse them
    const containerHeight = 600; // Approximate, will be auto-adjusted
    const isTabsCollapsed = typeof currentSize === 'number' && currentSize > containerHeight * 0.8;
    const topSize = isTabsCollapsed ? containerHeight * 0.5 : containerHeight * 0.85;
    verticalRef.current?.resize([topSize]);
    saveSettings({ ...loadSettings(), topPaneSize: topSize });
  };

  const infoPaneCollapsed = typeof settings.leftPaneSize === 'number' && settings.leftPaneSize <= MIN_PANE_SIZE;

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
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--cam-navbar-inverse-bg, #333)',
                border: 'none',
                borderRadius: '3px 0 0 3px',
                color: 'white',
                cursor: 'pointer',
                padding: '8px 2px',
                zIndex: 10,
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
              <BPMNViewer
                activities={activities}
                diagramXML={diagramXML}
                className="ctn-content"
                style={{ width: '100%', height: '100%' }}
                showRuntimeToggle={instance.state === 'ACTIVE'}
              />
            </Allotment.Pane>
            <Allotment.Pane minSize={MIN_PANE_SIZE}>
              <div className="ctn-row ctn-content-bottom ctn-tabbed" style={{ height: '100%', position: 'relative' }}>
                {/* Chevron to collapse/expand tabs panel */}
                <button
                  type="button"
                  onClick={toggleTabsPanel}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: 'translateX(-50%)',
                    background: 'var(--cam-navbar-inverse-bg, #333)',
                    border: 'none',
                    borderRadius: '0 0 3px 3px',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '2px 8px',
                    zIndex: 10,
                  }}
                  title="Toggle tabs panel size"
                  aria-label="Toggle tabs panel size"
                >
                  <GoChevronUp />
                </button>
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
