/**
 * Decision input form component for DMN evaluation.
 * @module Components/DecisionInputForm
 */

import React from 'react';
import FormButton from './FormButton';

/** Decision input field definition */
export interface DecisionInputField {
  id: string;
  name: string;
  label: string;
  typeRef: string;
}

export interface DecisionInputFormProps {
  inputs: DecisionInputField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onEvaluate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

/**
 * Renders a form for entering decision input variables.
 * Supports different input types based on DMN typeRef.
 */
const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  inputs,
  values,
  onChange,
  onEvaluate,
  onClear,
  isLoading,
}) => {
  /**
   * Handles form submission.
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onEvaluate();
  };

  return (
    <form className="dmn-inputs-form" onSubmit={handleSubmit}>
      <h4>Input Variables</h4>
      {inputs.length === 0 ? (
        <p className="dmn-inputs-form__empty">No inputs defined for this decision.</p>
      ) : (
        inputs.map(input => (
          <div key={input.id} className="dmn-inputs-form__field">
            <label htmlFor={`input-${input.id}`}>
              {input.label || input.name}
              <span className="dmn-inputs-form__type-hint">({input.typeRef || 'string'})</span>
            </label>
            {input.typeRef.toLowerCase() === 'boolean' ? (
              <div className="dmn-inputs-form__checkbox-wrapper">
                <input
                  type="checkbox"
                  id={`input-${input.id}`}
                  checked={values[input.name] === 'true'}
                  onChange={e => {
                    onChange(input.name, e.target.checked ? 'true' : 'false');
                  }}
                  disabled={isLoading}
                />
                <label htmlFor={`input-${input.id}`}>{values[input.name] === 'true' ? 'true' : 'false'}</label>
              </div>
            ) : (
              <input
                type={
                  input.typeRef.toLowerCase() === 'integer' || input.typeRef.toLowerCase() === 'double'
                    ? 'number'
                    : 'text'
                }
                id={`input-${input.id}`}
                className="dmn-inputs-form__input"
                value={values[input.name] ?? ''}
                onChange={e => {
                  onChange(input.name, e.target.value);
                }}
                placeholder={`Enter ${input.name}`}
                disabled={isLoading}
                step={input.typeRef.toLowerCase() === 'double' ? 'any' : undefined}
              />
            )}
          </div>
        ))
      )}
      <div className="dmn-inputs-form__actions">
        <FormButton type="submit" variant="primary" disabled={isLoading || inputs.length === 0} minWidth={100}>
          {isLoading ? 'Evaluating...' : 'Evaluate'}
        </FormButton>
        <FormButton type="button" variant="secondary" onClick={onClear} disabled={isLoading} minWidth={80}>
          Clear
        </FormButton>
      </div>
    </form>
  );
};

export default DecisionInputForm;
