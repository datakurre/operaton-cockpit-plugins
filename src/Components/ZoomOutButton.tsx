import React, { memo } from 'react';

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
      className="btn btn-default zoom-out-button out"
      style={{
        marginTop: -1,
      }}
    >
      <span className="glyphicon glyphicon-minus" />
    </button>
  );
});

ZoomOutButton.displayName = 'ZoomOutButton';

export default ZoomOutButton;
