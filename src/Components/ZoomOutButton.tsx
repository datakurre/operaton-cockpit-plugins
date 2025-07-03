import React from 'react';
import { FaMinus } from 'react-icons/fa';

interface ZoomOutButtonProps {
  onZoomOut: () => void;
}

const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ onZoomOut }) => {
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
};

export default ZoomOutButton;
