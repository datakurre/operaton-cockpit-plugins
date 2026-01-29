/**
 * Tests for variable transformation utilities
 */
import {
  transformVariableValue,
  transformVariable,
  transformVariables,
  isValidVariable,
  filterValidVariables,
  VARIABLE_TYPES,
  type VariableInput,
} from '../variables';

describe('VARIABLE_TYPES', () => {
  it('contains all expected types', () => {
    expect(VARIABLE_TYPES).toContain('String');
    expect(VARIABLE_TYPES).toContain('Integer');
    expect(VARIABLE_TYPES).toContain('Boolean');
    expect(VARIABLE_TYPES).toContain('Double');
    expect(VARIABLE_TYPES).toContain('Date');
    expect(VARIABLE_TYPES).toContain('Json');
    expect(VARIABLE_TYPES).toContain('Object');
    expect(VARIABLE_TYPES).toContain('File');
    expect(VARIABLE_TYPES).toContain('Bytes');
    expect(VARIABLE_TYPES).toContain('Short');
    expect(VARIABLE_TYPES).toContain('Long');
  });
});

describe('transformVariableValue', () => {
  describe('Boolean type', () => {
    it('transforms string "true" to boolean true', () => {
      expect(transformVariableValue('true', 'Boolean')).toBe(true);
    });

    it('transforms string "false" to boolean false', () => {
      expect(transformVariableValue('false', 'Boolean')).toBe(false);
    });

    it('transforms boolean true to true', () => {
      expect(transformVariableValue(true, 'Boolean')).toBe(true);
    });

    it('transforms boolean false to false', () => {
      expect(transformVariableValue(false, 'Boolean')).toBe(false);
    });
  });

  describe('Numeric types', () => {
    it.each(['Integer', 'Double', 'Short', 'Long'])('transforms %s to number', type => {
      expect(transformVariableValue('42', type)).toBe(42);
    });

    it('handles decimal values for Double', () => {
      expect(transformVariableValue('3.14', 'Double')).toBeCloseTo(3.14);
    });

    it('returns 0 for non-numeric strings', () => {
      expect(transformVariableValue('not-a-number', 'Integer')).toBe(0);
    });

    it('handles empty string', () => {
      expect(transformVariableValue('', 'Integer')).toBe(0);
    });
  });

  describe('JSON types', () => {
    it('parses valid JSON for Json type', () => {
      const result = transformVariableValue('{"key": "value"}', 'Json');
      expect(result).toEqual({ key: 'value' });
    });

    it('parses valid JSON for Object type', () => {
      const result = transformVariableValue('{"nested": {"data": 1}}', 'Object');
      expect(result).toEqual({ nested: { data: 1 } });
    });

    it('parses JSON arrays', () => {
      const result = transformVariableValue('[1, 2, 3]', 'Json');
      expect(result).toEqual([1, 2, 3]);
    });

    it('returns raw string for invalid JSON', () => {
      expect(transformVariableValue('not-json', 'Json')).toBe('not-json');
    });
  });

  describe('String type', () => {
    it('returns string as-is', () => {
      expect(transformVariableValue('hello', 'String')).toBe('hello');
    });

    it('converts boolean to string', () => {
      expect(transformVariableValue(true, 'String')).toBe('true');
    });
  });

  describe('Other types', () => {
    it('treats unknown types as String', () => {
      expect(transformVariableValue('data', 'Unknown')).toBe('data');
    });

    it('handles Date type as string', () => {
      expect(transformVariableValue('2024-01-01', 'Date')).toBe('2024-01-01');
    });
  });
});

describe('transformVariable', () => {
  it('transforms a simple string variable', () => {
    const input: VariableInput = { name: 'test', type: 'String', value: 'hello' };
    const result = transformVariable(input);
    expect(result).toEqual({ value: 'hello', type: 'String' });
  });

  it('includes local flag when present and includeLocal is true', () => {
    const input: VariableInput = { name: 'test', type: 'String', value: 'hello', local: true };
    const result = transformVariable(input, true);
    expect(result).toEqual({ value: 'hello', type: 'String', local: true });
  });

  it('excludes local flag when includeLocal is false', () => {
    const input: VariableInput = { name: 'test', type: 'String', value: 'hello', local: true };
    const result = transformVariable(input, false);
    expect(result).toEqual({ value: 'hello', type: 'String' });
  });

  it('transforms boolean values correctly', () => {
    const input: VariableInput = { name: 'flag', type: 'Boolean', value: 'true' };
    const result = transformVariable(input);
    expect(result.value).toBe(true);
  });

  it('transforms numeric values correctly', () => {
    const input: VariableInput = { name: 'count', type: 'Integer', value: '42' };
    const result = transformVariable(input);
    expect(result.value).toBe(42);
  });
});

describe('transformVariables', () => {
  it('transforms an array of variables', () => {
    const inputs: VariableInput[] = [
      { name: 'str', type: 'String', value: 'hello' },
      { name: 'num', type: 'Integer', value: '42' },
      { name: 'flag', type: 'Boolean', value: 'true' },
    ];

    const result = transformVariables(inputs);

    expect(result).toEqual({
      str: { value: 'hello', type: 'String' },
      num: { value: 42, type: 'Integer' },
      flag: { value: true, type: 'Boolean' },
    });
  });

  it('skips variables with empty names', () => {
    const inputs: VariableInput[] = [
      { name: '', type: 'String', value: 'ignored' },
      { name: 'valid', type: 'String', value: 'kept' },
    ];

    const result = transformVariables(inputs);

    expect(Object.keys(result)).toEqual(['valid']);
  });

  it('handles empty array', () => {
    expect(transformVariables([])).toEqual({});
  });

  it('respects includeLocal parameter', () => {
    const inputs: VariableInput[] = [{ name: 'test', type: 'String', value: 'value', local: true }];

    const withLocal = transformVariables(inputs, true);
    expect(withLocal.test?.local).toBe(true);

    const withoutLocal = transformVariables(inputs, false);
    expect(withoutLocal.test?.local).toBeUndefined();
  });
});

describe('isValidVariable', () => {
  it('returns true for variable with non-empty name', () => {
    expect(isValidVariable({ name: 'test', type: 'String', value: '' })).toBe(true);
  });

  it('returns false for variable with empty name', () => {
    expect(isValidVariable({ name: '', type: 'String', value: 'value' })).toBe(false);
  });

  it('returns false for variable with whitespace-only name', () => {
    expect(isValidVariable({ name: '   ', type: 'String', value: 'value' })).toBe(false);
  });
});

describe('filterValidVariables', () => {
  it('filters out invalid variables', () => {
    const inputs: VariableInput[] = [
      { name: 'valid1', type: 'String', value: 'a' },
      { name: '', type: 'String', value: 'b' },
      { name: 'valid2', type: 'String', value: 'c' },
      { name: '   ', type: 'String', value: 'd' },
    ];

    const result = filterValidVariables(inputs);

    expect(result).toHaveLength(2);
    expect(result.map(v => v.name)).toEqual(['valid1', 'valid2']);
  });

  it('returns empty array when all are invalid', () => {
    const inputs: VariableInput[] = [
      { name: '', type: 'String', value: 'a' },
      { name: '   ', type: 'String', value: 'b' },
    ];

    expect(filterValidVariables(inputs)).toEqual([]);
  });
});
