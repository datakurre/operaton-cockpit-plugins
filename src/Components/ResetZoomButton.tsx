import React, { memo } from 'react';

interface ResetZoomButtonProps {
  onResetZoom: () => void;
}

/**
 * Button to reset BPMN diagram zoom to fit viewport.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param props - Component props
 * @returns Zoom reset button
 */
const ResetZoomButton: React.FC<ResetZoomButtonProps> = memo(({ onResetZoom }) => {
  return (
    <button
      onClick={onResetZoom}
      title="Reset Zoom"
      aria-label="Reset Zoom"
      className="btn btn-default reset-zoom-button"
    >
      <span className="glyphicon glyphicon-screenshot" />
    </button>
  );
});

ResetZoomButton.displayName = 'ResetZoomButton';

export default ResetZoomButton;
