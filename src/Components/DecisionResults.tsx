/**
 * Decision results display component.
 * @module Components/DecisionResults
 */

import React from 'react';
import ErrorMessage from './ErrorMessage';
import type { DecisionEvaluationResult } from '../utils/api';
import type { VariableValueDto } from '../types';

/** Decision output field definition */
export interface DecisionOutputField {
  id: string;
  name: string;
  label: string;
  typeRef: string;
}

export interface DecisionResultsProps {
  results: DecisionEvaluationResult | null;
  outputs: DecisionOutputField[];
  error: string | null;
}

/**
 * Formats a result value for display.
 * @param value - The variable value DTO
 * @returns Formatted string representation
 */
function formatResultValue(value: VariableValueDto | undefined): string {
  if (value?.value === null || value?.value === undefined) {
    return 'null';
  }
  if (typeof value.value === 'object') {
    return JSON.stringify(value.value);
  }
  return typeof value.value === 'string' ? value.value : JSON.stringify(value.value);
}

/**
 * Displays the results of a decision evaluation.
 * Shows matched rules and output values in a table.
 */
const DecisionResults: React.FC<DecisionResultsProps> = ({ results, outputs, error }) => {
  if (error) {
    return (
      <div className="dmn-results dmn-results--error">
        <h4>Evaluation Error</h4>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const hitCount = results.length;

  return (
    <div className="dmn-results">
      <h4>Evaluation Results</h4>
      {hitCount === 0 ? (
        <p className="dmn-results__empty">No rules matched the input values.</p>
      ) : (
        <>
          <p className="dmn-results__hit-count">
            {hitCount} rule{hitCount !== 1 ? 's' : ''} matched
          </p>
          <table className="dmn-results__table">
            <thead>
              <tr>
                <th>#</th>
                {outputs.map(output => (
                  <th key={output.id}>{output.label || output.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={`result-row-${String(index)}`}>
                  <td>{index + 1}</td>
                  {outputs.map(output => (
                    <td key={output.id}>{formatResultValue(row[output.name])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DecisionResults;
