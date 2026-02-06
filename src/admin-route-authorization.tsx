/**
 * Admin Authorizations Plugin
 *
 * This plugin provides a full route view for authorization management.
 * Layout follows instance-route-history pattern:
 * - Page wrapper with ctn-main
 * - BreadcrumbsPanel at top
 * - Container with Allotment for two-panel layout
 * - Left pane: Resource type list
 * - Right pane: Authorization table with CRUD operations
 *
 * Features:
 * - View authorizations by resource type
 * - Create new authorizations with type, user/group, permissions, and resource ID
 * - Edit existing authorizations (permissions, user/group, resource ID)
 * - Delete authorizations with confirmation
 * - Permission selection based on resource type
 */

/* eslint-disable max-lines-per-function, max-statements -- Large admin UI with complex CRUD operations */
import 'allotment/dist/style.css';
import './admin-route-authorization.scss';
import './Components/Button.scss';
import './Components/Modal.scss';

import { Allotment } from 'allotment';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

import AuthorizationDeleteModal from './Components/AuthorizationDeleteModal';
import AuthorizationFormModal from './Components/AuthorizationFormModal';
import BreadcrumbsPanel from './Components/BreadcrumbsPanel';
import Container from './Components/Container';
import ErrorMessage from './Components/ErrorMessage';
import FilterBox from './Components/FilterBox';
import LoadingSpinner from './Components/LoadingSpinner';
import Pagination from './Components/Pagination';
import SortableAuthorizationsTable from './Components/SortableAuthorizationsTable';
import type { API } from './types';
import { get, ApiError } from './utils/api';
import { Authorization, RESOURCE_TYPES, getResourceTypeName } from './utils/authorization';
import { ADMIN_PANEL_WIDTH_PX, DEFAULT_PAGE_SIZE } from './utils/constants';
import { parseAuthorizationExpressions } from './utils/filterExpressionParsers';
import { createAuthorizationFilterSchema, type LegacyExpression } from './utils/filterSchema';
import { loadSettings, saveSettings } from './utils/misc';

// =============================================================================
// Constants
// =============================================================================

/** Page size option constants */
const PAGE_SIZE_25 = 25;
const PAGE_SIZE_50 = 50;
const PAGE_SIZE_100 = 100;
const PAGE_SIZE_200 = 200;

/** Page size options */
const PAGE_SIZE_OPTIONS = [PAGE_SIZE_25, PAGE_SIZE_50, PAGE_SIZE_100, PAGE_SIZE_200];

// =============================================================================
// Main Component
// =============================================================================

interface AuthorizationsViewProps {
  api: API;
}
/**
 * Main authorizations view with two-panel layout matching Angular app.
 * Left panel (aside): Resource type list
 * Right panel (section-content): Authorization table with CRUD operations
 */

const AuthorizationsView: React.FC<AuthorizationsViewProps> = ({ api }) => {
  // Default to Application (0) as in Angular app
  const [selectedResourceType, setSelectedResourceType] = useState<number>(0);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [firstResult, setFirstResult] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<Record<string, string>>({});
  const [filterKey, setFilterKey] = useState(0);

  // Create filter schema with API for autocomplete (memoized to avoid recreation)
  // Exclude ID and Resource Type fields as they're implicit in this context
  const authorizationFilterSchema = useMemo(
    () => createAuthorizationFilterSchema(api, { includeId: false, includeResourceType: false }),
    [api]
  );

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authorization | null>(null);
  const [cloningAuth, setCloningAuth] = useState<Authorization | null>(null);
  const [deletingAuth, setDeletingAuth] = useState<Authorization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Fetch authorizations from the API
   */
  const fetchAuthorizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        maxResults: String(perPage),
        firstResult: String(firstResult),
        resourceType: String(selectedResourceType),
        ...filterParams,
      };

      // Get count
      const countParams: Record<string, string> = {
        resourceType: String(selectedResourceType),
        ...filterParams,
      };
      const countResult = (await get(api, '/authorization/count', countParams)) as { count: number } | null;
      setTotalCount(countResult?.count ?? 0);

      // Get authorizations
      const result = (await get(api, '/authorization', params)) as Authorization[] | null;
      setAuthorizations(result ?? []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch authorizations');
      }
      console.error('Error fetching authorizations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [api, selectedResourceType, perPage, firstResult, filterParams]);

  useEffect(() => {
    void fetchAuthorizations();
  }, [fetchAuthorizations]);

  /**
   * Handle resource type selection
   */
  const handleSelectResourceType = (resourceType: number): void => {
    setSelectedResourceType(resourceType);
    setCurrentPage(1);
    setFirstResult(0);
    setFilterParams({});
    // Increment filterKey to force FilterBox remount with new options
    setFilterKey(prev => prev + 1);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newFirstResult: number, page: number): void => {
    setCurrentPage(page);
    setFirstResult(newFirstResult);
  };

  /**
   * Handle page size change
   */
  const handlePageSizeChange = (newSize: number): void => {
    setPerPage(newSize);
    setCurrentPage(1);
    setFirstResult(0);
  };

  /**
   * Handle filter query submission.
   * Note: Schema restricts connectors to AND only, matching authorization API behavior.
   */
  const handleFilterSubmit = useCallback((expressions: LegacyExpression[]): void => {
    const params = parseAuthorizationExpressions(expressions);
    setFilterParams(params);
    setCurrentPage(1);
    setFirstResult(0);
  }, []);

  /**
   * Handle delete authorization
   */
  const handleDeleteAuthorization = async (): Promise<void> => {
    if (!deletingAuth?.id) {
      return;
    }
    setIsDeleting(true);
    try {
      const { del } = await import('./utils/api');
      await del(api, `/authorization/${deletingAuth.id}`);
      setDeletingAuth(null);
      void fetchAuthorizations();
    } catch (err) {
      console.error('Error deleting authorization:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete authorization');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle save from modal (create or edit)
   */
  const handleSaveAuthorization = (): void => {
    setShowCreateModal(false);
    setEditingAuth(null);
    setCloningAuth(null);
    void fetchAuthorizations();
  };

  const currentResourceName = getResourceTypeName(selectedResourceType);
  const settings = loadSettings();

  // Build breadcrumb items for admin authorizations view
  const breadcrumbItems = useMemo(
    () => [{ label: 'Dashboard', href: '#/' }, { label: `${currentResourceName} Authorizations` }],
    [currentResourceName]
  );

  return (
    <div className="ctn-main authorization-view">
      <BreadcrumbsPanel items={breadcrumbItems} />
      <Container>
        <Allotment
          vertical={false}
          onChange={(numbers: number[]) => {
            saveSettings({
              ...loadSettings(),
              leftPaneSize: numbers[0] ?? null,
            });
          }}
        >
          {/* Left pane - Resource type list */}
          <Allotment.Pane preferredSize={settings.leftPaneSize ?? ADMIN_PANEL_WIDTH_PX} minSize={150} maxSize={350}>
            <div className="resource-type-list">
              <ul>
                {RESOURCE_TYPES.map(rt => (
                  <li key={rt.id} className={selectedResourceType === rt.id ? 'active' : ''}>
                    <a
                      href={`#/authorization/?resource=${rt.id}`}
                      onClick={e => {
                        e.preventDefault();
                        handleSelectResourceType(rt.id);
                      }}
                    >
                      {rt.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Allotment.Pane>

          {/* Right pane - Authorization content */}
          <Allotment.Pane>
            <div className="authorization-content">
              {/* Notifications area */}
              {error && (
                <div className="page-notifications">
                  <ErrorMessage message={error} />
                </div>
              )}

              {/* Header with title and create button */}
              <header className="row">
                <div className="col-sm-8">
                  <h3>{currentResourceName} Authorizations</h3>
                </div>
                <div className="col-sm-4 text-right">
                  <button
                    className="btn btn-default"
                    onClick={() => {
                      setShowCreateModal(true);
                    }}
                    disabled={isLoading}
                  >
                    Create new authorization
                    <span className="glyphicon glyphicon-plus-sign create-btn-icon" />
                  </button>
                </div>
              </header>

              {/* Filter box and pagination controls */}
              <div className="filter-controls">
                <div className="row">
                  <div className="col-sm-9">
                    <FilterBox
                      key={filterKey}
                      schema={authorizationFilterSchema}
                      onFilterChange={() => {
                        // New format handled by onLegacyFilterChange
                      }}
                      onLegacyFilterChange={handleFilterSubmit}
                      placeholder="Add filter..."
                      storageKey="minimal-history-plugin-saved-searches-authorizations"
                    />
                  </div>
                  <div className="col-sm-3 text-right">
                    <label className="page-size-label">
                      Page size:
                      <select
                        className="form-control"
                        value={perPage}
                        onChange={e => {
                          handlePageSizeChange(Number(e.target.value));
                        }}
                      >
                        {PAGE_SIZE_OPTIONS.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {/* Content based on loading/data state */}
              {isLoading && <LoadingSpinner />}
              {!isLoading && authorizations.length === 0 && (
                <div className="alert alert-info">No authorizations found for {currentResourceName}.</div>
              )}
              {!isLoading && authorizations.length > 0 && (
                <>
                  <SortableAuthorizationsTable
                    authorizations={authorizations}
                    onEdit={setEditingAuth}
                    onClone={setCloningAuth}
                    onDelete={setDeletingAuth}
                  />

                  {/* Pagination */}
                  {totalCount > perPage && (
                    <Pagination
                      currentPage={currentPage}
                      perPage={perPage}
                      total={totalCount}
                      onPage={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </Allotment.Pane>
        </Allotment>
      </Container>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAuth || cloningAuth) && (
        <AuthorizationFormModal
          api={api}
          resourceType={selectedResourceType}
          authorization={editingAuth ?? (cloningAuth ? { ...cloningAuth, id: null } : null)}
          onSave={handleSaveAuthorization}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingAuth(null);
            setCloningAuth(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingAuth && (
        <AuthorizationDeleteModal
          authorization={deletingAuth}
          onConfirm={() => void handleDeleteAuthorization()}
          onCancel={() => {
            setDeletingAuth(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

// =============================================================================
// Plugin Export
// =============================================================================

interface AdminParams {
  api: API;
}

export default [
  {
    id: 'adminRouteAuthorization',
    pluginPoint: 'admin.route',
    properties: {
      path: '/authorization',
      label: 'Authorizations',
    },
    priority: 10,
    render: (node: Element, { api }: AdminParams): void => {
      createRoot(node).render(<AuthorizationsView api={api} />);
    },
  },
];
