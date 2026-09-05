import './Button.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { FaFire } from 'react-icons/fa';

import { loadSettings, saveSettings } from '../utils/misc';

/**
 * Props for ToggleHeatmapButton component
 */
interface ToggleHeatmapButtonProps {
  /** Callback invoked when heatmap visibility changes */
  onToggleHeatmap: (visible: boolean) => void;
  /**
   * Whether the activity history behind the heat was cut short. Every total is then
   * a floor rather than the real figure, so say so instead of letting a partial
   * reading pass for the whole one.
   */
  partial?: boolean;
}

/** Colour of the icon when the heatmap is on, taken from the hot end of the ramp. */
const HEAT_ICON_COLOR = '#d82c20';

/** Colour of the icon when the heat was computed from a truncated history */
const PARTIAL_HEAT_COLOR = '#b8860b';

/**
 * Toggle button for the time heatmap on a process instance diagram.
 * Persists the user's preference in localStorage.
 *
 * @param props - Component props
 * @param props.onToggleHeatmap - Callback invoked when visibility changes
 * @param props.partial - Whether the heat was computed from a truncated history
 * @returns Toggle button component
 */
export const ToggleHeatmapButton: React.FC<ToggleHeatmapButtonProps> = ({ onToggleHeatmap, partial = false }) => {
  const [showHeatmap, setShowHeatmap] = useState(loadSettings().showInstanceHeatmap);

  useEffect(() => {
    onToggleHeatmap(showHeatmap);
    saveSettings({
      ...loadSettings(),
      showInstanceHeatmap: showHeatmap,
    });
  }, [showHeatmap, onToggleHeatmap]);

  const handleClick = useCallback(() => {
    setShowHeatmap(prev => !prev);
  }, []);

  // The label carries the warning, not just the colour, so it reaches screen readers too.
  const action = !showHeatmap ? 'Show time heatmap' : 'Hide time heatmap';
  const label = partial ? `${action} (history truncated — totals may be incomplete)` : action;

  return (
    <button className="toggle-heatmap-button" title={label} aria-label={label} onClick={handleClick}>
      <FaFire
        style={{
          opacity: !showHeatmap ? '0.33' : '1.0',
          fontSize: '133%',
          ...(showHeatmap ? { color: partial ? PARTIAL_HEAT_COLOR : HEAT_ICON_COLOR } : {}),
        }}
      />
    </button>
  );
};
