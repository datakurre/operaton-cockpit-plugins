import { GridDataAutoCompleteHandler } from '@waylay/react-filter-box';

/**
 * Filter option configuration (matches react-filter-box Option interface)
 */
interface FilterOption {
  columnField: string;
  columnText?: string;
  type: string;
  customOperatorFunc?: (category: string) => string[];
  customValuesFunc?: (category: string, operator: string) => string[];
}

/**
 * Operator configuration for a filter category
 */
interface OperatorConfig {
  /** Operators available for this category */
  operators: string[];
  /** Whether to return a date picker for this operator */
  isDate?: boolean;
}

/**
 * Configuration for FilterAutoCompleteHandler
 */
export interface FilterAutoCompleteConfig {
  /** Map of category names to their operator configurations */
  categoryOperators: Record<string, OperatorConfig>;
  /** Categories that should be filtered out once used in query */
  singleUseCategories?: string[];
  /** Default operators for categories not explicitly configured */
  defaultOperators?: string[];
  /** Whether to accept any category (for variable name queries) */
  acceptAnyCategory?: boolean;
}

/**
 * Configurable autocomplete handler for filter boxes.
 *
 * This class provides a reusable autocomplete handler that can be configured
 * for different use cases (process definitions, process instances, etc.)
 *
 * @example
 * ```tsx
 * const config: FilterAutoCompleteConfig = {
 *   categoryOperators: {
 *     started: { operators: ['after'], isDate: true },
 *     finished: { operators: ['before'], isDate: true },
 *   },
 *   singleUseCategories: ['started', 'finished'],
 * };
 * const handler = new FilterAutoCompleteHandler(data, options, config);
 * ```
 */
export class FilterAutoCompleteHandler extends GridDataAutoCompleteHandler {
  private currentQuery = '';
  private config: FilterAutoCompleteConfig;

  /**
   * Creates a new FilterAutoCompleteHandler.
   * @param data - Data array for grid filtering (passed to parent)
   * @param options - Filter option configuration
   * @param config - Handler configuration for operators and categories
   */
  constructor(data: Record<string, unknown>[], options: FilterOption[], config: FilterAutoCompleteConfig) {
    super(data, options);
    this.config = config;
  }

  /**
   * Update the current query string for context-aware suggestions
   * @param query - The current filter query text
   */
  setQuery(query: string): void {
    this.currentQuery = query;
  }

  /**
   * Override to accept any category when configured
   */
  hasCategory(_category: string): boolean {
    if (this.config.acceptAnyCategory) {
      return true;
    }
    return super.hasCategory(_category);
  }

  /**
   * Returns available categories, filtering out single-use ones already in query
   */
  needCategories(): string[] {
    const categories = super.needCategories();
    const singleUse = this.config.singleUseCategories ?? [];

    return categories.filter((value: string) => {
      // Filter out single-use categories that are already in the query
      if (singleUse.includes(value) && this.currentQuery.includes(value)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Returns operators for a given category
   * @param parsedCategory - The category being queried
   */
  needOperators(parsedCategory: string): string[] {
    const categoryConfig = this.config.categoryOperators[parsedCategory];
    if (categoryConfig) {
      return categoryConfig.operators;
    }
    return this.config.defaultOperators ?? [];
  }

  /**
   * Returns values/suggestions for a given category and operator
   * @param parsedCategory - The category being queried
   * @param parsedOperator - The operator being used
   */
  needValues(parsedCategory: string, parsedOperator: string): unknown[] {
    const categoryConfig = this.config.categoryOperators[parsedCategory];

    // Check if this operator should show a date picker
    if (categoryConfig?.isDate) {
      if (categoryConfig.operators.includes(parsedOperator)) {
        return [{ customType: 'date' }];
      }
    }

    // Check common date operators
    if (parsedOperator === 'after' || parsedOperator === 'before') {
      return [{ customType: 'date' }];
    }

    return super.needValues(parsedCategory, parsedOperator);
  }
}

/**
 * Pre-configured handler for process definition filters
 */
export function createDefinitionFilterHandler(
  data: Record<string, unknown>[],
  options: FilterOption[]
): FilterAutoCompleteHandler {
  const config: FilterAutoCompleteConfig = {
    categoryOperators: {
      started: { operators: ['after'], isDate: true },
      finished: { operators: ['before'], isDate: true },
      maxResults: { operators: ['is'] },
    },
    singleUseCategories: ['started', 'finished', 'maxResults'],
  };
  return new FilterAutoCompleteHandler(data, options, config);
}

/**
 * Pre-configured handler for process instance query filters
 */
export function createInstanceQueryHandler(
  data: Record<string, unknown>[],
  options: FilterOption[]
): FilterAutoCompleteHandler {
  const config: FilterAutoCompleteConfig = {
    categoryOperators: {
      started: { operators: ['after'], isDate: true },
      finished: { operators: ['before'], isDate: true },
      key: { operators: ['==', 'like'] },
      variable: { operators: ['==', 'like', 'ilike'] },
    },
    singleUseCategories: ['started', 'finished'],
    defaultOperators: ['==', 'like', 'ilike'],
  };
  return new FilterAutoCompleteHandler(data, options, config);
}
