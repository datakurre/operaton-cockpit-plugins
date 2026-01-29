import './Button.scss';

import React, { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

import { loadSettings, saveSettings } from '../utils/misc';

/**
 * Props for ToggleHistoryStatisticsButton component
 */
interface ToggleHistoryStatisticsButtonProps {
  /** Callback invoked when history statistics visibility changes */
  onToggleHistoryStatistics: (visible: boolean) => void;
}

/**
 * Toggle button for showing/hiding history statistics badges on BPMN diagrams.
 * Persists the user's preference in localStorage.
 *
 * @param props - Component props
 * @param props.onToggleHistoryStatistics - Callback invoked when visibility changes
 * @returns Toggle button component
 */
export const ToggleHistoryStatisticsButton: React.FC<ToggleHistoryStatisticsButtonProps> = ({
  onToggleHistoryStatistics,
}) => {
  const [showHistoricBadges, setShowHistoricBadges] = useState(loadSettings().showHistoricBadges);
  useEffect(() => {
    onToggleHistoryStatistics(showHistoricBadges);
    saveSettings({
      ...loadSettings(),
      showHistoricBadges,
    });
  }, [showHistoricBadges, onToggleHistoryStatistics]);
  return (
    <button
      className="toggle-history-statistics-button"
      title={!showHistoricBadges ? 'Show history instance statistics' : 'Hide history instance statistics'}
      aria-label={!showHistoricBadges ? 'Show history instance statistics' : 'Hide history instance statistics'}
      onClick={() => {
        setShowHistoricBadges(!showHistoricBadges);
      }}
    >
      <FaHistory style={{ opacity: !showHistoricBadges ? '0.33' : '1.0', fontSize: '133%' }} />
    </button>
  );
};
