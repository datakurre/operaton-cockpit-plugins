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

import 'allotment/dist/style.css';
import './admin-route-authorizations.scss';
import './Components/Button.scss';
import './Components/Modal.scss';

import { Allotment } from 'allotment';
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

import Container from './Components/Container';
import ErrorMessage from './Components/ErrorMessage';
import FilterBox from './Components/FilterBox';
import IdentityAutocomplete from './Components/IdentityAutocomplete';
import LoadingSpinner from './Components/LoadingSpinner';
import Pagination from './Components/Pagination';
import ResourceAutocomplete from './Components/ResourceAutocomplete';
import type { API } from './types';
import { get, post, ApiError } from './utils/api';
import { DEFAULT_PAGE_SIZE } from './utils/constants';
import { FilterAutoCompleteHandler } from './utils/filterAutocomplete';
import type { FilterAutoCompleteConfig } from './utils/filterAutocomplete';
import { loadSettings, saveSettings } from './utils/misc';

// =============================================================================
// Constants
// =============================================================================

/** Authorization types - 0=global, 1=grant, 2=revoke */
const AUTH_TYPES: { id: number; name: string; label: string }[] = [
  { id: 0, name: 'Global', label: 'GLOBAL' },
  { id: 1, name: 'Grant', label: 'ALLOW' },
  { id: 2, name: 'Revoke', label: 'DENY' },
];

/** Resource types as defined in Camunda/Operaton - sorted by name */
const RESOURCE_TYPES: { id: number; name: string }[] = [
  { id: 0, name: 'Application' },
  { id: 4, name: 'Authorization' },
  { id: 13, name: 'Batch' },
  { id: 10, name: 'Decision Definition' },
  { id: 14, name: 'Decision Requirements Definition' },
  { id: 9, name: 'Deployment' },
  { id: 5, name: 'Filter' },
  { id: 2, name: 'Group' },
  { id: 3, name: 'Group Membership' },
  { id: 20, name: 'Historic Process Instance' },
  { id: 19, name: 'Historic Task Instance' },
  { id: 17, name: 'Operation Log' },
  { id: 6, name: 'Process Definition' },
  { id: 8, name: 'Process Instance' },
  { id: 21, name: 'System' },
  { id: 7, name: 'Task' },
  { id: 11, name: 'Tenant' },
  { id: 12, name: 'Tenant Membership' },
  { id: 1, name: 'User' },
];

/**
 * Permissions available for each resource type.
 * Based on Camunda 7 authorization service documentation.
 */
const PERMISSIONS_BY_RESOURCE: Record<number, string[]> = {
  // Application (0) - Access only
  0: ['ALL', 'ACCESS'],
  // User (1)
  1: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Group (2)
  2: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Group Membership (3)
  3: ['ALL', 'CREATE', 'DELETE'],
  // Authorization (4)
  4: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Filter (5)
  5: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Process Definition (6)
  6: [
    'ALL',
    'READ',
    'UPDATE',
    'DELETE',
    'READ_TASK',
    'UPDATE_TASK',
    'TASK_WORK',
    'TASK_ASSIGN',
    'CREATE_INSTANCE',
    'READ_INSTANCE',
    'UPDATE_INSTANCE',
    'DELETE_INSTANCE',
    'MIGRATE_INSTANCE',
    'SUSPEND',
    'SUSPEND_INSTANCE',
    'UPDATE_INSTANCE_VARIABLE',
    'UPDATE_TASK_VARIABLE',
    'RETRY_JOB',
    'READ_HISTORY',
    'DELETE_HISTORY',
    'UPDATE_HISTORY',
  ],
  // Task (7)
  7: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE', 'TASK_WORK', 'TASK_ASSIGN', 'UPDATE_VARIABLE'],
  // Process Instance (8)
  8: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE', 'RETRY_JOB', 'SUSPEND', 'UPDATE_VARIABLE'],
  // Deployment (9)
  9: ['ALL', 'READ', 'CREATE', 'DELETE'],
  // Decision Definition (10)
  10: ['ALL', 'READ', 'UPDATE', 'CREATE_INSTANCE', 'READ_HISTORY', 'DELETE_HISTORY'],
  // Tenant (11)
  11: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Tenant Membership (12)
  12: ['ALL', 'CREATE', 'DELETE'],
  // Batch (13)
  13: [
    'ALL',
    'READ',
    'UPDATE',
    'CREATE',
    'DELETE',
    'READ_HISTORY',
    'DELETE_HISTORY',
    'CREATE_BATCH_MIGRATE_PROCESS_INSTANCES',
    'CREATE_BATCH_MODIFY_PROCESS_INSTANCES',
    'CREATE_BATCH_RESTART_PROCESS_INSTANCES',
    'CREATE_BATCH_DELETE_RUNNING_PROCESS_INSTANCES',
    'CREATE_BATCH_DELETE_FINISHED_PROCESS_INSTANCES',
    'CREATE_BATCH_DELETE_DECISION_INSTANCES',
    'CREATE_BATCH_SET_JOB_RETRIES',
    'CREATE_BATCH_SET_EXTERNAL_TASK_RETRIES',
    'CREATE_BATCH_UPDATE_PROCESS_INSTANCES_SUSPEND',
    'CREATE_BATCH_SET_REMOVAL_TIME',
    'CREATE_BATCH_SET_VARIABLES',
    'CREATE_BATCH_CORRELATE_MESSAGES',
  ],
  // Decision Requirements Definition (14)
  14: ['ALL', 'READ'],
  // Report (15)
  15: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Dashboard (16)
  16: ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'],
  // Operation Log (17) - User Operation Log Category
  17: ['ALL', 'READ', 'UPDATE', 'DELETE'],
  // System (18) - Note: This is resource ID 21 in newer versions
  18: ['ALL', 'READ', 'SET', 'DELETE'],
  // Historic Task (19)
  19: ['ALL', 'READ', 'READ_VARIABLE'],
  // Historic Process Instance (20)
  20: ['ALL', 'READ', 'READ_VARIABLE'],
  // System (21) - newer resource ID for system
  21: ['ALL', 'READ', 'SET', 'DELETE'],
};

/** Default permissions for resources not in the mapping */
const DEFAULT_PERMISSIONS = ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'];

/** Page size option constants */
const PAGE_SIZE_25 = 25;
const PAGE_SIZE_50 = 50;
const PAGE_SIZE_100 = 100;
const PAGE_SIZE_200 = 200;

/** Page size options */
const PAGE_SIZE_OPTIONS = [PAGE_SIZE_25, PAGE_SIZE_50, PAGE_SIZE_100, PAGE_SIZE_200];

/**
 * Filter autocomplete configuration for authorizations.
 * Supports filtering by userId, groupId, and resourceId.
 */
const FILTER_CONFIG: FilterAutoCompleteConfig = {
  categoryOperators: {
    userId: { operators: ['==', '!=', 'contains', 'starts with'] },
    groupId: { operators: ['==', '!=', 'contains', 'starts with'] },
    resourceId: { operators: ['==', '!=', 'contains', 'starts with'] },
    type: { operators: ['==', '!='] },
  },
  defaultOperators: ['==', '!=', 'contains'],
};

/** Filter options for autocomplete */
const FILTER_OPTIONS = [
  { columnField: 'userId', columnText: 'User ID', type: 'text' },
  { columnField: 'groupId', columnText: 'Group ID', type: 'text' },
  { columnField: 'resourceId', columnText: 'Resource ID', type: 'text' },
  { columnField: 'type', columnText: 'Type', type: 'number' },
];

// =============================================================================
// Types
// =============================================================================

/** Authorization data from the API */
interface Authorization {
  id: string | null;
  type: number | null;
  permissions: string[] | null;
  userId: string | null;
  groupId: string | null;
  resourceType: number | null;
  resourceId: string | null;
  /** Whether authorization is in edit mode (UI state) */
  inUpdate?: boolean;
}

/** Form data for creating/editing authorization */
interface AuthorizationForm {
  type: number;
  identityType: 'user' | 'group';
  identityId: string;
  permissions: string[];
  resourceId: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get permissions for a resource type.
 * @param resourceType - The resource type ID
 * @returns Array of permission strings
 */
function getPermissionsForResource(resourceType: number | null): string[] {
  if (resourceType === null) {return DEFAULT_PERMISSIONS;}
  return PERMISSIONS_BY_RESOURCE[resourceType] ?? DEFAULT_PERMISSIONS;
}

/**
 * Get resource type name from ID.
 * @param resourceType - The resource type ID
 * @returns Resource type name or placeholder
 */
function getResourceTypeName(resourceType: number | null): string {
  if (resourceType === null) {return '-';}
  const found = RESOURCE_TYPES.find(rt => rt.id === resourceType);
  return found?.name ?? `Type ${resourceType}`;
}

/**
 * Get authorization type display label.
 * @param type - The authorization type ID
 * @returns Authorization type label
 */
function getAuthTypeLabel(type: number | null): string {
  if (type === null) {return '-';}
  const found = AUTH_TYPES.find(t => t.id === type);
  return found?.label ?? `Type ${type}`;
}

/**
 * Render identity display element for user/group.
 * @param userId - The user ID or null
 * @param groupId - The group ID or null
 * @returns JSX element displaying the identity
 */
function renderIdentityDisplay(userId: string | null, groupId: string | null): React.ReactElement {
  if (userId) {
    return (
      <span title="User">
        <span className="glyphicon glyphicon-user" /> {userId}
      </span>
    );
  }
  if (groupId) {
    return (
      <span title="Group">
        <span className="glyphicon glyphicon-th" /> {groupId}
      </span>
    );
  }
  return <span>-</span>;
}

// =============================================================================
// Breadcrumbs Panel
// =============================================================================

interface BreadcrumbsPanelProps {
  currentResource: string;
}

/**
 * Breadcrumbs panel for admin authorizations view.
 * Follows the same pattern as instance-route-history BreadcrumbsPanel.
 */
const BreadcrumbsPanel: React.FC<BreadcrumbsPanelProps> = ({ currentResource }) => {
  return (
    <div className="breadcrumbs-panel" cam-breadcrumbs-panel="">
      <ul className="cam-breadcrumb">
        <li>
          <a className="text" href="#/">
            Dashboard
          </a>
        </li>
        <li>
          <span className="divider">»</span>
          <span className="text">{currentResource} Authorizations</span>
        </li>
      </ul>
    </div>
  );
};

// =============================================================================
// Sub-Components
// =============================================================================

interface AuthorizationFormModalProps {
  api: API;
  resourceType: number;
  authorization: Authorization | null;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Modal form for creating/editing authorizations.
 */
// eslint-disable-next-line max-lines-per-function -- Complex form with validation
const AuthorizationFormModal: React.FC<AuthorizationFormModalProps> = ({
  api,
  resourceType,
  authorization,
  onSave,
  onCancel,
}) => {
  const isEditing = authorization !== null && authorization.id !== null;
  const availablePermissions = getPermissionsForResource(resourceType);

  const [form, setForm] = useState<AuthorizationForm>(() => ({
    type: authorization?.type ?? 1,
    identityType: authorization?.groupId ? 'group' : 'user',
    identityId: authorization?.userId ?? authorization?.groupId ?? '',
    permissions: authorization?.permissions ?? ['ALL'],
    resourceId: authorization?.resourceId ?? '*',
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle Esc key to close modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        type: form.type,
        permissions: form.permissions,
        userId: form.identityType === 'user' ? form.identityId : null,
        groupId: form.identityType === 'group' ? form.identityId : null,
        resourceType,
        resourceId: form.resourceId || '*',
      };

      if (isEditing) {
        // Update existing authorization - isEditing guarantees authorization and authorization.id are non-null
        const { put } = await import('./utils/api');
        // Type assertion safe here since isEditing is only true when authorization?.id is truthy
         
        await put(api, `/authorization/${authorization.id}`, JSON.stringify(payload));
      } else {
        // Create new authorization
        await post(api, '/authorization/create', {}, JSON.stringify(payload));
      }

      onSave();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save authorization');
      }
      console.error('Error saving authorization:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle a permission
   */
  const togglePermission = (perm: string): void => {
    setForm(prev => {
      const newPerms = prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm];
      // If ALL is selected, only keep ALL
      if (perm === 'ALL' && !prev.permissions.includes('ALL')) {
        return { ...prev, permissions: ['ALL'] };
      }
      // If selecting another permission while ALL is selected, remove ALL
      if (perm !== 'ALL' && prev.permissions.includes('ALL')) {
        return { ...prev, permissions: [perm] };
      }
      return { ...prev, permissions: newPerms.length > 0 ? newPerms : ['ALL'] };
    });
  };

  /**
   * Select all permissions
   */
  const selectAllPermissions = (): void => {
    setForm(prev => ({ ...prev, permissions: [...availablePermissions] }));
  };

  /**
   * Deselect all permissions (defaults to ALL)
   */
  const deselectAllPermissions = (): void => {
    setForm(prev => ({ ...prev, permissions: ['ALL'] }));
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-dialog" onClick={e => { e.stopPropagation(); }}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              {isEditing ? 'Edit Authorization' : 'Create New Authorization'}
            </h4>
            <button type="button" className="close" onClick={onCancel} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={e => void handleSubmit(e)}>
            <div className="modal-body">
              {error && <ErrorMessage message={error} />}

              {/* Authorization Type */}
              <div className="form-group">
                <label>Authorization Type</label>
                <div className="btn-group btn-group-sm" style={{ display: 'flex' }}>
                  {AUTH_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`btn ${form.type === t.id ? 'btn-primary' : 'btn-default'}`}
                      onClick={() => { setForm(prev => ({ ...prev, type: t.id })); }}
                      disabled={isEditing}
                    >
                      {t.name} ({t.label})
                    </button>
                  ))}
                </div>
              </div>

              {/* Identity Type */}
              <div className="form-group">
                <label>Identity Type</label>
                <div className="btn-group btn-group-sm" style={{ display: 'flex' }}>
                  <button
                    type="button"
                    className={`btn ${form.identityType === 'user' ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => { setForm(prev => ({ ...prev, identityType: 'user' })); }}
                  >
                    <span className="glyphicon glyphicon-user" /> User
                  </button>
                  <button
                    type="button"
                    className={`btn ${form.identityType === 'group' ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => { setForm(prev => ({ ...prev, identityType: 'group' })); }}
                  >
                    <span className="glyphicon glyphicon-th" /> Group
                  </button>
                </div>
              </div>

              {/* Identity ID */}
              <div className="form-group">
                <label>{form.identityType === 'user' ? 'User ID' : 'Group ID'}</label>
                <IdentityAutocomplete
                  api={api}
                  identityType={form.identityType}
                  value={form.identityId}
                  onChange={(id: string) => { setForm(prev => ({ ...prev, identityId: id })); }}
                  placeholder={form.identityType === 'user' ? 'e.g., demo or *' : 'e.g., camunda-admin or *'}
                  required
                />
                <small className="text-muted">Use * for all {form.identityType}s</small>
              </div>

              {/* Resource ID */}
              <div className="form-group">
                <label>Resource ID</label>
                <ResourceAutocomplete
                  api={api}
                  resourceType={resourceType}
                  value={form.resourceId}
                  onChange={(id: string) => { setForm(prev => ({ ...prev, resourceId: id })); }}
                  placeholder="e.g., * for all resources"
                />
                <small className="text-muted">Use * for all {getResourceTypeName(resourceType) || 'resources'}</small>
              </div>

              {/* Permissions */}
              <div className="form-group">
                <label>Permissions</label>
                <div style={{ marginBottom: '5px' }}>
                  <button
                    type="button"
                    className="btn btn-xs btn-default"
                    onClick={selectAllPermissions}
                    style={{ marginRight: '5px' }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs btn-default"
                    onClick={deselectAllPermissions}
                  >
                    Deselect All
                  </button>
                </div>
                <div className="permissions-grid">
                  {availablePermissions.map(perm => (
                    <div key={perm} className="checkbox permission-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm)}
                          onChange={() => { togglePermission(perm); }}
                        />{' '}
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSaving || !form.identityId}>
                {isSaving ? 'Saving...' : getSubmitButtonLabel(isEditing)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Get submit button label based on editing state.
 * @param isEditing - Whether the form is in edit mode
 * @returns Button label string
 */
function getSubmitButtonLabel(isEditing: boolean): string {
  return isEditing ? 'Update' : 'Create';
}

interface DeleteConfirmModalProps {
  authorization: Authorization;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

/**
 * Confirmation modal for deleting an authorization.
 */
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  authorization,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  /**
   * Handle Esc key to close modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel, isDeleting]);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-dialog" onClick={e => { e.stopPropagation(); }}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Delete Authorization</h4>
            <button type="button" className="close" onClick={onCancel} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this authorization?</p>
            <dl className="dl-horizontal">
              <dt>Type:</dt>
              <dd>{getAuthTypeLabel(authorization.type)}</dd>
              <dt>Identity:</dt>
              <dd>{renderIdentityDisplay(authorization.userId, authorization.groupId)}</dd>
              <dt>Resource:</dt>
              <dd>{getResourceTypeName(authorization.resourceType)}</dd>
              <dt>Resource ID:</dt>
              <dd>{authorization.resourceId ?? '*'}</dd>
              <dt>Permissions:</dt>
              <dd>{authorization.permissions?.join(', ') ?? '-'}</dd>
            </dl>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onCancel} disabled={isDeleting}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
// eslint-disable-next-line max-lines-per-function -- Complex two-panel view with cohesive functionality
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

  // Filter autocomplete handler
  const [autoCompleteHandler] = useState(() => 
    new FilterAutoCompleteHandler([], FILTER_OPTIONS, FILTER_CONFIG)
  );

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Authorization | null>(null);
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
   * Handle filter query submission
   */
  const handleFilterSubmit = (expressions: Record<string, string>): void => {
    setFilterParams(expressions);
    setCurrentPage(1);
    setFirstResult(0);
  };

  /**
   * Handle delete authorization
   */
  const handleDeleteAuthorization = async (): Promise<void> => {
    if (!deletingAuth?.id) {return;}
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
    void fetchAuthorizations();
  };

 const currentResourceName = getResourceTypeName(selectedResourceType);
  const settings = loadSettings();

  return (
    <div className="ctn-main" style={{ top: 0, bottom: 0 }}>
      <BreadcrumbsPanel currentResource={currentResourceName} />
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
          <Allotment.Pane preferredSize={settings.leftPaneSize ?? 220} minSize={150} maxSize={350}>
            <div className="resource-type-list">
              <ul>
                {RESOURCE_TYPES.map(rt => (
                  <li
                    key={rt.id}
                    className={selectedResourceType === rt.id ? 'active' : ''}
                  >
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
                    onClick={() => { setShowCreateModal(true); }}
                    disabled={isLoading}
                  >
                    Create new authorization
                    <span className="glyphicon glyphicon-plus-sign" style={{ marginLeft: '5px' }} />
                  </button>
                </div>
              </header>

              {/* Filter box and pagination controls */}
              <div className="filter-controls" style={{ marginBottom: '15px' }}>
                <div className="row">
                  <div className="col-sm-9">
                    <FilterBox
                      options={FILTER_OPTIONS}
                      autoCompleteHandler={autoCompleteHandler}
                      onParseOk={handleFilterSubmit}
                      defaultQuery={(): string => ''}
                    />
                  </div>
                  <div className="col-sm-3 text-right">
                    <label style={{ marginRight: '10px', display: 'inline-block' }}>
                      Page size:
                      <select
                        className="form-control"
                        style={{ width: 'auto', display: 'inline-block', marginLeft: '5px' }}
                        value={perPage}
                        onChange={e => { handlePageSizeChange(Number(e.target.value)); }}
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
                <div className="alert alert-info">
                  No authorizations found for {currentResourceName}.
                </div>
              )}
              {!isLoading && authorizations.length > 0 && (
                <form className="form-horizontal" name="createAuthForm">
                  <table className="cam-table">
                    <thead>
                      <tr>
                        <th className="authorization-type">Type</th>
                        <th className="user group">User / Group</th>
                        <th className="permissions">Permissions</th>
                        <th className="resource-id">Resource ID</th>
                        <th className="action">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authorizations.map(auth => (
                        <tr key={auth.id ?? ''} className={auth.inUpdate ? 'editing' : ''}>
                          <td className="authorization-type">
                            {getAuthTypeLabel(auth.type)}
                          </td>
                          <td className="user group">
                            {renderIdentityDisplay(auth.userId, auth.groupId)}
                          </td>
                          <td className="permissions">
                            {auth.permissions?.join(', ') ?? '-'}
                          </td>
                          <td className="resource-id">
                            {auth.resourceId ?? '*'}
                          </td>
                          <td className="action">
                            <a onClick={() => { setEditingAuth(auth); }} style={{ cursor: 'pointer', marginRight: '10px' }}>
                              Edit
                            </a>
                            <a onClick={() => { setDeletingAuth(auth); }} style={{ cursor: 'pointer', color: '#c00' }}>
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalCount > perPage && (
                    <Pagination
                      currentPage={currentPage}
                      perPage={perPage}
                      total={totalCount}
                      onPage={handlePageChange}
                    />
                  )}
                </form>
              )}
            </div>
          </Allotment.Pane>
        </Allotment>
      </Container>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAuth) && (
        <AuthorizationFormModal
          api={api}
          resourceType={selectedResourceType}
          authorization={editingAuth}
          onSave={handleSaveAuthorization}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingAuth(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingAuth && (
        <DeleteConfirmModal
          authorization={deletingAuth}
          onConfirm={() => void handleDeleteAuthorization()}
          onCancel={() => { setDeletingAuth(null); }}
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
    id: 'adminRouteAuthorizations',
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
