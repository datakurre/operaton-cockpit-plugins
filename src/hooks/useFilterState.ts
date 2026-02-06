/**
 * Custom hook for managing filter state with legacy expression support.
 *
 * Provides state management for FilterBox expressions, query parameter building,
 * and URL/localStorage persistence.
 *
 * @module
 */
import { useState, useCallback, useMemo } from 'react';

import type { LegacyExpression } from '../utils/filterSchema';
import { formatDateForApi } from '../utils/formatting';

/**
 * Filter state returned by useFilterState hook.
 */
export interface FilterState {
  /** Current filter expressions in legacy format */
  expressions: LegacyExpression[];
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Number of active filters */
  filterCount: number;
}

/**
 * Filter actions returned by useFilterState hook.
 */
export interface FilterActions {
  /** Set filter expressions */
  setExpressions: (expressions: LegacyExpression[]) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Add a single filter expression */
  addFilter: (category: string, operator: string, value: string) => void;
  /** Remove filters by category */
  removeFiltersByCategory: (category: string) => void;
}

/**
 * Query parameter builder result for API requests.
 */
export interface FilterQueryParams {
  /** Date filter: started after */
  startedAfter?: string;
  /** Date filter: finished before */
  finishedBefore?: string;
  /** Max results limit */
  maxResults?: number;
  /** Activity ID filter */
  activityId?: string;
  /** Activity name filter */
  activityName?: string;
  /** Activity name like filter */
  activityNameLike?: string;
  /** Activity type filter */
  activityType?: string;
  /** Task assignee filter */
  taskAssignee?: string;
  /** Task assignee like filter */
  taskAssigneeLike?: string;
  /** Finished only flag */
  finished?: boolean;
  /** Unfinished only flag */
  unfinished?: boolean;
  /** Canceled only flag */
  canceled?: boolean;
  /** Tenant ID filter */
  tenantIdIn?: string[];
  /** Process instance ID filter */
  processInstanceId?: string;
  /** Process instance business key */
  processInstanceBusinessKey?: string;
  /** Process instance business key like */
  processInstanceBusinessKeyLike?: string;
  /** With incidents flag */
  withIncidents?: boolean;
  /** Incident type filter */
  incidentType?: string;
  /** Incident status filter */
  incidentStatus?: string;
  /** Started by user filter */
  startedBy?: string;
  /** Process instance state filter */
  state?: string;
  /** Executed activity IDs filter */
  executedActivityIdIn?: string[];
  /** Active activity IDs filter */
  activeActivityIdIn?: string[];
  /** Variable filters */
  variables?: { name: string; value: string; operator: string }[];
}

/**
 * Options for useFilterState hook.
 */
export interface UseFilterStateOptions {
  /** Initial filter expressions */
  initialExpressions?: LegacyExpression[];
  /** Callback when expressions change */
  onFilterChange?: (expressions: LegacyExpression[]) => void;
}

/**
 * Process date filter expressions.
 */
function processDateFilter(params: FilterQueryParams, category: string, operator: string, value: string): void {
  if (category === 'started' && operator === 'after') {
    params.startedAfter = formatDateForApi(value);
  } else if (category === 'finished' && operator === 'before') {
    params.finishedBefore = formatDateForApi(value);
  }
}

/**
 * Process boolean filter expressions.
 */
function processBooleanFilter(params: FilterQueryParams, category: string, operator: string, value: string): void {
  const isTrue = value.toLowerCase() === 'true';
  const isBoolOp = operator === '==' || operator === 'is';

  if (category === 'finishedOnly' && isBoolOp) {
    params.finished = isTrue;
  } else if (category === 'unfinishedOnly') {
    params.unfinished = isTrue;
  } else if (category === 'canceled') {
    params.canceled = isTrue;
  } else if (category === 'withIncidents') {
    params.withIncidents = isTrue;
  }
}

/** String fields that support exact-match only. */
const EXACT_ONLY_FIELDS: Record<string, keyof FilterQueryParams> = {
  activityId: 'activityId',
  activityType: 'activityType',
  processInstanceId: 'processInstanceId',
  incidentType: 'incidentType',
  incidentStatus: 'incidentStatus',
  startedBy: 'startedBy',
  state: 'state',
};

/** String fields that support both exact and like matching. */
const LIKE_FIELDS: Record<string, { exact: keyof FilterQueryParams; like: keyof FilterQueryParams }> = {
  activityName: { exact: 'activityName', like: 'activityNameLike' },
  taskAssignee: { exact: 'taskAssignee', like: 'taskAssigneeLike' },
  key: { exact: 'processInstanceBusinessKey', like: 'processInstanceBusinessKeyLike' },
};

/**
 * Process string filter expressions.
 */
function processStringFilter(params: FilterQueryParams, category: string, operator: string, value: string): void {
  const isLike = operator === 'like';

  // Check exact-only fields first
  const exactField = EXACT_ONLY_FIELDS[category];
  if (exactField !== undefined) {
    (params as Record<string, string>)[exactField] = value;
    return;
  }

  // Check fields that support like matching
  const likeFieldDef = LIKE_FIELDS[category];
  if (likeFieldDef !== undefined) {
    const fieldName = isLike ? likeFieldDef.like : likeFieldDef.exact;
    const fieldValue = isLike ? `%${value}%` : value;
    (params as Record<string, string>)[fieldName] = fieldValue;
  }
}

/**
 * Process array filter expressions.
 */
function processArrayFilter(params: FilterQueryParams, category: string, value: string): void {
  switch (category) {
    case 'tenantIdIn':
      params.tenantIdIn ??= [];
      params.tenantIdIn.push(value);
      break;
    case 'executedActivityIdIn':
      params.executedActivityIdIn ??= [];
      params.executedActivityIdIn.push(value);
      break;
    case 'activeActivityIdIn':
      params.activeActivityIdIn ??= [];
      params.activeActivityIdIn.push(value);
      break;
    default:
      break;
  }
}

/**
 * Build query parameters from legacy expressions.
 *
 * @param expressions - Legacy filter expressions
 * @returns Query parameters for API request
 */
export function buildQueryParams(expressions: LegacyExpression[]): FilterQueryParams {
  const params: FilterQueryParams = {};
  const variables: { name: string; value: string; operator: string }[] = [];

  for (const expr of expressions) {
    const { category, operator, value } = expr;

    // Date filters
    processDateFilter(params, category, operator, value);

    // Boolean filters
    processBooleanFilter(params, category, operator, value);

    // String filters
    processStringFilter(params, category, operator, value);

    // Array filters
    processArrayFilter(params, category, value);

    // Special cases
    if (category === 'maxResults') {
      params.maxResults = parseInt(value, 10);
    }

    // Variable filters
    if (category === 'variable') {
      const colonIndex = value.indexOf(':');
      if (colonIndex > 0) {
        const varName = value.substring(0, colonIndex);
        const varValue = value.substring(colonIndex + 1);
        variables.push({ name: varName, value: varValue, operator });
      }
    }
  }

  if (variables.length > 0) {
    params.variables = variables;
  }

  return params;
}

/**
 * Custom hook for managing filter state.
 *
 * @param options - Filter state options
 * @returns Filter state and actions
 *
 * @example
 * ```tsx
 * const { state, actions, queryParams } = useFilterState({
 *   onFilterChange: (expressions) => {
 *     console.log('Filters changed:', expressions);
 *   },
 * });
 *
 * return (
 *   <FilterBox
 *     schema={filterSchema}
 *     onLegacyFilterChange={actions.setExpressions}
 *   />
 * );
 * ```
 */
export function useFilterState(options: UseFilterStateOptions = {}): {
  state: FilterState;
  actions: FilterActions;
  queryParams: FilterQueryParams;
} {
  const { initialExpressions = [], onFilterChange } = options;

  const [expressions, setExpressionsState] = useState<LegacyExpression[]>(initialExpressions);

  const setExpressions = useCallback(
    (newExpressions: LegacyExpression[]) => {
      setExpressionsState(newExpressions);
      onFilterChange?.(newExpressions);
    },
    [onFilterChange]
  );

  const clearFilters = useCallback(() => {
    setExpressions([]);
  }, [setExpressions]);

  const addFilter = useCallback(
    (category: string, operator: string, value: string) => {
      const newExpression: LegacyExpression = { category, operator, value };
      setExpressions([...expressions, newExpression]);
    },
    [expressions, setExpressions]
  );

  const removeFiltersByCategory = useCallback(
    (category: string) => {
      setExpressions(expressions.filter(e => e.category !== category));
    },
    [expressions, setExpressions]
  );

  const hasActiveFilters = expressions.length > 0;
  const filterCount = expressions.length;

  const queryParams = useMemo(() => buildQueryParams(expressions), [expressions]);

  const state: FilterState = {
    expressions,
    hasActiveFilters,
    filterCount,
  };

  const actions: FilterActions = {
    setExpressions,
    clearFilters,
    addFilter,
    removeFiltersByCategory,
  };

  return { state, actions, queryParams };
}

export default useFilterState;
