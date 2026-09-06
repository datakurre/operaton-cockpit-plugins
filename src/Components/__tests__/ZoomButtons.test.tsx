/**
 * Tests for zoom button components.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetZoomButton from '../ResetZoomButton';
import ZoomInButton from '../ZoomInButton';
import ZoomOutButton from '../ZoomOutButton';

describe('ResetZoomButton', () => {
  it('should render with correct aria-label', () => {
    const onResetZoom = jest.fn();
    render(<ResetZoomButton onResetZoom={onResetZoom} />);

    expect(screen.getByRole('button', { name: 'Reset Zoom' })).toBeInTheDocument();
  });

  it('should call onResetZoom when clicked', async () => {
    const user = userEvent.setup();
    const onResetZoom = jest.fn();
    render(<ResetZoomButton onResetZoom={onResetZoom} />);

    const button = screen.getByRole('button', { name: 'Reset Zoom' });
    await user.click(button);

    expect(onResetZoom).toHaveBeenCalledTimes(1);
  });

  it('should have correct class name and icon', () => {
    const onResetZoom = jest.fn();
    const { container } = render(<ResetZoomButton onResetZoom={onResetZoom} />);

    const button = screen.getByRole('button', { name: 'Reset Zoom' });
    expect(button).toHaveClass('btn', 'btn-default', 'reset-zoom-button');
    const icon = container.querySelector('span.glyphicon.glyphicon-screenshot');
    expect(icon).toBeInTheDocument();
  });
});

describe('ZoomInButton', () => {
  it('should render with correct aria-label', () => {
    const onZoomIn = jest.fn();
    render(<ZoomInButton onZoomIn={onZoomIn} />);

    expect(screen.getByRole('button', { name: 'Zoom In' })).toBeInTheDocument();
  });

  it('should call onZoomIn when clicked', async () => {
    const user = userEvent.setup();
    const onZoomIn = jest.fn();
    render(<ZoomInButton onZoomIn={onZoomIn} />);

    const button = screen.getByRole('button', { name: 'Zoom In' });
    await user.click(button);

    expect(onZoomIn).toHaveBeenCalledTimes(1);
  });

  it('should have correct class name and icon', () => {
    const onZoomIn = jest.fn();
    const { container } = render(<ZoomInButton onZoomIn={onZoomIn} />);

    const button = screen.getByRole('button', { name: 'Zoom In' });
    expect(button).toHaveClass('btn', 'btn-default', 'zoom-in-button', 'in');
    const icon = container.querySelector('span.glyphicon.glyphicon-plus');
    expect(icon).toBeInTheDocument();
  });

  it('should call callback multiple times on multiple clicks', async () => {
    const user = userEvent.setup();
    const onZoomIn = jest.fn();
    render(<ZoomInButton onZoomIn={onZoomIn} />);

    const button = screen.getByRole('button', { name: 'Zoom In' });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onZoomIn).toHaveBeenCalledTimes(3);
  });
});

describe('ZoomOutButton', () => {
  it('should render with correct aria-label', () => {
    const onZoomOut = jest.fn();
    render(<ZoomOutButton onZoomOut={onZoomOut} />);

    expect(screen.getByRole('button', { name: 'Zoom Out' })).toBeInTheDocument();
  });

  it('should call onZoomOut when clicked', async () => {
    const user = userEvent.setup();
    const onZoomOut = jest.fn();
    render(<ZoomOutButton onZoomOut={onZoomOut} />);

    const button = screen.getByRole('button', { name: 'Zoom Out' });
    await user.click(button);

    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it('should have correct class name and icon', () => {
    const onZoomOut = jest.fn();
    const { container } = render(<ZoomOutButton onZoomOut={onZoomOut} />);

    const button = screen.getByRole('button', { name: 'Zoom Out' });
    expect(button).toHaveClass('btn', 'btn-default', 'zoom-out-button', 'out');
    const icon = container.querySelector('span.glyphicon.glyphicon-minus');
    expect(icon).toBeInTheDocument();
  });

  it('should call callback multiple times on multiple clicks', async () => {
    const user = userEvent.setup();
    const onZoomOut = jest.fn();
    render(<ZoomOutButton onZoomOut={onZoomOut} />);

    const button = screen.getByRole('button', { name: 'Zoom Out' });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onZoomOut).toHaveBeenCalledTimes(3);
  });
});
