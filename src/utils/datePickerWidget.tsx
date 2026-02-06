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
  const initial = initialValue instanceof Date ? initialValue : initialValue ? new Date(String(initialValue)) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(initial);

  const handleConfirm = (): void => {
    if (selectedDate) {
      const display = formatDate(selectedDate);
      onConfirm(selectedDate, display);
    }
  };

  return (
    <div className="date-picker-widget">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          setSelectedDate(date);
        }}
        inline
        todayButton="Today"
      />

      {selectedDate && (
        <div className="date-picker-widget__summary">
          Selected: <strong>{formatDate(selectedDate)}</strong>
        </div>
      )}

      <div className="date-picker-widget__actions">
        <button onClick={handleConfirm} disabled={!selectedDate} className="btn btn-primary btn-sm">
          Apply
        </button>
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
