/**
 * FilterBox component using react-select-filter-box.
 *
 * This component provides a token-based filter builder with autocomplete support,
 * saved searches, and schema-based configuration.
 *
 * @module
 */
import 'react-select-filter-box/styles';
import './FilterBox.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// Import from react-select-filter-box with type casting to avoid
// React type conflicts from the library's nested node_modules
import {
  FilterBox as ReactSelectFilterBoxRaw,
  serialize,
  deserialize,
  type FilterExpression,
  type FilterSchema,
  type SerializedExpression,
} from 'react-select-filter-box';

import { type LegacyExpression, toLegacyExpressions } from '../utils/filterSchema';
import { type FilterConflict, validateFilterConflicts } from '../utils/filterExpressionParsers';

// Cast the component to avoid React version type conflicts
// The library bundles its own @types/react which conflicts with ours
const ReactSelectFilterBox = ReactSelectFilterBoxRaw as unknown as React.FC<{
  schema: FilterSchema;
  value: FilterExpression[];
  onChange: (expressions: FilterExpression[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  usePortal?: boolean;
}>;

/** Default storage key prefix for saved searches */
const SAVED_SEARCHES_KEY_PREFIX = 'minimal-history-plugin-saved-searches';

/** Interface for a saved search */
interface SavedSearch {
  name: string;
  /** Serialized filter expressions */
  expressions: SerializedExpression[];
}

/**
 * Load saved searches from localStorage.
 * @param storageKey - Storage key for this specific filter context
 * @returns Array of saved searches
 */
function loadSavedSearches(storageKey: string): SavedSearch[] {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as SavedSearch[];
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

/**
 * Save searches to localStorage.
 * @param storageKey - Storage key for this specific filter context
 * @param searches - Array of saved searches to persist
 */
function saveSavedSearches(storageKey: string, searches: SavedSearch[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(searches));
  } catch {
    console.warn('Failed to save searches to localStorage');
  }
}

/**
 * Props for SavedSearchesDropdown component
 */
interface SavedSearchesDropdownProps {
  /** Current serialized expressions */
  currentExpressions: SerializedExpression[];
  /** Callback when loading a saved search */
  onLoadExpressions: (expressions: SerializedExpression[]) => void;
  /** Storage key for this specific filter context */
  storageKey: string;
}

/**
 * SavedSearchesDropdown component.
 * Provides a dropdown UI for saving and loading filter queries.
 */
const SavedSearchesDropdown: React.FC<SavedSearchesDropdownProps> = ({
  currentExpressions,
  onLoadExpressions,
  storageKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved searches on mount
  useEffect(() => {
    setSavedSearches(loadSavedSearches(storageKey));
  }, [storageKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = useCallback((): void => {
    if (!newSearchName.trim() || currentExpressions.length === 0) {
      return;
    }
    const newSearches = [
      ...savedSearches.filter(s => s.name !== newSearchName.trim()),
      { name: newSearchName.trim(), expressions: currentExpressions },
    ];
    setSavedSearches(newSearches);
    saveSavedSearches(storageKey, newSearches);
    setNewSearchName('');
    setIsOpen(false);
  }, [currentExpressions, newSearchName, savedSearches, storageKey]);

  const handleLoad = useCallback(
    (search: SavedSearch): void => {
      onLoadExpressions(search.expressions);
      setIsOpen(false);
    },
    [onLoadExpressions]
  );

  const handleDelete = useCallback(
    (name: string, e: React.MouseEvent): void => {
      e.stopPropagation();
      const newSearches = savedSearches.filter(s => s.name !== name);
      setSavedSearches(newSearches);
      saveSavedSearches(storageKey, newSearches);
    },
    [savedSearches, storageKey]
  );

  const canSave = newSearchName.trim() && currentExpressions.length > 0;

  return (
    <div ref={dropdownRef} className="filter-box-saved-searches">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="filter-box-saved-searches__toggle"
        title="Saved searches"
        aria-label="Saved searches"
        aria-expanded={isOpen}
      >
        {/* Disk icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2h10l2 2v10H2V2zm1 1v10h10V4.414L11.586 3H3zm1 5h8v5H4V8zm1 1v3h6V9H5z" />
        </svg>
        {/* Chevron down */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 3l3 4 3-4H2z" />
        </svg>
      </button>
      {isOpen && (
        <div className="filter-box-saved-searches__dropdown">
          {/* Save section */}
          <div className="filter-box-saved-searches__save-section">
            <div className="filter-box-saved-searches__save-row">
              <input
                type="text"
                placeholder="Save search as..."
                value={newSearchName}
                onChange={e => {
                  setNewSearchName(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
                className="filter-box-saved-searches__input"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="filter-box-saved-searches__save-button"
              >
                Save
              </button>
            </div>
          </div>
          {/* Saved searches list */}
          {savedSearches.length > 0 ? (
            <div className="filter-box-saved-searches__list">
              {savedSearches.map(search => (
                <div
                  key={search.name}
                  onClick={() => {
                    handleLoad(search);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleLoad(search);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="filter-box-saved-searches__item"
                >
                  <span className="filter-box-saved-searches__item-name">{search.name}</span>
                  <button
                    type="button"
                    onClick={e => {
                      handleDelete(search.name, e);
                    }}
                    className="filter-box-saved-searches__delete-button"
                    title="Delete search"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="filter-box-saved-searches__empty">No saved searches</div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Props for FilterBox component
 */
export interface FilterBoxProps {
  /** Filter schema configuration */
  schema: FilterSchema;
  /** Initial filter expressions */
  initialExpressions?: FilterExpression[];
  /** Callback when expressions change and are valid */
  onFilterChange: (expressions: FilterExpression[]) => void;
  /** Optional callback receiving legacy format for backward compatibility */
  onLegacyFilterChange?: (expressions: LegacyExpression[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the filter box is disabled */
  disabled?: boolean;
  /** Storage key for saved searches - allows separate saved searches per context */
  storageKey?: string;
  /** Optional conflict rules for validating filter combinations */
  conflictRules?: FilterConflict[];
}

/**
 * FilterBox component.
 * A token-based filter builder with autocomplete support.
 */
const FilterBox: React.FC<FilterBoxProps> = ({
  schema,
  initialExpressions = [],
  onFilterChange,
  onLegacyFilterChange,
  placeholder = 'Add a filter...',
  disabled = false,
  storageKey = SAVED_SEARCHES_KEY_PREFIX,
  conflictRules,
}) => {
  const [expressions, setExpressions] = useState<FilterExpression[]>(initialExpressions);
  const [key, setKey] = useState(0);
  const [conflicts, setConflicts] = useState<FilterConflict[]>([]);
  const previousInitialExpressionsRef = useRef<string>(JSON.stringify(initialExpressions));

  // Serialize expressions for saved searches
  const serializedExpressions = serialize(expressions);

  // Validate for conflicts whenever expressions change
  useEffect(() => {
    if (conflictRules && conflictRules.length > 0) {
      const legacyExprs = toLegacyExpressions(expressions);
      const detected = validateFilterConflicts(legacyExprs, conflictRules);
      setConflicts(detected);
    } else {
      setConflicts([]);
    }
  }, [expressions, conflictRules]);

  // Update expressions when initialExpressions prop changes
  useEffect(() => {
    const currentSerialized = JSON.stringify(initialExpressions);
    if (currentSerialized !== previousInitialExpressionsRef.current) {
      previousInitialExpressionsRef.current = currentSerialized;
      setExpressions(initialExpressions);
      // Force re-render of ReactSelectFilterBox to show new expressions
      setKey(prev => prev + 1);
      // Trigger callbacks with new expressions
      if (initialExpressions.length > 0) {
        onFilterChange(initialExpressions);
        if (onLegacyFilterChange) {
          try {
            onLegacyFilterChange(toLegacyExpressions(initialExpressions));
          } catch {
            // Skip legacy callback if conversion fails
          }
        }
      }
    }
  }, [initialExpressions, onFilterChange, onLegacyFilterChange]);

  // Handle expression changes
  const handleChange = useCallback(
    (newExpressions: FilterExpression[]): void => {
      setExpressions(newExpressions);
      onFilterChange(newExpressions);

      // Also emit legacy format if callback provided
      if (onLegacyFilterChange) {
        onLegacyFilterChange(toLegacyExpressions(newExpressions));
      }
    },
    [onFilterChange, onLegacyFilterChange]
  );

  // Handle loading saved expressions
  const handleLoadExpressions = useCallback(
    (serialized: SerializedExpression[]): void => {
      try {
        const loadedExpressions = deserialize(serialized, schema);
        // Update expressions first, then force re-render on next tick
        setExpressions(loadedExpressions);
        // Use setTimeout to ensure state update completes before forcing re-render
        setTimeout(() => {
          setKey(prev => prev + 1);
        }, 0);
        onFilterChange(loadedExpressions);

        if (onLegacyFilterChange) {
          onLegacyFilterChange(toLegacyExpressions(loadedExpressions));
        }
      } catch (error) {
        console.error('Failed to deserialize saved expressions:', error);
        console.error('Serialized expressions:', serialized);
        console.warn('Failed to deserialize saved expressions');
      }
    },
    [schema, onFilterChange, onLegacyFilterChange]
  );

  return (
    <div className="filter-box-container">
      <div className="filter-box-wrapper">
        <ReactSelectFilterBox
          key={key}
          schema={schema}
          value={expressions}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          usePortal={false}
        />
      </div>
      <SavedSearchesDropdown
        currentExpressions={serializedExpressions}
        onLoadExpressions={handleLoadExpressions}
        storageKey={storageKey}
      />
      {conflicts.length > 0 ? (
        <div className="filter-box-conflicts" role="alert">
          <span className="filter-box-conflicts__icon" aria-hidden="true">
            ⚠️
          </span>
          <span className="filter-box-conflicts__message">
            {conflicts.length === 1
              ? conflicts[0]?.reason
              : `${conflicts.length} filter conflicts: ${conflicts.map(c => c.reason).join('; ')}`}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default FilterBox;

// Re-export types for convenience
export type { FilterExpression, FilterSchema, LegacyExpression, FilterConflict };
