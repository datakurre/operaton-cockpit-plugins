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

/** Colour of the icon when the figures came from a capped query */
const PARTIAL_COLOR = '#b8860b';

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
  /**
   * Whether the query hit its result cap. The badges and the heat then describe only the
   * records that fit, and the tab's warning is on the other side of the screen from the
   * diagram, so the button has to carry the caveat too.
   */
  partial?: boolean;
}

/**
 * Three-state toggle for the statistics overlays on a process definition diagram:
 * off, execution counts, then a heatmap of cumulative time. Persists the mode.
 *
 * @param props - Component props
 * @param props.onToggleHistoryStatistics - Callback invoked when the mode changes
 * @param props.partial - Whether the query hit its result cap
 * @returns Toggle button component
 */
export const ToggleHistoryStatisticsButton: React.FC<ToggleHistoryStatisticsButtonProps> = ({
  onToggleHistoryStatistics,
  partial = false,
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
  const action = MODE_LABEL[mode];
  // Only worth saying while something is actually drawn: off, there are no figures for
  // the caveat to be about.
  const caveated = partial && mode !== 'off';
  const label = caveated ? `${action} (result limit reached — figures cover recent activity only)` : action;
  const Icon = mode === 'heat' ? FaFire : FaHistory;
  // Amber wins over the heat red: a caveat about what the figures cover matters more
  // than the mode they are drawn in, and the two never need saying at once.
  let iconColor: string | undefined = undefined;
  if (caveated) {
    iconColor = PARTIAL_COLOR;
  } else if (mode === 'heat') {
    iconColor = HEAT_ICON_COLOR;
  }

  return (
    <button className="toggle-history-statistics-button" title={label} aria-label={label} onClick={handleClick}>
      <Icon
        style={{
          opacity: mode === 'off' ? '0.33' : '1.0',
          fontSize: '133%',
          ...(iconColor !== undefined ? { color: iconColor } : {}),
        }}
      />
    </button>
  );
};
