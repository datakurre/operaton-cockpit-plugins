import './Components/Button.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import FilterBox from './Components/FilterBox';
import Portal from './Components/Portal';
import StatisticsTable from './Components/StatisticsTable';
import { ToggleHistoryStatisticsButton } from './Components/ToggleHistoryStatisticsButton';
import { createHistoryService } from './services/HistoryService';
import type { BpmnViewerInstance, OverlayManager } from './services/ViewerService';
import { DefinitionPluginParams, HistoricActivityInstance } from './types';
import { DEFAULT_MAX_RESULTS } from './utils/constants';
import {
  parseActivityInstanceExpressions,
  activityInstanceQueryToRecord,
  getDefaultActivityInstanceQuery,
} from './utils/filterExpressionParsers';
import { createDefinitionFilterSchema, type LegacyExpression, fromLegacyExpressions } from './utils/filterSchema';
import { filter } from './utils/misc';

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
  const [expressions, setExpressions] = useState<LegacyExpression[]>([]);
  const [query, setQuery] = useState<Record<string, string | null>>({});
  const [viewer, setViewer] = useState<BpmnViewerInstance | null>(initialState.viewer);
  const [statistics, setStatistics] = useState<Element | null>(initialState.statistics);
  const [processVersion, setProcessVersion] = useState<number | null>(null);
  const [initialFilterSet, setInitialFilterSet] = useState(false);

  hooks.setViewer = setViewer;
  hooks.setStatistics = setStatistics;

  const [activities, setActivities] = useState<HistoricActivityInstance[]>([]);
  const [tokens, setTokens] = useState<Element[]>([]);
  const [showTokens, setShowTokens] = useState(false);

  // Create history service instance (memoized to avoid recreation on each render)
  const historyService = useMemo(() => createHistoryService(api), [api]);

  // Create filter schema with API for autocomplete (memoized to avoid recreation)
  const definitionFilterSchema = useMemo(() => createDefinitionFilterSchema(api), [api]);

  // Fetch process definition version
  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch(`${api.engineApi}/process-definition/${processDefinitionId}`);
        if (response.ok) {
          const data = (await response.json()) as { version?: number };
          if (data.version !== undefined) {
            setProcessVersion(data.version);
          }
        }
      } catch {
        // Silently fail - continue without version filter
      }
    })();
  }, [api.engineApi, processDefinitionId]);

  // Set initial predefined filter once version is loaded
  useEffect(() => {
    if (!initialFilterSet && processVersion !== null) {
      const MS_PER_SECOND = 1000;
      const SECONDS_PER_HOUR = 3600;
      const HOURS_PER_DAY = 24;
      const DAYS_PER_WEEK = 7;

      const weekAgoMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
      const oneDayMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY;
      const weekAgo = new Date(Date.now() - weekAgoMs).toISOString().split('T')[0] ?? '';
      const tomorrow = new Date(Date.now() + oneDayMs).toISOString().split('T')[0] ?? '';

      const defaultExpressions: LegacyExpression[] = [
        { category: 'started', operator: 'after', value: weekAgo },
        { category: 'finished', operator: 'before', value: tomorrow },
        { category: 'version', operator: '==', value: String(processVersion) },
        { category: 'maxResults', operator: 'is', value: String(DEFAULT_MAX_RESULTS) },
      ];

      setExpressions(defaultExpressions);
      setInitialFilterSet(true);
    }
  }, [processVersion, initialFilterSet]);

  // FETCH

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      void (async () => {
        const result = await historyService.getActivitiesByDefinition(processDefinitionId, query);
        setActivities(result as HistoricActivityInstance[]);
      })();
    }
  }, [historyService, processDefinitionId, query]);

  useEffect(() => {
    if (expressions.length > 0) {
      const parsed = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);
      setQuery(activityInstanceQueryToRecord(parsed));
    } else {
      setQuery(getDefaultActivityInstanceQuery(DEFAULT_MAX_RESULTS));
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
        schema={definitionFilterSchema}
        onFilterChange={() => {
          // New format handled by onLegacyFilterChange
        }}
        onLegacyFilterChange={setExpressions}
        placeholder="Add filter..."
        initialExpressions={fromLegacyExpressions(expressions, definitionFilterSchema)}
        storageKey="minimal-history-plugin-saved-searches-definition-activities"
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
