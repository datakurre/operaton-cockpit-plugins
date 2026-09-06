/**
 * Filter expression parsers for converting filter box expressions to API query parameters.
 *
 * These pure functions extract the filter parsing logic from plugin components
 * to enable unit testing and reuse.
 *
 * ## Filter Schema to API Parameter Mapping
 *
 * The FilterBox component uses `react-select-filter-box` which produces "legacy expressions"
 * in the format `{ category, operator, value }`. These parsers convert those expressions
 * to API query parameters.
 *
 * ### Activity Instance Query Mapping (definition-historic-activities)
 *
 * | Schema Field       | Operator | API Parameter              | Notes                              |
 * |--------------------|----------|----------------------------|------------------------------------|
 * | started            | after    | startedAfter               | Date with T00:00:00.000+0000 suffix|
 * | started            | before   | startedBefore              | Date with T00:00:00.000+0000 suffix|
 * | finished           | after    | finishedAfter              | Date with T00:00:00.000+0000 suffix|
 * | finished           | before   | finishedBefore             | Date with T00:00:00.000+0000 suffix|
 * | maxResults         | is/==    | maxResults                 | Integer                            |
 * | version            | ==       | processDefinitionVersion   | Process definition version number  |
 * | activityInstanceId | ==       | activityInstanceId         | Activity instance ID               |
 * | processInstanceId  | ==       | processInstanceId          | Process instance ID                |
 * | executionId        | ==       | executionId                | Execution ID                       |
 * | activityId         | ==       | activityId                 | BPMN element ID                    |
 * | activityName       | ==       | activityName               | Exact match                        |
 * | activityName       | like     | activityNameLike           | Pattern with % wildcards           |
 * | activityType       | ==       | activityType               | e.g., userTask, serviceTask        |
 * | taskAssignee       | ==       | taskAssignee               | Exact match                        |
 * | taskAssignee       | like     | taskAssigneeLike           | Pattern with % wildcards           |
 * | finishedOnly       | ==       | finished                   | Boolean (value=true)               |
 * | unfinishedOnly     | ==       | unfinished                 | Boolean (value=true)               |
 * | canceled           | ==       | canceled                   | Boolean (value=true)               |
 * | completeScope      | ==       | completeScope              | Boolean (value=true)               |
 * | tenantIdIn         | ==       | tenantIdIn                 | Comma-separated tenant IDs         |
 * | withoutTenantId    | ==       | withoutTenantId            | Boolean (value=true)               |
 *
 * ### Process Instance Query Mapping (instance-route-history)
 *
 * | Schema Field                  | Operator | API Parameter                  | Notes                    |
 * |-------------------------------|----------|--------------------------------|--------------------------|
 * | started                       | after    | startedAfter                   | Date with timezone       |
 * | started                       | before   | startedBefore                  | Date with timezone       |
 * | finished                      | after    | finishedAfter                  | Date with timezone       |
 * | finished                      | before   | finishedBefore                 | Date with timezone       |
 * | executedActivity              | after    | executedActivityAfter          | Date with timezone       |
 * | executedActivity              | before   | executedActivityBefore         | Date with timezone       |
 * | executedJob                   | after    | executedJobAfter               | Date with timezone       |
 * | executedJob                   | before   | executedJobBefore              | Date with timezone       |
 * | key                           | ==       | processInstanceBusinessKey     | Exact match              |
 * | key                           | like     | processInstanceBusinessKeyLike | Pattern                  |
 * | processInstanceBusinessKeyIn  | ==       | processInstanceBusinessKeyIn   | Comma-separated keys     |
 * | processDefinitionName         | ==       | processDefinitionName          | Exact match              |
 * | processDefinitionName         | like     | processDefinitionNameLike      | Pattern with % wildcards |
 * | variable                      | ==/like  | variables[]                    | name:value format        |
 * | version                       | any      | useAllVersions=true            | Client-side flag         |
 * | version                       | ==/</>   | versionFilter                  | Client-side filtering    |
 * | processInstanceId             | ==       | processInstanceId              | Exact match              |
 * | processInstanceIds            | ==       | processInstanceIds             | Comma-separated IDs      |
 * | rootProcessInstances          | ==       | rootProcessInstances           | Boolean (value=true)     |
 * | superProcessInstanceId        | ==       | superProcessInstanceId         | Parent instance ID       |
 * | subProcessInstanceId          | ==       | subProcessInstanceId           | Sub-process instance ID  |
 * | finishedOnly                  | ==       | finished                       | Boolean                  |
 * | unfinishedOnly                | ==       | unfinished                     | Boolean                  |
 * | active                        | ==       | active                         | Boolean                  |
 * | suspended                     | ==       | suspended                      | Boolean                  |
 * | completed                     | ==       | completed                      | Boolean                  |
 * | withIncidents                 | ==       | withIncidents                  | Boolean                  |
 * | withRootIncidents             | ==       | withRootIncidents              | Boolean                  |
 * | incidentType                  | ==       | incidentType                   | e.g., failedJob          |
 * | incidentStatus                | ==       | incidentStatus                 | e.g., open               |
 * | incidentMessage               | ==       | incidentMessage                | Exact match              |
 * | incidentMessage               | like     | incidentMessageLike            | Pattern with % wildcards |
 * | startedBy                     | ==       | startedBy                      | User ID                  |
 * | tenantIdIn                    | ==       | tenantIdIn                     | Comma-separated IDs      |
 * | withoutTenantId               | ==       | withoutTenantId                | Boolean (value=true)     |
 * | state                         | ==       | state                          | e.g., ACTIVE, COMPLETED  |
 * | executedActivityIdIn          | ==       | executedActivityIdIn           | Comma-separated IDs      |
 * | activeActivityIdIn            | ==       | activeActivityIdIn             | Comma-separated IDs      |
 *
 * ### Authorization Query Mapping (admin-route-authorization)
 *
 * | Schema Field   | Operator | API Parameter | Notes                     |
 * |----------------|----------|---------------|---------------------------|
 * | id             | ==       | id            | Authorization ID          |
 * | userIdIn       | ==       | userIdIn      | User ID                   |
 * | groupIdIn      | ==       | groupIdIn     | Group ID                  |
 * | resourceId     | ==       | resourceId    | Resource identifier       |
 * | resourceType   | ==       | resourceType  | Integer (0-21)            |
 * | type           | ==       | type          | 0=Global, 1=Grant, 2=Rev  |
 *
 * @module
 */

import type { LegacyExpression } from './filterSchema';

/**
 * API query parameters for historic activity instance queries.
 * Maps to the `/history/activity-instance` endpoint.
 */
export interface ActivityInstanceQueryParams {
  /** Filter activities started after this timestamp */
  startedAfter?: string;
  /** Filter activities started before this timestamp */
  startedBefore?: string;
  /** Filter activities finished before this timestamp */
  finishedBefore?: string;
  /** Filter activities finished after this timestamp */
  finishedAfter?: string;
  /** Maximum number of results to return */
  maxResults?: string;
  /** Filter by process definition version */
  processDefinitionVersion?: string;
  /** Filter by process definition ID */
  processDefinitionId?: string;
  /** Filter by activity instance ID */
  activityInstanceId?: string;
  /** Filter by process instance ID */
  processInstanceId?: string;
  /** Filter by execution ID */
  executionId?: string;
  /** Filter by activity ID (BPMN element ID) */
  activityId?: string;
  /** Filter by activity name (exact match) */
  activityName?: string;
  /** Filter by activity name pattern */
  activityNameLike?: string;
  /** Filter by activity type (e.g., userTask, serviceTask) */
  activityType?: string;
  /** Filter by task assignee */
  taskAssignee?: string;
  /** Filter by task assignee pattern */
  taskAssigneeLike?: string;
  /** Only include finished activities */
  finished?: boolean;
  /** Only include unfinished activities */
  unfinished?: boolean;
  /** Only include canceled activities */
  canceled?: boolean;
  /** Only include activities that completed a scope */
  completeScope?: boolean;
  /** Filter by tenant IDs */
  tenantIdIn?: string;
  /** Only include activities without a tenant ID */
  withoutTenantId?: boolean;
  /** Sort field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: string;
}

/**
 * Version filter configuration for process instance queries.
 */
export interface VersionFilter {
  /** Comparison operator */
  operator: 'eq' | 'lt' | 'lte' | 'gt' | 'gte';
  /** Version number to compare against */
  value: number;
}

/**
 * Variable filter for process instance queries.
 */
export interface VariableFilter {
  /** Variable name */
  name: string;
  /** Comparison operator */
  operator: string;
  /** Variable value */
  value: string;
}

/**
 * API query parameters for historic process instance queries.
 * Maps to the `/history/process-instance` endpoint.
 */
export interface ProcessInstanceQueryParams {
  /** Filter instances started after this timestamp */
  startedAfter?: string;
  /** Filter instances started before this timestamp */
  startedBefore?: string;
  /** Filter instances finished before this timestamp */
  finishedBefore?: string;
  /** Filter instances finished after this timestamp */
  finishedAfter?: string;
  /** Restrict to instances that executed an activity after the given date */
  executedActivityAfter?: string;
  /** Restrict to instances that executed an activity before the given date */
  executedActivityBefore?: string;
  /** Restrict to instances that executed a job after the given date */
  executedJobAfter?: string;
  /** Restrict to instances that executed a job before the given date */
  executedJobBefore?: string;
  /** Filter by business key (exact match) */
  processInstanceBusinessKey?: string;
  /** Filter by business key pattern */
  processInstanceBusinessKeyLike?: string;
  /** Filter by multiple business keys (comma-separated) */
  processInstanceBusinessKeyIn?: string;
  /** Filter by multiple instance IDs (comma-separated) */
  processInstanceIds?: string;
  /** Exclude by multiple instance IDs (comma-separated) */
  processInstanceIdNotIn?: string;
  /** Filter by process definition name */
  processDefinitionName?: string;
  /** Filter by process definition name pattern */
  processDefinitionNameLike?: string;
  /** Filter by process definition key */
  processDefinitionKey?: string;
  /** Filter by process definition key pattern */
  processDefinitionKeyLike?: string;
  /** Filter by multiple process definition keys (comma-separated) */
  processDefinitionKeyIn?: string;
  /** Exclude by multiple process definition keys (comma-separated) */
  processDefinitionKeyNotIn?: string;
  /** Filter by process definition ID */
  processDefinitionId?: string;
  /** Variable filters */
  variables?: VariableFilter[];
  /** Whether variable names should be case-insensitive */
  variableNamesIgnoreCase?: boolean;
  /** Whether variable values should be case-insensitive */
  variableValuesIgnoreCase?: boolean;
  /** When true, use processDefinitionKey instead of processDefinitionId */
  useAllVersions?: boolean;
  /** Client-side version filtering */
  versionFilter?: VersionFilter;
  /** Filter by specific instance ID */
  processInstanceId?: string;
  /** Only show top-level process instances */
  rootProcessInstances?: boolean;
  /** Filter by root process instance ID */
  rootProcessInstanceId?: string;
  /** Filter sub-processes of a parent instance */
  superProcessInstanceId?: string;
  /** Filter instances with a specific sub-process */
  subProcessInstanceId?: string;
  /** Only include finished instances */
  finished?: boolean;
  /** Only include unfinished instances */
  unfinished?: boolean;
  /** Only include active instances */
  active?: boolean;
  /** Only include suspended instances */
  suspended?: boolean;
  /** Only include completed instances */
  completed?: boolean;
  /** Only include externally terminated instances */
  externallyTerminated?: boolean;
  /** Only include internally terminated instances */
  internallyTerminated?: boolean;
  /** Only include instances with incidents */
  withIncidents?: boolean;
  /** Only include instances with root incidents */
  withRootIncidents?: boolean;
  /** Only include instances with retrying jobs */
  withJobsRetrying?: boolean;
  /** Filter by incident type */
  incidentType?: string;
  /** Filter by incident status */
  incidentStatus?: string;
  /** Filter by incident message (exact match) */
  incidentMessage?: string;
  /** Filter by incident message pattern */
  incidentMessageLike?: string;
  /** Filter by incident IDs (comma-separated) */
  incidentIdIn?: string;
  /** Filter by user who started the process */
  startedBy?: string;
  /** Filter by tenant IDs */
  tenantIdIn?: string;
  /** Only include instances without a tenant ID */
  withoutTenantId?: boolean;
  /** Filter by instance state */
  state?: string;
  /** Filter by executed activity IDs */
  executedActivityIdIn?: string;
  /** Filter by active activity IDs */
  activeActivityIdIn?: string;
  /** Filter by activity IDs (async/incident) */
  activityIdIn?: string;
}

/**
 * API query parameters for authorization queries.
 * Maps to the `/authorization` endpoint.
 */
export interface AuthorizationQueryParams {
  /** Filter by authorization ID */
  id?: string;
  /** Filter by user ID(s) */
  userIdIn?: string;
  /** Filter by group ID(s) */
  groupIdIn?: string;
  /** Filter by resource ID */
  resourceId?: string;
  /** Filter by resource type (integer) */
  resourceType?: string;
  /** Filter by authorization type (0=Global, 1=Grant, 2=Revoke) */
  type?: string;
}

/** Valid API parameters for authorization endpoint */
const VALID_AUTHORIZATION_PARAMS = ['id', 'userIdIn', 'groupIdIn', 'resourceId', 'resourceType', 'type'];

/** Time suffix for API date format */
const DATE_TIME_SUFFIX = 'T00:00:00.000+0000';

/**
 * Parse a date value and format for API if valid.
 * @param value - Date string value (can be ISO string or date-only format)
 * @returns Formatted date string or undefined if invalid
 */
function formatDateForApi(value: string): string | undefined {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return undefined;
  }
  // Extract just the date portion (YYYY-MM-DD) and append the time suffix
  const dateOnly = date.toISOString().split('T')[0] ?? '';
  return `${dateOnly}${DATE_TIME_SUFFIX}`;
}

/** Activity instance date field mappings: [category, operator] -> query key */
const ACTIVITY_DATE_FIELDS: Record<string, keyof ActivityInstanceQueryParams> = {
  'started:after': 'startedAfter',
  'started:before': 'startedBefore',
  'finished:before': 'finishedBefore',
  'finished:after': 'finishedAfter',
};

/** Activity instance string field mappings: [category, operator] -> query key */
const ACTIVITY_STRING_FIELDS: Record<string, keyof ActivityInstanceQueryParams> = {
  'activityInstanceId:==': 'activityInstanceId',
  'processInstanceId:==': 'processInstanceId',
  'processDefinitionId:==': 'processDefinitionId',
  'executionId:==': 'executionId',
  'activityId:==': 'activityId',
  'activityName:==': 'activityName',
  'activityName:like': 'activityNameLike',
  'activityType:==': 'activityType',
  'taskAssignee:==': 'taskAssignee',
  'taskAssignee:like': 'taskAssigneeLike',
  'tenantIdIn:==': 'tenantIdIn',
};

/** Activity instance boolean fields */
const ACTIVITY_BOOLEAN_FIELDS = new Set<string>([
  'finishedOnly',
  'unfinishedOnly',
  'canceled',
  'completeScope',
  'withoutTenantId',
]);

/** Map UI boolean field names to API field names */
const ACTIVITY_BOOLEAN_FIELD_MAP: Record<string, string> = {
  finishedOnly: 'finished',
  unfinishedOnly: 'unfinished',
};

/**
 * Parse filter expressions for activity instance queries.
 * Converts FilterBox expressions to API query parameters for `/history/activity-instance`.
 *
 * @param expressions - Array of filter expressions from FilterBox
 * @param defaultMaxResults - Default max results when not specified
 * @returns Query parameters for the history API
 */
export function parseActivityInstanceExpressions(
  expressions: LegacyExpression[],
  defaultMaxResults: number
): ActivityInstanceQueryParams {
  const query: ActivityInstanceQueryParams = {
    sortBy: 'endTime',
    sortOrder: 'desc',
    maxResults: String(defaultMaxResults),
  };

  for (const { category, operator, value } of expressions) {
    // Handle maxResults specially
    if (category === 'maxResults' && (operator === 'is' || operator === '==')) {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        query.maxResults = String(num);
      }
      continue;
    }

    // Handle version filter
    if (category === 'version' && (operator === 'is' || operator === '==')) {
      const versionNum = parseInt(value, 10);
      if (!isNaN(versionNum)) {
        query.processDefinitionVersion = String(versionNum);
      }
      continue;
    }

    // Date fields
    const dateKey = ACTIVITY_DATE_FIELDS[`${category}:${operator}`];
    if (dateKey !== undefined) {
      const dateValue = formatDateForApi(value);
      if (dateValue !== undefined) {
        (query as Record<string, string>)[dateKey] = dateValue;
      }
      continue;
    }

    // String fields (with like pattern wrapping)
    const stringKey = ACTIVITY_STRING_FIELDS[`${category}:${operator}`];
    if (stringKey !== undefined) {
      const val = operator === 'like' ? `%${value}%` : value;
      (query as Record<string, string>)[stringKey] = val;
      continue;
    }

    // Boolean fields
    if (ACTIVITY_BOOLEAN_FIELDS.has(category) && operator === '==' && value === 'true') {
      const apiFieldName = ACTIVITY_BOOLEAN_FIELD_MAP[category] ?? category;
      (query as Record<string, boolean>)[apiFieldName] = true;
    }
  }

  return query;
}

/** Process instance date field mappings: [category, operator] -> query key */
const PROCESS_DATE_FIELDS: Record<string, keyof ProcessInstanceQueryParams> = {
  'started:after': 'startedAfter',
  'started:before': 'startedBefore',
  'finished:before': 'finishedBefore',
  'finished:after': 'finishedAfter',
  'executedActivity:after': 'executedActivityAfter',
  'executedActivity:before': 'executedActivityBefore',
  'executedJob:after': 'executedJobAfter',
  'executedJob:before': 'executedJobBefore',
};

/** Process instance string field mappings: [category, operator] -> query key */
const PROCESS_STRING_FIELDS: Record<string, keyof ProcessInstanceQueryParams> = {
  'key:==': 'processInstanceBusinessKey',
  'key:like': 'processInstanceBusinessKeyLike',
  'processInstanceBusinessKeyIn:==': 'processInstanceBusinessKeyIn',
  'processInstanceBusinessKeyIn:like': 'processInstanceBusinessKeyLike',
  'processDefinitionName:==': 'processDefinitionName',
  'processDefinitionName:like': 'processDefinitionNameLike',
  'processDefinitionKey:==': 'processDefinitionKey',
  'processDefinitionKey:like': 'processDefinitionKeyLike',
  'processDefinitionKeyIn:==': 'processDefinitionKeyIn',
  'processDefinitionKeyNotIn:==': 'processDefinitionKeyNotIn',
  'processDefinitionId:==': 'processDefinitionId',
  'processInstanceId:==': 'processInstanceId',
  'processInstanceIds:==': 'processInstanceIds',
  'processInstanceIdNotIn:==': 'processInstanceIdNotIn',
  'rootProcessInstanceId:==': 'rootProcessInstanceId',
  'superProcessInstanceId:==': 'superProcessInstanceId',
  'subProcessInstanceId:==': 'subProcessInstanceId',
  'incidentType:==': 'incidentType',
  'incidentStatus:==': 'incidentStatus',
  'incidentMessage:==': 'incidentMessage',
  'incidentMessage:like': 'incidentMessageLike',
  'incidentIdIn:==': 'incidentIdIn',
  'startedBy:==': 'startedBy',
  'tenantIdIn:==': 'tenantIdIn',
  'state:==': 'state',
  'executedActivityIdIn:==': 'executedActivityIdIn',
  'activeActivityIdIn:==': 'activeActivityIdIn',
};

/** Process instance boolean fields */
const PROCESS_BOOLEAN_FIELDS = new Set<string>([
  'rootProcessInstances',
  'finishedOnly',
  'unfinishedOnly',
  'active',
  'suspended',
  'completed',
  'externallyTerminated',
  'internallyTerminated',
  'withIncidents',
  'withRootIncidents',
  'withJobsRetrying',
  'withoutTenantId',
]);

/** Map UI boolean field names to API field names */
const PROCESS_BOOLEAN_FIELD_MAP: Record<string, string> = {
  finishedOnly: 'finished',
  unfinishedOnly: 'unfinished',
};

/**
 * Parse variable filter expression.
 * @param variables - Array to add variable filter to
 * @param query - Query object for case sensitivity flags
 * @param operator - Filter operator
 * @param value - Filter value in "name:value" format
 */
function parseVariableFilter(
  variables: VariableFilter[],
  query: ProcessInstanceQueryParams,
  operator: string,
  value: string
): void {
  const colonIndex = value.indexOf(':');
  if (colonIndex <= 0) {
    return;
  }

  const varName = value.substring(0, colonIndex);
  const varValue = value.substring(colonIndex + 1);
  const opType = operator === 'like' || operator === 'ilike' ? 'like' : 'eq';

  variables.push({
    name: varName,
    operator: opType,
    value: varValue,
  });

  if (operator === 'ilike') {
    query.variableNamesIgnoreCase = true;
    query.variableValuesIgnoreCase = true;
  }
}

/** Map operator strings to version filter operators */
const VERSION_OPERATOR_MAP: Record<string, 'eq' | 'lt' | 'lte' | 'gt' | 'gte'> = {
  '==': 'eq',
  '<': 'lt',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
};

/**
 * Parse version filter expression.
 * @param query - Query object to populate
 * @param operator - Filter operator
 * @param value - Version value
 */
function parseVersionFilter(query: ProcessInstanceQueryParams, operator: string, value: string): void {
  if (operator === 'any') {
    query.useAllVersions = true;
    return;
  }

  const versionNum = parseInt(value, 10);
  if (isNaN(versionNum)) {
    return;
  }

  query.useAllVersions = true;
  const filterOp = VERSION_OPERATOR_MAP[operator];
  if (filterOp !== undefined) {
    query.versionFilter = { operator: filterOp, value: versionNum };
  }
}

/** Fields that need % wrapping for like operator */
const FIELDS_NEEDING_LIKE_WRAP = new Set<string>([
  'processDefinitionName',
  'processDefinitionKey',
  'incidentMessage',
  'processInstanceBusinessKeyIn',
]);

/**
 * Known process instance filter field names.
 * Used to detect freeform (variable) fields vs predefined fields.
 */
const KNOWN_PROCESS_FIELDS = new Set<string>([
  'started',
  'finished',
  'executedActivity',
  'executedJob',
  'processInstanceId',
  'processInstanceIds',
  'processInstanceIdNotIn',
  'key',
  'processInstanceBusinessKeyIn',
  'processDefinitionName',
  'processDefinitionKey',
  'processDefinitionKeyIn',
  'processDefinitionKeyNotIn',
  'processDefinitionId',
  'rootProcessInstances',
  'rootProcessInstanceId',
  'superProcessInstanceId',
  'subProcessInstanceId',
  'variable',
  'version',
  'finishedOnly',
  'unfinishedOnly',
  'active',
  'suspended',
  'completed',
  'externallyTerminated',
  'internallyTerminated',
  'withIncidents',
  'withRootIncidents',
  'withJobsRetrying',
  'incidentType',
  'incidentStatus',
  'incidentMessage',
  'incidentIdIn',
  'executedActivityIdIn',
  'activeActivityIdIn',
  'startedBy',
  'tenantIdIn',
  'withoutTenantId',
  'state',
]);

/**
 * Parse filter expressions for process instance queries.
 * Converts FilterBox expressions to API query parameters for `/history/process-instance`.
 *
 * @param expressions - Array of filter expressions from FilterBox
 * @returns Query parameters for the history API
 */
export function parseProcessInstanceExpressions(expressions: LegacyExpression[]): ProcessInstanceQueryParams {
  const query: ProcessInstanceQueryParams = {};
  const variables: VariableFilter[] = [];

  for (const { category, operator, value } of expressions) {
    // Handle special cases first
    if (category === 'variable') {
      parseVariableFilter(variables, query, operator, value);
      continue;
    }
    if (category === 'version') {
      parseVersionFilter(query, operator, value);
      continue;
    }

    // Date fields
    const dateKey = PROCESS_DATE_FIELDS[`${category}:${operator}`];
    if (dateKey !== undefined) {
      const dateValue = formatDateForApi(value);
      if (dateValue !== undefined) {
        (query as Record<string, string>)[dateKey] = dateValue;
      }
      continue;
    }

    // String fields (with like pattern wrapping for some fields)
    const stringKey = PROCESS_STRING_FIELDS[`${category}:${operator}`];
    if (stringKey !== undefined) {
      const shouldWrap = operator === 'like' && FIELDS_NEEDING_LIKE_WRAP.has(category);
      (query as Record<string, string>)[stringKey] = shouldWrap ? `%${value}%` : value;
      continue;
    }

    // Boolean fields
    if (PROCESS_BOOLEAN_FIELDS.has(category) && operator === '==' && value === 'true') {
      const apiFieldName = PROCESS_BOOLEAN_FIELD_MAP[category] ?? category;
      (query as Record<string, boolean>)[apiFieldName] = true;
      continue;
    }

    // Freeform fields (variables) - any field not in the known set
    if (!KNOWN_PROCESS_FIELDS.has(category)) {
      const opType = operator === 'like' || operator === 'ilike' ? 'like' : 'eq';
      variables.push({
        name: category,
        operator: opType,
        value,
      });

      if (operator === 'ilike') {
        query.variableNamesIgnoreCase = true;
        query.variableValuesIgnoreCase = true;
      }
    }
  }

  if (variables.length > 0) {
    query.variables = variables;
  }

  return query;
}

/**
 * Parse filter expressions for authorization queries.
 * Converts FilterBox expressions to API query parameters for `/authorization`.
 *
 * @param expressions - Array of filter expressions from FilterBox
 * @returns Query parameters for the authorization API as a string record
 */
export function parseAuthorizationExpressions(expressions: LegacyExpression[]): Record<string, string> {
  const params: Record<string, string> = {};

  for (const expr of expressions) {
    const category = expr.category;
    const value = expr.value;

    if (!value || !category || !VALID_AUTHORIZATION_PARAMS.includes(category)) {
      continue;
    }

    // Category names match API params directly
    params[category] = value;
  }

  return params;
}

/**
 * Convert ActivityInstanceQueryParams to a flat record for API request.
 * Filters out undefined values and converts booleans to strings.
 *
 * @param params - Parsed query parameters
 * @returns Flattened record suitable for API request
 */
export function activityInstanceQueryToRecord(params: ActivityInstanceQueryParams): Record<string, string | null> {
  const result: Record<string, string | null> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }
    if (typeof value === 'boolean') {
      result[key] = String(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Filter conflict definition.
 * Describes a pair of mutually exclusive filter fields.
 */
export interface FilterConflict {
  /** First field in the conflict pair */
  field1: string;
  /** Second field in the conflict pair */
  field2: string;
  /** Human-readable reason for the conflict */
  reason: string;
}

/**
 * Conflicts for activity instance query filters.
 * These field pairs should not be combined.
 */
export const ACTIVITY_FILTER_CONFLICTS: FilterConflict[] = [
  {
    field1: 'finishedOnly',
    field2: 'unfinishedOnly',
    reason: 'Cannot filter for both finished and unfinished activities',
  },
  {
    field1: 'tenantIdIn',
    field2: 'withoutTenantId',
    reason: 'Cannot filter for specific tenants and no tenant at the same time',
  },
];

/**
 * Conflicts for process instance query filters.
 * These field pairs should not be combined.
 */
export const PROCESS_FILTER_CONFLICTS: FilterConflict[] = [
  {
    field1: 'finishedOnly',
    field2: 'unfinishedOnly',
    reason: 'Cannot filter for both finished and unfinished instances',
  },
  { field1: 'active', field2: 'completed', reason: 'Active and completed are mutually exclusive states' },
  {
    field1: 'active',
    field2: 'externallyTerminated',
    reason: 'Active and externally terminated are mutually exclusive states',
  },
  {
    field1: 'active',
    field2: 'internallyTerminated',
    reason: 'Active and internally terminated are mutually exclusive states',
  },
  { field1: 'suspended', field2: 'active', reason: 'Suspended and active are mutually exclusive states' },
  {
    field1: 'tenantIdIn',
    field2: 'withoutTenantId',
    reason: 'Cannot filter for specific tenants and no tenant at the same time',
  },
];

/**
 * Validate filter expressions for conflicts.
 * Returns an array of conflicts found in the given expressions.
 *
 * @param expressions - Array of legacy filter expressions to validate
 * @param conflicts - Array of conflict definitions to check against
 * @returns Array of detected conflicts (empty if no conflicts)
 */
export function validateFilterConflicts(
  expressions: LegacyExpression[],
  conflicts: FilterConflict[]
): FilterConflict[] {
  // Only count filters that are actively enabled (value='true' for booleans or any value for other fields)
  const activeFields = new Set(
    expressions
      .filter(e => {
        // Boolean fields are only active when value is 'true'
        if (e.value === 'false') {
          return false;
        }
        // Other fields are active when they have any filter applied
        return e.operator === '==' || e.operator === 'is' || e.operator === 'eq';
      })
      .map(e => e.category)
  );

  const detected: FilterConflict[] = [];

  for (const conflict of conflicts) {
    if (activeFields.has(conflict.field1) && activeFields.has(conflict.field2)) {
      detected.push(conflict);
    }
  }

  return detected;
}

/**
 * Get default activity instance query with date range.
 * Returns a query for the past week with results ordered by end time.
 *
 * @param maxResults - Maximum number of results
 * @returns Default query parameters
 */
export function getDefaultActivityInstanceQuery(maxResults: number): Record<string, string | null> {
  const MS_PER_SECOND = 1000;
  const SECONDS_PER_HOUR = 3600;
  const HOURS_PER_DAY = 24;
  const DAYS_PER_WEEK = 7;

  const weekAgoMs = MS_PER_SECOND * SECONDS_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
  const weekAgo = new Date(Date.now() - weekAgoMs).toISOString().split('T')[0] ?? '';

  // No finishedBefore: the engine reads it as "must have a finish time", so it drops
  // every activity still running and leaves the statistics blind to work in progress.
  // startedAfter already bounds the query.
  return {
    sortBy: 'endTime',
    sortOrder: 'desc',
    startedAfter: `${weekAgo}T00:00:00.000+0000`,
    maxResults: String(maxResults),
  };
}
