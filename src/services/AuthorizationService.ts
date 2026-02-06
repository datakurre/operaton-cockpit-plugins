/**
 * Authorization service abstraction for testability.
 * Provides a single point for authorization-related API calls.
 * @module services/AuthorizationService
 */

import { API } from '../types';
import { get as apiGet, post as apiPost, put as apiPut, del as apiDel } from '../utils/api';
import type { Authorization, AuthorizationForm } from '../utils/authorization';

/**
 * Query parameters for authorization list
 */
export interface AuthorizationQueryParams {
  /** Resource type ID */
  resourceType?: number;
  /** Filter by authorization ID */
  id?: string;
  /** Filter by user IDs */
  userIdIn?: string;
  /** Filter by group IDs */
  groupIdIn?: string;
  /** Filter by resource ID */
  resourceId?: string;
  /** Filter by authorization type (0=Global, 1=Grant, 2=Revoke) */
  type?: number;
  /** Maximum number of results */
  maxResults?: number;
  /** First result index */
  firstResult?: number;
  /** Sort by field */
  sortBy?: string;
  /** Sort order (asc, desc) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Payload for creating or updating an authorization
 */
export interface AuthorizationPayload {
  type: number;
  permissions: string[];
  userId: string | null;
  groupId: string | null;
  resourceType: number;
  resourceId: string;
}

/**
 * Authorization service interface for dependency injection
 */
export interface IAuthorizationService {
  /**
   * Get list of authorizations
   * @param params - Query parameters
   * @returns Promise resolving to array of authorizations
   */
  getAuthorizations(params?: AuthorizationQueryParams): Promise<Authorization[]>;

  /**
   * Get authorization count
   * @param params - Query parameters
   * @returns Promise resolving to count
   */
  getCount(params?: AuthorizationQueryParams): Promise<number>;

  /**
   * Create a new authorization
   * @param payload - Authorization data
   * @returns Promise resolving to created authorization
   */
  create(payload: AuthorizationPayload): Promise<Authorization>;

  /**
   * Update an existing authorization
   * @param id - Authorization ID
   * @param payload - Updated authorization data
   * @returns Promise resolving when complete
   */
  update(id: string, payload: AuthorizationPayload): Promise<void>;

  /**
   * Delete an authorization
   * @param id - Authorization ID
   * @returns Promise resolving when complete
   */
  delete(id: string): Promise<void>;
}

/**
 * Convert query params to string record for API calls
 */
function toStringRecord(params: AuthorizationQueryParams): Record<string, string> {
  const result: Record<string, string> = {};

  if (params.resourceType !== undefined) {
    result['resourceType'] = String(params.resourceType);
  }
  if (params.id) {
    result['id'] = params.id;
  }
  if (params.userIdIn) {
    result['userIdIn'] = params.userIdIn;
  }
  if (params.groupIdIn) {
    result['groupIdIn'] = params.groupIdIn;
  }
  if (params.resourceId) {
    result['resourceId'] = params.resourceId;
  }
  if (params.type !== undefined) {
    result['type'] = String(params.type);
  }
  if (params.maxResults !== undefined) {
    result['maxResults'] = String(params.maxResults);
  }
  if (params.firstResult !== undefined) {
    result['firstResult'] = String(params.firstResult);
  }
  if (params.sortBy) {
    result['sortBy'] = params.sortBy;
  }
  if (params.sortOrder) {
    result['sortOrder'] = params.sortOrder;
  }

  return result;
}

/**
 * Default implementation of the authorization service
 */
export class AuthorizationService implements IAuthorizationService {
  private api: API;

  /**
   * Creates a new AuthorizationService instance
   * @param api - The API configuration object
   */
  constructor(api: API) {
    this.api = api;
  }

  /**
   * Gets authorizations with optional filtering
   * @param params - Optional query parameters
   * @returns Promise resolving to array of authorizations
   */
  async getAuthorizations(params: AuthorizationQueryParams = {}): Promise<Authorization[]> {
    const queryParams = toStringRecord(params);
    const result: unknown = await apiGet(this.api, '/authorization', queryParams);
    return Array.isArray(result) ? (result as Authorization[]) : [];
  }

  /**
   * Gets the count of authorizations matching the query
   * @param params - Optional query parameters
   * @returns Promise resolving to count
   */
  async getCount(params: AuthorizationQueryParams = {}): Promise<number> {
    const queryParams = toStringRecord(params);
    const result: unknown = await apiGet(this.api, '/authorization/count', queryParams);
    if (typeof result === 'object' && result !== null && 'count' in result) {
      return (result as { count: number }).count;
    }
    return 0;
  }

  /**
   * Creates a new authorization
   * @param payload - Authorization data
   * @returns Promise resolving to created authorization
   */
  async create(payload: AuthorizationPayload): Promise<Authorization> {
    const result: unknown = await apiPost(this.api, '/authorization/create', {}, JSON.stringify(payload));
    return result as Authorization;
  }

  /**
   * Updates an existing authorization
   * @param id - Authorization ID
   * @param payload - Updated authorization data
   * @returns Promise resolving when complete
   */
  async update(id: string, payload: AuthorizationPayload): Promise<void> {
    await apiPut(this.api, `/authorization/${id}`, JSON.stringify(payload));
  }

  /**
   * Deletes an authorization
   * @param id - Authorization ID
   * @returns Promise resolving when complete
   */
  async delete(id: string): Promise<void> {
    await apiDel(this.api, `/authorization/${id}`);
  }
}

/**
 * Factory function to create an AuthorizationService from a form object
 * @param form - Authorization form data
 * @param resourceType - Resource type ID
 * @returns Authorization payload
 */
export function createPayloadFromForm(form: AuthorizationForm, resourceType: number): AuthorizationPayload {
  return {
    type: form.type,
    permissions: form.permissions,
    userId: form.identityType === 'user' ? form.identityId : null,
    groupId: form.identityType === 'group' ? form.identityId : null,
    resourceType,
    resourceId: form.resourceId || '*',
  };
}

/**
 * Creates a new AuthorizationService instance
 * @param api - The API configuration object
 * @returns A new AuthorizationService instance
 */
export function createAuthorizationService(api: API): IAuthorizationService {
  return new AuthorizationService(api);
}
