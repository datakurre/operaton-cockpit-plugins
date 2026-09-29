/**
 * Filterable, keyboard-navigable combobox backed by a plain text input.
 *
 * Drop-in replacement for a plain `<select>` when the option list is
 * id-bearing (BPMN activities, sequence flows, activity instances, terminated
 * instances, ...): lets the user filter options by typing part of the label
 * or id instead of scrolling a long native dropdown. Selection is
 * constrained to the given options — typed text that doesn't match one is
 * discarded when the field loses focus, mirroring a native select's inability
 * to hold an out-of-list value.
 */
import React, { useEffect, useMemo, useState } from 'react';
import './SearchableSelect.scss';

/** A selectable option: an id-bearing value plus its already-formatted display label. */
export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  /** Currently selected value (an option's `value`, or '' for none). */
  value: string;
  /** Called with the selected option's value, or '' when the placeholder is chosen. */
  onChange: (value: string) => void;
  /** Called when the field loses focus, after any pending selection is applied. */
  onBlur?: () => void;
  /** The full, unfiltered option list. */
  options: SearchableSelectOption[];
  /** Shown as a pinned, always-selectable first entry that clears the field. Omit for a field that must always hold one of `options`. */
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Applied to the input element, e.g. "form-control". */
  className?: string;
  /** Applied to the wrapping element, for width/layout parity with the `<select>` it replaces. */
  style?: React.CSSProperties;
}

/** Options rendered before the list is truncated with a "keep typing" hint. */
const MAX_VISIBLE_OPTIONS = 50;

/**
 * Filterable select. See module doc.
 */
/* eslint-disable max-lines-per-function, complexity -- Combobox with filtering and keyboard navigation */
export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  id,
  name,
  required = false,
  disabled = false,
  className = 'form-control',
  style,
}) => {
  const selectedOption = options.find(o => o.value === value);
  const [text, setText] = useState(selectedOption?.label ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Resync the displayed text with the selected option while the field isn't being edited
  // (external value changes, options arriving after an initial empty load, ...).
  useEffect(() => {
    if (!isOpen) {
      setText(selectedOption?.label ?? '');
    }
    // selectedOption is derived from value/options each render; only their identity matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  const clearOption: SearchableSelectOption | null =
    placeholder !== undefined ? { value: '', label: placeholder } : null;

  // Once the user is actively narrowing the list by typing, a non-matching entry has no
  // business anchoring the top of the results — that's also what lets a genuine "no matches"
  // state surface instead of always showing at least the pinned placeholder.
  const isFiltering = hasTyped && text.trim() !== '';

  const matchedOptions = useMemo(() => {
    if (!isFiltering) {
      return options;
    }
    const query = text.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(query));
  }, [isFiltering, text, options]);

  const visibleMatches = matchedOptions.slice(0, MAX_VISIBLE_OPTIONS);
  const hiddenCount = matchedOptions.length - visibleMatches.length;
  const visibleOptions = clearOption && !isFiltering ? [clearOption, ...visibleMatches] : visibleMatches;

  const inputId = id ?? `searchable-select-${name ?? 'field'}`;
  const listboxId = `${inputId}-listbox`;

  const revertText = (): void => {
    setText(selectedOption?.label ?? '');
  };

  const closeList = (): void => {
    setIsOpen(false);
    setHasTyped(false);
    setActiveIndex(-1);
  };

  const selectOption = (option: SearchableSelectOption): void => {
    onChange(option.value);
    setText(option.label);
    closeList();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    setIsOpen(true);
    setHasTyped(false);
    setActiveIndex(-1);
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
    setHasTyped(true);
    setIsOpen(true);
    setActiveIndex(0);
  };

  const handleBlur = (): void => {
    closeList();
    revertText();
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex(prev => (prev < visibleOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0) {
        const option = visibleOptions[activeIndex];
        if (option) {
          selectOption(option);
        }
      }
    } else if (e.key === 'Escape') {
      closeList();
      revertText();
    }
  };

  return (
    <div className="searchable-select" style={{ position: 'relative', ...style }}>
      <input
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        className={className}
        style={{ width: '100%' }}
        value={text}
        placeholder={placeholder}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        required={required}
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-required={required}
        aria-disabled={disabled}
      />
      {isOpen && (
        <div id={listboxId} role="listbox" className="searchable-select__options">
          {visibleOptions.length === 0 && (
            <div className="searchable-select__option searchable-select__option--hint">No matches</div>
          )}
          {visibleOptions.map((option, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard navigation is handled by the input
            <div
              key={option.value || '__clear__'}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={[
                'searchable-select__option',
                index === activeIndex ? 'searchable-select__option--active' : '',
                clearOption && index === 0 ? 'searchable-select__option--placeholder' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={e => {
                // Keep focus on the input so this click registers before any blur would fire.
                e.preventDefault();
              }}
              onClick={() => {
                selectOption(option);
              }}
              onMouseEnter={() => {
                setActiveIndex(index);
              }}
            >
              {option.label}
            </div>
          ))}
          {hiddenCount > 0 && (
            <div className="searchable-select__option searchable-select__option--hint">
              {hiddenCount} more — keep typing to narrow the list
            </div>
          )}
        </div>
      )}
    </div>
  );
};
/* eslint-enable max-lines-per-function, complexity */

export default SearchableSelect;
