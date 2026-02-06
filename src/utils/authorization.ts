/**
 * Authorization utilities and constants for the admin authorization plugin.
 * Shared types, constants, and helper functions for authorization management.
 */

import React from 'react';

import type { API } from '../types';
import { get } from './api';

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
  /** Resource type numeric value */
  resourceType: number | null;
  /** Display name for resource type */
  resourceTypeName: string;
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

/** Resolved resource info with actual ID for linking */
export interface ResolvedResource {
  /** Original resource ID (may be a key) */
  originalId: string;
  /** Resolved ID for linking (latest version ID if key was resolved) */
  resolvedId: string | null;
  /** Whether the resource was found */
  isExists: boolean;
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
// Cross-App Navigation Helpers
// =============================================================================

/**
 * Get the cockpit app base URL from the admin API URL.
 * Transforms e.g. '/operaton/app/admin/default' to '/operaton/app/cockpit/default'
 * @param adminApi - The admin API base URL
 * @returns The cockpit app base URL
 */
export function getCockpitBaseUrl(adminApi: string): string {
  // Replace 'admin' with 'cockpit' in the app path
  return adminApi.replace('/app/admin/', '/app/cockpit/');
}

// =============================================================================
// Cross-App Navigation
// =============================================================================

/**
 * Derive the cockpit app URL from the admin API URL.
 * Converts /operaton/api/admin to /operaton/app/cockpit/{engine}/
 * @param adminApiUrl - The admin API URL (e.g., /operaton/api/admin)
 * @param engineName - The engine name (e.g., 'default')
 * @returns Cockpit app base URL or null if conversion fails
 */
export function deriveCockpitAppUrl(
  adminApiUrl: string | null | undefined,
  engineName: string | null | undefined
): string | null {
  if (!adminApiUrl || !engineName) {
    return null;
  }
  try {
    // Remove hash and query if present
    const cleanUrl = adminApiUrl.split('#')[0]?.split('?')[0];
    if (!cleanUrl) {
      return null;
    }
    // Convert /api/admin to /app/cockpit/{engine}/
    if (cleanUrl.includes('/api/admin')) {
      const cockpitUrl = cleanUrl.replace('/api/admin', `/app/cockpit/${engineName}`);
      return cockpitUrl.endsWith('/') ? cockpitUrl : `${cockpitUrl}/`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Derive the tasklist app URL from the admin API URL.
 * Converts /operaton/api/admin to /operaton/app/tasklist/{engine}/
 * @param adminApiUrl - The admin API URL (e.g., /operaton/api/admin)
 * @param engineName - The engine name (e.g., 'default')
 * @returns Tasklist app base URL or null if conversion fails
 */
export function deriveTasklistAppUrl(
  adminApiUrl: string | null | undefined,
  engineName: string | null | undefined
): string | null {
  if (!adminApiUrl || !engineName) {
    return null;
  }
  try {
    // Remove hash and query if present
    const cleanUrl = adminApiUrl.split('#')[0]?.split('?')[0];
    if (!cleanUrl) {
      return null;
    }
    // Convert /api/admin to /app/tasklist/{engine}/
    if (cleanUrl.includes('/api/admin')) {
      const tasklistUrl = cleanUrl.replace('/api/admin', `/app/tasklist/${engineName}`);
      return tasklistUrl.endsWith('/') ? tasklistUrl : `${tasklistUrl}/`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Determine which app a resource type belongs to.
 * @param resourceType - The resource type ID
 * @returns 'cockpit', 'tasklist', or 'admin'
 */
export function getResourceApp(resourceType: number | null): 'cockpit' | 'tasklist' | 'admin' {
  if (resourceType === null) {
    return 'admin';
  }

  // Task resources belong to tasklist
  if (resourceType === 7) {
    return 'tasklist';
  }

  // Resource types that have views in cockpit
  const cockpitResources = [
    6, // Process Definition
    8, // Process Instance
    9, // Deployment
    10, // Decision Definition
    13, // Batch
    14, // Decision Requirements Definition
    20, // Historic Process Instance
  ];

  return cockpitResources.includes(resourceType) ? 'cockpit' : 'admin';
}

// =============================================================================
// Process Definition Key Resolution
// =============================================================================

/**
 * UUID pattern for detecting definition IDs.
 * Matches UUID v1, v4, and other standard formats (8-4-4-4-12 hex digits).
 */
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Check if a resource ID contains a UUID, indicating it's a definition ID.
 * @param resourceId - The resource ID to check
 * @returns True if it contains a UUID
 */
export function containsUUID(resourceId: string | null): boolean {
  if (!resourceId || resourceId === '*' || resourceId === '') {
    return false;
  }
  return UUID_PATTERN.test(resourceId);
}

/**
 * Check if a resource ID is a process definition key (not a full ID).
 * Process definition IDs typically have format: key:version:deploymentId
 * Keys don't contain colons or UUIDs.
 * @param resourceId - The resource ID to check
 * @returns True if it looks like a key
 */
export function isProcessDefinitionKey(resourceId: string | null): boolean {
  if (!resourceId || resourceId === '*' || resourceId === '') {
    return false;
  }
  // If it contains a UUID, it's a definition ID
  if (containsUUID(resourceId)) {
    return false;
  }
  // IDs contain colons (e.g., "my-process:1:abc123"), keys don't
  return !resourceId.includes(':');
}

/** Cache for resolved process definition keys -> IDs */
const processDefinitionKeyCache = new Map<string, string | null>();

/**
 * Clear the process definition key cache.
 * Call this when navigating away or refreshing data.
 */
export function clearProcessDefinitionKeyCache(): void {
  processDefinitionKeyCache.clear();
}

/** Process definition response from API */
interface ProcessDefinitionResponse {
  id?: string;
  key?: string;
  version?: number;
}

/**
 * Resolve a process definition key to its latest version ID.
 * Results are cached to avoid repeated API calls.
 * @param api - The API object
 * @param key - The process definition key
 * @returns The resolved ID or null if not found
 */
export async function resolveProcessDefinitionKey(api: API, key: string): Promise<string | null> {
  // Check cache first
  if (processDefinitionKeyCache.has(key)) {
    return processDefinitionKeyCache.get(key) ?? null;
  }

  try {
    // Get the latest version by key
    const result = (await get(api, `/process-definition/key/${encodeURIComponent(key)}`)) as ProcessDefinitionResponse;
    const resolvedId = result.id ?? null;
    processDefinitionKeyCache.set(key, resolvedId);
    return resolvedId;
  } catch {
    // Key not found or error - cache as null
    processDefinitionKeyCache.set(key, null);
    return null;
  }
}

/**
 * Resolve multiple process definition keys to their IDs in batch.
 * Uses caching to minimize API calls.
 * @param api - The API object
 * @param keys - Array of keys to resolve
 * @returns Map of key -> resolved ID (or null if not found)
 */
export async function resolveProcessDefinitionKeys(api: API, keys: string[]): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const keysToResolve: string[] = [];

  // Check cache first
  for (const key of keys) {
    if (processDefinitionKeyCache.has(key)) {
      results.set(key, processDefinitionKeyCache.get(key) ?? null);
    } else {
      keysToResolve.push(key);
    }
  }

  // Resolve uncached keys in parallel
  const resolutions = await Promise.all(
    keysToResolve.map(async key => {
      const id = await resolveProcessDefinitionKey(api, key);
      return { key, id };
    })
  );

  for (const { key, id } of resolutions) {
    results.set(key, id);
  }

  return results;
}

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
 * Links user IDs to /users/[userid] and group IDs to /groups/[groupId].
 * @param userId - The user ID or null
 * @param groupId - The group ID or null
 * @returns JSX element displaying the identity with link
 */
export function renderIdentityDisplay(userId: string | null, groupId: string | null): React.ReactElement {
  if (userId) {
    return React.createElement(
      'span',
      { title: 'User' },
      React.createElement('span', { className: 'glyphicon glyphicon-user' }),
      ' ',
      React.createElement('a', { href: `#/users/${encodeURIComponent(userId)}` }, userId)
    );
  }
  if (groupId) {
    return React.createElement(
      'span',
      { title: 'Group' },
      React.createElement('span', { className: 'glyphicon glyphicon-th' }),
      ' ',
      React.createElement('a', { href: `#/groups/${encodeURIComponent(groupId)}` }, groupId)
    );
  }
  return React.createElement('span', null, '-');
}

/**
 * Options for generating resource URLs.
 */
export interface ResourceUrlOptions {
  /** Base URL for cockpit app (for cross-app navigation from admin) */
  cockpitBaseUrl?: string | undefined;
  /** Base URL for tasklist app (for cross-app navigation from admin) */
  tasklistBaseUrl?: string | undefined;
  /** Resolved ID to use instead of original (e.g., resolved from key) */
  resolvedId?: string | null | undefined;
}

/**
 * Generate URL for a resource based on its type and ID.
 * Supports cross-app navigation when cockpitBaseUrl is provided.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (original, for display purposes)
 * @param options - Optional URL generation options
 * @returns Full URL or hash-only URL, or null if no link available
 */
export function getResourceUrl(
  resourceType: number | null,
  resourceId: string | null,
  options?: ResourceUrlOptions
): string | null {
  // Wildcard resources don't link anywhere
  if (!resourceId || resourceId === '*') {
    return null;
  }

  if (resourceType === null) {
    return null;
  }

  // Use resolved ID if available, otherwise use original
  const idForLink = options?.resolvedId ?? resourceId;
  const encodedId = encodeURIComponent(idForLink);

  // Determine which app the resource belongs to and get the appropriate base URL
  const app = getResourceApp(resourceType);
  let baseUrl = '';
  if (app === 'cockpit' && options?.cockpitBaseUrl) {
    baseUrl = options.cockpitBaseUrl;
  } else if (app === 'tasklist' && options?.tasklistBaseUrl) {
    baseUrl = options.tasklistBaseUrl;
  }

  // Map resource types to their URLs
  switch (resourceType) {
    case 0: // Application - no specific link
      return null;
    case 1: // User
      return `#/users/${encodedId}`;
    case 2: // Group
      return `#/groups/${encodedId}`;
    case 3: // Group Membership - no specific link
      return null;
    case 4: // Authorization - link to authorization page filtered by ID
      return `#/authorization/?resource=4&authorizationId=${encodedId}`;
    case 5: // Filter - no direct link in admin cockpit
      return null;
    case 6: // Process Definition
      // If it's a key (no UUID, no colons), link to processes dashboard with filter
      if (isProcessDefinitionKey(idForLink)) {
        const filterQuery = encodeURIComponent(JSON.stringify([{ type: 'key', operator: 'eq', value: idForLink }]));
        return `${baseUrl}#/processes?pdSearchQuery=${filterQuery}`;
      }
      // Otherwise it's a definition ID, link directly
      return `${baseUrl}#/process-definition/${encodedId}`;
    case 7: // Task - link to tasklist
      return baseUrl ? `${baseUrl}#/?task=${encodedId}` : null;
    case 8: // Process Instance
      return `${baseUrl}#/process-instance/${encodedId}`;
    case 9: // Deployment
      return `${baseUrl}#/repository?page=1&deploymentsQuery=%5B%5D&deployment=${encodedId}`;
    case 10: // Decision Definition
      return `${baseUrl}#/decision-definition/${encodedId}`;
    case 11: // Tenant
      return `#/tenants/${encodedId}`;
    case 12: // Tenant Membership - no specific link
      return null;
    case 13: // Batch
      return `${baseUrl}#/batch/${encodedId}`;
    case 14: // Decision Requirements Definition
      return `${baseUrl}#/decision-definition/${encodedId}`;
    case 17: // Operation Log - no specific link
      return null;
    case 19: // Historic Task Instance - no specific link in standard cockpit
      return null;
    case 20: // Historic Process Instance
      return `${baseUrl}#/history/process-instance/${encodedId}`;
    case 21: // System - no specific link
      return null;
    default:
      return null;
  }
}

/**
 * Get the API endpoint to check if a resource exists.
 * Returns null if the resource type cannot be validated via API.
 * For process definitions, handles both keys and full IDs.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (may be a key for process definitions)
 * @returns API endpoint path or null
 */
export function getResourceValidationEndpoint(resourceType: number | null, resourceId: string | null): string | null {
  // Wildcard resources cannot be validated
  if (!resourceId || resourceId === '*') {
    return null;
  }

  if (resourceType === null) {
    return null;
  }

  const encodedId = encodeURIComponent(resourceId);

  // Map resource types to their validation API endpoints
  switch (resourceType) {
    case 1: // User
      return `/user/${encodedId}/profile`;
    case 2: // Group
      return `/group/${encodedId}`;
    case 4: // Authorization
      return `/authorization/${encodedId}`;
    case 5: // Filter
      return `/filter/${encodedId}`;
    case 6: // Process Definition - handle both key and ID
      // If it's a key (no colons), use the key endpoint
      if (isProcessDefinitionKey(resourceId)) {
        return `/process-definition/key/${encodedId}`;
      }
      return `/process-definition/${encodedId}`;
    case 8: // Process Instance
      return `/process-instance/${encodedId}`;
    case 9: // Deployment
      return `/deployment/${encodedId}`;
    case 10: // Decision Definition
      return `/decision-definition/${encodedId}`;
    case 11: // Tenant
      return `/tenant/${encodedId}`;
    case 13: // Batch
      return `/batch/${encodedId}`;
    case 14: // Decision Requirements Definition
      return `/decision-requirements-definition/${encodedId}`;
    case 20: // Historic Process Instance
      return `/history/process-instance/${encodedId}`;
    // Resource types that cannot be validated:
    // 0: Application, 3: Group Membership, 7: Task, 12: Tenant Membership,
    // 17: Operation Log, 19: Historic Task Instance, 21: System
    default:
      return null;
  }
}

/** Validation status for a resource */
export type ResourceValidationStatus = 'valid' | 'invalid' | 'unknown';

/** Map of resource IDs to their validation status */
export type ResourceValidationMap = Record<string, ResourceValidationStatus>;

/** Map of resource IDs to their resolved IDs (for keys -> latest version ID) */
export type ResolvedIdMap = Record<string, string | null>;

/**
 * Render resource ID display element with optional link and validation status.
 * Links resource IDs to their corresponding Cockpit pages when applicable.
 * Colors missing resources red when validation indicates they don't exist.
 * Supports cross-app navigation and resolved IDs for process definition keys.
 * @param resourceType - The resource type ID
 * @param resourceId - The resource ID (original, displayed to user)
 * @param isValidationStatus - Optional validation status ('valid', 'invalid', 'unknown')
 * @param urlOptions - Optional URL generation options (cockpitBaseUrl, resolvedId)
 * @returns JSX element displaying the resource ID with optional link and validation styling
 */
export function renderResourceIdDisplay(
  resourceType: number | null,
  resourceId: string | null,
  isValidationStatus?: ResourceValidationStatus,
  urlOptions?: ResourceUrlOptions
): React.ReactElement {
  const displayId = resourceId ?? '-';
  const url = getResourceUrl(resourceType, resourceId, urlOptions);

  // Build style based on validation status
  const style: React.CSSProperties = {};
  let title: string | undefined;

  if (isValidationStatus === 'invalid') {
    style.color = '#d9534f'; // Bootstrap danger color
    style.fontWeight = 'bold';
    title = 'Resource not found';
  } else if (isValidationStatus === 'valid') {
    title = 'Resource exists';
  }

  if (url) {
    return React.createElement('a', { href: url, style, title }, displayId);
  }

  return React.createElement('span', { style, title }, displayId);
}
