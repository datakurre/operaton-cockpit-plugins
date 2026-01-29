import React from 'react';

interface SuccessMessageProps {
  /** The success message to display */
  message: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Simple success message component for consistent success display.
 * Uses Bootstrap's alert-success styling.
 *
 * @param props - Component props
 * @param props.message - The success message to display
 * @param props.className - Custom CSS class name
 * @returns Success alert div
 *
 * @example
 * ```tsx
 * <SuccessMessage message="Operation completed successfully!" />
 * ```
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = 'alert alert-success' }) => {
  return (
    <div className={className} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default SuccessMessage;
