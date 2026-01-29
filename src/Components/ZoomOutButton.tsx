import React, { memo } from 'react';
import { FaMinus } from 'react-icons/fa';

interface ZoomOutButtonProps {
  onZoomOut: () => void;
}

/**
 * Button to zoom out on BPMN diagram.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param props - Component props
 * @returns Zoom out button
 */
const ZoomOutButton: React.FC<ZoomOutButtonProps> = memo(({ onZoomOut }) => {
  return (
    <button
      onClick={onZoomOut}
      title="Zoom Out"
      aria-label="Zoom Out"
      className="zoom-out-button"
      style={{
        marginTop: -1,
      }}
    >
      <FaMinus size={20} />
    </button>
  );
});

ZoomOutButton.displayName = 'ZoomOutButton';

export default ZoomOutButton;
