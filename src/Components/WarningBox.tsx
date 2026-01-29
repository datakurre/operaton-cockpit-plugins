import React from 'react';

interface WarningBoxProps {
  /** Warning message content */
  children: React.ReactNode;
  /** Optional title (defaults to "Warning") */
  title?: string;
  /** Additional CSS class name */
  className?: string;
}

/** Warning box styling constants */
const WARNING_STYLES: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '2px',
  marginBottom: '15px',
};

/**
 * Reusable warning box component for displaying cautionary messages.
 * Uses Bootstrap-like warning colors (yellow/amber).
 *
 * @example
 * ```tsx
 * <WarningBox>
 *   Process instance modification is a powerful operation that can lead to
 *   inconsistent process states. Use with extreme care.
 * </WarningBox>
 *
 * <WarningBox title="Danger Zone">
 *   This action cannot be undone.
 * </WarningBox>
 * ```
 */
export const WarningBox: React.FC<WarningBoxProps> = ({ children, title = 'Warning', className }) => {
  return (
    <div role="alert" aria-live="polite" style={WARNING_STYLES} className={className}>
      <strong>⚠️ {title}:</strong> {children}
    </div>
  );
};

export default WarningBox;
