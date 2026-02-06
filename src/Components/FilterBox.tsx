/**
 * FilterBox component wraps @waylay/react-filter-box which has incomplete TypeScript definitions.
 * The internal API uses `any` types extensively. We suppress these warnings here as the library
 * cannot be modified and the types are not fixable without modifying the library itself.
 */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, react/destructuring-assignment, max-params, react-hooks/exhaustive-deps */

import './react-filter-box.scss';
import './react-datepicker.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import ReactFilterBox, { Expression } from '@waylay/react-filter-box';

import { CODEMIRROR_INIT_DELAY_MS } from '../utils/constants';

/** Storage key for saved searches */
const SAVED_SEARCHES_KEY = 'minimal-history-plugin-saved-searches';

/** Interface for a saved search */
interface SavedSearch {
  name: string;
  query: string;
}

/**
 * Load saved searches from localStorage
 */
function loadSavedSearches(): SavedSearch[] {
  try {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
    if (stored) {
      return JSON.parse(stored) as SavedSearch[];
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

/**
 * Save searches to localStorage
 */
function saveSavedSearches(searches: SavedSearch[]): void {
  try {
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    console.warn('Failed to save searches to localStorage');
  }
}

/**
 * SavedSearchesDropdown component
 * Provides a dropdown UI for saving and loading filter queries
 */
interface SavedSearchesDropdownProps {
  currentQuery: string;
  onLoadQuery: (query: string) => void;
}

// eslint-disable-next-line max-lines-per-function -- Dropdown with state management, local storage, and event handlers
const SavedSearchesDropdown: React.FC<SavedSearchesDropdownProps> = ({ currentQuery, onLoadQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved searches on mount
  useEffect(() => {
    setSavedSearches(loadSavedSearches());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = () => {
    if (!newSearchName.trim() || !currentQuery.trim()) {
      return;
    }
    const newSearches = [
      ...savedSearches.filter(s => s.name !== newSearchName.trim()),
      { name: newSearchName.trim(), query: currentQuery },
    ];
    setSavedSearches(newSearches);
    saveSavedSearches(newSearches);
    setNewSearchName('');
    setIsOpen(false);
  };

  const handleLoad = (search: SavedSearch) => {
    onLoadQuery(search.query);
    setIsOpen(false);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSearches = savedSearches.filter(s => s.name !== name);
    setSavedSearches(newSearches);
    saveSavedSearches(newSearches);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          color: '#555',
        }}
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
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {/* Save section */}
          <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
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
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  fontSize: '12px',
                }}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!newSearchName.trim() || !currentQuery.trim()}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  background: '#f0f0f0',
                  cursor: newSearchName.trim() && currentQuery.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                }}
              >
                Save
              </button>
            </div>
          </div>
          {/* Saved searches list */}
          {savedSearches.length > 0 ? (
            <div>
              {savedSearches.map(search => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Dropdown item with mouse-only interaction
                <div
                  key={search.name}
                  onClick={() => {
                    handleLoad(search);
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <span style={{ fontSize: '13px' }}>{search.name}</span>
                  <button
                    type="button"
                    onClick={e => {
                      handleDelete(search.name, e);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      fontSize: '14px',
                    }}
                    title="Delete search"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '12px', color: '#999', fontSize: '12px', textAlign: 'center' }}>
              No saved searches
            </div>
          )}
        </div>
      )}
    </div>
  );
};

class SimpleReactFilterBox extends ReactFilterBox {
  componentDidMount() {
    if (this.props['query']) {
      // Defer onSubmit to next tick to ensure CodeMirror and AutoCompletePopup
      // are fully initialized. The FilterInput component sets up its CodeMirror
      // instance via a ref callback, which may not complete before componentDidMount.
      // Without this delay, the autoCompleteHandler may not be properly connected,
      // causing typeahead suggestions to fail and filter changes to not update requests.
      setTimeout(() => {
        this.onSubmit(this.props['query']);
      }, 0);
    }
  }

  needAutoCompleteValues(_codeMirror: any, text: string) {
    // Get suggestions from the parser
    let suggestions = this.parser.getSuggestions(text).filter(hintInfo => {
      return !['(', ')', 'OR'].includes(hintInfo.value as string);
    });

    // If no useful suggestions (empty or just AND), and the autoCompleteHandler is available,
    // provide category suggestions to help users discover available filter options
    const hasOnlyAndSuggestion =
      suggestions.length === 0 || (suggestions.length === 1 && suggestions[0]?.value === 'AND');

    if (hasOnlyAndSuggestion && this.props['autoCompleteHandler']) {
      const categories = this.props['autoCompleteHandler'].needCategories();
      if (categories && categories.length > 0) {
        suggestions = categories.map((cat: string) => ({
          value: cat,
          type: 'category',
        }));
      }
    }

    return suggestions;
  }
}

// Custom render function for autocomplete items
// Parameters from react-filter-box AutoCompletePopup:
// - self: HintResult (contains from/to cursor positions and list)
// - data: Completion (contains value, type, hint, render)
// - registerAndGetPickFunc: function to get pick callback
// - cursor: CodeMirror cursor position (unused here)
// - parsedQuery: parsed expression result (unused here)
const customRenderCompletionItem = (
  self: any,
  data: any,
  registerAndGetPickFunc: () => (value: string) => void,
  _cursor: any,
  _parsedQuery: any,
  queryText: string
) => {
  if (data.value?.customType === 'date') {
    const pick = registerAndGetPickFunc();
    const start = Number(self.from.ch);
    // Extract the date portion from the query text starting at cursor position
    const textFromStart = queryText.substring(start);
    const dateCandidate = textFromStart.split(' ')[0] ?? '';
    const parsedDate = new Date(dateCandidate);
    const selected: Date = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    return (
      <div>
        <ReactDatePicker
          selected={selected}
          onChange={(date: Date | null) => {
            const dateString = date?.toISOString().split('T')[0];
            // Fix code mirror cursor position
            if (dateString) {
              self.to.ch = start + (dateString.length + 1);
            }
            pick(dateString ?? '');
          }}
          inline
        />
      </div>
    );
  } else {
    const className = ` hint-value cm-${data.type}`;
    return <div className={className}>{data.value}</div>;
  }
};

const FilterBox = (props: any) => {
  // Compute initial query once and cache it
  const [initialQuery] = useState(() => props.defaultQuery());
  const [query, setQuery] = useState(initialQuery);
  // Key to force remount when loading a saved query
  const [filterBoxKey, setFilterBoxKey] = useState(0);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const queryRef = useRef(query);
  const containerRef = useRef<HTMLDivElement>(null);
  const filterBoxRef = useRef<any>(null);

  // Handler to load a saved query
  const handleLoadQuery = useCallback(
    (savedQuery: string) => {
      setLoadedQuery(savedQuery);
      setQuery(savedQuery);
      setFilterBoxKey(prev => prev + 1);
      props.autoCompleteHandler.setQuery(savedQuery);
    },
    [props.autoCompleteHandler]
  );

  // Initialize autoCompleteHandler with the initial query synchronously.
  // This must happen before the first render to ensure the handler is ready
  // when SimpleReactFilterBox.componentDidMount triggers onSubmit.
  useState(() => {
    props.autoCompleteHandler.setQuery(initialQuery);
  });

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // Update auto complete to not offer same category twice
  useEffect(() => {
    props.autoCompleteHandler.setQuery(query);
  }, [query]);

  // Set up focus listener to show autocomplete immediately
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleFocusIn = (e: FocusEvent) => {
      // Check if focus is on the CodeMirror input
      const target = e.target as HTMLElement;
      if (target.closest('.CodeMirror')) {
        // Delay to ensure CodeMirror is ready
        setTimeout(() => {
          const codeMirror = container.querySelector('.CodeMirror');
          const cm = (codeMirror as any)?.CodeMirror;
          // Trigger autocomplete if input is empty or has minimal content
          if (cm?.getValue?.().trim().length === 0) {
            // Trigger a change event to make react-filter-box show autocomplete
            // We insert and remove a space to trigger the autocomplete popup
            cm.replaceRange(' ', { line: 0, ch: 0 });
            cm.replaceRange('', { line: 0, ch: 0 }, { line: 0, ch: 1 });
          }
        }, CODEMIRROR_INIT_DELAY_MS);
      }
    };

    container.addEventListener('focusin', handleFocusIn);
    return () => {
      container.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  // Cast to any to avoid React type conflicts between @waylay/react-filter-box and project React types
  const FilterBoxComponent = SimpleReactFilterBox as any;

  // Determine which query to use for the filter box
  const effectiveQuery = loadedQuery ?? initialQuery;

  return (
    <div className="form-control" ref={containerRef} style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <FilterBoxComponent
          key={filterBoxKey}
          ref={filterBoxRef}
          options={props.options}
          strictMode
          query={effectiveQuery}
          autoCompleteHandler={props.autoCompleteHandler}
          customRenderCompletionItem={(
            self: any,
            data: any,
            registerAndGetPickFunc: () => (value: string) => void,
            cursor: any,
            parsedQuery: any
          ) => customRenderCompletionItem(self, data, registerAndGetPickFunc, cursor, parsedQuery, queryRef.current)}
          onChange={(newQuery: string) => {
            setQuery(newQuery);
            // Clear loaded query after user modifies
            if (loadedQuery !== null) {
              setLoadedQuery(null);
            }
          }}
          onParseOk={(expressions: Expression[]) => {
            props.onParseOk(expressions);
            (document.activeElement as HTMLElement | null)?.blur();
          }}
        />
      </div>
      <SavedSearchesDropdown currentQuery={query} onLoadQuery={handleLoadQuery} />
    </div>
  );
};

export default FilterBox;
