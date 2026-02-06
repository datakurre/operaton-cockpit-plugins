/**
 * Error boundary component for catching and displaying React errors.
 * Provides a fallback UI when components crash and prevents error propagation.
 *
 * @module
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorMessage from './ErrorMessage';

/** Props for ErrorBoundary component */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional component name for error context */
  componentName?: string;
}

/** State for ErrorBoundary component */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Error info with component stack */
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in child
 * component tree and displays a fallback UI instead of crashing the whole app.
 *
 * @example
 * ```tsx
 * <ErrorBoundary componentName="AuditLog">
 *   <AuditLogTable activities={activities} />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   *
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Update state so the next render shows the fallback UI.
   * @param error - The error that was thrown
   * @returns New state with error information
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Log error information and call optional callback.
   * @param error - The error that was thrown
   * @param errorInfo - Error info with component stack
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error state to allow retry.
   */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   *
   */
  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI
      const errorMessage = componentName
        ? `An error occurred in ${componentName}: ${error?.message ?? 'Unknown error'}`
        : `An error occurred: ${error?.message ?? 'Unknown error'}`;

      return (
        <div className="error-boundary">
          <ErrorMessage message={errorMessage} />
          <button type="button" onClick={this.handleReset} className="btn btn-secondary" style={{ marginTop: '10px' }}>
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
