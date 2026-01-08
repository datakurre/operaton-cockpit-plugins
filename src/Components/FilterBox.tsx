import './react-filter-box.scss';
import './react-datepicker.scss';

import React, { useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import ReactFilterBox, { Expression } from '@waylay/react-filter-box';

class SimpleReactFilterBox extends ReactFilterBox {
  componentDidMount() {
    if (this.props.query) {
      // Defer onSubmit to next tick to ensure CodeMirror and AutoCompletePopup
      // are fully initialized. The FilterInput component sets up its CodeMirror
      // instance via a ref callback, which may not complete before componentDidMount.
      // Without this delay, the autoCompleteHandler may not be properly connected,
      // causing typeahead suggestions to fail and filter changes to not update requests.
      setTimeout(() => {
        this.onSubmit(this.props.query);
      }, 0);
    }
  }

  needAutoCompleteValues(codeMirror: any, text: string) {
    // Get suggestions from the parser
    let suggestions = this.parser.getSuggestions(text).filter(hintInfo => {
      return !['(', ')', 'OR'].includes(hintInfo.value as string);
    });

    // If no useful suggestions (empty or just AND), and the autoCompleteHandler is available,
    // provide category suggestions to help users discover available filter options
    const hasOnlyAndSuggestion =
      suggestions.length === 0 || (suggestions.length === 1 && suggestions[0].value === 'AND');

    if (hasOnlyAndSuggestion && this.props.autoCompleteHandler) {
      const categories = this.props.autoCompleteHandler.needCategories();
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
  cursor: any,
  parsedQuery: any,
  queryText: string
) => {
  if (data.value?.customType === 'date') {
    const pick = registerAndGetPickFunc();
    const start = self.from.ch;
    // Extract the date portion from the query text starting at cursor position
    const textFromStart = queryText.substring(start);
    const dateCandidate = textFromStart.split(' ')[0];
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
              self.to.ch = start + dateString.length + 1;
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
  const queryRef = useRef(query);

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

  // Cast to any to avoid React type conflicts between @waylay/react-filter-box and project React types
  const FilterBoxComponent = SimpleReactFilterBox as any;

  return (
    <div className="form-control">
      <FilterBoxComponent
        options={props.options}
        strictMode={true}
        query={initialQuery}
        autoCompleteHandler={props.autoCompleteHandler}
        customRenderCompletionItem={(
          self: any,
          data: any,
          registerAndGetPickFunc: () => (value: string) => void,
          cursor: any,
          parsedQuery: any
        ) => customRenderCompletionItem(self, data, registerAndGetPickFunc, cursor, parsedQuery, queryRef.current)}
        onChange={(newQuery: string) => setQuery(newQuery)}
        onParseOk={(expressions: Expression[]) => {
          props.onParseOk(expressions);
          (document?.activeElement as HTMLElement)?.blur();
        }}
      />
    </div>
  );
};

export default FilterBox;
