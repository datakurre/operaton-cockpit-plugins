import React from 'react';

/** Available button style variants */
export type FormButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface FormButtonProps {
  /** Button label text */
  children: React.ReactNode;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler for non-submit buttons */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Visual style variant */
  variant?: FormButtonVariant;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Additional CSS class name */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/** Style configurations for each button variant */
const VARIANT_STYLES: Record<FormButtonVariant, { background: string; disabledBackground: string }> = {
  primary: { background: '#495057', disabledBackground: '#adb5bd' },
  secondary: { background: '#6c757d', disabledBackground: '#adb5bd' },
  danger: { background: '#dc3545', disabledBackground: '#e4606d' },
  success: { background: '#28a745', disabledBackground: '#5dd879' },
};

/** Default minimum button width in pixels */
const DEFAULT_MIN_WIDTH = 90;

/**
 * Reusable form button component with consistent styling across the plugin.
 * Supports multiple variants and disabled state.
 *
 * @example
 * ```tsx
 * <FormButton variant="primary" type="submit">
 *   Save Changes
 * </FormButton>
 *
 * <FormButton variant="secondary" onClick={handleRemove}>
 *   Remove
 * </FormButton>
 * ```
 */
export const FormButton: React.FC<FormButtonProps> = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  variant = 'primary',
  minWidth = DEFAULT_MIN_WIDTH,
  className,
  'aria-label': ariaLabel,
}) => {
  const variantStyle = VARIANT_STYLES[variant];

  const style: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: disabled ? variantStyle.disabledBackground : variantStyle.background,
    color: 'white',
    border: 'none',
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    minWidth: `${minWidth}px`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FormButton;
