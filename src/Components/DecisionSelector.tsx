/**
 * Decision selector dropdown component with autocomplete and version selection.
 * @module Components/DecisionSelector
 */

import React, { useMemo, useState } from 'react';
import type { DecisionDefinition } from '../types';

export interface DecisionSelectorProps {
  decisions: DecisionDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

interface GroupedDecision {
  key: string;
  name: string;
  versions: DecisionDefinition[];
}

/**
 * Groups decisions by key and sorts versions descending.
 * @param decisions - Array of decision definitions
 * @returns Array of grouped decisions
 */
function groupDecisionsByKey(decisions: DecisionDefinition[]): GroupedDecision[] {
  const groups = new Map<string, GroupedDecision>();

  decisions.forEach(d => {
    const key = d.key ?? d.id ?? '';
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: d.name ?? key,
        versions: [],
      });
    }
    groups.get(key)?.versions.push(d);
  });

  // Sort versions descending (newest first)
  groups.forEach(group => {
    group.versions.sort((a, b) => (b.version ?? 0) - (a.version ?? 0));
  });

  return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Dropdown selector for choosing a decision definition to evaluate.
 * Supports autocomplete filtering and version selection.
 */
const DecisionSelector: React.FC<DecisionSelectorProps> = ({ decisions, selectedId, onSelect, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const groupedDecisions = useMemo(() => groupDecisionsByKey(decisions), [decisions]);

  const selectedDecision = useMemo(
    () => decisions.find(d => d.id === selectedId),
    [decisions, selectedId]
  );

  const currentVersions = useMemo(() => {
    if (!selectedDecision) {
      return [];
    }
    const group = groupedDecisions.find(g => g.key === selectedDecision.key);
    return group?.versions ?? [];
  }, [groupedDecisions, selectedDecision]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) {
      return groupedDecisions;
    }
    const term = searchTerm.toLowerCase();
    return groupedDecisions.filter(
      g => g.name.toLowerCase().includes(term) || g.key.toLowerCase().includes(term)
    );
  }, [groupedDecisions, searchTerm]);

  const showDropdown = isFocused && !selectedDecision && filteredGroups.length > 0;

  return (
    <div className="decision-selector">
      <div className="decision-selector__controls">
        <input
          id="decision-search"
          type="text"
          className="decision-selector__search"
          placeholder="Select decision..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            // Delay to allow click on dropdown
            setTimeout(() => {
              setIsFocused(false);
            }, 200);
          }}
          disabled={disabled}
          aria-label="Select decision definition"
        />
        {showDropdown && (
          <select
            className="decision-selector__dropdown"
            size={Math.min(10, filteredGroups.length)}
            onChange={e => {
              const value = e.target.value;
              if (value) {
                onSelect(value);
                setSearchTerm('');
                setIsFocused(false);
              }
            }}
            disabled={disabled}
          >
            {filteredGroups.map(group => (
              <option key={group.versions[0]?.id ?? group.key} value={group.versions[0]?.id ?? ''}>
                {group.name} (v{group.versions[0]?.version})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedDecision && (
        <div className="decision-selector__selected">
          <span className="decision-selector__name">
            {selectedDecision.name ?? selectedDecision.key ?? selectedDecision.id}
          </span>
          <button
            type="button"
            className="btn btn-link btn-xs decision-selector__version-toggle"
            onClick={() => {
              setShowVersions(!showVersions);
            }}
            disabled={disabled || currentVersions.length <= 1}
            title="Switch version"
          >
            v{selectedDecision.version}
            {currentVersions.length > 1 && (
              <span className="glyphicon glyphicon-triangle-bottom" style={{ marginLeft: 4 }} />
            )}
          </button>
          <button
            type="button"
            className="btn btn-link btn-xs decision-selector__clear"
            onClick={() => {
              onSelect('');
              setSearchTerm('');
            }}
            disabled={disabled}
            title="Clear selection"
          >
            <span className="glyphicon glyphicon-remove" />
          </button>
        </div>
      )}

      {showVersions && currentVersions.length > 1 && (
        <div className="decision-selector__versions">
          <div className="decision-selector__versions-title">Available versions:</div>
          {currentVersions.map(v => (
            <button
              key={v.id ?? ''}
              type="button"
              className={`decision-selector__version-item ${v.id === selectedId ? 'active' : ''}`}
              onClick={() => {
                onSelect(v.id ?? '');
                setShowVersions(false);
              }}
              disabled={disabled}
            >
              Version {v.version}
              {v.id === selectedId && <span className="glyphicon glyphicon-ok" style={{ marginLeft: 8 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DecisionSelector;
