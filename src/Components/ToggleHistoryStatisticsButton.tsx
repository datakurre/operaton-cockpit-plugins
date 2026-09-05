import './Button.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { FaFire, FaHistory } from 'react-icons/fa';

import { loadSettings, saveSettings } from '../utils/misc';

/**
 * What the diagram shows alongside the process definition.
 *
 * - `off` — nothing
 * - `counts` — a badge per activity with how many times it ran
 * - `heat` — the same badges carrying cumulative time, under a heatmap layer
 */
export type StatisticsMode = 'off' | 'counts' | 'heat';

/** The cycle the button walks on each click. */
const MODE_CYCLE: StatisticsMode[] = ['off', 'counts', 'heat'];

const MODE_LABEL: Record<StatisticsMode, string> = {
  off: 'Show history instance statistics',
  counts: 'Show time heatmap',
  heat: 'Hide history instance statistics',
};

/** Colour of the icon in heat mode, taken from the hot end of the heatmap ramp. */
const HEAT_ICON_COLOR = '#d82c20';

/**
 * Reads the stored mode. It is kept as two booleans rather than one string so that
 * settings and URL parameters written before the heatmap existed still mean what they
 * did: `showHistoricBadges` still turns badges on, `showHeatmap` adds the layer.
 * @returns The mode the stored settings describe
 */
function loadMode(): StatisticsMode {
  const settings = loadSettings();
  if (!settings.showHistoricBadges && !settings.showHeatmap) {
    return 'off';
  }
  return settings.showHeatmap ? 'heat' : 'counts';
}

/**
 * Props for ToggleHistoryStatisticsButton component
 */
interface ToggleHistoryStatisticsButtonProps {
  /** Callback invoked when the mode changes */
  onToggleHistoryStatistics: (mode: StatisticsMode) => void;
}

/**
 * Three-state toggle for the statistics overlays on a process definition diagram:
 * off, execution counts, then a heatmap of cumulative time. Persists the mode.
 *
 * @param props - Component props
 * @param props.onToggleHistoryStatistics - Callback invoked when the mode changes
 * @returns Toggle button component
 */
export const ToggleHistoryStatisticsButton: React.FC<ToggleHistoryStatisticsButtonProps> = ({
  onToggleHistoryStatistics,
}) => {
  const [mode, setMode] = useState<StatisticsMode>(loadMode);

  useEffect(() => {
    onToggleHistoryStatistics(mode);
    saveSettings({
      ...loadSettings(),
      showHistoricBadges: mode !== 'off',
      showHeatmap: mode === 'heat',
    });
  }, [mode, onToggleHistoryStatistics]);

  const handleClick = useCallback(() => {
    setMode(current => MODE_CYCLE[(MODE_CYCLE.indexOf(current) + 1) % MODE_CYCLE.length] ?? 'off');
  }, []);

  // The label names what the next click does, so the third state is discoverable
  // rather than something you find by clicking twice.
  const label = MODE_LABEL[mode];
  const Icon = mode === 'heat' ? FaFire : FaHistory;

  return (
    <button className="toggle-history-statistics-button" title={label} aria-label={label} onClick={handleClick}>
      <Icon
        style={{
          opacity: mode === 'off' ? '0.33' : '1.0',
          fontSize: '133%',
          ...(mode === 'heat' ? { color: HEAT_ICON_COLOR } : {}),
        }}
      />
    </button>
  );
};
