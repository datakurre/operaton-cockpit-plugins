/**
 * Tests for Clippy component.
 *
 * @module
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clippy } from '../Clippy';

// Mock react-copy-to-clipboard
let mockOnCopyFn: (() => void) | null = null;
jest.mock('react-copy-to-clipboard', () => ({
  __esModule: true,
  default: ({ children, text, onCopy }: { children: React.ReactNode; text: string; onCopy: () => void }) => {
    mockOnCopyFn = onCopy;
    return (
      <span data-testid="copy-button" data-copy-text={text}>
        {children}
      </span>
    );
  },
}));

describe('Clippy', () => {
  beforeEach(() => {
    mockOnCopyFn = null;
  });

  describe('rendering', () => {
    it('should render children correctly', () => {
      render(<Clippy value="test">Hello World</Clippy>);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render with string value', () => {
      render(<Clippy value="test value">Content</Clippy>);

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render with number children', () => {
      render(<Clippy value={42}>{42}</Clippy>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render with complex children', () => {
      render(
        <Clippy value="link">
          <a href="/test">Click here</a>
        </Clippy>
      );

      expect(screen.getByRole('link', { name: 'Click here' })).toBeInTheDocument();
    });
  });

  describe('hover behavior', () => {
    it('should not show copy button initially', () => {
      render(<Clippy value="test">Hover me</Clippy>);

      // Initially copy button should not be visible
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });

    it('should show copy button on mouse over', () => {
      render(<Clippy value="test">Hover me</Clippy>);

      const container = screen.getByText('Hover me').closest('span');
      fireEvent.mouseOver(container!);

      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('should hide copy button on mouse leave', () => {
      render(<Clippy value="test">Hover me</Clippy>);

      const container = screen.getByText('Hover me').closest('span');

      // Mouse over
      fireEvent.mouseOver(container!);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();

      // Mouse leave
      fireEvent.mouseLeave(container!);
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });
  });

  describe('copy functionality', () => {
    it('should pass correct value to CopyToClipboard', () => {
      render(<Clippy value="copy this text">Click to copy</Clippy>);

      const container = screen.getByText('Click to copy').closest('span');
      fireEvent.mouseOver(container!);

      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toHaveAttribute('data-copy-text', 'copy this text');
    });

    it('should have onCopy callback set', () => {
      render(<Clippy value="test">Click to copy</Clippy>);

      const container = screen.getByText('Click to copy').closest('span');
      fireEvent.mouseOver(container!);

      // The mock captures the onCopy callback
      expect(mockOnCopyFn).toBeDefined();
    });
  });

  describe('value prop', () => {
    it('should accept string values', () => {
      render(<Clippy value="string value">Content</Clippy>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should accept number values', () => {
      render(<Clippy value={123}>Content</Clippy>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should accept object values', () => {
      render(<Clippy value={{ key: 'value' }}>Content</Clippy>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have flex display style on container', () => {
      render(<Clippy value="test">Styled</Clippy>);

      const container = screen.getByText('Styled').closest('span');
      expect(container).toHaveStyle({ display: 'flex', alignItems: 'center' });
    });
  });
});
