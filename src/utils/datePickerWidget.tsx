/**
 * Custom date picker widget for react-select-filter-box.
 *
 * Provides an inline date picker using react-datepicker for better UX
 * compared to the default autocomplete-based date selection.
 *
 * @module
 */
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import type { CustomAutocompleteWidget, CustomWidgetProps } from 'react-select-filter-box/dist/types';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Date picker widget component that properly manages hooks
 */
const DatePickerWidgetComponent: React.FC<CustomWidgetProps> = ({ onConfirm, onCancel, initialValue }) => {
  let initial: Date | null = null;
  if (initialValue instanceof Date) {
    initial = initialValue;
  } else if (initialValue !== null && initialValue !== undefined && initialValue !== '') {
    // Only convert primitives (string/number) to avoid stringifying objects
    const valueType = typeof initialValue;
    if (valueType === 'string') {
      initial = new Date(initialValue as string);
    } else if (valueType === 'number') {
      initial = new Date(initialValue as number);
    }
  }
  const [selectedDate, setSelectedDate] = useState<Date | null>(initial);

  const handleDateChange = (date: Date | null): void => {
    setSelectedDate(date);
    // Immediately apply when a date is selected
    // The onChange is only triggered when user clicks a date cell, not when navigating months
    if (date) {
      const display = formatDate(date);
      onConfirm(date, display);
    }
  };

  return (
    <div className="date-picker-widget">
      <DatePicker selected={selectedDate} onChange={handleDateChange} inline todayButton="Today" />

      {selectedDate && (
        <div className="date-picker-widget__summary">
          Selected: <strong>{formatDate(selectedDate)}</strong>
        </div>
      )}

      <div className="date-picker-widget__actions">
        <button onClick={onCancel} className="btn btn-default btn-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * Custom date picker widget that uses react-datepicker for inline date selection.
 * Provides a better UX than the autocomplete-based date selection.
 */
export const datePickerWidget: CustomAutocompleteWidget = {
  /**
   * Render the date picker widget
   */
  render: (props: CustomWidgetProps) => {
    return <DatePickerWidgetComponent {...props} />;
  },

  /**
   * Validate that the value is a valid Date
   */
  validate: (value: unknown): boolean => {
    return value instanceof Date && !isNaN(value.getTime());
  },

  /**
   * Serialize the date to ISO string
   */
  serialize: (value: unknown): string => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  },

  /**
   * Parse the serialized date string back to Date
   */
  parse: (serialized: string): unknown => {
    const date = new Date(serialized);
    return isNaN(date.getTime()) ? null : date;
  },
};

export default datePickerWidget;
