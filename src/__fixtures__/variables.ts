/**
 * Mock variable data for tests.
 *
 * @module
 */

/** Variable types supported by the process engine. */
export type VariableType =
  | 'String'
  | 'Integer'
  | 'Long'
  | 'Double'
  | 'Boolean'
  | 'Date'
  | 'Object'
  | 'Json'
  | 'File'
  | 'Bytes'
  | 'Null';

/** Variable data structure as returned by the history API. */
export interface MockVariable {
  id: string;
  name: string;
  type: VariableType;
  value: unknown;
  activityInstanceId?: string;
  processInstanceId: string;
  processDefinitionId: string;
  createTime?: string;
  state?: string;
}

/** Substring start position for generating random IDs */
const RANDOM_ID_SLICE_START = 2;

/**
 * Creates a mock variable with sensible defaults.
 *
 * @param overrides - Optional overrides for variable properties
 * @returns Mock variable object
 */
export function createVariable(overrides: Partial<MockVariable> = {}): MockVariable {
  const id = overrides.id ?? `var-${Math.random().toString(RANDOM_ID_SLICE_START).slice(2)}`;
  return {
    id,
    name: 'testVar',
    type: 'String',
    value: 'test-value',
    processInstanceId: 'instance-123',
    processDefinitionId: 'definition-456',
    ...overrides,
  };
}

/** Mock string variable. */
export const mockStringVariable = createVariable({
  id: 'var-string-1',
  name: 'customerName',
  type: 'String',
  value: 'John Doe',
});

/** Mock integer variable. */
export const mockIntegerVariable = createVariable({
  id: 'var-integer-1',
  name: 'orderCount',
  type: 'Integer',
  value: 42,
});

/** Mock long variable. */
export const mockLongVariable = createVariable({
  id: 'var-long-1',
  name: 'orderId',
  type: 'Long',
  value: 1234567890123,
});

/** Mock double variable. */
export const mockDoubleVariable = createVariable({
  id: 'var-double-1',
  name: 'price',
  type: 'Double',
  value: 99.99,
});

/** Mock boolean variable. */
export const mockBooleanVariable = createVariable({
  id: 'var-boolean-1',
  name: 'isApproved',
  type: 'Boolean',
  value: true,
});

/** Mock date variable. */
export const mockDateVariable = createVariable({
  id: 'var-date-1',
  name: 'createdAt',
  type: 'Date',
  value: '2024-01-01T10:00:00.000Z',
});

/** Mock JSON/Object variable. */
export const mockJsonVariable = createVariable({
  id: 'var-json-1',
  name: 'orderDetails',
  type: 'Object',
  value: {
    items: [
      { name: 'Widget', quantity: 2 },
      { name: 'Gadget', quantity: 1 },
    ],
    total: 149.97,
  },
});

/** Mock file variable. */
export const mockFileVariable = createVariable({
  id: 'var-file-1',
  name: 'attachment',
  type: 'File',
  value: null,
});

/** Mock null variable. */
export const mockNullVariable = createVariable({
  id: 'var-null-1',
  name: 'optionalField',
  type: 'Null',
  value: null,
});

/** Collection of common mock variables. */
export const mockVariables = [mockStringVariable, mockIntegerVariable, mockBooleanVariable, mockJsonVariable];
