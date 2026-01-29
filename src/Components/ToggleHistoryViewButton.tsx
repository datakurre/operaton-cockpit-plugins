import './Button.scss';

import React, { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

/**
 * Props for ToggleHistoryViewButton component
 */
interface ToggleHistoryViewButtonProps {
  /** Callback invoked when history view visibility changes */
  onToggleHistoryView: (visible: boolean) => void;
  /** Initial visibility state */
  initial?: boolean;
}

/**
 * Toggle button for switching between history and runtime views.
 *
 * @param props - Component props
 * @param props.onToggleHistoryView - Callback invoked when visibility changes
 * @param props.initial - Initial visibility state
 * @returns Toggle button component
 */
export const ToggleHistoryViewButton: React.FC<ToggleHistoryViewButtonProps> = ({ onToggleHistoryView, initial }) => {
  const [showHistoryView, setShowHistoryView] = useState(Boolean(initial));
  useEffect(() => {
    onToggleHistoryView(showHistoryView);
  }, [showHistoryView, onToggleHistoryView]);
  return (
    <button
      className="toggle-history-view-button"
      title={!showHistoryView ? 'Show history view' : 'Show runtime view'}
      aria-label={!showHistoryView ? 'Show history view' : 'Show runtime view'}
      onClick={() => {
        setShowHistoryView(!showHistoryView);
      }}
    >
      <FaHistory style={{ opacity: !showHistoryView ? '0.33' : '1.0', fontSize: '133%' }} />
    </button>
  );
};
