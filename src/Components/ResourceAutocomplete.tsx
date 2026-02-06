/**
 * Resource Autocomplete Component
 *
 * Provides autocomplete for resource IDs based on the resource type.
 * Fetches appropriate resources from the Operaton/Camunda API.
 * Also allows typing "*" for all resources.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { API } from '../types';
import {
  RESOURCE_TYPE_PROCESS_DEFINITION,
  RESOURCE_TYPE_TASK,
  RESOURCE_TYPE_DEPLOYMENT,
  RESOURCE_TYPE_DECISION_DEFINITION,
  RESOURCE_TYPE_TENANT,
} from '../utils/constants';
import { get, ApiError } from '../utils/api';

interface ResourceAutocompleteProps {
  /** API configuration */
  api: API;
  /** Resource type ID */
  resourceType: number;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

interface ResourceItem {
  id: string;
  name?: string;
  key?: string;
}

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;
/** Maximum suggestions to show */
const MAX_SUGGESTIONS = 10;

/**
 * Get the appropriate API endpoint and parameters for a resource type.
 * @param resourceType - The resource type ID
 * @returns Endpoint information or null if no autocomplete available
 */
function getResourceEndpoint(resourceType: number): {
  endpoint: string;
  idField: string;
  nameField?: string;
  searchParam: string;
  enumValues?: string[];
} | null {
  switch (resourceType) {
    case 0: // Application
      return {
        endpoint: '',
        idField: '',
        searchParam: '',
        enumValues: ['cockpit', 'tasklist', 'admin', '*'],
      };
    case 1: // User
      return { endpoint: '/user', idField: 'id', nameField: 'firstName', searchParam: 'idLike' };
    case 2: // Group
      return { endpoint: '/group', idField: 'id', nameField: 'name', searchParam: 'idLike' };
    case RESOURCE_TYPE_PROCESS_DEFINITION:
      return { endpoint: '/process-definition', idField: 'key', nameField: 'name', searchParam: 'keyLike' };
    case RESOURCE_TYPE_TASK:
      return { endpoint: '/task', idField: 'id', nameField: 'name', searchParam: 'taskDefinitionKey' };
    case RESOURCE_TYPE_DEPLOYMENT:
      return { endpoint: '/deployment', idField: 'id', nameField: 'name', searchParam: 'nameLike' };
    case RESOURCE_TYPE_DECISION_DEFINITION:
      return { endpoint: '/decision-definition', idField: 'key', nameField: 'name', searchParam: 'keyLike' };
    case RESOURCE_TYPE_TENANT:
      return {
        endpoint: '/decision-requirements-definition',
        idField: 'key',
        nameField: 'name',
        searchParam: 'keyLike',
      };
    default:
      return null; // No autocomplete for this resource type
  }
}

/**
 * Resource autocomplete input with API-based suggestions.
 * Fetches resource IDs from the REST API based on resource type.
 * Falls back to plain text input if resource type doesn't support autocomplete.
 *
 * @example
 * ```tsx
 * <ResourceAutocomplete
 *   api={api}
 *   resourceType={6} // Process Definition
 *   value={resourceId}
 *   onChange={setResourceId}
 *   placeholder="Enter resource ID or *"
 * />
 * ```
 */
// eslint-disable-next-line max-lines-per-function -- Autocomplete with debouncing, API integration, and keyboard navigation
export const ResourceAutocomplete: React.FC<ResourceAutocompleteProps> = ({
  api,
  resourceType,
  value,
  onChange,
  placeholder,
}) => {
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const endpointConfig = getResourceEndpoint(resourceType);
  const hasAutocomplete = endpointConfig !== null;

  /**
   * Fetch suggestions from API or enum values
   */
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!hasAutocomplete || !query) {
        setSuggestions([]);
        return;
      }

      // Type guard: hasAutocomplete ensures endpointConfig is non-null

      // Handle enum values (e.g., Application resource type)
      if (endpointConfig.enumValues) {
        const filtered = endpointConfig.enumValues
          .filter(val => val.toLowerCase().includes(query.toLowerCase()))
          .map(val => ({ id: val, label: val }));
        setSuggestions(filtered);
        return;
      }

      if (query === '*') {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const params: Record<string, string> = {
          maxResults: String(MAX_SUGGESTIONS),
        };

        // Add search parameter
        if (endpointConfig.searchParam.endsWith('Like')) {
          params[endpointConfig.searchParam] = `%${query}%`;
        } else {
          params[endpointConfig.searchParam] = query;
        }

        const result = (await get(api, endpointConfig.endpoint, params)) as ResourceItem[] | null;

        if (result && result.length > 0) {
          const formatted = result.map(item => {
            const idValue = item[endpointConfig.idField as keyof ResourceItem];
            const id = typeof idValue === 'string' ? idValue : '';
            const nameValue = endpointConfig.nameField
              ? item[endpointConfig.nameField as keyof ResourceItem]
              : undefined;
            const name = typeof nameValue === 'string' ? nameValue : undefined;
            return {
              id,
              label: name ? `${id} (${name})` : id,
            };
          });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          console.error(`Error fetching resources:`, err.message);
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [api, endpointConfig, hasAutocomplete]
  );

  /**
   * Handle input change with debouncing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    onChange(newValue);

    if (!hasAutocomplete) {
      return;
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      if (newValue.length > 0) {
        void fetchSuggestions(newValue);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, DEBOUNCE_DELAY);
  };

  /**
   * Handle suggestion selection
   */
  const handleSelectSuggestion = (id: string): void => {
    onChange(id);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          if (selected) {
            handleSelectSuggestion(selected.id);
          }
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        // No action for other keys
        break;
    }
  };

  /**
   * Handle click outside to close suggestions
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Reset suggestions when resource type changes
   */
  useEffect(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, [resourceType]);

  const inputId = `resource-autocomplete-${resourceType}`;

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        className="form-control"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        aria-autocomplete={hasAutocomplete ? 'list' : 'none'}
        aria-controls={hasAutocomplete ? `${inputId}-suggestions` : undefined}
        aria-expanded={hasAutocomplete ? showSuggestions : undefined}
      />
      {hasAutocomplete && showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id={`${inputId}-suggestions`}
          className="resource-autocomplete-suggestions"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Keyboard navigation handled by parent input
            <div
              key={suggestion.id}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => {
                handleSelectSuggestion(suggestion.id);
              }}
              onMouseEnter={() => {
                setSelectedIndex(index);
              }}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
      {hasAutocomplete && isLoading && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <span className="glyphicon glyphicon-refresh glyphicon-spin" />
        </div>
      )}
    </div>
  );
};

export default ResourceAutocomplete;
