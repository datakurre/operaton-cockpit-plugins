/**
 * HistoryViewLayout component for the process instance history view.
 * Provides the resizable pane layout with BPMN viewer, info panel, and tabs.
 */
import 'allotment/dist/style.css';

import { Allotment, AllotmentHandle } from 'allotment';
import React, { useRef, useState } from 'react';
import { GoChevronLeft, GoChevronRight, GoChevronUp, GoChevronDown } from 'react-icons/go';
import { VscExpandAll, VscCollapseAll } from 'react-icons/vsc';

import AuditLogTable from './AuditLogTable';
import BPMNViewer from './BPMN';
import Container from './Container';
import ProcessInfoPanel, { type ProcessInstance } from './ProcessInfoPanel';
import RestartProcessForm from './RestartProcessForm';
import { Tab, Tabs } from './Tabs';
import VariablesTable from './VariablesTable';
import { loadSettings, saveSettings } from '../utils/misc';
import type { components } from '../operaton';
import type { API } from '../types';

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
  /** API configuration. */
  api: API;
}

/** Minimum pane size when collapsed (in pixels) */
const MIN_PANE_SIZE = 50;
/** Default expanded size for info panel (in pixels) */
const INFO_EXPANDED_SIZE = 320;
/** Info panel width threshold to determine collapsed state (in pixels) */
const INFO_WIDTH_THRESHOLD = 100;
/** Tabs panel height threshold to determine collapsed state (in pixels) */
const TABS_HEIGHT_THRESHOLD = 200;

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
  api,
}) => {
  const settings = loadSettings();
  const horizontalRef = useRef<AllotmentHandle>(null);
  const verticalRef = useRef<AllotmentHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [infoPaneSize, setInfoPaneSize] = useState<number>(
    typeof settings.leftPaneSize === 'number' ? settings.leftPaneSize : INFO_EXPANDED_SIZE
  );
  // Track bottom tabs pane size (derived from container height - top pane size)
  const [tabsPaneSize, setTabsPaneSize] = useState<number>(() => {
    if (typeof settings.topPaneSize === 'number') {
      // topPaneSize is the BPMN viewer height; tabs height = container - topPaneSize
      const containerHeight = 600;
      return containerHeight - settings.topPaneSize;
    }
    return 300; // Default: 50% of 600px container
  });

  /** Get container height for calculations */
  const getContainerHeight = (): number => {
    return containerRef.current?.clientHeight ?? 600;
  };

  /** Toggle the left info panel between collapsed (50px) and expanded (320px) */
  const toggleInfoPanel = (): void => {
    const isCollapsed = infoPaneSize < INFO_WIDTH_THRESHOLD;
    const newInfoSize = isCollapsed ? INFO_EXPANDED_SIZE : MIN_PANE_SIZE;
    // Allotment resize takes array of sizes for each pane in order
    // First pane is info panel, second pane gets remaining space
    horizontalRef.current?.resize([newInfoSize, Infinity]);
    saveSettings({ ...loadSettings(), leftPaneSize: newInfoSize });
    setInfoPaneSize(newInfoSize);
  };

  /** Toggle the bottom tabs panel between collapsed (50px) and expanded (50vh) */
  const toggleTabsPanel = (): void => {
    const containerHeight = getContainerHeight();
    const expandedTabsHeight = containerHeight * 0.5;
    // If tabs are small (< 200px), expand them to 50vh; otherwise collapse to 50px
    const isCollapsed = tabsPaneSize < TABS_HEIGHT_THRESHOLD;
    const newTabsSize = isCollapsed ? expandedTabsHeight : MIN_PANE_SIZE;
    // topPaneSize = containerHeight - tabsSize
    const newTopSize = containerHeight - newTabsSize;
    // Allotment resize takes array of sizes for each pane in order
    // First pane is BPMN viewer (top), second pane is tabs (bottom)
    verticalRef.current?.resize([newTopSize, newTabsSize]);
    saveSettings({ ...loadSettings(), topPaneSize: newTopSize });
    setTabsPaneSize(newTabsSize);
  };

  /** Toggle all panels between fully collapsed and fully expanded */
  const toggleAllPanels = (): void => {
    const containerHeight = getContainerHeight();
    const bothCollapsed = infoPaneSize < INFO_WIDTH_THRESHOLD && tabsPaneSize < TABS_HEIGHT_THRESHOLD;

    if (bothCollapsed) {
      // Expand both: info panel to 320px, tabs to 50vh
      const expandedTabsHeight = containerHeight * 0.5;
      const newTopSize = containerHeight - expandedTabsHeight;
      horizontalRef.current?.resize([INFO_EXPANDED_SIZE, Infinity]);
      verticalRef.current?.resize([newTopSize, expandedTabsHeight]);
      saveSettings({ ...loadSettings(), leftPaneSize: INFO_EXPANDED_SIZE, topPaneSize: newTopSize });
      setInfoPaneSize(INFO_EXPANDED_SIZE);
      setTabsPaneSize(expandedTabsHeight);
    } else {
      // Collapse both: info panel to 50px, tabs to 50px
      const newTopSize = containerHeight - MIN_PANE_SIZE;
      horizontalRef.current?.resize([MIN_PANE_SIZE, Infinity]);
      verticalRef.current?.resize([newTopSize, MIN_PANE_SIZE]);
      saveSettings({ ...loadSettings(), leftPaneSize: MIN_PANE_SIZE, topPaneSize: newTopSize });
      setInfoPaneSize(MIN_PANE_SIZE);
      setTabsPaneSize(MIN_PANE_SIZE);
    }
  };

  return (
    <Container>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
        <Allotment
          ref={horizontalRef}
          vertical={false}
          onChange={(numbers: number[]) => {
            const newLeftSize = numbers[0] ?? infoPaneSize;
            setInfoPaneSize(newLeftSize);
            saveSettings({
              ...loadSettings(),
              leftPaneSize: newLeftSize,
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
                title={infoPaneSize < INFO_WIDTH_THRESHOLD ? 'Maximize info panel' : 'Minimize info panel'}
                aria-label={infoPaneSize < INFO_WIDTH_THRESHOLD ? 'Maximize info panel' : 'Minimize info panel'}
              >
                {infoPaneSize < INFO_WIDTH_THRESHOLD ? <GoChevronRight /> : <GoChevronLeft />}
              </button>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <Allotment
              ref={verticalRef}
              vertical
              onChange={(numbers: number[]) => {
                const newTopSize = numbers[0] ?? 0;
                const containerHeight = getContainerHeight();
                const newTabsSize = containerHeight - newTopSize;
                setTabsPaneSize(newTabsSize);
                saveSettings({
                  ...loadSettings(),
                  topPaneSize: newTopSize,
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
                    title={tabsPaneSize < TABS_HEIGHT_THRESHOLD ? 'Maximize tabs panel' : 'Minimize tabs panel'}
                    aria-label={tabsPaneSize < TABS_HEIGHT_THRESHOLD ? 'Maximize tabs panel' : 'Minimize tabs panel'}
                  >
                    {tabsPaneSize < TABS_HEIGHT_THRESHOLD ? <GoChevronUp /> : <GoChevronDown />}
                  </button>
                  {/* Maximize/minimize BPMN panel button (by toggling side panels) */}
                  <button
                    type="button"
                    onClick={toggleAllPanels}
                    style={{
                      position: 'absolute',
                      left: '50px',
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
                    title={
                      infoPaneSize < INFO_WIDTH_THRESHOLD && tabsPaneSize < TABS_HEIGHT_THRESHOLD
                        ? 'Restore side panels'
                        : 'Maximize diagram'
                    }
                    aria-label={
                      infoPaneSize < INFO_WIDTH_THRESHOLD && tabsPaneSize < TABS_HEIGHT_THRESHOLD
                        ? 'Restore side panels'
                        : 'Maximize diagram'
                    }
                  >
                    {infoPaneSize < INFO_WIDTH_THRESHOLD && tabsPaneSize < TABS_HEIGHT_THRESHOLD ? (
                      <VscCollapseAll />
                    ) : (
                      <VscExpandAll />
                    )}
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
                    {instance.state !== 'ACTIVE' && instance.state !== 'SUSPENDED' && (
                      <Tab label="Terminated">
                        <RestartProcessForm api={api} processDefinitionId={instance.processDefinitionId} />
                      </Tab>
                    )}
                  </Tabs>
                </div>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </div>
    </Container>
  );
};

export default HistoryViewLayout;
