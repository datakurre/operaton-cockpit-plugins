/**
 * Tests for VariableBuilder component.
 *
 * @module
 */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import VariableBuilder from '../VariableBuilder';

/**
 * Wrapper component that provides form context for testing.
 */
function TestFormWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('VariableBuilder', () => {
  describe('rendering', () => {
    it('should render Add Variable button', () => {
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.getByRole('button', { name: 'Add Variable' })).toBeInTheDocument();
    });

    it('should render no variable rows initially when empty', () => {
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    });

    it('should render existing variables when defaultValues provided', () => {
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'myVar', type: 'String', value: 'test' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.getByDisplayValue('myVar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });
  });

  describe('adding variables', () => {
    it('should add a new variable row when Add Variable is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const addButton = screen.getByRole('button', { name: 'Add Variable' });
      await user.click(addButton);

      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
    });

    it('should add multiple variable rows', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const addButton = screen.getByRole('button', { name: 'Add Variable' });
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      expect(removeButtons).toHaveLength(3);
    });
  });

  describe('removing variables', () => {
    it('should remove a variable row when Remove is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'toRemove', type: 'String', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.getByDisplayValue('toRemove')).toBeInTheDocument();

      const removeButton = screen.getByRole('button', { name: 'Remove' });
      await user.click(removeButton);

      expect(screen.queryByDisplayValue('toRemove')).not.toBeInTheDocument();
    });

    it('should remove correct variable when multiple exist', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper
          defaultValues={{
            variables: [
              { name: 'var1', type: 'String', value: '' },
              { name: 'var2', type: 'String', value: '' },
              { name: 'var3', type: 'String', value: '' },
            ],
          }}
        >
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.getByDisplayValue('var1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('var2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('var3')).toBeInTheDocument();

      // Remove the second variable
      const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
      await user.click(removeButtons[1]!);

      expect(screen.getByDisplayValue('var1')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('var2')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('var3')).toBeInTheDocument();
    });
  });

  describe('variable types', () => {
    it('should render String type with text input', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      await user.click(screen.getByRole('button', { name: 'Add Variable' }));

      const valueInput = screen.getByPlaceholderText('Value');
      // Default input is a text input (tagName INPUT, not TEXTAREA)
      expect(valueInput.tagName).toBe('INPUT');
      // And not a special type like number or datetime-local
      expect(valueInput).not.toHaveAttribute('type', 'number');
      expect(valueInput).not.toHaveAttribute('type', 'datetime-local');
    });

    it('should render Boolean type with select dropdown', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'boolVar', type: 'Boolean', value: 'false' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      // Boolean should render as a select with true/false options
      const selects = screen.getAllByRole('combobox');
      // One for type, one for value (Boolean)
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    it('should render Integer type with number input', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'intVar', type: 'Integer', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const numberInput = screen.getByPlaceholderText('Value');
      expect(numberInput).toHaveAttribute('type', 'number');
    });

    it('should render Date type with datetime-local input', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'dateVar', type: 'Date', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const dateInput = screen.getByPlaceholderText('Value');
      expect(dateInput).toHaveAttribute('type', 'datetime-local');
    });

    it('should render Json type with textarea', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'jsonVar', type: 'Json', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const textarea = screen.getByPlaceholderText('Value');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should have all variable types in the type dropdown', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'testVar', type: 'String', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      // Find the type select
      const selects = screen.getAllByRole('combobox');
      const typeSelect = selects.find(select => within(select).queryByText('String'));

      expect(typeSelect).toBeInTheDocument();
      expect(within(typeSelect!).getByText('String')).toBeInTheDocument();
      expect(within(typeSelect!).getByText('Integer')).toBeInTheDocument();
      expect(within(typeSelect!).getByText('Boolean')).toBeInTheDocument();
      expect(within(typeSelect!).getByText('Double')).toBeInTheDocument();
      expect(within(typeSelect!).getByText('Date')).toBeInTheDocument();
      expect(within(typeSelect!).getByText('Json')).toBeInTheDocument();
    });
  });

  describe('local flag', () => {
    it('should not show Local checkbox when showLocalFlag is false', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'var', type: 'String', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      expect(screen.queryByText('Local')).not.toBeInTheDocument();
    });

    it('should show Local checkbox when showLocalFlag is true', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'var', type: 'String', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag />
        </TestFormWrapper>
      );

      expect(screen.getByText('Local')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should toggle Local checkbox', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'var', type: 'String', value: '', local: false }] }}>
          <VariableBuilder name="variables" showLocalFlag />
        </TestFormWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('input interactions', () => {
    it('should allow typing in the name field', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      await user.click(screen.getByRole('button', { name: 'Add Variable' }));

      const nameInput = screen.getByPlaceholderText('Name');
      await user.type(nameInput, 'myNewVariable');

      expect(nameInput).toHaveValue('myNewVariable');
    });

    it('should allow typing in the value field', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      await user.click(screen.getByRole('button', { name: 'Add Variable' }));

      const valueInput = screen.getByPlaceholderText('Value');
      await user.type(valueInput, 'myValue123');

      expect(valueInput).toHaveValue('myValue123');
    });

    it('should allow changing variable type', async () => {
      const user = userEvent.setup();
      render(
        <TestFormWrapper defaultValues={{ variables: [{ name: 'var', type: 'String', value: '' }] }}>
          <VariableBuilder name="variables" showLocalFlag={false} />
        </TestFormWrapper>
      );

      const typeSelect = screen.getByDisplayValue('String');
      await user.selectOptions(typeSelect, 'Integer');

      expect(typeSelect).toHaveValue('Integer');
    });
  });
});
