/**
 * Authorization utilities and constants for the admin authorization plugin.
 * Shared types, constants, and helper functions for authorization management.
 */

import React from 'react';

// =============================================================================
// Types
// =============================================================================

/** Authorization data from the API */
export interface Authorization {
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
export interface AuthorizationForm {
  type: number;
  identityType: 'user' | 'group';
  identityId: string;
  permissions: string[];
  resourceId: string;
}

/** Row data structure for the authorization table (for react-table) */
export interface AuthorizationRow {
  /** Original authorization object for actions */
  original: Authorization;
  /** Authorization type numeric value */
  type: number;
  /** Display label for authorization type */
  typeLabel: string;
  /** User ID or empty string */
  userId: string;
  /** Group ID or empty string */
  groupId: string;
  /** Identity display (user/group) */
  identity: string;
  /** Permissions joined as string */
  permissions: string;
  /** Resource ID or '*' */
  resourceId: string;
}

/** Authorization type definition */
export interface AuthorizationType {
  id: number;
  name: string;
  label: string;
}

/** Resource type definition */
export interface ResourceType {
  id: number;
  name: string;
}

// =============================================================================
// Constants
// =============================================================================

/** Authorization types - 0=global, 1=grant, 2=revoke */
export const AUTH_TYPES: AuthorizationType[] = [
  { id: 0, name: 'Global', label: 'GLOBAL' },
  { id: 1, name: 'Grant', label: 'ALLOW' },
  { id: 2, name: 'Revoke', label: 'DENY' },
];

/** Resource types as defined in Camunda/Operaton - sorted by name */
export const RESOURCE_TYPES: ResourceType[] = [
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
 * Based on Operaton / Camunda 7 authorization service documentation.
 * Each resource type includes 'ALL' plus its specific permissions.
 */
export const PERMISSIONS_BY_RESOURCE: Record<number, string[]> = {
  // Application (0)
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
  5: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
  // Process Definition (6)
  6: [
    'ALL',
    'READ',
    'UPDATE',
    'DELETE',
    'SUSPEND',
    'CREATE_INSTANCE',
    'READ_INSTANCE',
    'UPDATE_INSTANCE',
    'RETRY_JOB',
    'SUSPEND_INSTANCE',
    'DELETE_INSTANCE',
    'MIGRATE_INSTANCE',
    'READ_TASK',
    'UPDATE_TASK',
    'TASK_ASSIGN',
    'TASK_WORK',
    'READ_TASK_VARIABLE',
    'READ_HISTORY',
    'READ_HISTORY_VARIABLE',
    'DELETE_HISTORY',
    'READ_INSTANCE_VARIABLE',
    'UPDATE_INSTANCE_VARIABLE',
    'UPDATE_TASK_VARIABLE',
    'UPDATE_HISTORY',
  ],
  // Task (7)
  7: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'TASK_ASSIGN', 'TASK_WORK', 'UPDATE_VARIABLE', 'READ_VARIABLE'],
  // Process Instance (8)
  8: ['ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'RETRY_JOB', 'SUSPEND', 'UPDATE_VARIABLE'],
  // Deployment (9)
  9: ['ALL', 'CREATE', 'READ', 'DELETE'],
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
    'CREATE_BATCH_SET_REMOVAL_TIME',
    'CREATE_BATCH_SET_EXTERNAL_TASK_RETRIES',
    'CREATE_BATCH_UPDATE_PROCESS_INSTANCES_SUSPEND',
    'CREATE_BATCH_SET_VARIABLES',
  ],
  // Decision Requirements Definition (14)
  14: ['ALL', 'READ'],
  // Operation Log (17) - User Operation Log Category
  17: ['ALL', 'READ', 'DELETE', 'UPDATE'],
  // Historic Task (19)
  19: ['ALL', 'READ', 'READ_VARIABLE'],
  // Historic Process Instance (20)
  20: ['ALL', 'READ'],
  // System (21)
  21: ['ALL', 'READ', 'SET', 'DELETE'],
};

/** Default permissions for resources not in the mapping */
export const DEFAULT_PERMISSIONS = ['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE'];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get permissions for a resource type.
 * @param resourceType - The resource type ID
 * @returns Array of permission strings
 */
export function getPermissionsForResource(resourceType: number | null): string[] {
  if (resourceType === null) {
    return DEFAULT_PERMISSIONS;
  }
  return PERMISSIONS_BY_RESOURCE[resourceType] ?? DEFAULT_PERMISSIONS;
}

/**
 * Get resource type name from ID.
 * @param resourceType - The resource type ID
 * @returns Resource type name or placeholder
 */
export function getResourceTypeName(resourceType: number | null): string {
  if (resourceType === null) {
    return '-';
  }
  const found = RESOURCE_TYPES.find(rt => rt.id === resourceType);
  return found?.name ?? `Type ${resourceType}`;
}

/**
 * Get authorization type display label.
 * @param type - The authorization type ID
 * @returns Authorization type label
 */
export function getAuthTypeLabel(type: number | null): string {
  if (type === null) {
    return '-';
  }
  const found = AUTH_TYPES.find(t => t.id === type);
  return found?.label ?? `Type ${type}`;
}

/**
 * Render identity display element for user/group.
 * @param userId - The user ID or null
 * @param groupId - The group ID or null
 * @returns JSX element displaying the identity
 */
export function renderIdentityDisplay(userId: string | null, groupId: string | null): React.ReactElement {
  if (userId) {
    return React.createElement(
      'span',
      { title: 'User' },
      React.createElement('span', { className: 'glyphicon glyphicon-user' }),
      ' ',
      userId
    );
  }
  if (groupId) {
    return React.createElement(
      'span',
      { title: 'Group' },
      React.createElement('span', { className: 'glyphicon glyphicon-th' }),
      ' ',
      groupId
    );
  }
  return React.createElement('span', null, '-');
}
