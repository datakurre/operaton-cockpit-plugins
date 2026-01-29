import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    // Should have role="status" for accessibility
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Message appears both visible and in screen reader span
    expect(screen.getAllByText('Loading...')).toHaveLength(2);
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getAllByText('Please wait...')).toHaveLength(2);
  });

  it('renders with default className', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toHaveClass('loading');
  });

  it('renders with custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-loading" />);
    expect(container.firstChild).toHaveClass('custom-loading');
  });
});

describe('ErrorMessage', () => {
  it('renders with the provided message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has role="alert" for accessibility', () => {
    render(<ErrorMessage message="Error occurred" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with default className', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    expect(container.firstChild).toHaveClass('alert');
    expect(container.firstChild).toHaveClass('alert-danger');
  });

  it('renders with custom className', () => {
    const { container } = render(<ErrorMessage message="Error" className="custom-error" />);
    expect(container.firstChild).toHaveClass('custom-error');
  });
});
