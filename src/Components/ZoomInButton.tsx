import React, { memo } from 'react';
import { FaPlus } from 'react-icons/fa';

interface ZoomInButtonProps {
  onZoomIn: () => void;
}

/**
 * Button to zoom in on BPMN diagram.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param props - Component props
 * @returns Zoom in button
 */
const ZoomInButton: React.FC<ZoomInButtonProps> = memo(({ onZoomIn }) => {
  return (
    <button
      onClick={onZoomIn}
      title="Zoom In"
      aria-label="Zoom In"
      className="zoom-in-button"
      style={{
        marginBottom: 0,
      }}
    >
      <FaPlus size={20} />
    </button>
  );
});

ZoomInButton.displayName = 'ZoomInButton';

export default ZoomInButton;
