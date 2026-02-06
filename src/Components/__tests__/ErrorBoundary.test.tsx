/**
 * Tests for ErrorBoundary component.
 *
 * @module
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Suppress console.error in tests to avoid noisy output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('Normal operation', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should display error message when child throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
      expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });

    it('should display component name in error message when provided', () => {
      render(
        <ErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/An error occurred in TestComponent/)).toBeInTheDocument();
    });

    it('should display Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Custom fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    });

    it('should not show default error message when custom fallback is provided', () => {
      const customFallback = <div>Custom error</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/An error occurred/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Try Again/i })).not.toBeInTheDocument();
    });
  });

  describe('Reset functionality', () => {
    it('should reset error state when Try Again is clicked', () => {
      // Use a component that can toggle throwing
      let shouldThrow = true;
      const ToggleError: React.FC = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div data-testid="recovered">Recovered!</div>;
      };

      const { rerender } = render(
        <ErrorBoundary key="test">
          <ToggleError />
        </ErrorBoundary>
      );

      // Should show error initially
      expect(screen.getByText(/An error occurred/)).toBeInTheDocument();

      // Stop throwing and click reset
      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

      // After reset, should try to render children again
      // Since shouldThrow is now false, component should render
      rerender(
        <ErrorBoundary key="test">
          <ToggleError />
        </ErrorBoundary>
      );

      // Should now show the recovered component
      expect(screen.getByTestId('recovered')).toBeInTheDocument();
    });
  });

  describe('getDerivedStateFromError', () => {
    it('should capture error in state', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // The error message contains the error text, proving the state was set
      expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });
  });
});
