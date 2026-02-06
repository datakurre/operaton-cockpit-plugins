/**
 * Authorization Delete Confirm Modal Component
 *
 * Modal dialog for confirming deletion of an authorization record.
 * Displays authorization details for user confirmation.
 */

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Modal backdrop with programmatic dismiss */
import React, { useEffect } from 'react';

import {
  Authorization,
  getAuthTypeLabel,
  getResourceTypeName,
  renderIdentityDisplay,
} from '../utils/authorization';

interface AuthorizationDeleteModalProps {
  authorization: Authorization;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

/**
 * Confirmation modal for deleting an authorization.
 */
const AuthorizationDeleteModal: React.FC<AuthorizationDeleteModalProps> = ({
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
      <div
        className="modal-dialog"
        onClick={e => {
          e.stopPropagation();
        }}
      >
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

export default AuthorizationDeleteModal;
