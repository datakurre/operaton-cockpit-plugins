/**
 * Variable transformation utilities for Camunda/Operaton API
 *
 * @module utils/variables
 */

/** Supported variable types in Camunda/Operaton */
export const VARIABLE_TYPES = [
  'String',
  'Integer',
  'Boolean',
  'Double',
  'Date',
  'Json',
  'Object',
  'File',
  'Bytes',
  'Short',
  'Long',
] as const;

export type VariableType = (typeof VARIABLE_TYPES)[number];

/** Numeric variable types that require parseFloat conversion */
const NUMERIC_TYPES: readonly string[] = ['Integer', 'Double', 'Short', 'Long'];

/** JSON-like variable types that require JSON.parse conversion */
const JSON_TYPES: readonly string[] = ['Json', 'Object'];

/**
 * Variable input from form data
 */
export interface VariableInput {
  name: string;
  type: string;
  value: string | boolean;
  local?: boolean;
}

/**
 * Transformed variable for API requests
 */
export interface TransformedVariable {
  value: boolean | number | string | object;
  type: string;
  local?: boolean;
}

/**
 * Transform a single variable value based on its type
 * @param value - The raw value from form input
 * @param type - The variable type
 * @returns The transformed value
 */
export function transformVariableValue(value: string | boolean, type: string): boolean | number | string | object {
  if (type === 'Boolean') {
    return value === 'true' || value === true;
  }

  if (NUMERIC_TYPES.includes(type)) {
    const stringValue = String(value);
    const parsed = parseFloat(stringValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (JSON_TYPES.includes(type)) {
    try {
      return JSON.parse(String(value)) as object;
    } catch {
      // Return raw string if parsing fails - backend will catch validation errors
      return String(value);
    }
  }

  return String(value);
}

/**
 * Transform a single variable for API requests
 * @param variable - The variable input from form
 * @param includeLocal - Whether to include the local flag
 * @returns Transformed variable object for API
 */
export function transformVariable(variable: VariableInput, includeLocal = true): TransformedVariable {
  const result: TransformedVariable = {
    value: transformVariableValue(variable.value, variable.type),
    type: variable.type,
  };

  if (includeLocal && variable.local !== undefined) {
    result.local = variable.local;
  }

  return result;
}

/**
 * Transform an array of variables into the format expected by Camunda/Operaton API
 * @param variables - Array of variable inputs from form
 * @param includeLocal - Whether to include the local flag in output
 * @returns Object mapping variable names to their transformed values
 */
export function transformVariables(
  variables: VariableInput[],
  includeLocal = true
): Record<string, TransformedVariable> {
  return variables.reduce<Record<string, TransformedVariable>>((acc, variable) => {
    if (variable.name) {
      acc[variable.name] = transformVariable(variable, includeLocal);
    }
    return acc;
  }, {});
}

/**
 * Validate that a variable has a valid name
 * @param variable - The variable to validate
 * @returns true if the variable has a non-empty name
 */
export function isValidVariable(variable: VariableInput): boolean {
  return variable.name.trim().length > 0;
}

/**
 * Filter out variables with empty names
 * @param variables - Array of variable inputs
 * @returns Array with only valid variables
 */
export function filterValidVariables(variables: VariableInput[]): VariableInput[] {
  return variables.filter(isValidVariable);
}
