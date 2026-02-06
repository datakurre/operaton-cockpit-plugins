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
  createDateAutocompleter,
  createEnumAutocompleter,
} from 'react-select-filter-box';

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
 * Create a date field configuration with date autocompleter.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
export function createDateField(
  key: string,
  label: string,
  operators: OperatorConfig[]
): FieldConfig {
  return {
    key,
    label,
    type: 'date',
    operators,
    allowMultiple: false,
    valueAutocompleter: createDateAutocompleter(),
  };
}

/**
 * Create a string field configuration.
 * @param key - Field key
 * @param label - Display label
 * @param operators - Operators for this field
 * @returns Field configuration
 */
export function createStringField(
  key: string,
  label: string,
  operators: OperatorConfig[]
): FieldConfig {
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
export function createNumberField(
  key: string,
  label: string,
  operators: OperatorConfig[]
): FieldConfig {
  return {
    key,
    label,
    type: 'number',
    operators,
    allowMultiple: false,
  };
}

/**
 * Create a filter schema for process definition statistics.
 * @returns Filter schema for definition filters
 */
export function createDefinitionFilterSchema(): FilterSchema {
  return {
    fields: [
      createDateField('started', 'Started', [OPERATORS.after]),
      createDateField('finished', 'Finished', [OPERATORS.before]),
      createNumberField('maxResults', 'Max Results', [OPERATORS.is]),
    ],
  };
}

/**
 * Create a filter schema for process instance history queries.
 * @returns Filter schema for instance filters
 */
export function createInstanceQuerySchema(): FilterSchema {
  return {
    fields: [
      createDateField('started', 'Started', [OPERATORS.after]),
      createDateField('finished', 'Finished', [OPERATORS.before]),
      createStringField('key', 'Process Key', [OPERATORS.eq, OPERATORS.like]),
      createStringField('variable', 'Variable', [OPERATORS.eq, OPERATORS.like, OPERATORS.ilike]),
      {
        key: 'version',
        label: 'Version',
        type: 'number',
        operators: [OPERATORS.any, OPERATORS.eq, OPERATORS.lt, OPERATORS.gt, OPERATORS.lte, OPERATORS.gte],
        allowMultiple: false,
      },
    ],
  };
}

/**
 * Create a filter schema for authorization filters.
 * Field names match Operaton REST API query parameters directly.
 * @returns Filter schema for authorization filters
 */
export function createAuthorizationFilterSchema(): FilterSchema {
  return {
    fields: [
      createStringField('id', 'ID', [OPERATORS.eq]),
      createStringField('userIdIn', 'User ID', [OPERATORS.eq]),
      createStringField('groupIdIn', 'Group ID', [OPERATORS.eq]),
      createStringField('resourceId', 'Resource ID', [OPERATORS.eq]),
      createEnumField('type', 'Type', [OPERATORS.eq], [
        { key: '0', label: 'Global' },
        { key: '1', label: 'Grant' },
        { key: '2', label: 'Revoke' },
      ]),
    ],
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
        conditionType: (expr.connector ?? 'AND'),
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
export function fromLegacyExpressions(
  expressions: LegacyExpression[],
  schema: FilterSchema
): FilterExpression[] {
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
