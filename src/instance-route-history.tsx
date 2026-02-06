import './Components/Button.scss';
import './instance-route-history.scss';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Expression } from '@waylay/react-filter-box';

import BreadcrumbsPanel from './Components/BreadcrumbsPanel';
import FilterBox from './Components/FilterBox';
import HistoryTable from './Components/HistoryTable';
import HistoryViewLayout from './Components/HistoryViewLayout';
import Page from './Components/Page';
import Pagination from './Components/Pagination';
import Portal from './Components/Portal';
import { ToggleHistoryViewButton } from './Components/ToggleHistoryViewButton';
import { ViewerButtonsPortal } from './Components/ViewerButtonsPortal';
import { DefinitionPluginParams, RoutePluginParams } from './types';
import {
  get,
  post,
  getHistoricProcessInstance,
  getVersion,
  getProcessDefinition,
  getProcessDefinitionXml,
  getActivities,
  getVariables,
  getDecisions,
} from './utils/api';
import { DEFAULT_PAGE_SIZE } from './utils/constants';
import { createInstanceQueryHandler } from './utils/filterAutocomplete';
import { sortActivitiesByEndTime, sortByName, mapDecisionsByActivity } from './utils/misc';

const InstanceQueryOptions = [
  {
    columnField: 'started',
    type: 'date',
  },
  {
    columnField: 'finished',
    type: 'date',
  },
  {
    columnField: 'key',
    type: 'string',
  },
  {
    columnField: 'variable',
    type: 'string',
  },
];

/** Interface for parsed filter tokens from filter expressions */
interface ParsedFilterTokens {
  startedAfter?: string;
  finishedBefore?: string;
  processInstanceBusinessKey?: string;
  processInstanceBusinessKeyLike?: string;
  variables?: { name: string; operator: string; value: string }[];
  variableNamesIgnoreCase?: boolean;
  variableValuesIgnoreCase?: boolean;
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
  const [autoCompleteHandler] = useState(() => createInstanceQueryHandler([], InstanceQueryOptions));
  const [expressions, setExpressions] = useState([] as Expression[]);
  const [query, setQuery] = useState({} as ParsedFilterTokens);
  const [historyTabNode, setHistoryTabNode] = useState<Element | null>(initialState['historyTabNode'] ?? null);

  hooks['setHistoryTabNode'] = setHistoryTabNode;

  const [instances, setInstances] = useState<Record<string, unknown>[]>([]);
  const [instancesCount, setInstancesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(DEFAULT_PAGE_SIZE);
  const [firstResult, setFirstResult] = useState(0);
  // FETCH

  useEffect(() => {
    void (async () => {
      const countResult = (await get(api, '/history/process-instance/count', { processDefinitionId })) as {
        count: number;
      };
      setInstancesCount(countResult.count);

      setInstances(
        (await post(
          api,
          '/history/process-instance',
          { maxResults: String(perPage), firstResult: String(firstResult) },
          JSON.stringify({
            sortBy: 'endTime',
            sortOrder: 'desc',
            processDefinitionId,
            ...query,
          })
        )) as Record<string, unknown>[]
      );
    })();
  }, [api, processDefinitionId, perPage, query, firstResult]);

  /* eslint-disable complexity */
  // Filter parsing requires handling multiple expression types with different operator mappings
  useEffect(() => {
    const parsedQuery: ParsedFilterTokens = {};
    const variables: { name: string; operator: string; value: string }[] = [];
    for (const { category, operator, value } of expressions) {
      const strValue = value ?? '';
      const categoryStr = category ?? '';
      if (category === 'started' && operator === 'after' && !isNaN(new Date(strValue).getTime())) {
        parsedQuery.startedAfter = `${strValue}T00:00:00.000+0000`;
      } else if (category === 'finished' && operator === 'before' && !isNaN(new Date(strValue).getTime())) {
        parsedQuery.finishedBefore = `${strValue}T00:00:00.000+0000`;
      } else if (category === 'key' && operator === '==') {
        parsedQuery.processInstanceBusinessKey = strValue;
      } else if (category === 'key' && operator === 'like') {
        parsedQuery.processInstanceBusinessKeyLike = strValue;
      } else if (operator === '==') {
        variables.push({
          name: categoryStr,
          operator: 'eq',
          value: strValue,
        });
      } else if (operator === 'like' || operator === 'ilike') {
        variables.push({
          name: categoryStr,
          operator: 'like',
          value: strValue,
        });
      }
      if (operator === 'ilike') {
        parsedQuery.variableNamesIgnoreCase = true;
        parsedQuery.variableValuesIgnoreCase = true;
      }
    }
    if (variables.length > 0) {
      parsedQuery.variables = variables;
    }
    setQuery(parsedQuery);
  }, [expressions]);
  /* eslint-enable complexity */

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
        options={InstanceQueryOptions}
        autoCompleteHandler={autoCompleteHandler}
        onParseOk={setExpressions}
        defaultQuery={(): string => ''}
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
