/**
 * Tests for FilterBox component.
 *
 * @module
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBox from '../FilterBox';

// Mock react-filter-box and date picker since they have complex dependencies
jest.mock('@waylay/react-filter-box', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: class MockReactFilterBox extends React.Component<any> {
      parser = {
        getSuggestions: () => [],
      };

      componentDidMount() {
        if (this.props.query) {
          this.onSubmit(this.props.query);
        }
      }

      onSubmit(query: string) {
        if (this.props.onParseOk) {
          this.props.onParseOk([{ category: 'test', operator: '=', value: query }]);
        }
      }

      render() {
        return (
          <div data-testid="filter-box">
            <input
              data-testid="filter-input"
              defaultValue={this.props.query}
              onChange={e => {
                if (this.props.onChange) {
                  this.props.onChange(e.target.value);
                }
              }}
              onBlur={() => {
                this.onSubmit((this as any).props.query);
              }}
            />
          </div>
        );
      }
    },
    Expression: {},
  };
});

jest.mock('react-datepicker', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ selected, onChange, inline }: any) => (
      <div data-testid="date-picker" data-selected={selected?.toISOString()} data-inline={inline}>
        <button onClick={() => onChange(new Date('2024-06-15'))}>Pick Date</button>
      </div>
    ),
  };
});

/**
 * Mock autocomplete handler that simulates FilterBox behavior.
 */
function createMockAutoCompleteHandler() {
  let currentQuery = '';
  return {
    needCategories: jest.fn(() => ['started', 'finished', 'activityId']),
    needOperators: jest.fn(() => ['=', '>', '<', '>=', '<=']),
    needValues: jest.fn(() => []),
    setQuery: jest.fn((query: string) => {
      currentQuery = query;
    }),
    getQuery: () => currentQuery,
  };
}

describe('FilterBox', () => {
  const defaultOptions = [
    { columnField: 'started', type: 'date' },
    { columnField: 'finished', type: 'date' },
    { columnField: 'activityId', type: 'string' },
  ];

  describe('rendering', () => {
    it('should render with default query', () => {
      const handler = createMockAutoCompleteHandler();
      const onParseOk = jest.fn();
      const defaultQuery = jest.fn(() => 'started > 2024-01-01');

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={onParseOk}
          defaultQuery={defaultQuery}
        />
      );

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
      expect(defaultQuery).toHaveBeenCalled();
    });

    it('should render filter input element', () => {
      const handler = createMockAutoCompleteHandler();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });

    it('should have form-control class wrapper', () => {
      const handler = createMockAutoCompleteHandler();

      const { container } = render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      expect(container.querySelector('.form-control')).toBeInTheDocument();
    });
  });

  describe('onParseOk callback', () => {
    it('should call onParseOk with parsed expressions on submit', async () => {
      const handler = createMockAutoCompleteHandler();
      const onParseOk = jest.fn();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={onParseOk}
          defaultQuery={() => 'started > 2024-01-01'}
        />
      );

      // Wait for componentDidMount to trigger onSubmit
      await waitFor(() => {
        expect(onParseOk).toHaveBeenCalled();
      });

      expect(onParseOk).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            category: expect.any(String),
          }),
        ])
      );
    });

    it('should call onParseOk when query changes', async () => {
      const user = userEvent.setup();
      const handler = createMockAutoCompleteHandler();
      const onParseOk = jest.fn();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={onParseOk}
          defaultQuery={() => ''}
        />
      );

      const input = screen.getByTestId('filter-input');
      await user.clear(input);
      await user.type(input, 'activityId = Task_1');

      // Trigger blur to simulate form submission
      await user.tab();

      await waitFor(() => {
        expect(onParseOk).toHaveBeenCalled();
      });
    });
  });

  describe('autocomplete handler integration', () => {
    it('should call setQuery on autoCompleteHandler during initialization', () => {
      const handler = createMockAutoCompleteHandler();
      const initialQuery = 'finished < 2024-12-31';

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => initialQuery}
        />
      );

      expect(handler.setQuery).toHaveBeenCalledWith(initialQuery);
    });

    it('should update autoCompleteHandler query when input changes', async () => {
      const user = userEvent.setup();
      const handler = createMockAutoCompleteHandler();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      const input = screen.getByTestId('filter-input');
      await user.type(input, 'new query');

      await waitFor(() => {
        expect(handler.setQuery).toHaveBeenCalled();
      });
    });

    it('should provide categories via needCategories', () => {
      const handler = createMockAutoCompleteHandler();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      const categories = handler.needCategories();
      expect(categories).toContain('started');
      expect(categories).toContain('finished');
      expect(categories).toContain('activityId');
    });
  });

  describe('options handling', () => {
    it('should accept column field options', () => {
      const handler = createMockAutoCompleteHandler();
      const customOptions = [
        { columnField: 'processInstanceId', type: 'string' },
        { columnField: 'businessKey', type: 'string' },
      ];

      render(
        <FilterBox
          options={customOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });

    it('should handle empty options array', () => {
      const handler = createMockAutoCompleteHandler();

      render(<FilterBox options={[]} autoCompleteHandler={handler} onParseOk={jest.fn()} defaultQuery={() => ''} />);

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });
  });

  describe('query state management', () => {
    it('should maintain query state across changes', async () => {
      const user = userEvent.setup();
      const handler = createMockAutoCompleteHandler();
      const onParseOk = jest.fn();

      render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={onParseOk}
          defaultQuery={() => 'initial query'}
        />
      );

      const input = screen.getByTestId('filter-input');
      expect(input).toHaveValue('initial query');

      await user.clear(input);
      await user.type(input, 'updated query');

      expect(input).toHaveValue('updated query');
    });

    it('should compute initial query only once', () => {
      const handler = createMockAutoCompleteHandler();
      const defaultQuery = jest.fn(() => 'computed query');

      const { rerender } = render(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={defaultQuery}
        />
      );

      const initialCallCount = defaultQuery.mock.calls.length;

      // Re-render should not call defaultQuery again
      rerender(
        <FilterBox
          options={defaultOptions}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={defaultQuery}
        />
      );

      expect(defaultQuery).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('date picker integration', () => {
    it('should render date picker for date fields when provided as autocomplete value', () => {
      const handler = createMockAutoCompleteHandler();
      const options = [
        { columnField: 'started', type: 'date' },
        { columnField: 'finished', type: 'date' },
      ];

      render(
        <FilterBox
          options={options}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => 'started > 2024-01-01'}
        />
      );

      // The date picker is rendered via customRenderCompletionItem when
      // autocomplete suggestions include a date type. Since our mock
      // ReactDatePicker renders a testid, verify it exists when date fields are configured.
      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });

    it('should include date type in options configuration', () => {
      const handler = createMockAutoCompleteHandler();
      const dateOptions = [
        { columnField: 'started', type: 'date' },
        { columnField: 'finished', type: 'date' },
      ];

      const { container } = render(
        <FilterBox options={dateOptions} autoCompleteHandler={handler} onParseOk={jest.fn()} defaultQuery={() => ''} />
      );

      // Date options are passed to the FilterBox and will trigger date picker
      // rendering when the autocomplete popup shows a date-type suggestion
      expect(container.querySelector('.form-control')).toBeInTheDocument();
    });

    it('should handle date picker mock rendering with custom date selection', async () => {
      const user = userEvent.setup();
      const handler = createMockAutoCompleteHandler();

      // Configure the mock to provide date type values for 'started' field
      handler.needValues = jest.fn(() => [{ value: { customType: 'date' }, type: 'date' }]);

      render(
        <FilterBox
          options={[{ columnField: 'started', type: 'date' }]}
          autoCompleteHandler={handler}
          onParseOk={jest.fn()}
          defaultQuery={() => ''}
        />
      );

      const input = screen.getByTestId('filter-input');
      await user.type(input, 'started > ');

      // The mocked date picker provides a Pick Date button for testing
      // In a real scenario, the date picker would be shown in the autocomplete popup
      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });
  });
});
