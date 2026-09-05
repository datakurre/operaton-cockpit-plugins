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
  /**
   * Whether the activity history behind the path was cut short. The drawn path is then
   * complete only up to the point the records stop, so say so rather than letting a
   * partial path read as the whole story.
   */
  partial?: boolean;
}

/** Colour of the icon when the path was drawn from a truncated history */
const PARTIAL_PATH_COLOR = '#b8860b';

/**
 * Toggle button for showing/hiding sequence flow on BPMN diagrams.
 * Persists the user's preference in localStorage.
 *
 * @param props - Component props
 * @param props.onToggleSequenceFlow - Callback invoked when visibility changes
 * @param props.partial - Whether the path was drawn from a truncated history
 * @returns Toggle button component
 */
export const ToggleSequenceFlowButton: React.FC<ToggleSequenceFlowButtonProps> = ({
  onToggleSequenceFlow,
  partial = false,
}) => {
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

  // The label carries the warning, not just the colour, so it reaches screen readers too.
  const action = !showSequenceFlow ? 'Show sequence flow' : 'Hide sequence flow';
  const label = partial ? `${action} (history truncated — path may be incomplete)` : action;

  return (
    <button className="toggle-sequence-flow-button" title={label} aria-label={label} onClick={handleClick}>
      <GiStrikingArrows
        style={{
          opacity: !showSequenceFlow ? '0.33' : '1.0',
          fontSize: '133%',
          ...(partial ? { color: PARTIAL_PATH_COLOR } : {}),
        }}
      />
    </button>
  );
};
