/**
 * Filter schema utilities for react-select-filter-box.
 *
 * This module provides schema builders and adapters for creating filter configurations
 * compatible with react-select-filter-box from the legacy react-filter-box format.
 *
 * @module
 */
import {
  type FieldConfig,
  type FilterExpression,
  type FilterSchema,
  type OperatorConfig,
  type AutocompleteItem,
  createEnumAutocompleter,
  createAsyncAutocompleter,
} from 'react-select-filter-box';
import type { API } from '../types';
import { datePickerWidget } from './datePickerWidget';
import './datePickerWidget.scss';

/**
 * Standard operators used across filter configurations
 */
export const OPERATORS = {
  /** Equals operator */
  eq: { key: 'eq', label: 'equals', symbol: '=' } satisfies OperatorConfig,
  /** Not equals operator */
  neq: { key: 'neq', label: 'not equals', symbol: '≠' } satisfies OperatorConfig,
  /** Like (contains) operator */
  like: { key: 'like', label: 'contains', symbol: '~' } satisfies OperatorConfig,
  /** Case-insensitive like operator */
  ilike: { key: 'ilike', label: 'contains (case-insensitive)', symbol: '≈' } satisfies OperatorConfig,
  /** After (greater than or equal for dates) */
  after: { key: 'after', label: 'after', symbol: '≥' } satisfies OperatorConfig,
  /** Before (less than or equal for dates) */
  before: { key: 'before', label: 'before', symbol: '≤' } satisfies OperatorConfig,
  /** Greater than */
  gt: { key: 'gt', label: 'greater than', symbol: '>' } satisfies OperatorConfig,
  /** Less than */
  lt: { key: 'lt', label: 'less than', symbol: '<' } satisfies OperatorConfig,
  /** Greater than or equal */
  gte: { key: 'gte', label: 'greater or equal', symbol: '≥' } satisfies OperatorConfig,
  /** Less than or equal */
  lte: { key: 'lte', label: 'less or equal', symbol: '≤' } satisfies OperatorConfig,
  /** Is operator (exact match) */
  is: { key: 'is', label: 'is', symbol: '=' } satisfies OperatorConfig,
  /** Any value */
  any: { key: 'any', label: 'any', symbol: '*' } satisfies OperatorConfig,
} as const;

/**
 * Configuration for a filter field builder
 */
export interface FieldBuilderConfig {
  /** Field key */
  key: string;
  /** Field label */
  label?: string;
  /** Field type */
  type: 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'enum' | 'id' | 'custom';
  /** Operators for this field */
  operators: OperatorConfig[];
  /** Whether multiple values allowed (default: true) */
  allowMultiple?: boolean;
  /** Static values for enum/selection fields */
  values?: { key: string; label: string }[];
  /** Whether this is a date field */
  isDate?: boolean;
}

/**
 * Create a date field configuration with custom date picker widget.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
export function createDateField(key: string, label: string, operators: OperatorConfig[]): FieldConfig {
  // Add customInput to each operator to use the date picker widget
  const operatorsWithWidget = operators.map(op => ({
    ...op,
    customInput: datePickerWidget,
  }));

  return {
    key,
    label,
    type: 'date',
    operators: operatorsWithWidget,
    allowMultiple: false,
  };
}

/**
 * Create a string field configuration.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
export function createStringField(key: string, label: string, operators: OperatorConfig[]): FieldConfig {
  return {
    key,
    label,
    type: 'string',
    operators,
    allowMultiple: true,
  };
}

/**
 * Create an enum field configuration with static values.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @param values - Static enum values
 * @returns Field configuration
 */
export function createEnumField(
  key: string,
  label: string,
  operators: OperatorConfig[],
  values: { key: string; label: string }[]
): FieldConfig {
  return {
    key,
    label,
    type: 'enum',
    operators,
    allowMultiple: true,
    valueAutocompleter: createEnumAutocompleter(values),
  };
}

/**
 * Create a number field configuration.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
export function createNumberField(key: string, label: string, operators: OperatorConfig[]): FieldConfig {
  return {
    key,
    label,
    type: 'number',
    operators,
    allowMultiple: false,
  };
}

/**
 * Create a boolean field configuration.
 * Boolean fields are represented as enum fields with true/false values.
 * @param key - Field key
 * @param label - Display label
 * @returns Field configuration
 */
export function createBooleanField(key: string, label: string): FieldConfig {
  return {
    key,
    label,
    type: 'enum',
    operators: [OPERATORS.is],
    allowMultiple: false,
    valueAutocompleter: createEnumAutocompleter([
      { key: 'true', label: 'true' },
      { key: 'false', label: 'false' },
    ]),
  };
}

// =============================================================================
// Async Autocompleter Infrastructure
// =============================================================================

/**
 * Configuration options for API-based autocompleters
 */
export interface ApiAutocompleterOptions {
  /** API configuration (injected at runtime) */
  api: API;
  /** Minimum characters before triggering search (default: 1) */
  minChars?: number;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Whether to cache results (default: true) */
  shouldCacheResults?: boolean;
  /** Maximum number of results to return (default: 10) */
  maxResults?: number;
  /** Custom loading message (default: "Searching...") */
  loadingMessage?: string;
}

/**
 * Create an async autocompleter that fetches suggestions from an API endpoint.
 * 
 * This utility wraps react-select-filter-box's createAsyncAutocompleter with
 * built-in debouncing, caching, and error handling optimized for Operaton REST API.
 * 
 * @param fetchFn - Async function that fetches autocomplete items from API
 * @param options - Configuration options
 * @returns Autocompleter instance
 * 
 * @example
 * ```typescript
 * const userAutocompleter = createApiAutocompleter(
 *   async (query, api, signal) => {
 *     const response = await fetch(
 *       `${api.engineApi}/user?nameLike=${encodeURIComponent(query)}%`,
 *       { signal, headers: headers(api) }
 *     );
 *     const users = await response.json();
 *     return users.map(u => ({ key: u.id, label: u.id }));
 *   },
 *   { api, minChars: 2, maxResults: 10 }
 * );
 * ```
 */
export function createApiAutocompleter(
  fetchFn: (query: string, api: API, signal?: AbortSignal) => Promise<AutocompleteItem[]>,
  options: ApiAutocompleterOptions
): ReturnType<typeof createAsyncAutocompleter> {
  const {
    api,
    minChars = 1,
    debounceMs = 300,
    shouldCacheResults = true,
    loadingMessage = 'Searching...',
  } = options;

  return createAsyncAutocompleter(
    async (query: string, _context: unknown, signal?: AbortSignal) => {
      try {
        // Delegate to the provided fetch function
        return await fetchFn(query, api, signal);
      } catch (unknownError) {
        const error = unknownError as Error;
        // Handle abort gracefully
        if (error.name === 'AbortError') {
          return [];
        }
        
        // Handle API errors
        console.error('Autocomplete fetch error:', error);
        return [];
      }
    },
    {
      debounceMs,
      minChars,
      cacheResults: shouldCacheResults,
      loadingMessage,
    }
  );
}

/**
 * Create a string field with async API-based autocomplete.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @param autocompleter - Async autocompleter instance
 * @returns Field configuration
 */
export function createAsyncStringField(
  key: string,
  label: string,
  operators: OperatorConfig[],
  autocompleter: ReturnType<typeof createAsyncAutocompleter>
): FieldConfig {
  return {
    key,
    label,
    type: 'string',
    operators,
    allowMultiple: true,
    valueAutocompleter: autocompleter,
  };
}

// =============================================================================
// Pre-built API Autocompleters
// =============================================================================

/**
 * User profile response from Operaton API
 */
interface UserProfileDto {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/**
 * Group response from Operaton API
 */
interface GroupDto {
  id?: string | null;
  name?: string | null;
  type?: string | null;
}

/**
 * Create an autocompleter for user search via /user API endpoint.
 * 
 * Searches users by first name, last name, and email with substring matching.
 * Performs three separate API calls and combines results, removing duplicates.
 * This is necessary because the REST API uses AND logic for multiple parameters.
 * Returns user IDs as suggestions. Handles permission errors gracefully.
 * 
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for user search
 * 
 * @example
 * ```typescript
 * const userAutocompleter = createUserAutocompleter(api, { minChars: 2 });
 * const field = createAsyncStringField('startedBy', 'Started By', [OPERATORS.eq], userAutocompleter);
 * ```
 */
export function createUserAutocompleter(
  api: API,
  options?: Omit<ApiAutocompleterOptions, 'api'>
): ReturnType<typeof createAsyncAutocompleter> {
  return createApiAutocompleter(
    async (query: string, apiConfig: API, signal?: AbortSignal): Promise<AutocompleteItem[]> => {
      const encodedQuery = encodeURIComponent(query);
      const headers = {
        Accept: 'application/json',
        'X-XSRF-TOKEN': apiConfig.CSRFToken,
      };

      // Perform three separate searches (REST API uses AND logic, not OR)
      const searches = [
        `${apiConfig.engineApi}/user?firstNameLike=%${encodedQuery}%`,
        `${apiConfig.engineApi}/user?lastNameLike=%${encodedQuery}%`,
        `${apiConfig.engineApi}/user?emailLike=%${encodedQuery}%`,
      ];

      const results = await Promise.all(
        searches.map(async url => {
          try {
            const response = await fetch(url, {
              signal: signal ?? null,
              headers,
            });

            // Handle permission denied gracefully
            if (response.status === 403) {
              console.warn('User search permission denied');
              return [];
            }

            if (!response.ok) {
              throw new Error(`User search failed: ${response.status}`);
            }

            return (await response.json()) as UserProfileDto[];
          } catch (error) {
            // If one search fails, continue with others
            console.warn('User search request failed:', error);
            return [];
          }
        })
      );

      // Combine results and remove duplicates by user ID
      const userMap = new Map<string, UserProfileDto>();
      for (const userList of results) {
        for (const user of userList) {
          if (user.id && !userMap.has(user.id)) {
            userMap.set(user.id, user);
          }
        }
      }

      return Array.from(userMap.values()).map(u => {
        const parts: string[] = [];
        if (u.firstName || u.lastName) {
          parts.push(`${u.firstName ?? ''} ${u.lastName ?? ''}`.trim());
        }
        if (u.email) {
          parts.push(`<${u.email}>`);
        }
        return {
          type: 'value' as const,
          key: u.id ?? '',
          label: parts.length > 0 ? `${u.id} (${parts.join(' ')})` : (u.id ?? ''),
        };
      });
    },
    {
      api,
      minChars: options?.minChars ?? 2,
      debounceMs: options?.debounceMs ?? 300,
      shouldCacheResults: options?.shouldCacheResults ?? true,
      ...(options?.maxResults !== undefined && { maxResults: options.maxResults }),
      loadingMessage: options?.loadingMessage ?? 'Searching users...',
    }
  );
}

/**
 * Create an autocompleter for group search via /group API endpoint.
 * 
 * Searches groups by name with substring matching. Returns group IDs with names as suggestions.
 * Handles permission errors gracefully.
 * 
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for group search
 * 
 * @example
 * ```typescript
 * const groupAutocompleter = createGroupAutocompleter(api, { minChars: 2 });
 * const field = createAsyncStringField('groupIdIn', 'Group', [OPERATORS.eq], groupAutocompleter);
 * ```
 */
export function createGroupAutocompleter(
  api: API,
  options?: Omit<ApiAutocompleterOptions, 'api'>
): ReturnType<typeof createAsyncAutocompleter> {
  return createApiAutocompleter(
    async (query: string, apiConfig: API, signal?: AbortSignal): Promise<AutocompleteItem[]> => {
      const url = `${apiConfig.engineApi}/group?nameLike=%${encodeURIComponent(query)}%`;
      const response = await fetch(url, {
        signal: signal ?? null,
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': apiConfig.CSRFToken,
        },
      });

      // Handle permission denied gracefully
      if (response.status === 403) {
        console.warn('Group search permission denied');
        return [];
      }

      if (!response.ok) {
        throw new Error(`Group search failed: ${response.status}`);
      }

      const groups = (await response.json()) as GroupDto[];
      return groups
        .filter(g => g.id)
        .map(g => ({
          type: 'value' as const,
          key: g.id ?? '',
          label: g.name ? `${g.id} (${g.name})` : (g.id ?? ''),
        }));
    },
    {
      api,
      minChars: options?.minChars ?? 2,
      debounceMs: options?.debounceMs ?? 300,
      shouldCacheResults: options?.shouldCacheResults ?? true,
      ...(options?.maxResults !== undefined && { maxResults: options.maxResults }),
      loadingMessage: options?.loadingMessage ?? 'Searching groups...',
    }
  );
}

/**
 * Tenant response from Operaton API
 */
interface TenantDto {
  id?: string | null;
  name?: string | null;
}

/**
 * Create an autocompleter for tenant search via /tenant API endpoint.
 * 
 * Fetches all tenants and caches the result since tenant lists rarely change.
 * Returns tenant IDs with names as suggestions.
 * 
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for tenant search
 * 
 * @example
 * ```typescript
 * const tenantAutocompleter = createTenantAutocompleter(api);
 * const field = createAsyncStringField('tenantIdIn', 'Tenant ID', [OPERATORS.eq], tenantAutocompleter);
 * ```
 */
export function createTenantAutocompleter(
  api: API,
  options?: Omit<ApiAutocompleterOptions, 'api' | 'shouldCacheResults'>
): ReturnType<typeof createAsyncAutocompleter> {
  return createApiAutocompleter(
    async (query: string, apiConfig: API, signal?: AbortSignal): Promise<AutocompleteItem[]> => {
      const url = `${apiConfig.engineApi}/tenant`;
      const response = await fetch(url, {
        signal: signal ?? null,
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': apiConfig.CSRFToken,
        },
      });

      // Handle permission denied gracefully
      if (response.status === 403) {
        console.warn('Tenant search permission denied');
        return [];
      }

      if (!response.ok) {
        throw new Error(`Tenant search failed: ${response.status}`);
      }

      const tenants = (await response.json()) as TenantDto[];
      const lowerQuery = query.toLowerCase();
      
      return tenants
        .filter(t => t.id && t.id.toLowerCase().includes(lowerQuery))
        .map(t => ({
          type: 'value' as const,
          key: t.id ?? '',
          label: t.name ? `${t.id} (${t.name})` : (t.id ?? ''),
        }));
    },
    {
      api,
      minChars: options?.minChars ?? 0,
      debounceMs: options?.debounceMs ?? 0,
      shouldCacheResults: true, // Always cache - tenants rarely change
      ...(options?.maxResults !== undefined && { maxResults: options.maxResults }),
      loadingMessage: options?.loadingMessage ?? 'Loading tenants...',
    }
  );
}

/**
 * Process definition response from Operaton API
 */
interface ProcessDefinitionDto {
  id?: string | null;
  key?: string | null;
  name?: string | null;
  version?: number | null;
  versionTag?: string | null;
}

/**
 * Create an autocompleter for process definition search via /process-definition API endpoint.
 * 
 * Searches process definitions by name with wildcard matching.
 * Groups results by latest version to avoid clutter.
 * 
 * @param api - API configuration
 * @param options - Optional autocompleter configuration
 * @returns Autocompleter instance for process definition search
 * 
 * @example
 * ```typescript
 * const processDefAutocompleter = createProcessDefinitionAutocompleter(api);
 * const field = createAsyncStringField('processDefinitionName', 'Process Name', [OPERATORS.eq], processDefAutocompleter);
 * ```
 */
export function createProcessDefinitionAutocompleter(
  api: API,
  options?: Omit<ApiAutocompleterOptions, 'api'>
): ReturnType<typeof createAsyncAutocompleter> {
  return createApiAutocompleter(
    async (query: string, apiConfig: API, signal?: AbortSignal): Promise<AutocompleteItem[]> => {
      const url = `${apiConfig.engineApi}/process-definition?nameLike=${encodeURIComponent(query)}%&latestVersion=true`;
      const response = await fetch(url, {
        signal: signal ?? null,
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': apiConfig.CSRFToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Process definition search failed: ${response.status}`);
      }

      const definitions = (await response.json()) as ProcessDefinitionDto[];
      return definitions
        .filter(d => d.name)
        .map(d => ({
          type: 'value' as const,
          key: d.name ?? '',
          label: d.versionTag 
            ? `${d.name} (v${d.version} - ${d.versionTag})`
            : `${d.name} (v${d.version})`,
        }));
    },
    {
      api,
      minChars: options?.minChars ?? 2,
      debounceMs: options?.debounceMs ?? 300,
      shouldCacheResults: options?.shouldCacheResults ?? true,
      ...(options?.maxResults !== undefined && { maxResults: options.maxResults }),
      loadingMessage: options?.loadingMessage ?? 'Searching process definitions...',
    }
  );
}

/**
 * Create an autocompleter for activity IDs/names from BPMN XML context.
 * 
 * Provides context-aware suggestions by parsing activity IDs and names from
 * the current process definition's BPMN XML.
 * 
 * @param activities - Array of BPMN activities from getBpmnElements
 * @param showNames - Whether to show activity names (default: false, show IDs)
 * @returns Autocompleter instance for activity search
 * 
 * @example
 * ```typescript
 * const { activities } = await getBpmnElements(processDefinitionId, api);
 * const activityIdAutocompleter = createActivityAutocompleter(activities);
 * const field = createAsyncStringField('activityId', 'Activity ID', [OPERATORS.eq], activityIdAutocompleter);
 * ```
 */
export function createActivityAutocompleter(
  activities: { id: string; name?: string; type: string }[],
  showNames = false
): ReturnType<typeof createAsyncAutocompleter> {
  // Convert activities to autocomplete items
  const items: AutocompleteItem[] = activities.map(activity => ({
    type: 'value' as const,
    key: showNames ? (activity.name ?? activity.id) : activity.id,
    label: showNames
      ? activity.name
        ? `${activity.name} (${activity.id})`
        : activity.id
      : activity.id,
  }));

  // Return a synchronous autocompleter with instant results
  return createAsyncAutocompleter(
    async (query: string) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.key.toLowerCase().includes(lowerQuery) ||
          item.label.toLowerCase().includes(lowerQuery)
      );
    },
    {
      debounceMs: 0, // No debounce for local data
      minChars: 0,   // Show all on focus
      cacheResults: true,
      loadingMessage: 'Filtering activities...',
    }
  );
}

/** Activity types for filtering */
const ACTIVITY_TYPES = [
  { key: 'startEvent', label: 'Start Event' },
  { key: 'endEvent', label: 'End Event' },
  { key: 'userTask', label: 'User Task' },
  { key: 'serviceTask', label: 'Service Task' },
  { key: 'sendTask', label: 'Send Task' },
  { key: 'receiveTask', label: 'Receive Task' },
  { key: 'scriptTask', label: 'Script Task' },
  { key: 'businessRuleTask', label: 'Business Rule Task' },
  { key: 'manualTask', label: 'Manual Task' },
  { key: 'exclusiveGateway', label: 'Exclusive Gateway' },
  { key: 'parallelGateway', label: 'Parallel Gateway' },
  { key: 'inclusiveGateway', label: 'Inclusive Gateway' },
  { key: 'eventBasedGateway', label: 'Event-Based Gateway' },
  { key: 'callActivity', label: 'Call Activity' },
  { key: 'subProcess', label: 'Sub-Process' },
  { key: 'boundaryEvent', label: 'Boundary Event' },
  { key: 'intermediateThrowEvent', label: 'Intermediate Throw Event' },
  { key: 'intermediateCatchEvent', label: 'Intermediate Catch Event' },
];

/**
 * Configuration for context-aware activity autocompleters.
 * Pass this when you have BPMN XML context available.
 */
export interface ActivityAutocompleterContext {
  activities: { id: string; name?: string; type: string }[];
}

/**
 * Create a filter schema for process definition statistics.
 * @param api - Optional API configuration for enabling autocomplete on user/group/tenant fields
 * @param activityContext - Optional BPMN activities for context-aware autocomplete
 * @returns Filter schema for definition filters
 */
export function createDefinitionFilterSchema(
  api?: API,
  activityContext?: ActivityAutocompleterContext
): FilterSchema {
  const taskAssigneeField = api
    ? createAsyncStringField('taskAssignee', 'Task Assignee', [OPERATORS.eq, OPERATORS.like], createUserAutocompleter(api))
    : createStringField('taskAssignee', 'Task Assignee', [OPERATORS.eq, OPERATORS.like]);

  const tenantIdInField = api
    ? createAsyncStringField('tenantIdIn', 'Tenant ID', [OPERATORS.eq], createTenantAutocompleter(api))
    : createStringField('tenantIdIn', 'Tenant ID', [OPERATORS.eq]);

  const activityIdField = activityContext
    ? createAsyncStringField('activityId', 'Activity ID', [OPERATORS.eq], createActivityAutocompleter(activityContext.activities, false))
    : createStringField('activityId', 'Activity ID', [OPERATORS.eq]);

  const activityNameField = activityContext
    ? createAsyncStringField('activityName', 'Activity Name', [OPERATORS.eq, OPERATORS.like], createActivityAutocompleter(activityContext.activities, true))
    : createStringField('activityName', 'Activity Name', [OPERATORS.eq, OPERATORS.like]);

  return {
    fields: [
      createDateField('started', 'Started After', [OPERATORS.after]),
      createDateField('startedBefore', 'Started Before', [OPERATORS.before]),
      createDateField('finished', 'Finished', [OPERATORS.before]),
      createDateField('finishedAfter', 'Finished After', [OPERATORS.after]),
      createNumberField('maxResults', 'Max Results', [OPERATORS.is]),
      createNumberField('version', 'Version', [OPERATORS.eq]),
      createStringField('processDefinitionId', 'Process Definition ID', [OPERATORS.eq]),
      createStringField('activityInstanceId', 'Activity Instance ID', [OPERATORS.eq]),
      createStringField('processInstanceId', 'Process Instance ID', [OPERATORS.eq]),
      createStringField('executionId', 'Execution ID', [OPERATORS.eq]),
      activityIdField,
      activityNameField,
      createEnumField('activityType', 'Activity Type', [OPERATORS.eq], ACTIVITY_TYPES),
      taskAssigneeField,
      createBooleanField('finishedOnly', 'Finished Only'),
      createBooleanField('unfinishedOnly', 'Unfinished Only'),
      createBooleanField('canceled', 'Canceled Only'),
      createBooleanField('completeScope', 'Complete Scope'),
      tenantIdInField,
      createBooleanField('withoutTenantId', 'Without Tenant ID'),
    ],
  };
}

/** Process instance states */
const INSTANCE_STATES = [
  { key: 'ACTIVE', label: 'Active' },
  { key: 'SUSPENDED', label: 'Suspended' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'EXTERNALLY_TERMINATED', label: 'Externally Terminated' },
  { key: 'INTERNALLY_TERMINATED', label: 'Internally Terminated' },
];

/** Incident types */
const INCIDENT_TYPES = [
  { key: 'failedJob', label: 'Failed Job' },
  { key: 'failedExternalTask', label: 'Failed External Task' },
];

/** Incident status values */
const INCIDENT_STATUSES = [
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
];

/**
 * Create a filter schema for process instance history queries.
 * @param api - Optional API configuration for enabling autocomplete on user/group/tenant fields
 * @param activityContext - Optional BPMN activities for context-aware autocomplete
 * @returns Filter schema for instance filters
 */
export function createInstanceQuerySchema(
  api?: API,
  activityContext?: ActivityAutocompleterContext
): FilterSchema {
  const startedByField = api
    ? createAsyncStringField('startedBy', 'Started By', [OPERATORS.eq], createUserAutocompleter(api))
    : createStringField('startedBy', 'Started By', [OPERATORS.eq]);

  const processDefinitionNameField = api
    ? createAsyncStringField('processDefinitionName', 'Process Name', [OPERATORS.eq, OPERATORS.like], createProcessDefinitionAutocompleter(api))
    : createStringField('processDefinitionName', 'Process Name', [OPERATORS.eq, OPERATORS.like]);

  const tenantIdInField = api
    ? createAsyncStringField('tenantIdIn', 'Tenant ID', [OPERATORS.eq], createTenantAutocompleter(api))
    : createStringField('tenantIdIn', 'Tenant ID', [OPERATORS.eq]);

  const executedActivityIdInField = activityContext
    ? createAsyncStringField('executedActivityIdIn', 'Executed Activity ID', [OPERATORS.eq], createActivityAutocompleter(activityContext.activities, false))
    : createStringField('executedActivityIdIn', 'Executed Activity ID', [OPERATORS.eq]);

  const activeActivityIdInField = activityContext
    ? createAsyncStringField('activeActivityIdIn', 'Active Activity ID', [OPERATORS.eq], createActivityAutocompleter(activityContext.activities, false))
    : createStringField('activeActivityIdIn', 'Active Activity ID', [OPERATORS.eq]);

  return {
    fields: [
      // Date filters
      createDateField('started', 'Started After', [OPERATORS.after]),
      createDateField('startedBefore', 'Started Before', [OPERATORS.before]),
      createDateField('finished', 'Finished Before', [OPERATORS.before]),
      createDateField('finishedAfter', 'Finished After', [OPERATORS.after]),
      createDateField('executedActivityAfter', 'Executed Activity After', [OPERATORS.after]),
      createDateField('executedActivityBefore', 'Executed Activity Before', [OPERATORS.before]),
      createDateField('executedJobAfter', 'Executed Job After', [OPERATORS.after]),
      createDateField('executedJobBefore', 'Executed Job Before', [OPERATORS.before]),

      // Instance identifiers
      createStringField('processInstanceId', 'Instance ID', [OPERATORS.eq]),
      createStringField('processInstanceIds', 'Instance IDs', [OPERATORS.eq]),
      createStringField('processInstanceIdNotIn', 'Instance ID (Exclude)', [OPERATORS.eq]),
      createStringField('key', 'Process Key', [OPERATORS.eq, OPERATORS.like]),
      createStringField('processInstanceBusinessKeyIn', 'Business Keys', [OPERATORS.eq]),
      processDefinitionNameField,
      createStringField('processDefinitionKey', 'Process Definition Key', [OPERATORS.eq, OPERATORS.like]),
      createStringField('processDefinitionKeyIn', 'Process Definition Keys', [OPERATORS.eq]),
      createStringField('processDefinitionKeyNotIn', 'Process Definition Keys (Exclude)', [OPERATORS.eq]),
      createStringField('processDefinitionId', 'Process Definition ID', [OPERATORS.eq]),

      // Hierarchy filters
      createBooleanField('rootProcessInstances', 'Root Instances Only'),
      createStringField('rootProcessInstanceId', 'Root Process Instance ID', [OPERATORS.eq]),
      createStringField('superProcessInstanceId', 'Super Process Instance ID', [OPERATORS.eq]),
      createStringField('subProcessInstanceId', 'Sub Process Instance ID', [OPERATORS.eq]),

      // Variable filters (deprecated, use freeform fields instead)
      createStringField('variable', 'Variable', [OPERATORS.eq, OPERATORS.like, OPERATORS.ilike]),

      // Version filter
      {
        key: 'version',
        label: 'Version',
        type: 'number',
        operators: [OPERATORS.any, OPERATORS.eq, OPERATORS.lt, OPERATORS.gt, OPERATORS.lte, OPERATORS.gte],
        allowMultiple: false,
      },

      // State filters
      createBooleanField('finishedOnly', 'Finished Only'),
      createBooleanField('unfinishedOnly', 'Unfinished Only'),
      createBooleanField('active', 'Active Only'),
      createBooleanField('suspended', 'Suspended Only'),
      createBooleanField('completed', 'Completed Only'),
      createBooleanField('externallyTerminated', 'Externally Terminated'),
      createBooleanField('internallyTerminated', 'Internally Terminated'),
      createEnumField('state', 'State', [OPERATORS.eq], INSTANCE_STATES),

      // Incident filters
      createBooleanField('withIncidents', 'With Incidents'),
      createBooleanField('withRootIncidents', 'With Root Incidents'),
      createBooleanField('withJobsRetrying', 'With Jobs Retrying'),
      createEnumField('incidentType', 'Incident Type', [OPERATORS.eq], INCIDENT_TYPES),
      createEnumField('incidentStatus', 'Incident Status', [OPERATORS.eq], INCIDENT_STATUSES),
      createStringField('incidentMessage', 'Incident Message', [OPERATORS.eq, OPERATORS.like]),
      createStringField('incidentIdIn', 'Incident IDs', [OPERATORS.eq]),

      // Activity filters
      executedActivityIdInField,
      activeActivityIdInField,

      // Other filters
      startedByField,
      tenantIdInField,
      createBooleanField('withoutTenantId', 'Without Tenant ID'),
    ],
    allowFreeformFields: true,
    freeformFieldConfig: {
      type: 'string',
      placeholder: 'Type variable name...',
      createLabel: 'Variable: ',
      group: 'Process Variables',
      operators: [OPERATORS.eq, OPERATORS.like, OPERATORS.ilike],
      validateFieldName: (name: string) => /^[a-zA-Z_]\w*$/.test(name) || 'Variable name must start with a letter or underscore and contain only alphanumeric characters and underscores',
    },
  };
}

/** Resource types for authorization filtering (sorted by name) */
const RESOURCE_TYPE_VALUES = [
  { key: '0', label: 'Application' },
  { key: '4', label: 'Authorization' },
  { key: '13', label: 'Batch' },
  { key: '10', label: 'Decision Definition' },
  { key: '14', label: 'Decision Requirements Definition' },
  { key: '9', label: 'Deployment' },
  { key: '5', label: 'Filter' },
  { key: '2', label: 'Group' },
  { key: '3', label: 'Group Membership' },
  { key: '20', label: 'Historic Process Instance' },
  { key: '19', label: 'Historic Task Instance' },
  { key: '17', label: 'Operation Log' },
  { key: '6', label: 'Process Definition' },
  { key: '8', label: 'Process Instance' },
  { key: '21', label: 'System' },
  { key: '7', label: 'Task' },
  { key: '11', label: 'Tenant' },
  { key: '12', label: 'Tenant Membership' },
  { key: '1', label: 'User' },
];

/**
 * Create a filter schema for authorization filters.
 * Field names match Operaton REST API query parameters directly.
 * @param api - Optional API configuration for enabling autocomplete on user/group fields
 * @param options - Optional configuration for field inclusion
 * @returns Filter schema for authorization filters
 */
export function createAuthorizationFilterSchema(
  api?: API,
  options?: { includeId?: boolean; includeResourceType?: boolean }
): FilterSchema {
  const userIdInField = api
    ? createAsyncStringField('userIdIn', 'User ID', [OPERATORS.eq], createUserAutocompleter(api))
    : createStringField('userIdIn', 'User ID', [OPERATORS.eq]);

  const groupIdInField = api
    ? createAsyncStringField('groupIdIn', 'Group ID', [OPERATORS.eq], createGroupAutocompleter(api))
    : createStringField('groupIdIn', 'Group ID', [OPERATORS.eq]);

  const fields: FieldConfig[] = [];

  // Only include ID field if explicitly requested (defaults to false)
  if (options?.includeId) {
    fields.push(createStringField('id', 'ID', [OPERATORS.eq]));
  }

  // Add user and group ID fields with autocomplete
  fields.push(userIdInField, groupIdInField);

  // Add resource ID field
  fields.push(createStringField('resourceId', 'Resource ID', [OPERATORS.eq]));

  // Only include Resource Type field if explicitly requested (defaults to false)
  if (options?.includeResourceType) {
    fields.push(createEnumField('resourceType', 'Resource Type', [OPERATORS.eq], RESOURCE_TYPE_VALUES));
  }

  // Add authorization type field
  fields.push(
    createEnumField(
      'type',
      'Type',
      [OPERATORS.eq],
      [
        { key: '0', label: 'Global' },
        { key: '1', label: 'Grant' },
        { key: '2', label: 'Revoke' },
      ]
    )
  );

  return {
    fields,
    connectors: [{ key: 'AND', label: 'AND' }],
  };
}

/**
 * Adapter interface matching the legacy Expression format from react-filter-box.
 * Used for backward compatibility during migration.
 */
export interface LegacyExpression {
  category: string;
  operator: string;
  value: string;
  conditionType?: 'AND' | 'OR';
}

/**
 * Convert new FilterExpression array to legacy Expression array.
 * This provides backward compatibility for existing code that expects the old format.
 * @param expressions - New format expressions
 * @returns Legacy format expressions
 */
export function toLegacyExpressions(expressions: FilterExpression[]): LegacyExpression[] {
  return expressions.map((expr, index) => {
    const base = {
      category: expr.condition.field.key,
      operator: mapOperatorKeyToLegacy(expr.condition.operator.key),
      value: expr.condition.value.serialized,
    };

    // Only add conditionType for non-last expressions
    if (index < expressions.length - 1) {
      return {
        ...base,
        conditionType: expr.connector ?? 'AND',
      };
    }

    return base;
  });
}

/**
 * Map new operator keys to legacy operator strings.
 * @param key - New operator key
 * @returns Legacy operator string
 */
function mapOperatorKeyToLegacy(key: string): string {
  const mapping: Record<string, string> = {
    eq: '==',
    neq: '!=',
    like: 'like',
    ilike: 'ilike',
    after: 'after',
    before: 'before',
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<=',
    is: '==',
    any: 'any',
  };
  return mapping[key] ?? key;
}

/**
 * Convert legacy Expression array to new FilterExpression array.
 * @param expressions - Legacy format expressions
 * @param schema - Filter schema for field/operator lookup
 * @returns New format expressions
 */
export function fromLegacyExpressions(expressions: LegacyExpression[], schema: FilterSchema): FilterExpression[] {
  return expressions.map((expr, index) => {
    const field = schema.fields.find(f => f.key === expr.category);
    const operatorKey = mapLegacyOperatorToKey(expr.operator);
    const operator = field?.operators.find(o => o.key === operatorKey) ?? {
      key: operatorKey,
      label: expr.operator,
    };

    return {
      condition: {
        field: {
          key: expr.category,
          label: field?.label ?? expr.category,
          type: field?.type ?? 'string',
        },
        operator: {
          key: operator.key,
          label: operator.label,
          symbol: operator.symbol,
        },
        value: {
          raw: expr.value,
          display: expr.value,
          serialized: expr.value,
        },
      },
      connector: index < expressions.length - 1 ? (expr.conditionType ?? 'AND') : undefined,
    };
  });
}

/**
 * Map legacy operator strings to new operator keys.
 * @param op - Legacy operator string
 * @returns New operator key
 */
function mapLegacyOperatorToKey(op: string): string {
  const mapping: Record<string, string> = {
    '==': 'eq',
    '!=': 'neq',
    like: 'like',
    ilike: 'ilike',
    after: 'after',
    before: 'before',
    '>': 'gt',
    '<': 'lt',
    '>=': 'gte',
    '<=': 'lte',
    is: 'is',
    any: 'any',
  };
  return mapping[op] ?? op;
}
