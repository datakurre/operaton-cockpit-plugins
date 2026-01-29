import React from 'react';

interface LoadingSpinnerProps {
  /** Custom message to display */
  message?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Simple loading spinner component for consistent loading states.
 * Includes ARIA attributes for screen reader announcements.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', className = 'loading' }) => {
  return (
    <div className={className} role="status" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{message}</span>
      {message}
    </div>
  );
};

export default LoadingSpinner;
