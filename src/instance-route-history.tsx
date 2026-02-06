/* eslint-disable @typescript-eslint/naming-convention -- Complex history view with filtering and pagination */
import './Components/Button.scss';
import './instance-route-history.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import BreadcrumbsPanel from './Components/BreadcrumbsPanel';
import FilterBox from './Components/FilterBox';
import HistoryTable from './Components/HistoryTable';
import HistoryViewLayout from './Components/HistoryViewLayout';
import Page from './Components/Page';
import Pagination from './Components/Pagination';
import Portal from './Components/Portal';
import { ToggleHistoryViewButton } from './Components/ToggleHistoryViewButton';
import { ViewerButtonsPortal } from './Components/ViewerButtonsPortal';
import {
  createHistoryService,
  type HistoricProcessInstanceQueryParams,
  type HistoricProcessInstance,
} from './services/HistoryService';
import { DefinitionPluginParams, RoutePluginParams } from './types';
import {
  getHistoricProcessInstance,
  getVersion,
  getProcessDefinition,
  getProcessDefinitionXml,
  getActivities,
  getVariables,
  getDecisions,
} from './utils/api';
import { DEFAULT_PAGE_SIZE } from './utils/constants';
import { parseProcessInstanceExpressions, type ProcessInstanceQueryParams } from './utils/filterExpressionParsers';
import { createInstanceQuerySchema, type LegacyExpression } from './utils/filterSchema';
import { sortActivitiesByEndTime, sortByName, mapDecisionsByActivity } from './utils/misc';

/**
 * Convert filter expression params to API query params.
 * Handles type conversions between internal and API formats.
 */
/* eslint-disable complexity, max-statements -- Query conversion requires explicit field mappings */
function toApiQuery(
  params: Omit<ProcessInstanceQueryParams, 'useAllVersions' | 'versionFilter'>
): HistoricProcessInstanceQueryParams {
  const result: HistoricProcessInstanceQueryParams = {};

  if (params.startedAfter) {
    result.startedAfter = params.startedAfter;
  }
  if (params.finishedBefore) {
    result.finishedBefore = params.finishedBefore;
  }
  if (params.processInstanceBusinessKey) {
    result.processInstanceBusinessKey = params.processInstanceBusinessKey;
  }
  if (params.processInstanceBusinessKeyLike) {
    result.processInstanceBusinessKeyLike = params.processInstanceBusinessKeyLike;
  }
  if (params.variables && params.variables.length > 0) {
    result.variables = params.variables;
  }
  if (params.variableNamesIgnoreCase !== undefined) {
    result.variableNamesIgnoreCase = params.variableNamesIgnoreCase;
  }
  if (params.variableValuesIgnoreCase !== undefined) {
    result.variableValuesIgnoreCase = params.variableValuesIgnoreCase;
  }
  if (params.finished !== undefined) {
    result.finished = params.finished;
  }
  if (params.unfinished !== undefined) {
    result.unfinished = params.unfinished;
  }
  if (params.withIncidents !== undefined) {
    result.withIncidents = params.withIncidents;
  }
  if (params.incidentType) {
    result.incidentType = params.incidentType;
  }
  if (params.incidentStatus) {
    result.incidentStatus = params.incidentStatus;
  }
  if (params.startedBy) {
    result.startedBy = params.startedBy;
  }
  // Convert tenantIdIn from string to array
  if (params.tenantIdIn) {
    result.tenantIdIn = params.tenantIdIn.split(',').map(t => t.trim());
  }
  if (params.state) {
    result.state = params.state;
  }
  // Convert executedActivityIdIn from string to array
  if (params.executedActivityIdIn) {
    result.executedActivityIdIn = params.executedActivityIdIn.split(',').map(a => a.trim());
  }
  // Convert activeActivityIdIn from string to array
  if (params.activeActivityIdIn) {
    result.activeActivityIdIn = params.activeActivityIdIn.split(',').map(a => a.trim());
  }
  // State boolean fields
  if (params.active !== undefined) {
    result.active = params.active;
  }
  if (params.suspended !== undefined) {
    result.suspended = params.suspended;
  }
  if (params.completed !== undefined) {
    result.completed = params.completed;
  }
  if (params.externallyTerminated !== undefined) {
    result.externallyTerminated = params.externallyTerminated;
  }
  if (params.internallyTerminated !== undefined) {
    result.internallyTerminated = params.internallyTerminated;
  }

  return result;
}
/* eslint-enable complexity, max-statements */

/** Interface for BPMN viewer instance */
interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (serviceName: string) => unknown;
}

const initialState: Record<string, Element | null> = {
  historyTabNode: null,
};

const hooks: Record<string, (node: Element) => void> = {
  setHistoryTabNode: (node: Element): void => {
    initialState['historyTabNode'] = node;
  },
};

/**
 * Plugin component for displaying historic process instance list.
 * Manages filter parsing, pagination, and history table rendering.
 */
const Plugin: React.FC<DefinitionPluginParams> = ({ root, api, processDefinitionId }) => {
  const [expressions, setExpressions] = useState<LegacyExpression[]>([]);
  const [query, setQuery] = useState<ProcessInstanceQueryParams>({});
  const [historyTabNode, setHistoryTabNode] = useState<Element | null>(initialState['historyTabNode'] ?? null);

  hooks['setHistoryTabNode'] = setHistoryTabNode;

  const [instances, setInstances] = useState<HistoricProcessInstance[]>([]);
  const [instancesCount, setInstancesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(DEFAULT_PAGE_SIZE);
  const [firstResult, setFirstResult] = useState(0);

  // Create history service instance (memoized to avoid recreation on each render)
  const historyService = useMemo(() => createHistoryService(api), [api]);

  // Create filter schema with API for autocomplete (memoized to avoid recreation)
  const instanceQuerySchema = useMemo(() => createInstanceQuerySchema(api), [api]);

  // Extract process definition key from the ID (format: key:version:deploymentId)
  const processDefinitionKey = processDefinitionId.split(':')[0] ?? processDefinitionId;

  // FETCH
  useEffect(() => {
    void (async () => {
      // Build query parameters, handling version filtering
      const { useAllVersions, versionFilter, ...restQuery } = query;
      const baseQuery: HistoricProcessInstanceQueryParams = {
        sortBy: 'endTime',
        sortOrder: 'desc',
        ...toApiQuery(restQuery),
      };

      // If version filter is used, switch to processDefinitionKey
      if (useAllVersions === true) {
        baseQuery.processDefinitionKey = processDefinitionKey;
      } else {
        baseQuery.processDefinitionId = processDefinitionId;
      }

      const count = await historyService.countProcessInstances(baseQuery);
      setInstancesCount(count);

      // Fetch instances and optionally filter by version client-side
      let fetchedInstances = await historyService.queryProcessInstances(baseQuery, {
        maxResults: perPage,
        firstResult,
      });

      // Apply version filter client-side if specified (API doesn't support version operators)
      if (versionFilter) {
        fetchedInstances = fetchedInstances.filter(instance => {
          const defId = instance.processDefinitionId;
          if (!defId) {
            return false;
          }
          // Extract version from processDefinitionId (format: key:version:deploymentId)
          const versionPart = defId.split(':')[1];
          const instanceVersion = versionPart !== undefined ? parseInt(versionPart, 10) : NaN;
          if (isNaN(instanceVersion)) {
            return false;
          }

          switch (versionFilter.operator) {
            case 'eq':
              return instanceVersion === versionFilter.value;
            case 'lt':
              return instanceVersion < versionFilter.value;
            case 'lte':
              return instanceVersion <= versionFilter.value;
            case 'gt':
              return instanceVersion > versionFilter.value;
            case 'gte':
              return instanceVersion >= versionFilter.value;
            default:
              return true;
          }
        });
      }

      setInstances(fetchedInstances);
    })();
  }, [historyService, processDefinitionId, processDefinitionKey, perPage, query, firstResult]);

  // Parse filter expressions using extracted utility function
  useEffect(() => {
    setQuery(parseProcessInstanceExpressions(expressions));
  }, [expressions]);

  // Hack to ensure long living HTML node for filter box
  if (historyTabNode !== null && !Array.from(historyTabNode.children).includes(root)) {
    historyTabNode.appendChild(root);
  }

  const pageClicked = (firstResult: number, page: number): void => {
    setCurrentPage(page);
    setFirstResult(firstResult);
  };

  return historyTabNode !== null ? (
    <Portal node={root}>
      <FilterBox
        schema={instanceQuerySchema}
        onFilterChange={() => {
          // New format handled by onLegacyFilterChange
        }}
        onLegacyFilterChange={setExpressions}
        placeholder="Add filter..."
        storageKey="minimal-history-plugin-saved-searches-instance-history"
      />
      {instances.length > 0 ? <HistoryTable instances={instances} /> : null}
      <Pagination currentPage={currentPage} perPage={perPage} total={instancesCount} onPage={pageClicked} />
    </Portal>
  ) : null;
};

export default [
  {
    id: 'definitionTabHistoricInstances',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'History',
    },
    render: (node: Element): void => {
      hooks['setHistoryTabNode']?.(node);
    },
  },
  {
    id: 'definitionHistoricInstancesPlugin',
    pluginPoint: 'cockpit.processDefinition.runtime.action',
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <Plugin root={node} api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
  {
    id: 'instanceDiagramHistoricToggle',
    pluginPoint: 'cockpit.processInstance.diagram.plugin',
    render: (viewer: BpmnViewerInstance): void => {
      // Create a minimal mount point for React - the ViewerButtonsPortal handles positioning
      const mountPoint = document.createElement('div');
      mountPoint.style.display = 'contents';
      viewer._container.appendChild(mountPoint);
      createRoot(mountPoint).render(
        <React.StrictMode>
          <ViewerButtonsPortal viewer={viewer} position={{ right: '15px', top: '60px' }}>
            <ToggleHistoryViewButton
              onToggleHistoryView={(value: boolean): void => {
                if (value) {
                  const hash = window.location.hash;
                  const hashPart = hash !== '' ? hash.split('?')[0] : '';
                  const basePath = window.location.href.split('#')[0] ?? '';
                  const newHash =
                    hashPart !== undefined && hashPart !== ''
                      ? hashPart.replace(/^#\/process-instance/, '#/history/process-instance').replace(/\/runtime/, '/')
                      : '';
                  window.location.href = `${basePath}${newHash}`;
                }
              }}
              initial={false}
            />
          </ViewerButtonsPortal>
        </React.StrictMode>
      );
    },
  },
  {
    id: 'instanceRouteHistory',
    pluginPoint: 'cockpit.route',
    properties: {
      path: '/history/process-instance/:id',
      label: '/history',
    },

    render: (node: Element, { api }: RoutePluginParams): void => {
      const hash = window.location.hash;
      const match = /\/history\/process-instance\/([^/]*)/.exec(hash);
      const processInstanceId = match?.[1]?.split('?')[0] ?? null;
      if (processInstanceId !== null) {
        void (async () => {
          const instance = await getHistoricProcessInstance(api, processInstanceId);
          const [versionData, definition, diagram, activitiesData, variablesData, decisions] = await Promise.all([
            getVersion(api),
            getProcessDefinition(api, instance.processDefinitionId ?? ''),
            getProcessDefinitionXml(api, instance.processDefinitionId ?? ''),
            getActivities(api, processInstanceId),
            getVariables(api, processInstanceId),
            getDecisions(api, processInstanceId),
          ]);
          const decisionByActivity = mapDecisionsByActivity(decisions);
          const activityById = new Map(activitiesData.map(activity => [activity.id ?? '', activity]));
          const activities = sortActivitiesByEndTime(activitiesData);
          const variables = sortByName(variablesData);
          // Build the process instance object for display components
          const processInstance = {
            id: instance.id ?? processInstanceId,
            processDefinitionId: instance.processDefinitionId ?? '',
            processDefinitionKey: instance.processDefinitionKey,
            processDefinitionVersion: instance.processDefinitionVersion,
            businessKey: instance.businessKey,
            tenantId: instance.tenantId,
            superProcessInstanceId: instance.superProcessInstanceId,
            ...(instance.processDefinitionName !== null &&
              instance.processDefinitionName !== undefined && {
                processDefinitionName: instance.processDefinitionName,
              }),
            ...(instance.state !== null && instance.state !== undefined && { state: instance.state }),
          };
          createRoot(node).render(
            <React.StrictMode>
              <Page version={versionData.version} api={api}>
                <BreadcrumbsPanel
                  processDefinitionId={instance.processDefinitionId ?? ''}
                  processDefinitionName={instance.processDefinitionName ?? undefined}
                  processInstanceId={processInstanceId}
                />
                <HistoryViewLayout
                  instance={processInstance}
                  historicInstance={instance}
                  definition={definition}
                  diagramXML={diagram.bpmn20Xml}
                  activities={activities}
                  variables={variables}
                  activityById={activityById}
                  decisionByActivity={decisionByActivity}
                />
              </Page>
            </React.StrictMode>
          );
        })();
      }
    },
  },
];
