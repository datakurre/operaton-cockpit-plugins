import React from 'react';

interface ErrorMessageProps {
  /** The error message to display */
  message: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Simple error message component for consistent error display.
 * Uses role="alert" with aria-live="assertive" for immediate screen reader announcement.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = 'alert alert-danger' }) => {
  return (
    <div className={className} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default ErrorMessage;
