import './Button.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { GiStrikingArrows } from 'react-icons/gi';

import { loadSettings, saveSettings } from '../utils/misc';

/**
 * Props for ToggleSequenceFlowButton component
 */
interface ToggleSequenceFlowButtonProps {
  /** Callback invoked when sequence flow visibility changes */
  onToggleSequenceFlow: (visible: boolean) => void;
}

/**
 * Toggle button for showing/hiding sequence flow on BPMN diagrams.
 * Persists the user's preference in localStorage.
 *
 * @param props - Component props
 * @param props.onToggleSequenceFlow - Callback invoked when visibility changes
 * @returns Toggle button component
 */
export const ToggleSequenceFlowButton: React.FC<ToggleSequenceFlowButtonProps> = ({ onToggleSequenceFlow }) => {
  const [showSequenceFlow, setShowSequenceFlow] = useState(loadSettings().showSequenceFlow);

  useEffect(() => {
    onToggleSequenceFlow(showSequenceFlow);
    saveSettings({
      ...loadSettings(),
      showSequenceFlow,
    });
  }, [showSequenceFlow, onToggleSequenceFlow]);

  const handleClick = useCallback(() => {
    setShowSequenceFlow(prev => !prev);
  }, []);

  return (
    <button
      className="toggle-sequence-flow-button"
      title={!showSequenceFlow ? 'Show sequence flow' : 'Hide sequence flow'}
      aria-label={!showSequenceFlow ? 'Show sequence flow' : 'Hide sequence flow'}
      onClick={handleClick}
    >
      <GiStrikingArrows style={{ opacity: !showSequenceFlow ? '0.33' : '1.0', fontSize: '133%' }} />
    </button>
  );
};
