import React from 'react';

interface SelectOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
}

interface SelectFieldProps {
  /** Field label text */
  label: string;
  /** Current selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Available options */
  options: SelectOption[];
  /** Placeholder text for empty selection */
  placeholder?: string;
  /** Field name for form submission */
  name?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS class for the select element */
  className?: string;
  /** Width of the select element */
  width?: string;
  /** Unique identifier for accessibility */
  id?: string;
}

/** Default select element width */
const DEFAULT_WIDTH = '400px';

/**
 * Reusable form select field component with consistent styling.
 * Renders a label with an inline select element.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Activity"
 *   value={selectedActivity}
 *   onChange={setSelectedActivity}
 *   options={activities.map(a => ({ value: a.id, label: a.name }))}
 *   placeholder="-- Select Activity --"
 * />
 * ```
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  name,
  required = false,
  disabled = false,
  className = 'form-control',
  width = DEFAULT_WIDTH,
  id,
}) => {
  const selectId = id ?? `select-${name ?? label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label htmlFor={selectId}>{label}: </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        className={className}
        style={{ width, display: 'inline-block', marginLeft: '10px' }}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
