/**
 * Mock for react-select-filter-box used in tests.
 *
 * @module
 */
import React from 'react';

/** Mock expression type. */
interface MockExpression {
  field: string;
  operator: string;
  value: string | number | boolean;
}

/** Mock serialized expression type. */
interface MockSerializedExpression {
  field: string;
  operator: string;
  value: string | number | boolean;
}

/** Mock FilterBox props. */
interface MockFilterBoxProps {
  schema?: unknown;
  value?: MockExpression[];
  onChange?: (expressions: MockExpression[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Mock serialize function. */
export function serialize(expressions: MockExpression[]): MockSerializedExpression[] {
  return expressions.map(e => ({
    field: e.field,
    operator: e.operator,
    value: e.value,
  }));
}

/** Mock deserialize function. */
export function deserialize(
  serialized: MockSerializedExpression[],
  _schema?: unknown
): MockExpression[] {
  return serialized.map(s => ({
    field: s.field,
    operator: s.operator,
    value: s.value,
  }));
}

/** Mock FilterBox component. */
export const FilterBox = React.forwardRef(function MockFilterBox(
  { value = [], onChange, placeholder, disabled }: MockFilterBoxProps,
  _ref: React.Ref<unknown>
) {
  const [inputValue, setInputValue] = React.useState(
    value.map(e => `${e.field} ${e.operator} ${e.value}`).join(' AND ')
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (onChange && newValue) {
      const parts = newValue.split(/\s+/);
      if (parts.length >= 3) {
        onChange([
          {
            field: parts[0] ?? '',
            operator: parts[1] ?? '=',
            value: parts.slice(2).join(' '),
          },
        ]);
      }
    }
  };

  return (
    <div data-testid="filter-box">
      <input
        data-testid="filter-input"
        placeholder={placeholder}
        disabled={disabled}
        value={inputValue}
        onChange={handleInput}
      />
    </div>
  );
});

// Mock operator constants
export const STRING_OPERATORS = [
  { value: '=', label: 'equals' },
  { value: '!=', label: 'not equals' },
  { value: 'LIKE', label: 'contains' },
];

export const NUMBER_OPERATORS = [
  { value: '=', label: 'equals' },
  { value: '!=', label: 'not equals' },
  { value: '>', label: 'greater than' },
  { value: '<', label: 'less than' },
  { value: '>=', label: 'greater or equal' },
  { value: '<=', label: 'less or equal' },
];

export const DATE_OPERATORS = NUMBER_OPERATORS;

export const BOOLEAN_OPERATORS = [{ value: '=', label: 'equals' }];

export const ENUM_OPERATORS = [
  { value: '=', label: 'equals' },
  { value: '!=', label: 'not equals' },
];

export const ID_OPERATORS = [
  { value: '=', label: 'equals' },
  { value: '!=', label: 'not equals' },
];

export const DEFAULT_CONNECTORS = [{ value: 'AND', label: 'and' }];

/** Mock autocompleter type. */
type MockAutocompleter = (query: string, context?: unknown) => Promise<unknown[]>;

/** Mock autocompleter factory functions. */
export function createStaticAutocompleter(_values?: unknown[]): MockAutocompleter {
  return async () => [];
}

export function createEnumAutocompleter(
  _values?: { key: string; label: string }[],
  _options?: unknown
): MockAutocompleter {
  return async () => [];
}

export function createAsyncAutocompleter(
  _fetchFn?: unknown,
  _options?: unknown
): MockAutocompleter {
  return async () => [];
}

export function createNumberAutocompleter(_options?: unknown): MockAutocompleter {
  return async () => [];
}

export function createDateAutocompleter(_options?: unknown): MockAutocompleter {
  return async () => [];
}

export function createDateTimeAutocompleter(_options?: unknown): MockAutocompleter {
  return async () => [];
}

export function combineAutocompleters(
  _completers: unknown[]
): () => Promise<unknown[]> {
  return () => Promise.resolve([]);
}

export function mapAutocompleter(_completer: unknown): () => Promise<unknown[]> {
  return () => Promise.resolve([]);
}

export function withCache(_completer: unknown): () => Promise<unknown[]> {
  return () => Promise.resolve([]);
}

export function withDebounce(_completer: unknown): () => Promise<unknown[]> {
  return () => Promise.resolve([]);
}

export function withStaleWhileRevalidate(
  _completer: unknown
): () => Promise<unknown[]> {
  return () => Promise.resolve([]);
}

/** Mock schema utilities. */
export function createSchema(_fields: unknown): unknown {
  return { fields: {} };
}

export function defineSchema(_fields: unknown): unknown {
  return { fields: {} };
}

export function mergeSchemas(..._schemas: unknown[]): unknown {
  return { fields: {} };
}

export function pickFields(_schema: unknown, _fields: unknown[]): unknown {
  return { fields: {} };
}

export function omitFields(_schema: unknown, _fields: unknown[]): unknown {
  return { fields: {} };
}

export function extendSchema(_schema: unknown, _fields: unknown): unknown {
  return { fields: {} };
}

export function validateExpression(_expr: unknown): { isValid: boolean } {
  return { isValid: true };
}

export function validateExpressions(_exprs: unknown[]): { isValid: boolean } {
  return { isValid: true };
}

export function validateSchema(_schema: unknown): { isValid: boolean } {
  return { isValid: true };
}

export function toDisplayString(_exprs: unknown[]): string {
  return '';
}

export function toQueryString(_exprs: unknown[]): string {
  return '';
}

export function fromQueryString(_query: string): unknown[] {
  return [];
}

export function getDefaultOperators(_type: string): unknown[] {
  return [];
}

export default FilterBox;
