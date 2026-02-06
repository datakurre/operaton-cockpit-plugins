/**
 * Tests for FilterBox component.
 *
 * The FilterBox component wraps react-select-filter-box with additional
 * features like saved searches and legacy expression conversion.
 *
 * @module
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// react-select-filter-box is mocked via moduleNameMapper in jest.config.js

import FilterBox from '../FilterBox';
import {
  createDefinitionFilterSchema,
  createInstanceQuerySchema,
  createAuthorizationFilterSchema,
} from '../../utils/filterSchema';

describe('FilterBox', () => {
  const mockSchema = createInstanceQuerySchema();

  describe('rendering', () => {
    it('should render with schema', () => {
      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} />);

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(
        <FilterBox schema={mockSchema} onFilterChange={jest.fn()} placeholder="Search..." />
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} disabled />);

      expect(screen.getByTestId('filter-input')).toBeDisabled();
    });

    it('should render with saved searches dropdown toggle', () => {
      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} />);

      expect(screen.getByTitle('Saved searches')).toBeInTheDocument();
    });
  });

  describe('onFilterChange callback', () => {
    it('should call onFilterChange when expressions change', async () => {
      const user = userEvent.setup();
      const onFilterChange = jest.fn();

      render(<FilterBox schema={mockSchema} onFilterChange={onFilterChange} />);

      const input = screen.getByTestId('filter-input');
      await user.type(input, 'activityId = Task_1');

      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalled();
      });
    });

    it('should provide expressions in the expected format', async () => {
      const user = userEvent.setup();
      const onFilterChange = jest.fn();

      render(<FilterBox schema={mockSchema} onFilterChange={onFilterChange} />);

      const input = screen.getByTestId('filter-input');
      await user.type(input, 'activityId = Task_1');

      await waitFor(() => {
        const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1];
        expect(lastCall[0]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: expect.any(String),
              operator: expect.any(String),
              value: expect.anything(),
            }),
          ])
        );
      });
    });
  });

  describe('onLegacyFilterChange callback', () => {
    it('should accept onLegacyFilterChange prop without errors', () => {
      const onLegacyFilterChange = jest.fn();

      render(
        <FilterBox
          schema={mockSchema}
          onFilterChange={jest.fn()}
          onLegacyFilterChange={onLegacyFilterChange}
        />
      );

      // Just verify it renders without errors when callback is provided
      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });
  });

  describe('initial expressions', () => {
    it('should render with initial expressions', () => {
      const initialExpressions = [{ field: 'activityId', operator: '=', value: 'Task_1' }];

      render(
        <FilterBox
          schema={mockSchema}
          onFilterChange={jest.fn()}
          initialExpressions={initialExpressions}
        />
      );

      expect(screen.getByTestId('filter-input')).toHaveValue('activityId = Task_1');
    });

    it('should render multiple initial expressions joined with AND', () => {
      const initialExpressions = [
        { field: 'activityId', operator: '=', value: 'Task_1' },
        { field: 'processInstanceId', operator: '=', value: '123' },
      ];

      render(
        <FilterBox
          schema={mockSchema}
          onFilterChange={jest.fn()}
          initialExpressions={initialExpressions}
        />
      );

      expect(screen.getByTestId('filter-input')).toHaveValue(
        'activityId = Task_1 AND processInstanceId = 123'
      );
    });
  });

  describe('saved searches dropdown', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should toggle dropdown when button is clicked', async () => {
      const user = userEvent.setup();

      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} />);

      const toggleButton = screen.getByTitle('Saved searches');
      await user.click(toggleButton);

      // Dropdown should be visible with save section
      expect(screen.getByPlaceholderText('Save search as...')).toBeInTheDocument();
    });

    it('should show empty state when no saved searches', async () => {
      const user = userEvent.setup();

      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} />);

      const toggleButton = screen.getByTitle('Saved searches');
      await user.click(toggleButton);

      expect(screen.getByText('No saved searches')).toBeInTheDocument();
    });

    it('should have save button', async () => {
      const user = userEvent.setup();

      render(<FilterBox schema={mockSchema} onFilterChange={jest.fn()} />);

      const toggleButton = screen.getByTitle('Saved searches');
      await user.click(toggleButton);

      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <FilterBox schema={mockSchema} onFilterChange={jest.fn()} />
          <button data-testid="outside">Outside</button>
        </div>
      );

      const toggleButton = screen.getByTitle('Saved searches');
      await user.click(toggleButton);

      expect(screen.getByPlaceholderText('Save search as...')).toBeInTheDocument();

      const outsideButton = screen.getByTestId('outside');
      await user.click(outsideButton);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Save search as...')).not.toBeInTheDocument();
      });
    });
  });

  describe('schema variants', () => {
    it('should work with definition filter schema', () => {
      const schema = createDefinitionFilterSchema();

      render(<FilterBox schema={schema} onFilterChange={jest.fn()} />);

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });

    it('should work with instance query schema', () => {
      const schema = createInstanceQuerySchema();

      render(<FilterBox schema={schema} onFilterChange={jest.fn()} />);

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });

    it('should work with authorization filter schema', () => {
      const schema = createAuthorizationFilterSchema();

      render(<FilterBox schema={schema} onFilterChange={jest.fn()} />);

      expect(screen.getByTestId('filter-box')).toBeInTheDocument();
    });
  });

  describe('wrapper styling', () => {
    it('should have filter-box-wrapper class', () => {
      const { container } = render(
        <FilterBox schema={mockSchema} onFilterChange={jest.fn()} />
      );

      expect(container.querySelector('.filter-box-wrapper')).toBeInTheDocument();
    });

    it('should have filter-box-container class', () => {
      const { container } = render(
        <FilterBox schema={mockSchema} onFilterChange={jest.fn()} />
      );

      expect(container.querySelector('.filter-box-container')).toBeInTheDocument();
    });
  });
});
