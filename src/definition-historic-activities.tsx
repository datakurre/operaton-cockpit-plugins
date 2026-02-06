import './Components/Button.scss';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Expression } from '@waylay/react-filter-box';

import FilterBox from './Components/FilterBox';
import Portal from './Components/Portal';
import StatisticsTable from './Components/StatisticsTable';
import { ToggleHistoryStatisticsButton } from './Components/ToggleHistoryStatisticsButton';
import type { BpmnViewerInstance, OverlayManager } from './services/ViewerService';
import { DefinitionPluginParams, HistoricActivityInstance } from './types';
import { get } from './utils/api';
import { MS_PER_SECOND, SECONDS_PER_HOUR, HOURS_PER_DAY, DAYS_PER_WEEK, DEFAULT_MAX_RESULTS } from './utils/constants';
import { createDefinitionFilterHandler } from './utils/filterAutocomplete';
import { filter } from './utils/misc';

const DefinitionFilterOptions = [
  {
    columnField: 'started',
    type: 'date',
  },
  {
    columnField: 'finished',
    type: 'date',
  },
  {
    columnField: 'maxResults',
    type: 'text',
  },
];

interface PluginState {
  viewer: BpmnViewerInstance | null;
  statistics: Element | null;
}

const initialState: PluginState = {
  viewer: null,
  statistics: null,
};

interface PluginHooks {
  setViewer: (viewer: BpmnViewerInstance | null) => void;
  setStatistics: (node: Element | null) => void;
}

const hooks: PluginHooks = {
  setViewer: (viewer: BpmnViewerInstance | null) => {
    initialState.viewer = viewer;
  },
  setStatistics: (node: Element | null) => {
    initialState.statistics = node;
  },
};

/**
 * Plugin component for displaying historic activity statistics on process definitions.
 * Manages filter state, diagram overlays, and statistics table rendering.
 */
// eslint-disable-next-line max-lines-per-function -- Plugin with coordinated state for diagram, overlays, and table
const Plugin: React.FC<DefinitionPluginParams> = ({ root, api, processDefinitionId }) => {
  const [autoCompleteHandler] = useState(() => createDefinitionFilterHandler([], DefinitionFilterOptions));
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [query, setQuery] = useState<Record<string, string | null>>({});
  const [viewer, setViewer] = useState<BpmnViewerInstance | null>(initialState.viewer);
  const [statistics, setStatistics] = useState<Element | null>(initialState.statistics);

  hooks.setViewer = setViewer;
  hooks.setStatistics = setStatistics;

  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [tokens, setTokens] = useState<Element[]>([]);
  const [showTokens, setShowTokens] = useState(false);

  // FETCH

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      void (async () => {
        const result = await get(api, '/history/activity-instance', {
          ...query,
          processDefinitionId,
        });
        setActivities(result as HistoricActivityInstance[]);
      })();
    }
  }, [api, processDefinitionId, query]);

  useEffect(() => {
    if (expressions.length > 0) {
      const filterQuery: Record<string, string | null> = {
        sortBy: 'endTime',
        sortOrder: 'desc',
        maxResults: String(DEFAULT_MAX_RESULTS),
      };
      for (const { category, operator, value } of expressions) {
        const strValue = value ?? '';
        if (category === 'started' && operator === 'after' && !isNaN(new Date(strValue).getTime())) {
          filterQuery['startedAfter'] = `${strValue}T00:00:00.000+0000`;
        } else if (category === 'finished' && operator === 'before' && !isNaN(new Date(strValue).getTime())) {
          filterQuery['finishedBefore'] = `${strValue}T00:00:00.000+0000`;
        } else if (category === 'maxResults' && operator === 'is' && !isNaN(parseInt(strValue, 10))) {
          filterQuery['maxResults'] = strValue;
        }
      }
      setQuery(filterQuery);
    } else {
      const weekAgoMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
      const oneDayMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY;
      const weekAgo = new Date(new Date().getTime() - weekAgoMs).toISOString().split('T')[0] ?? '';
      const tomorrow = new Date(new Date().getTime() + oneDayMs).toISOString().split('T')[0] ?? '';
      setQuery({
        sortBy: 'endTime',
        sortOrder: 'desc',
        startedAfter: `${weekAgo}T00:00:00.000+0000`,
        finishedBefore: `${tomorrow}T00:00:00.000+0000`,
        maxResults: String(DEFAULT_MAX_RESULTS),
      });
    }
  }, [expressions]);

  // Overlay

  useEffect(() => {
    if (viewer) {
      const toggleHistoryStatisticsButton = document.createElement('div');
      toggleHistoryStatisticsButton.className = 'viewer-button-container viewer-button-container--top-60';
      viewer._container.appendChild(toggleHistoryStatisticsButton);
      createRoot(toggleHistoryStatisticsButton).render(
        <React.StrictMode>
          <ToggleHistoryStatisticsButton
            onToggleHistoryStatistics={(value: boolean) => {
              setShowTokens(value);
            }}
          />
        </React.StrictMode>
      );
    }
  }, [viewer]);

  /* eslint-disable complexity, max-statements, react-hooks/exhaustive-deps */
  // Note: tokens is intentionally excluded from deps to prevent infinite loop (effect creates new tokens)
  useEffect(() => {
    for (const token of tokens) {
      token.parentElement?.removeChild(token);
    }

    if (showTokens && viewer !== null && activities.length > 0) {
      const overlays = viewer.get('overlays') as OverlayManager;
      const update: Element[] = [];
      const counter: Record<string, number> = {};
      for (const activity of activities) {
        const id = activity.activityId;
        if (id !== null && id !== undefined) {
          counter[id] = (counter[id] ?? 0) + 1;
        }
      }

      const seen: Record<string, boolean> = {};
      for (const activity of activities) {
        const id = activity.activityId;
        if (id === null || id === undefined || seen[id]) {
          continue;
        }
        seen[id] = true;

        const overlay = document.createElement('span');
        overlay.innerText = String(counter[id] ?? 0);
        overlay.className = 'badge';
        overlay.style.cssText = `
          background: lightgray;
        `;
        try {
          const elementId = id.split('#')[0];
          if (elementId !== undefined) {
            overlays.add(elementId, {
              position: {
                bottom: 17,
                right: 10,
              },
              html: overlay,
            });
            update.push(overlay);
          }
        } catch {
          // Silently skip elements that can't have overlays
        }
      }
      setTokens(update);
    }
  }, [viewer, activities, showTokens]);
  /* eslint-enable complexity, max-statements, react-hooks/exhaustive-deps */

  // Hack to ensure long living HTML node for filter box
  if (statistics && !Array.from(statistics.children).includes(root)) {
    statistics.appendChild(root);
  }

  // Tabs
  return statistics ? (
    <Portal node={root}>
      <FilterBox
        options={DefinitionFilterOptions}
        autoCompleteHandler={autoCompleteHandler}
        onParseOk={setExpressions}
        defaultQuery={(): string => {
          const weekAgoMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
          const oneDayMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY;
          const weekAgo = new Date(new Date().getTime() - weekAgoMs).toISOString().split('T')[0] ?? '';
          const tomorrow = new Date(new Date().getTime() + oneDayMs).toISOString().split('T')[0] ?? '';
          return `started after ${weekAgo} AND finished before ${tomorrow} AND maxResults is ${DEFAULT_MAX_RESULTS}`;
        }}
      />
      {activities.length > 0 ? (
        <StatisticsTable
          activities={filter(activities, activity => Boolean(activity.activityName && activity.endTime))}
        />
      ) : null}
    </Portal>
  ) : null;
};

export default [
  {
    id: 'definitionHistoricActivitiesDiagramTokens',
    pluginPoint: 'cockpit.processDefinition.diagram.plugin',
    render: (viewer: BpmnViewerInstance): void => {
      hooks.setViewer(viewer);
    },
  },
  {
    id: 'definitionHistoricActivitiesStatisticsTab',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'Statistics',
    },
    render: (node: Element): void => {
      hooks.setStatistics(node);
    },
  },
  {
    id: 'definitionHistoricActivitiesPlugin',
    pluginPoint: 'cockpit.processDefinition.runtime.action',
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <Plugin root={node} api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
];
