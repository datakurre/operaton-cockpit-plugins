/**
 * Identity Autocomplete Component
 *
 * Provides autocomplete for user IDs and group IDs from the Operaton/Camunda API.
 * Also allows typing non-existing IDs including wildcard "*".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { API } from '../types';
import { get, ApiError } from '../utils/api';

interface IdentityAutocompleteProps {
  /** API configuration */
  api: API;
  /** Type of identity: user or group */
  identityType: 'user' | 'group';
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
}

interface UserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface GroupDto {
  id: string;
  name?: string;
  type?: string;
}

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;
/** Maximum suggestions to show */
const MAX_SUGGESTIONS = 10;

/**
 * Identity autocomplete input with API-based suggestions.
 * Fetches user or group IDs from the REST API while allowing manual entry.
 *
 * @example
 * ```tsx
 * <IdentityAutocomplete
 *   api={api}
 *   identityType="user"
 *   value={userId}
 *   onChange={setUserId}
 *   placeholder="Enter user ID or select from suggestions"
 * />
 * ```
 */
// eslint-disable-next-line max-lines-per-function -- Autocomplete with debouncing, API integration, and keyboard navigation
export const IdentityAutocomplete: React.FC<IdentityAutocompleteProps> = ({
  api,
  identityType,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch suggestions from API
   */
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query === '*') {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const endpoint = identityType === 'user' ? '/user' : '/group';
        const params: Record<string, string> = {
          maxResults: String(MAX_SUGGESTIONS),
        };

        if (identityType === 'user') {
          // For users, search by first name, last name, or email
          params['firstNameLike'] = `%${query}%`;
          params['lastNameLike'] = `%${query}%`;
          params['emailLike'] = `%${query}%`;
        } else {
          // For groups, search by name
          params['nameLike'] = `%${query}%`;
        }

        const result = (await get(api, endpoint, params)) as UserDto[] | GroupDto[] | null;

        if (result && result.length > 0) {
          const formatted = result.map(item => {
            if (identityType === 'user') {
              const user = item as UserDto;
              const displayName =
                user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : user.id;
              return {
                id: user.id,
                label: displayName !== user.id ? `${user.id} (${displayName})` : user.id,
              };
            } else {
              const group = item as GroupDto;
              return {
                id: group.id,
                label: group.name ? `${group.id} (${group.name})` : group.id,
              };
            }
          });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          console.error(`Error fetching ${identityType}s:`, err.message);
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [api, identityType]
  );

  /**
   * Handle input change with debouncing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    onChange(newValue);

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

  const inputId = `identity-autocomplete-${identityType}`;

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
        required={required}
        aria-autocomplete="list"
        aria-controls={`${inputId}-suggestions`}
        aria-expanded={showSuggestions}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id={`${inputId}-suggestions`}
          className="identity-autocomplete-suggestions"
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
      {isLoading && (
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

export default IdentityAutocomplete;
