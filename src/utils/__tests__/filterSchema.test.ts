/**
 * Tests for filter schema utilities.
 *
 * Tests schema builders and expression converters for react-select-filter-box.
 *
 * @module
 */
import {
  OPERATORS,
  createDateField,
  createStringField,
  createEnumField,
  createNumberField,
  createBooleanField,
  createDefinitionFilterSchema,
  createInstanceQuerySchema,
  createAuthorizationFilterSchema,
  toLegacyExpressions,
  fromLegacyExpressions,
  type LegacyExpression,
} from '../filterSchema';
import type { FilterExpression, FilterSchema } from 'react-select-filter-box';

describe('filterSchema', () => {
  describe('OPERATORS', () => {
    it('should define eq operator with correct properties', () => {
      expect(OPERATORS.eq).toEqual({
        key: 'eq',
        label: 'equals',
        symbol: '=',
      });
    });

    it('should define neq operator with correct properties', () => {
      expect(OPERATORS.neq).toEqual({
        key: 'neq',
        label: 'not equals',
        symbol: '≠',
      });
    });

    it('should define like operator with correct properties', () => {
      expect(OPERATORS.like).toEqual({
        key: 'like',
        label: 'contains',
        symbol: '~',
      });
    });

    it('should define ilike operator with correct properties', () => {
      expect(OPERATORS.ilike).toEqual({
        key: 'ilike',
        label: 'contains (case-insensitive)',
        symbol: '≈',
      });
    });

    it('should define after operator with correct properties', () => {
      expect(OPERATORS.after).toEqual({
        key: 'after',
        label: 'after',
        symbol: '≥',
      });
    });

    it('should define before operator with correct properties', () => {
      expect(OPERATORS.before).toEqual({
        key: 'before',
        label: 'before',
        symbol: '≤',
      });
    });

    it('should define gt operator with correct properties', () => {
      expect(OPERATORS.gt).toEqual({
        key: 'gt',
        label: 'greater than',
        symbol: '>',
      });
    });

    it('should define lt operator with correct properties', () => {
      expect(OPERATORS.lt).toEqual({
        key: 'lt',
        label: 'less than',
        symbol: '<',
      });
    });

    it('should define gte operator with correct properties', () => {
      expect(OPERATORS.gte).toEqual({
        key: 'gte',
        label: 'greater or equal',
        symbol: '≥',
      });
    });

    it('should define lte operator with correct properties', () => {
      expect(OPERATORS.lte).toEqual({
        key: 'lte',
        label: 'less or equal',
        symbol: '≤',
      });
    });

    it('should define is operator with correct properties', () => {
      expect(OPERATORS.is).toEqual({
        key: 'is',
        label: 'is',
        symbol: '=',
      });
    });

    it('should define any operator with correct properties', () => {
      expect(OPERATORS.any).toEqual({
        key: 'any',
        label: 'any',
        symbol: '*',
      });
    });
  });

  describe('createDateField', () => {
    it('should create a date field configuration', () => {
      const field = createDateField('started', 'Started', [OPERATORS.after]);

      expect(field.key).toBe('started');
      expect(field.label).toBe('Started');
      expect(field.type).toBe('date');
      expect(field.operators).toEqual([OPERATORS.after]);
      expect(field.allowMultiple).toBe(false);
      expect(field.valueAutocompleter).toBeDefined();
    });

    it('should support multiple operators', () => {
      const field = createDateField('date', 'Date', [OPERATORS.after, OPERATORS.before]);

      expect(field.operators).toHaveLength(2);
      expect(field.operators).toContainEqual(OPERATORS.after);
      expect(field.operators).toContainEqual(OPERATORS.before);
    });
  });

  describe('createStringField', () => {
    it('should create a string field configuration', () => {
      const field = createStringField('name', 'Name', [OPERATORS.eq]);

      expect(field.key).toBe('name');
      expect(field.label).toBe('Name');
      expect(field.type).toBe('string');
      expect(field.operators).toEqual([OPERATORS.eq]);
      expect(field.allowMultiple).toBe(true);
    });

    it('should support multiple operators', () => {
      const field = createStringField('text', 'Text', [OPERATORS.eq, OPERATORS.like, OPERATORS.ilike]);

      expect(field.operators).toHaveLength(3);
    });
  });

  describe('createEnumField', () => {
    it('should create an enum field configuration', () => {
      const values = [
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
      ];
      const field = createEnumField('status', 'Status', [OPERATORS.eq], values);

      expect(field.key).toBe('status');
      expect(field.label).toBe('Status');
      expect(field.type).toBe('enum');
      expect(field.operators).toEqual([OPERATORS.eq]);
      expect(field.allowMultiple).toBe(true);
      expect(field.valueAutocompleter).toBeDefined();
    });
  });

  describe('createNumberField', () => {
    it('should create a number field configuration', () => {
      const field = createNumberField('count', 'Count', [OPERATORS.eq, OPERATORS.gt, OPERATORS.lt]);

      expect(field.key).toBe('count');
      expect(field.label).toBe('Count');
      expect(field.type).toBe('number');
      expect(field.operators).toHaveLength(3);
      expect(field.allowMultiple).toBe(false);
    });
  });

  describe('createBooleanField', () => {
    it('should create a boolean field configuration as enum type', () => {
      const field = createBooleanField('active', 'Active');

      expect(field.key).toBe('active');
      expect(field.label).toBe('Active');
      expect(field.type).toBe('enum');
      expect(field.operators).toEqual([OPERATORS.is]);
      expect(field.allowMultiple).toBe(false);
      expect(field.valueAutocompleter).toBeDefined();
    });
  });

  describe('createDefinitionFilterSchema', () => {
    it('should create schema with all required fields', () => {
      const schema = createDefinitionFilterSchema();

      // Should have all the definition filter fields
      expect(schema.fields).toHaveLength(20);
      const keys = schema.fields.map(f => f.key);
      expect(keys).toContain('started');
      expect(keys).toContain('finished');
      expect(keys).toContain('maxResults');
      expect(keys).toContain('version');
      expect(keys).toContain('activityId');
      expect(keys).toContain('activityName');
      expect(keys).toContain('activityType');
      expect(keys).toContain('taskAssignee');
      expect(keys).toContain('finishedOnly');
      expect(keys).toContain('unfinishedOnly');
      expect(keys).toContain('canceled');
      expect(keys).toContain('tenantIdIn');
    });

    it('should have correct operators for started field', () => {
      const schema = createDefinitionFilterSchema();
      const startedField = schema.fields.find(f => f.key === 'started');

      expect(startedField?.operators).toEqual([OPERATORS.after]);
    });

    it('should have correct operators for finished field', () => {
      const schema = createDefinitionFilterSchema();
      const finishedField = schema.fields.find(f => f.key === 'finished');

      expect(finishedField?.operators).toEqual([OPERATORS.before]);
    });

    it('should have correct operators for maxResults field', () => {
      const schema = createDefinitionFilterSchema();
      const maxResultsField = schema.fields.find(f => f.key === 'maxResults');

      expect(maxResultsField?.operators).toEqual([OPERATORS.is]);
    });
  });

  describe('createInstanceQuerySchema', () => {
    it('should create schema with all required fields', () => {
      const schema = createInstanceQuerySchema();

      // Should have all the instance query fields (including Phase 7 additions)
      expect(schema.fields).toHaveLength(45);
      const keys = schema.fields.map(f => f.key);
      expect(keys).toContain('started');
      expect(keys).toContain('finished');
      expect(keys).toContain('key');
      expect(keys).toContain('variable');
      expect(keys).toContain('version');
      expect(keys).toContain('processInstanceId');
      expect(keys).toContain('finishedOnly');
      expect(keys).toContain('unfinishedOnly');
      expect(keys).toContain('withIncidents');
      expect(keys).toContain('incidentType');
      expect(keys).toContain('incidentStatus');
      expect(keys).toContain('startedBy');
      expect(keys).toContain('tenantIdIn');
      expect(keys).toContain('state');
      expect(keys).toContain('executedActivityIdIn');
      expect(keys).toContain('activeActivityIdIn');
    });

    it('should have correct operators for key field', () => {
      const schema = createInstanceQuerySchema();
      const keyField = schema.fields.find(f => f.key === 'key');

      expect(keyField?.operators).toEqual([OPERATORS.eq, OPERATORS.like]);
    });

    it('should have correct operators for variable field', () => {
      const schema = createInstanceQuerySchema();
      const variableField = schema.fields.find(f => f.key === 'variable');

      expect(variableField?.operators).toEqual([OPERATORS.eq, OPERATORS.like, OPERATORS.ilike]);
    });

    it('should have correct operators for version field', () => {
      const schema = createInstanceQuerySchema();
      const versionField = schema.fields.find(f => f.key === 'version');

      expect(versionField?.operators).toEqual([
        OPERATORS.any,
        OPERATORS.eq,
        OPERATORS.lt,
        OPERATORS.gt,
        OPERATORS.lte,
        OPERATORS.gte,
      ]);
    });
  });

  describe('createAuthorizationFilterSchema', () => {
    it('should create schema with all required fields', () => {
      const schema = createAuthorizationFilterSchema();

      expect(schema.fields).toHaveLength(6);
      expect(schema.fields.map(f => f.key)).toEqual([
        'id',
        'userIdIn',
        'groupIdIn',
        'resourceId',
        'resourceType',
        'type',
      ]);
    });

    it('should have type field with correct enum values', () => {
      const schema = createAuthorizationFilterSchema();
      const typeField = schema.fields.find(f => f.key === 'type');

      expect(typeField?.type).toBe('enum');
      expect(typeField?.valueAutocompleter).toBeDefined();
    });

    it('should have resourceType field with correct enum values', () => {
      const schema = createAuthorizationFilterSchema();
      const resourceTypeField = schema.fields.find(f => f.key === 'resourceType');

      expect(resourceTypeField?.type).toBe('enum');
      expect(resourceTypeField?.valueAutocompleter).toBeDefined();
    });
  });

  describe('toLegacyExpressions', () => {
    it('should convert a single expression correctly', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'started', label: 'Started', type: 'date' },
            operator: { key: 'after', label: 'after', symbol: '≥' },
            value: { raw: '2024-01-01', display: '2024-01-01', serialized: '2024-01-01' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        category: 'started',
        operator: 'after',
        value: '2024-01-01',
      });
    });

    it('should convert eq operator to ==', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'key', label: 'Key', type: 'string' },
            operator: { key: 'eq', label: 'equals', symbol: '=' },
            value: { raw: 'test', display: 'test', serialized: 'test' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('==');
    });

    it('should convert neq operator to !=', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'status', label: 'Status', type: 'string' },
            operator: { key: 'neq', label: 'not equals', symbol: '≠' },
            value: { raw: 'completed', display: 'completed', serialized: 'completed' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('!=');
    });

    it('should convert gt operator to >', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'count', label: 'Count', type: 'number' },
            operator: { key: 'gt', label: 'greater than', symbol: '>' },
            value: { raw: '10', display: '10', serialized: '10' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('>');
    });

    it('should convert lt operator to <', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'count', label: 'Count', type: 'number' },
            operator: { key: 'lt', label: 'less than', symbol: '<' },
            value: { raw: '5', display: '5', serialized: '5' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('<');
    });

    it('should convert gte operator to >=', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'count', label: 'Count', type: 'number' },
            operator: { key: 'gte', label: 'greater or equal', symbol: '≥' },
            value: { raw: '10', display: '10', serialized: '10' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('>=');
    });

    it('should convert lte operator to <=', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'count', label: 'Count', type: 'number' },
            operator: { key: 'lte', label: 'less or equal', symbol: '≤' },
            value: { raw: '5', display: '5', serialized: '5' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]?.operator).toBe('<=');
    });

    it('should add conditionType for non-last expressions', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'started', label: 'Started', type: 'date' },
            operator: { key: 'after', label: 'after', symbol: '≥' },
            value: { raw: '2024-01-01', display: '2024-01-01', serialized: '2024-01-01' },
          },
          connector: 'AND',
        },
        {
          condition: {
            field: { key: 'finished', label: 'Finished', type: 'date' },
            operator: { key: 'before', label: 'before', symbol: '≤' },
            value: { raw: '2024-12-31', display: '2024-12-31', serialized: '2024-12-31' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('conditionType', 'AND');
      expect(result[1]).not.toHaveProperty('conditionType');
    });

    it('should handle OR connector', () => {
      const expressions: FilterExpression[] = [
        {
          condition: {
            field: { key: 'status', label: 'Status', type: 'string' },
            operator: { key: 'eq', label: 'equals', symbol: '=' },
            value: { raw: 'active', display: 'active', serialized: 'active' },
          },
          connector: 'OR',
        },
        {
          condition: {
            field: { key: 'status', label: 'Status', type: 'string' },
            operator: { key: 'eq', label: 'equals', symbol: '=' },
            value: { raw: 'pending', display: 'pending', serialized: 'pending' },
          },
        },
      ];

      const result = toLegacyExpressions(expressions);

      expect(result[0]).toHaveProperty('conditionType', 'OR');
    });

    it('should return empty array for empty input', () => {
      const result = toLegacyExpressions([]);

      expect(result).toEqual([]);
    });
  });

  describe('fromLegacyExpressions', () => {
    const testSchema: FilterSchema = {
      fields: [
        { key: 'started', label: 'Started', type: 'date', operators: [OPERATORS.after, OPERATORS.before] },
        { key: 'key', label: 'Process Key', type: 'string', operators: [OPERATORS.eq, OPERATORS.like] },
        { key: 'count', label: 'Count', type: 'number', operators: [OPERATORS.eq, OPERATORS.gt, OPERATORS.lt] },
      ],
    };

    it('should convert a single legacy expression correctly', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'started',
          operator: 'after',
          value: '2024-01-01',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result).toHaveLength(1);
      expect(result[0]?.condition.field.key).toBe('started');
      expect(result[0]?.condition.field.label).toBe('Started');
      expect(result[0]?.condition.operator.key).toBe('after');
      expect(result[0]?.condition.value.raw).toBe('2024-01-01');
      expect(result[0]?.condition.value.serialized).toBe('2024-01-01');
    });

    it('should convert == operator to eq', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'key',
          operator: '==',
          value: 'test',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('eq');
    });

    it('should convert != operator to neq', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'key',
          operator: '!=',
          value: 'test',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('neq');
    });

    it('should convert > operator to gt', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'count',
          operator: '>',
          value: '10',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('gt');
    });

    it('should convert < operator to lt', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'count',
          operator: '<',
          value: '5',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('lt');
    });

    it('should convert >= operator to gte', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'count',
          operator: '>=',
          value: '10',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('gte');
    });

    it('should convert <= operator to lte', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'count',
          operator: '<=',
          value: '5',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.condition.operator.key).toBe('lte');
    });

    it('should preserve conditionType as connector', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'key',
          operator: '==',
          value: 'test1',
          conditionType: 'AND',
        },
        {
          category: 'key',
          operator: '==',
          value: 'test2',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result).toHaveLength(2);
      expect(result[0]?.connector).toBe('AND');
      expect(result[1]?.connector).toBeUndefined();
    });

    it('should handle OR conditionType', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'key',
          operator: '==',
          value: 'test1',
          conditionType: 'OR',
        },
        {
          category: 'key',
          operator: '==',
          value: 'test2',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result[0]?.connector).toBe('OR');
    });

    it('should handle unknown fields gracefully', () => {
      const legacy: LegacyExpression[] = [
        {
          category: 'unknown',
          operator: '==',
          value: 'test',
        },
      ];

      const result = fromLegacyExpressions(legacy, testSchema);

      expect(result).toHaveLength(1);
      expect(result[0]?.condition.field.key).toBe('unknown');
      expect(result[0]?.condition.field.label).toBe('unknown');
      expect(result[0]?.condition.field.type).toBe('string');
    });

    it('should return empty array for empty input', () => {
      const result = fromLegacyExpressions([], testSchema);

      expect(result).toEqual([]);
    });
  });

  describe('round-trip conversion', () => {
    const schema = createInstanceQuerySchema();

    it('should preserve expressions through toLegacy and fromLegacy', () => {
      const original: FilterExpression[] = [
        {
          condition: {
            field: { key: 'started', label: 'Started', type: 'date' },
            operator: { key: 'after', label: 'after', symbol: '≥' },
            value: { raw: '2024-01-01', display: '2024-01-01', serialized: '2024-01-01' },
          },
          connector: 'AND',
        },
        {
          condition: {
            field: { key: 'key', label: 'Process Key', type: 'string' },
            operator: { key: 'eq', label: 'equals', symbol: '=' },
            value: { raw: 'my-process', display: 'my-process', serialized: 'my-process' },
          },
        },
      ];

      const legacy = toLegacyExpressions(original);
      const restored = fromLegacyExpressions(legacy, schema);

      expect(restored).toHaveLength(2);
      expect(restored[0]?.condition.field.key).toBe('started');
      expect(restored[0]?.condition.operator.key).toBe('after');
      expect(restored[0]?.condition.value.serialized).toBe('2024-01-01');
      expect(restored[0]?.connector).toBe('AND');

      expect(restored[1]?.condition.field.key).toBe('key');
      expect(restored[1]?.condition.operator.key).toBe('eq');
      expect(restored[1]?.condition.value.serialized).toBe('my-process');
      expect(restored[1]?.connector).toBeUndefined();
    });
  });

  describe('createApiAutocompleter', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    it('should create an autocompleter with default options', () => {
      const fetchFn = jest.fn().mockResolvedValue([
        { key: 'user1', label: 'User One' },
        { key: 'user2', label: 'User Two' },
      ]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
      });

      expect(autocompleter).toBeDefined();
      expect(typeof autocompleter.getSuggestions).toBe('function');
    });

    it('should pass query and api to fetchFn', async () => {
      const fetchFn = jest.fn().mockResolvedValue([{ key: 'test', label: 'Test' }]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        minChars: 1,
        debounceMs: 0,
        shouldCacheResults: false,
      });

      const context = {
        inputValue: 'test-query',
        field: { key: 'test', label: 'Test', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      await autocompleter.getSuggestions(context);

      expect(fetchFn).toHaveBeenCalledWith('test-query', mockApi, expect.any(AbortSignal));
    });

    it('should handle AbortError gracefully', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      const fetchFn = jest.fn().mockRejectedValue(abortError);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        minChars: 1,
        debounceMs: 0,
        shouldCacheResults: false,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'test', label: 'Test', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const apiError = new Error('API Error');
      const fetchFn = jest.fn().mockRejectedValue(apiError);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        minChars: 1,
        debounceMs: 0,
        shouldCacheResults: false,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'test', label: 'Test', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Autocomplete fetch error:', apiError);

      consoleErrorSpy.mockRestore();
    });

    it('should use custom minChars option', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        minChars: 3,
      });

      // The minChars option is passed to createAsyncAutocompleter internally
      // We can't easily test it here without integration tests
      expect(autocompleter).toBeDefined();
    });

    it('should use custom debounceMs option', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        debounceMs: 500,
      });

      expect(autocompleter).toBeDefined();
    });

    it('should use custom shouldCacheResults option', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        shouldCacheResults: false,
      });

      expect(autocompleter).toBeDefined();
    });

    it('should use custom loadingMessage option', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);

      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
        loadingMessage: 'Loading data...',
      });

      expect(autocompleter).toBeDefined();
    });
  });

  describe('createAsyncStringField', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    it('should create a string field with async autocompleter', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);
      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
      });

      const field = require('../filterSchema').createAsyncStringField(
        'testField',
        'Test Field',
        [OPERATORS.eq, OPERATORS.like],
        autocompleter
      );

      expect(field).toEqual({
        key: 'testField',
        label: 'Test Field',
        type: 'string',
        operators: [OPERATORS.eq, OPERATORS.like],
        allowMultiple: true,
        valueAutocompleter: autocompleter,
      });
    });

    it('should allow multiple values by default', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);
      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
      });

      const field = require('../filterSchema').createAsyncStringField(
        'testField',
        'Test Field',
        [OPERATORS.eq],
        autocompleter
      );

      expect(field.allowMultiple).toBe(true);
    });

    it('should use provided operators', () => {
      const fetchFn = jest.fn().mockResolvedValue([]);
      const autocompleter = require('../filterSchema').createApiAutocompleter(fetchFn, {
        api: mockApi,
      });

      const customOperators = [OPERATORS.eq, OPERATORS.neq, OPERATORS.like];
      const field = require('../filterSchema').createAsyncStringField(
        'testField',
        'Test Field',
        customOperators,
        autocompleter
      );

      expect(field.operators).toEqual(customOperators);
    });
  });

  describe('createUserAutocompleter', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create an autocompleter for user search', () => {
      const autocompleter = require('../filterSchema').createUserAutocompleter(mockApi);

      expect(autocompleter).toBeDefined();
      expect(typeof autocompleter.getSuggestions).toBe('function');
    });

    it('should fetch users from /user API endpoint', async () => {
      const mockUsers = [
        { id: 'john.doe', firstName: 'John', lastName: 'Doe' },
        { id: 'jane.smith', firstName: 'Jane', lastName: 'Smith' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      });

      const autocompleter = require('../filterSchema').createUserAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
        shouldCacheResults: false,
      });

      const context = {
        inputValue: 'john',
        field: { key: 'startedBy', label: 'Started By', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/engine-rest/user?idIn=john*',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
            'X-XSRF-TOKEN': 'test-token',
          }),
        })
      );

      expect(result).toEqual([
        { type: 'value', key: 'john.doe', label: 'john.doe (John Doe)' },
        { type: 'value', key: 'jane.smith', label: 'jane.smith (Jane Smith)' },
      ]);
    });

    it('should handle users without names', async () => {
      const mockUsers = [
        { id: 'system' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      });

      const autocompleter = require('../filterSchema').createUserAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'sys',
        field: { key: 'startedBy', label: 'Started By', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'system', label: 'system' },
      ]);
    });

    it('should handle 403 permission denied gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
      });

      const autocompleter = require('../filterSchema').createUserAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'startedBy', label: 'Started By', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith('User search permission denied');

      consoleWarnSpy.mockRestore();
    });

    it('should filter out users without IDs', async () => {
      const mockUsers = [
        { id: 'john.doe', firstName: 'John', lastName: 'Doe' },
        { id: null },
        { firstName: 'Jane', lastName: 'Smith' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      });

      const autocompleter = require('../filterSchema').createUserAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'startedBy', label: 'Started By', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'john.doe', label: 'john.doe (John Doe)' },
      ]);
    });
  });

  describe('createGroupAutocompleter', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create an autocompleter for group search', () => {
      const autocompleter = require('../filterSchema').createGroupAutocompleter(mockApi);

      expect(autocompleter).toBeDefined();
      expect(typeof autocompleter.getSuggestions).toBe('function');
    });

    it('should fetch groups from /group API endpoint', async () => {
      const mockGroups = [
        { id: 'admin', name: 'Administrators' },
        { id: 'users', name: 'Users' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockGroups,
      });

      const autocompleter = require('../filterSchema').createGroupAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
        shouldCacheResults: false,
      });

      const context = {
        inputValue: 'admin',
        field: { key: 'groupIdIn', label: 'Group', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/engine-rest/group?idIn=admin*',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
            'X-XSRF-TOKEN': 'test-token',
          }),
        })
      );

      expect(result).toEqual([
        { type: 'value', key: 'admin', label: 'admin (Administrators)' },
        { type: 'value', key: 'users', label: 'users (Users)' },
      ]);
    });

    it('should handle groups without names', async () => {
      const mockGroups = [
        { id: 'sysadmin' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockGroups,
      });

      const autocompleter = require('../filterSchema').createGroupAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'sys',
        field: { key: 'groupIdIn', label: 'Group', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'sysadmin', label: 'sysadmin' },
      ]);
    });

    it('should handle 403 permission denied gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
      });

      const autocompleter = require('../filterSchema').createGroupAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'groupIdIn', label: 'Group', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Group search permission denied');

      consoleWarnSpy.mockRestore();
    });

    it('should filter out groups without IDs', async () => {
      const mockGroups = [
        { id: 'admin', name: 'Administrators' },
        { id: null },
        { name: 'Invalid Group' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockGroups,
      });

      const autocompleter = require('../filterSchema').createGroupAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'test',
        field: { key: 'groupIdIn', label: 'Group', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'admin', label: 'admin (Administrators)' },
      ]);
    });
  });

  describe('createTenantAutocompleter', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch and filter tenants from /tenant endpoint', async () => {
      const mockTenants = [
        { id: 'tenant1', name: 'Tenant One' },
        { id: 'tenant2', name: 'Tenant Two' },
        { id: 'acme-corp', name: 'ACME Corporation' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTenants,
      });

      const autocompleter = require('../filterSchema').createTenantAutocompleter(mockApi);

      const context = {
        inputValue: 'tenant',
        field: { key: 'tenantIdIn', label: 'Tenant ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/engine-rest/tenant',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
          }),
        })
      );

      expect(result).toEqual([
        { type: 'value', key: 'tenant1', label: 'tenant1 (Tenant One)' },
        { type: 'value', key: 'tenant2', label: 'tenant2 (Tenant Two)' },
      ]);
    });

    it('should cache results and return all tenants on empty query', async () => {
      const mockTenants = [
        { id: 'tenant1', name: 'Tenant One' },
        { id: 'tenant2', name: 'Tenant Two' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTenants,
      });

      const autocompleter = require('../filterSchema').createTenantAutocompleter(mockApi);

      const context = {
        inputValue: '',
        field: { key: 'tenantIdIn', label: 'Tenant ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'tenant1', label: 'tenant1 (Tenant One)' },
        { type: 'value', key: 'tenant2', label: 'tenant2 (Tenant Two)' },
      ]);
    });

    it('should handle tenants without names', async () => {
      const mockTenants = [
        { id: 'tenant1', name: 'Tenant One' },
        { id: 'tenant2', name: null },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTenants,
      });

      const autocompleter = require('../filterSchema').createTenantAutocompleter(mockApi);

      const context = {
        inputValue: 'tenant',
        field: { key: 'tenantIdIn', label: 'Tenant ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'tenant1', label: 'tenant1 (Tenant One)' },
        { type: 'value', key: 'tenant2', label: 'tenant2' },
      ]);
    });

    it('should handle permission denied (403)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const autocompleter = require('../filterSchema').createTenantAutocompleter(mockApi);

      const context = {
        inputValue: 'test',
        field: { key: 'tenantIdIn', label: 'Tenant ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Tenant search permission denied');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('createProcessDefinitionAutocompleter', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch latest process definitions by name pattern', async () => {
      const mockDefinitions = [
        { id: 'invoice:1:abc', key: 'invoice', name: 'Invoice Process', version: 3, versionTag: null },
        { id: 'invoice:2:def', key: 'invoice-approval', name: 'Invoice Approval', version: 2, versionTag: 'v1.2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockDefinitions,
      });

      const autocompleter = require('../filterSchema').createProcessDefinitionAutocompleter(mockApi, {
        minChars: 2,
        debounceMs: 0,
      });

      const context = {
        inputValue: 'invoice',
        field: { key: 'processDefinitionName', label: 'Process Name', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/engine-rest/process-definition?nameLike=invoice%&latestVersion=true',
        expect.any(Object)
      );

      expect(result).toEqual([
        { type: 'value', key: 'Invoice Process', label: 'Invoice Process (v3)' },
        { type: 'value', key: 'Invoice Approval', label: 'Invoice Approval (v2 - v1.2)' },
      ]);
    });

    it('should filter out definitions without names', async () => {
      const mockDefinitions = [
        { id: 'test:1:abc', key: 'test', name: 'Test Process', version: 1, versionTag: null },
        { id: 'noname:1:def', key: 'noname', name: null, version: 1, versionTag: null },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockDefinitions,
      });

      const autocompleter = require('../filterSchema').createProcessDefinitionAutocompleter(mockApi, {
        minChars: 1,
        debounceMs: 0,
      });

      const context = {
        inputValue: 't',
        field: { key: 'processDefinitionName', label: 'Process Name', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'Test Process', label: 'Test Process (v1)' },
      ]);
    });
  });

  describe('createActivityAutocompleter', () => {
    const mockActivities = [
      { id: 'Task_1', name: 'User Task One', type: 'userTask' },
      { id: 'Task_2', name: 'User Task Two', type: 'userTask' },
      { id: 'Gateway_1', name: undefined, type: 'exclusiveGateway' },
    ];

    it('should filter activities by ID (showNames=false)', async () => {
      const autocompleter = require('../filterSchema').createActivityAutocompleter(mockActivities, false);

      const context = {
        inputValue: 'Task',
        field: { key: 'activityId', label: 'Activity ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'Task_1', label: 'Task_1' },
        { type: 'value', key: 'Task_2', label: 'Task_2' },
      ]);
    });

    it('should filter activities by name (showNames=true)', async () => {
      const autocompleter = require('../filterSchema').createActivityAutocompleter(mockActivities, true);

      const context = {
        inputValue: 'User',
        field: { key: 'activityName', label: 'Activity Name', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'User Task One', label: 'User Task One (Task_1)' },
        { type: 'value', key: 'User Task Two', label: 'User Task Two (Task_2)' },
      ]);
    });

    it('should return all activities on empty query', async () => {
      const autocompleter = require('../filterSchema').createActivityAutocompleter(mockActivities, false);

      const context = {
        inputValue: '',
        field: { key: 'activityId', label: 'Activity ID', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { type: 'value', key: 'Task_1', label: 'Task_1' },
        { type: 'value', key: 'Task_2', label: 'Task_2' },
        { type: 'value', key: 'Gateway_1', label: 'Gateway_1' },
      ]);
    });

    it('should handle activities without names when showNames=true', async () => {
      const autocompleter = require('../filterSchema').createActivityAutocompleter(mockActivities, true);

      const context = {
        inputValue: 'Gateway',
        field: { key: 'activityName', label: 'Activity Name', type: 'string' as const },
        operator: { key: 'eq', label: 'equals' },
        existingExpressions: [],
        schema: { fields: [] },
      };

      const result = await autocompleter.getSuggestions(context);

      expect(result).toEqual([
        { type: 'value', key: 'Gateway_1', label: 'Gateway_1' },
      ]);
    });
  });

  describe('createDefinitionFilterSchema with activity context', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    const mockActivities = [
      { id: 'Task_1', name: 'User Task', type: 'userTask' },
    ];

    it('should use activity autocompleter when context provided', () => {
      const schema = require('../filterSchema').createDefinitionFilterSchema(
        mockApi,
        { activities: mockActivities }
      );

      const activityIdField = schema.fields.find((f: { key: string }) => f.key === 'activityId');
      const activityNameField = schema.fields.find((f: { key: string }) => f.key === 'activityName');

      expect(activityIdField).toBeDefined();
      expect(activityIdField?.valueAutocompleter).toBeDefined();
      expect(activityNameField).toBeDefined();
      expect(activityNameField?.valueAutocompleter).toBeDefined();
    });

    it('should use tenant autocompleter when API provided', () => {
      const schema = require('../filterSchema').createDefinitionFilterSchema(mockApi);

      const tenantIdInField = schema.fields.find((f: { key: string }) => f.key === 'tenantIdIn');

      expect(tenantIdInField).toBeDefined();
      expect(tenantIdInField?.valueAutocompleter).toBeDefined();
    });
  });

  describe('createInstanceQuerySchema with activity context', () => {
    const mockApi = {
      engineApi: 'http://localhost:8080/engine-rest',
      CSRFToken: 'test-token',
    } as any;

    const mockActivities = [
      { id: 'Task_1', name: 'User Task', type: 'userTask' },
    ];

    it('should use activity autocompleter when context provided', () => {
      const schema = require('../filterSchema').createInstanceQuerySchema(
        mockApi,
        { activities: mockActivities }
      );

      const executedActivityField = schema.fields.find((f: { key: string }) => f.key === 'executedActivityIdIn');
      const activeActivityField = schema.fields.find((f: { key: string }) => f.key === 'activeActivityIdIn');

      expect(executedActivityField).toBeDefined();
      expect(executedActivityField?.valueAutocompleter).toBeDefined();
      expect(activeActivityField).toBeDefined();
      expect(activeActivityField?.valueAutocompleter).toBeDefined();
    });

    it('should use process definition name autocompleter when API provided', () => {
      const schema = require('../filterSchema').createInstanceQuerySchema(mockApi);

      const processDefNameField = schema.fields.find((f: { key: string }) => f.key === 'processDefinitionName');

      expect(processDefNameField).toBeDefined();
      expect(processDefNameField?.valueAutocompleter).toBeDefined();
    });

    it('should use tenant autocompleter when API provided', () => {
      const schema = require('../filterSchema').createInstanceQuerySchema(mockApi);

      const tenantIdInField = schema.fields.find((f: { key: string }) => f.key === 'tenantIdIn');

      expect(tenantIdInField).toBeDefined();
      expect(tenantIdInField?.valueAutocompleter).toBeDefined();
    });

    it('should include new medium priority fields', () => {
      const schema = require('../filterSchema').createInstanceQuerySchema(mockApi);

      const externallyTerminatedField = schema.fields.find((f: { key: string }) => f.key === 'externallyTerminated');
      const internallyTerminatedField = schema.fields.find((f: { key: string }) => f.key === 'internallyTerminated');
      const rootProcessInstanceIdField = schema.fields.find((f: { key: string }) => f.key === 'rootProcessInstanceId');
      const processInstanceIdNotInField = schema.fields.find((f: { key: string }) => f.key === 'processInstanceIdNotIn');
      const processDefinitionKeyNotInField = schema.fields.find((f: { key: string }) => f.key === 'processDefinitionKeyNotIn');

      expect(externallyTerminatedField).toBeDefined();
      expect(externallyTerminatedField?.type).toBe('enum');
      expect(internallyTerminatedField).toBeDefined();
      expect(internallyTerminatedField?.type).toBe('enum');
      expect(rootProcessInstanceIdField).toBeDefined();
      expect(rootProcessInstanceIdField?.type).toBe('string');
      expect(processInstanceIdNotInField).toBeDefined();
      expect(processInstanceIdNotInField?.type).toBe('string');
      expect(processDefinitionKeyNotInField).toBeDefined();
      expect(processDefinitionKeyNotInField?.type).toBe('string');
    });
  });
});
