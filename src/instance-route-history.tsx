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
import {
  parseProcessInstanceExpressions,
  type ProcessInstanceQueryParams,
  type VersionFilter,
} from './utils/filterExpressionParsers';
import { createInstanceQuerySchema, type LegacyExpression } from './utils/filterSchema';
import { sortActivitiesByEndTime, sortByName, mapDecisionsByActivity, loadSettings } from './utils/misc';

/**
 * Convert filter expression params to API query params.
 * Handles type conversions between internal and API formats.
 */
/* eslint-disable complexity, max-statements -- Query conversion requires explicit field mappings */
function toApiQuery(
  params: Omit<ProcessInstanceQueryParams, 'useAllVersions' | 'versionFilter'>
): HistoricProcessInstanceQueryParams {
  const result: HistoricProcessInstanceQueryParams = {};

  // Date fields
  if (params.startedAfter) {
    result.startedAfter = params.startedAfter;
  }
  if (params.startedBefore) {
    result.startedBefore = params.startedBefore;
  }
  if (params.finishedAfter) {
    result.finishedAfter = params.finishedAfter;
  }
  if (params.finishedBefore) {
    result.finishedBefore = params.finishedBefore;
  }
  if (params.executedActivityAfter) {
    result.executedActivityAfter = params.executedActivityAfter;
  }
  if (params.executedActivityBefore) {
    result.executedActivityBefore = params.executedActivityBefore;
  }
  if (params.executedJobAfter) {
    result.executedJobAfter = params.executedJobAfter;
  }
  if (params.executedJobBefore) {
    result.executedJobBefore = params.executedJobBefore;
  }

  // Process definition fields
  if (params.processDefinitionId) {
    result.processDefinitionId = params.processDefinitionId;
  }
  if (params.processDefinitionKey) {
    result.processDefinitionKey = params.processDefinitionKey;
  }
  if (params.processDefinitionName) {
    result.processDefinitionName = params.processDefinitionName;
  }
  if (params.processDefinitionNameLike) {
    result.processDefinitionNameLike = params.processDefinitionNameLike;
  }
  if (params.processDefinitionKeyIn) {
    result.processDefinitionKeyIn = params.processDefinitionKeyIn.split(',').map(k => k.trim());
  }
  if (params.processDefinitionKeyNotIn) {
    result.processDefinitionKeyNotIn = params.processDefinitionKeyNotIn.split(',').map(k => k.trim());
  }

  // Process instance identifiers
  if (params.processInstanceId) {
    result.processInstanceId = params.processInstanceId;
  }
  if (params.processInstanceIds) {
    result.processInstanceIds = params.processInstanceIds.split(',').map(id => id.trim());
  }
  if (params.processInstanceIdNotIn) {
    result.processInstanceIdNotIn = params.processInstanceIdNotIn.split(',').map(id => id.trim());
  }

  // Business key fields
  if (params.processInstanceBusinessKey) {
    result.processInstanceBusinessKey = params.processInstanceBusinessKey;
  }
  if (params.processInstanceBusinessKeyLike) {
    result.processInstanceBusinessKeyLike = params.processInstanceBusinessKeyLike;
  }
  if (params.processInstanceBusinessKeyIn) {
    result.processInstanceBusinessKeyIn = params.processInstanceBusinessKeyIn.split(',').map(k => k.trim());
  }

  // Hierarchy fields
  if (params.rootProcessInstances !== undefined) {
    result.rootProcessInstances = params.rootProcessInstances;
  }
  if (params.rootProcessInstanceId) {
    result.rootProcessInstanceId = params.rootProcessInstanceId;
  }
  if (params.superProcessInstanceId) {
    result.superProcessInstanceId = params.superProcessInstanceId;
  }
  if (params.subProcessInstanceId) {
    result.subProcessInstanceId = params.subProcessInstanceId;
  }

  // Variable fields
  if (params.variables && params.variables.length > 0) {
    result.variables = params.variables;
  }
  if (params.variableNamesIgnoreCase !== undefined) {
    result.variableNamesIgnoreCase = params.variableNamesIgnoreCase;
  }
  if (params.variableValuesIgnoreCase !== undefined) {
    result.variableValuesIgnoreCase = params.variableValuesIgnoreCase;
  }

  // State boolean fields
  if (params.finished !== undefined) {
    result.finished = params.finished;
  }
  if (params.unfinished !== undefined) {
    result.unfinished = params.unfinished;
  }
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
  if (params.state) {
    result.state = params.state;
  }

  // Incident fields
  if (params.withIncidents !== undefined) {
    result.withIncidents = params.withIncidents;
  }
  if (params.withRootIncidents !== undefined) {
    result.withRootIncidents = params.withRootIncidents;
  }
  if (params.withJobsRetrying !== undefined) {
    result.withJobsRetrying = params.withJobsRetrying;
  }
  if (params.incidentType) {
    result.incidentType = params.incidentType;
  }
  if (params.incidentStatus) {
    result.incidentStatus = params.incidentStatus;
  }
  if (params.incidentMessage) {
    result.incidentMessage = params.incidentMessage;
  }
  if (params.incidentMessageLike) {
    result.incidentMessageLike = params.incidentMessageLike;
  }
  if (params.incidentIdIn) {
    result.incidentIdIn = params.incidentIdIn.split(',').map(id => id.trim());
  }

  // Activity fields
  if (params.executedActivityIdIn) {
    result.executedActivityIdIn = params.executedActivityIdIn.split(',').map(a => a.trim());
  }
  if (params.activeActivityIdIn) {
    result.activeActivityIdIn = params.activeActivityIdIn.split(',').map(a => a.trim());
  }

  // Other fields
  if (params.startedBy) {
    result.startedBy = params.startedBy;
  }
  if (params.tenantIdIn) {
    result.tenantIdIn = params.tenantIdIn.split(',').map(t => t.trim());
  }
  if (params.withoutTenantId !== undefined) {
    result.withoutTenantId = params.withoutTenantId;
  }

  return result;
}
/* eslint-enable complexity, max-statements */

/**
 * Test an instance's definition version against a version filter.
 *
 * The version is read from the process definition id, which the engine formats as
 * `key:version:deploymentId`.
 * @param processDefinitionId - Process definition id of the historic instance
 * @param versionFilter - Operator and version to compare against
 * @returns True when the instance's version satisfies the filter
 */
export function matchesVersionFilter(
  processDefinitionId: string | null | undefined,
  versionFilter: VersionFilter
): boolean {
  if (processDefinitionId === null || processDefinitionId === undefined || processDefinitionId === '') {
    return false;
  }
  const versionPart = processDefinitionId.split(':')[1];
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
}

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

      // The history API has no version operator, and its instance query takes a single
      // processDefinitionId rather than a list, so a version filter can only be applied
      // client-side. Paginating on the server first would slice the page *before* that
      // filter ran, leaving short or empty pages under a total that still counted the
      // other versions. So fetch one bounded window instead and page through it locally.
      if (versionFilter) {
        const windowed = await historyService.queryProcessInstances(baseQuery, {
          maxResults: loadSettings().maxResults,
          firstResult: 0,
        });
        const matching = windowed.filter(instance => matchesVersionFilter(instance.processDefinitionId, versionFilter));
        setInstancesCount(matching.length);
        setInstances(matching.slice(firstResult, firstResult + perPage));
        return;
      }

      const count = await historyService.countProcessInstances(baseQuery);
      setInstancesCount(count);

      setInstances(
        await historyService.queryProcessInstances(baseQuery, {
          maxResults: perPage,
          firstResult,
        })
      );
    })();
  }, [historyService, processDefinitionId, processDefinitionKey, perPage, query, firstResult]);

  // Parse filter expressions using extracted utility function. Changing the filter changes
  // the size of the result set, so return to the first page rather than leaving the pager
  // pointing past the end of it.
  useEffect(() => {
    setQuery(parseProcessInstanceExpressions(expressions));
    setCurrentPage(1);
    setFirstResult(0);
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
                  api={api}
                />
              </Page>
            </React.StrictMode>
          );
        })();
      }
    },
  },
];
