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

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { DefinitionPluginParams, RoutePluginParams, ProcessDefinition } from './types';
import { getStorage } from './utils/storage';

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
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
      style={{ marginLeft: '5px' }}
    >
      <span className={isFav ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'} />
      {isFav ? ' Unfavourite' : ' Favourite'}
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
const DashboardTable: React.FC<DashboardTableProps> = ({ api: _api }) => {
  const [favourites, setFavourites] = useState<FavouriteDefinition[]>([]);
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

  const handleRemove = (processDefinitionId: string): void => {
    removeFavourite(processDefinitionId);
    loadData();
  };

  if (loading) {
    return <div>Loading favourites...</div>;
  }

  if (favourites.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h3>Favourite Process Definitions</h3>
        <p>
          No favourite process definitions yet. Use the star button on a process definition to add it to favourites.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Favourite Process Definitions</h3>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Version</th>
            <th style={{ width: '80px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {favourites.map(fav => (
            <tr key={fav.id}>
              <td>
                <a href={`#/process-definition/${fav.id}/runtime`}>{fav.name ?? fav.key}</a>
              </td>
              <td>{fav.key}</td>
              <td>{fav.version}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-default btn-xs"
                  onClick={() => {
                    handleRemove(fav.id);
                  }}
                  title="Remove from favourites"
                >
                  <span className="glyphicon glyphicon-star" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
