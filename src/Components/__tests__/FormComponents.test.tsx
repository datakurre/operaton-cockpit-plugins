import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormButton } from '../FormButton';
import { SelectField } from '../SelectField';
import { WarningBox } from '../WarningBox';

describe('FormButton', () => {
  it('renders with children text', () => {
    render(<FormButton>Save</FormButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders as submit type when specified', () => {
    render(<FormButton type="submit">Submit</FormButton>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<FormButton onClick={handleClick}>Click Me</FormButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <FormButton onClick={handleClick} disabled>
        Disabled
      </FormButton>
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies primary variant styles by default', () => {
    render(<FormButton>Primary</FormButton>);
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveStyle({ backgroundColor: '#495057' });
  });

  it('applies secondary variant styles when specified', () => {
    render(<FormButton variant="secondary">Secondary</FormButton>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveStyle({ backgroundColor: '#6c757d' });
  });

  it('applies custom minWidth', () => {
    render(<FormButton minWidth={200}>Wide</FormButton>);
    const button = screen.getByRole('button', { name: 'Wide' });
    expect(button).toHaveStyle({ minWidth: '200px' });
  });
});

describe('SelectField', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(<SelectField label="Choose" value="" onChange={jest.fn()} options={options} />);
    expect(screen.getByText('Choose:')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SelectField label="Items" value="" onChange={jest.fn()} options={options} />);
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('renders placeholder when provided', () => {
    render(
      <SelectField label="Select" value="" onChange={jest.fn()} options={options} placeholder="-- Choose one --" />
    );
    expect(screen.getByRole('option', { name: '-- Choose one --' })).toBeInTheDocument();
  });

  it('calls onChange with selected value', () => {
    const handleChange = jest.fn();
    render(<SelectField label="Pick" value="" onChange={handleChange} options={options} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'opt2' } });
    expect(handleChange).toHaveBeenCalledWith('opt2');
  });

  it('shows correct selected value', () => {
    render(<SelectField label="Selected" value="opt2" onChange={jest.fn()} options={options} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('opt2');
  });

  it('can be disabled', () => {
    render(<SelectField label="Disabled" value="" onChange={jest.fn()} options={options} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute('aria-disabled', 'true');
  });

  it('can be required', () => {
    render(<SelectField label="Required" value="" onChange={jest.fn()} options={options} required />);
    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
    expect(select).toHaveAttribute('aria-required', 'true');
  });
});

describe('WarningBox', () => {
  it('renders children content', () => {
    render(<WarningBox>This is a warning message</WarningBox>);
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('renders with default Warning title', () => {
    render(<WarningBox>Content</WarningBox>);
    expect(screen.getByText('⚠️ Warning:')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<WarningBox title="Danger Zone">Content</WarningBox>);
    expect(screen.getByText('⚠️ Danger Zone:')).toBeInTheDocument();
  });

  it('has role="alert" for accessibility', () => {
    render(<WarningBox>Alert content</WarningBox>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    render(<WarningBox>Polite content</WarningBox>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('applies warning styling', () => {
    render(<WarningBox>Styled</WarningBox>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({ backgroundColor: '#fff3cd' });
  });
});
