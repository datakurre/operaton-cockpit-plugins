/**
 * Dashboard Favourites Plugin
 *
 * This plugin provides:
 * 1. A star button on process definitions to add/remove favorites
 * 2. A dashboard table showing favorited process definitions
 *
 * Favorites are stored in localStorage using the same settings pattern
 * as other plugins in this project.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Column, CellProps } from 'react-table';
import type { DefinitionPluginParams, RoutePluginParams, ProcessDefinition } from './types';
import type { components } from './operaton';
import { getStorage } from './utils/storage';
import { Clippy } from './Components/Clippy';
import SortableTable from './Components/SortableTable';
import DashboardSection from './Components/DashboardSection';

// =============================================================================
// Storage utilities
// =============================================================================

const FAVOURITES_KEY = 'minimal-history-plugin-favourites';

interface FavouriteDefinition {
  id: string;
  key: string;
  name: string | null;
  version: number;
}

type ProcessDefinitionStatistics = components['schemas']['ProcessDefinitionStatisticsResultDto'];

interface ProcessDefinitionRow {
  id: string;
  key: string;
  name: string | null;
  version: number;
  tenantId: string | null;
  incidents: number;
  instances: number;
  suspended: boolean;
  state: number; // 0 = healthy, 1 = suspended, 2 = incidents
}

/**
 * Load favourite process definitions from localStorage
 */
function loadFavourites(): FavouriteDefinition[] {
  const storage = getStorage();
  const raw = storage.get(FAVOURITES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as FavouriteDefinition[];
  } catch {
    return [];
  }
}

/**
 * Save favourite process definitions to localStorage
 */
function saveFavourites(favourites: FavouriteDefinition[]): void {
  const storage = getStorage();
  storage.set(FAVOURITES_KEY, JSON.stringify(favourites));
}

/**
 * Check if a process definition is favourited
 */
function isFavourite(processDefinitionId: string): boolean {
  const favourites = loadFavourites();
  return favourites.some(f => f.id === processDefinitionId);
}

/**
 * Add a process definition to favourites
 */
function addFavourite(definition: FavouriteDefinition): void {
  const favourites = loadFavourites();
  if (!favourites.some(f => f.id === definition.id)) {
    favourites.push(definition);
    saveFavourites(favourites);
  }
}

/**
 * Remove a process definition from favourites
 */
function removeFavourite(processDefinitionId: string): void {
  const favourites = loadFavourites();
  const filtered = favourites.filter(f => f.id !== processDefinitionId);
  saveFavourites(filtered);
}

// =============================================================================
// Star Button Component
// =============================================================================

interface StarButtonProps {
  api: { engineApi: string };
  processDefinitionId: string;
}

/**
 * Star button to add/remove process definition from favourites
 */
const StarButton: React.FC<StarButtonProps> = ({ api, processDefinitionId }) => {
  const [isFav, setIsFav] = useState<boolean>(false);
  const [definition, setDefinition] = useState<ProcessDefinition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load process definition details
    const fetchDefinition = async (): Promise<void> => {
      try {
        const response = await fetch(`${api.engineApi}/process-definition/${processDefinitionId}`);
        if (response.ok) {
          const data = (await response.json()) as ProcessDefinition;
          setDefinition(data);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    setIsFav(isFavourite(processDefinitionId));
    void fetchDefinition();
  }, [api.engineApi, processDefinitionId]);

  const handleToggle = (): void => {
    if (!definition) {
      return;
    }

    if (isFav) {
      removeFavourite(processDefinitionId);
      setIsFav(false);
    } else {
      addFavourite({
        id: definition.id ?? processDefinitionId,
        key: definition.key ?? '',
        name: definition.name ?? null,
        version: definition.version ?? 0,
      });
      setIsFav(true);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <button
      type="button"
      className="btn btn-default btn-sm"
      onClick={handleToggle}
      aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      style={{
        width: '40px',
        height: '34px',
        marginTop: '5px',
        padding: '6px 8px',
        minWidth: '40px',
      }}
    >
      <span className={isFav ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'} aria-hidden="true" />
    </button>
  );
};

// =============================================================================
// Dashboard Table Component
// =============================================================================

interface DashboardTableProps {
  api: { engineApi: string };
}

/**
 * Dashboard table showing favourite process definitions
 */
const DashboardTable: React.FC<DashboardTableProps> = ({ api }) => {
  const [favourites, setFavourites] = useState<FavouriteDefinition[]>([]);
  const [statistics, setStatistics] = useState<Map<string, ProcessDefinitionStatistics>>(new Map());
  // eslint-disable-next-line @typescript-eslint/naming-convention -- Common React state naming pattern
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = (): void => {
    setLoading(true);
    const favs = loadFavourites();
    setFavourites(favs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch statistics for all favourite definitions
  useEffect(() => {
    const fetchStatistics = async (): Promise<void> => {
      if (favourites.length === 0) {
        return;
      }

      try {
        // Build query string with all definition IDs
        const ids = favourites.map(f => `processDefinitionIdIn=${encodeURIComponent(f.id)}`).join('&');
        const response = await fetch(`${api.engineApi}/process-definition/statistics?${ids}&incidents=true`);

        if (response.ok) {
          const data = (await response.json()) as ProcessDefinitionStatistics[];
          const statsMap = new Map<string, ProcessDefinitionStatistics>();
          for (const stat of data) {
            if (stat.id) {
              statsMap.set(stat.id, stat);
            }
          }
          setStatistics(statsMap);
        }
      } catch {
        // Silently fail - will show default values
      }
    };

    void fetchStatistics();
  }, [api.engineApi, favourites]);

  // Transform favourites and statistics into table rows
  const tableData = useMemo<ProcessDefinitionRow[]>(() => {
    return favourites.map(fav => {
      const stats = statistics.get(fav.id);
      const definition = stats?.definition;
      const totalIncidents = (stats?.incidents ?? []).reduce((sum, inc) => sum + (inc.incidentCount ?? 0), 0);
      const suspended = definition?.suspended ?? false;

      // Calculate state: 0 = healthy, 1 = suspended, 2 = incidents
      let state = 0;
      if (totalIncidents > 0) {
        state = 2;
      } else if (suspended) {
        state = 1;
      }

      return {
        id: fav.id,
        key: fav.key,
        name: fav.name,
        version: fav.version,
        tenantId: definition?.tenantId ?? null,
        incidents: totalIncidents,
        instances: stats?.instances ?? 0,
        suspended,
        state,
      };
    });
  }, [favourites, statistics]);

  // Handler for removing favourites
  const handleRemoveFavourite = (definitionId: string): void => {
    removeFavourite(definitionId);
    loadData();
  };

  // Define table columns with AngularJS-compatible class names
  // Note: headerClassName and className are custom properties accessed via type casting in SortableTable
  const columns = useMemo<Column<ProcessDefinitionRow>[]>(
    () =>
      [
        {
          Header: 'State',
          accessor: 'state',
          headerClassName: 'state',
          className: 'state',
          Cell: ({ row }: CellProps<ProcessDefinitionRow, number>) => {
            const { incidents } = row.original;
            if (incidents > 0) {
              return <div className="circle circle-red">{/* State circle for incidents */}</div>;
            }
            return <div className="circle circle-green">{/* State circle for healthy */}</div>;
          },
        },
        {
          Header: 'Incidents',
          accessor: 'incidents',
          headerClassName: 'incidents',
          className: 'incidents',
          Cell: ({ value }: CellProps<ProcessDefinitionRow, number>) => <span>{value}</span>,
        },
        {
          Header: 'Running Instances',
          accessor: 'instances',
          headerClassName: 'instances',
          className: 'instances',
          Cell: ({ value }: CellProps<ProcessDefinitionRow, number>) => <span>{value}</span>,
        },
        {
          Header: 'Key',
          accessor: 'key',
          headerClassName: 'key',
          className: 'key',
          Cell: ({ value, row }: CellProps<ProcessDefinitionRow, string>) => (
            <Clippy value={value}>
              <a href={`#/process-definition/${row.original.id}/runtime`}>{value}</a>
            </Clippy>
          ),
        },
        {
          Header: 'Name',
          accessor: 'name',
          headerClassName: 'name',
          className: 'name',
          Cell: ({ value }: CellProps<ProcessDefinitionRow, string | null>) => <span>{value ?? ''}</span>,
        },
        {
          Header: 'Actions',
          id: 'actions',
          disableSortBy: true,
          Cell: ({ row }: CellProps<ProcessDefinitionRow, never>) => (
            <button
              type="button"
              className="btn btn-default btn-sm"
              onClick={() => handleRemoveFavourite(row.original.id)}
              aria-label="Remove from favourites"
              title="Remove from favourites"
              style={{
                padding: '4px 8px',
                minWidth: '32px',
              }}
            >
              <span className="glyphicon glyphicon-star" aria-hidden="true" />
            </button>
          ),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Custom column properties for AngularJS compatibility
      ] as any,
    [handleRemoveFavourite]
  );

  const title = `${favourites.length} favourite process definition${favourites.length !== 1 ? 's' : ''}`;

  return (
    <DashboardSection
      title={title}
      isLoading={loading}
      hasData={favourites.length > 0}
      emptyMessage="No favourite process definitions yet. Use the star button on a process definition to add it to favourites."
    >
      <SortableTable
        columns={columns}
        data={tableData}
        className="process-definitions-list cam-table search-results"
        ariaLabel="Favourite process definitions"
      />
    </DashboardSection>
  );
};

// =============================================================================
// Plugin Exports
// =============================================================================

export default [
  {
    id: 'definitionFavouritesAction',
    pluginPoint: 'cockpit.processDefinition.runtime.action',
    render: (node: Element, { api, processDefinitionId }: DefinitionPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <StarButton api={api} processDefinitionId={processDefinitionId} />
        </React.StrictMode>
      );
    },
  },
  {
    id: 'definitionFavouritesDashboard',
    pluginPoint: 'cockpit.processes.dashboard',
    priority: 10,
    render: (node: Element, { api }: RoutePluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <DashboardTable api={api} />
        </React.StrictMode>
      );
    },
  },
];
