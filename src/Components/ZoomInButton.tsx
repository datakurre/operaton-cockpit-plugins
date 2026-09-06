import React, { memo } from 'react';

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
      className="btn btn-default zoom-in-button in"
      style={{
        marginBottom: 0,
      }}
    >
      <span className="glyphicon glyphicon-plus" />
    </button>
  );
});

ZoomInButton.displayName = 'ZoomInButton';

export default ZoomInButton;
