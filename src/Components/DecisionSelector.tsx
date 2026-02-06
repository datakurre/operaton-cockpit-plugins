/**
 * Decision selector dropdown component.
 * @module Components/DecisionSelector
 */

import React from 'react';
import type { DecisionDefinition } from '../types';

export interface DecisionSelectorProps {
  decisions: DecisionDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/**
 * Dropdown selector for choosing a decision definition to evaluate.
 */
const DecisionSelector: React.FC<DecisionSelectorProps> = ({ decisions, selectedId, onSelect, disabled }) => {
  return (
    <div className="decisions-dashboard__selector">
      <label htmlFor="decision-select">Decision:</label>
      <select
        id="decision-select"
        value={selectedId}
        onChange={e => {
          onSelect(e.target.value);
        }}
        disabled={disabled}
        aria-label="Select decision definition"
      >
        <option value="">-- Select a decision --</option>
        {decisions.map(d => (
          <option key={d.id ?? ''} value={d.id ?? ''}>
            {d.name ?? d.key ?? d.id} (v{d.version})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DecisionSelector;
