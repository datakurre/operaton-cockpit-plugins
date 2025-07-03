import React from 'react';
import { IoMdLocate } from 'react-icons/io';

interface ResetZoomButtonProps {
  onResetZoom: () => void;
}

const ResetZoomButton: React.FC<ResetZoomButtonProps> = ({ onResetZoom }) => {
  return (
    <button onClick={onResetZoom} title="Reset Zoom" aria-label="Reset Zoom" className="reset-zoom-button">
      <IoMdLocate size={25} />
    </button>
  );
};

export default ResetZoomButton;
