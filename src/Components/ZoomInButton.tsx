import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface ZoomInButtonProps {
  onZoomIn: () => void;
}

const ZoomInButton: React.FC<ZoomInButtonProps> = ({ onZoomIn }) => {
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
};

export default ZoomInButton;
