/**
 * Authorization Form Modal Component
 *
 * Modal dialog for creating and editing authorization records.
 * Includes type selection, identity input, resource ID, and permission checkboxes.
 */

/* eslint-disable max-lines-per-function, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Complex form modal with many fields */
import React, { useState, useEffect } from 'react';

import ErrorMessage from './ErrorMessage';
import IdentityAutocomplete from './IdentityAutocomplete';
import ResourceAutocomplete from './ResourceAutocomplete';
import type { API } from '../types';
import { post, ApiError } from '../utils/api';
import {
  Authorization,
  AuthorizationForm,
  AUTH_TYPES,
  getPermissionsForResource,
  getResourceTypeName,
} from '../utils/authorization';

interface AuthorizationFormModalProps {
  api: API;
  resourceType: number;
  authorization: Authorization | null;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Get submit button label based on editing state.
 * @param isEditing - Whether the form is in edit mode
 * @returns Button label string
 */
function getSubmitButtonLabel(isEditing: boolean): string {
  return isEditing ? 'Update' : 'Create';
}

/**
 * Modal form for creating/editing authorizations.
 */
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
        const { put } = await import('../utils/api');
        // Type assertion safe here since isEditing is only true when authorization?.id is truthy
        const authId = authorization.id ?? '';
        await put(api, `/authorization/${authId}`, JSON.stringify(payload));
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
   * Get specific permissions (excluding ALL) for display
   */
  const getSpecificPermissions = (): string[] => {
    return availablePermissions.filter(p => p !== 'ALL');
  };

  /**
   * Check if all specific permissions are selected
   */
  const areAllPermissionsSelected = (): boolean => {
    const specific = getSpecificPermissions();
    return specific.every(p => form.permissions.includes(p)) || form.permissions.includes('ALL');
  };

  /**
   * Toggle a permission
   */
  const togglePermission = (perm: string): void => {
    setForm(prev => {
      const specific = getSpecificPermissions();
      const currentlySelected = prev.permissions.includes('ALL') 
        ? specific 
        : prev.permissions.filter(p => p !== 'ALL');

      const newPerms = currentlySelected.includes(perm)
        ? currentlySelected.filter(p => p !== perm)
        : [...currentlySelected, perm];

      // If all specific permissions are now selected, save as ["ALL"]
      if (newPerms.length === specific.length && specific.length > 0) {
        return { ...prev, permissions: ['ALL'] };
      }

      // Otherwise save the specific permissions (can be empty)
      return { ...prev, permissions: newPerms };
    });
  };

  /**
   * Toggle all permissions
   */
  const toggleAllPermissions = (): void => {
    const allSelected = areAllPermissionsSelected();
    
    if (allSelected) {
      // Deselect all
      setForm(prev => ({ ...prev, permissions: [] }));
    } else {
      // Select all
      setForm(prev => ({ ...prev, permissions: ['ALL'] }));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-dialog"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{isEditing ? 'Edit Authorization' : 'Create New Authorization'}</h4>
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
                <div className="btn-group btn-group-sm btn-group-flex">
                  {AUTH_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`btn ${form.type === t.id ? 'btn-primary' : 'btn-default'}`}
                      onClick={() => {
                        setForm(prev => ({ ...prev, type: t.id }));
                      }}
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
                <div className="btn-group btn-group-sm btn-group-flex">
                  <button
                    type="button"
                    className={`btn ${form.identityType === 'user' ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, identityType: 'user' }));
                    }}
                  >
                    <span className="glyphicon glyphicon-user" /> User
                  </button>
                  <button
                    type="button"
                    className={`btn ${form.identityType === 'group' ? 'btn-primary' : 'btn-default'}`}
                    onClick={() => {
                      setForm(prev => ({ ...prev, identityType: 'group' }));
                    }}
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
                  onChange={(id: string) => {
                    setForm(prev => ({ ...prev, identityId: id }));
                  }}
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
                  onChange={(id: string) => {
                    setForm(prev => ({ ...prev, resourceId: id }));
                  }}
                  placeholder="e.g., * for all resources"
                />
                <small className="text-muted">Use * for all {getResourceTypeName(resourceType) || 'resources'}</small>
              </div>

              {/* Permissions */}
              <div className="form-group">
                <label>
                  Permissions
                  <button
                    type="button"
                    className="btn btn-xs btn-link"
                    onClick={toggleAllPermissions}
                    style={{ marginLeft: '10px' }}
                  >
                    {areAllPermissionsSelected() ? 'Deselect All' : 'Select All'}
                  </button>
                </label>
                <div className="permissions-grid">
                  {getSpecificPermissions().map(perm => {
                    const isChecked = form.permissions.includes('ALL') || form.permissions.includes(perm);
                    return (
                      <div key={perm} className="checkbox permission-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              togglePermission(perm);
                            }}
                          />{' '}
                          {perm}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving || !form.identityId || form.permissions.length === 0}
              >
                {isSaving ? 'Saving...' : getSubmitButtonLabel(isEditing)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationFormModal;
