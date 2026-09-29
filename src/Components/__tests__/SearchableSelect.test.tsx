/**
 * Tests for the SearchableSelect combobox.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchableSelect from '../SearchableSelect';

const options = [
  { value: 'task1', label: 'User Task 1 (task1) — userTask' },
  { value: 'task2', label: 'Service Task 2 (task2) — serviceTask' },
  { value: 'subprocess1', label: 'Sub Process (subprocess1) — subProcess' },
];

describe('SearchableSelect', () => {
  it('shows the placeholder text when nothing is selected', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select Activity --" />);

    expect(screen.getByPlaceholderText('-- Select Activity --')).toBeInTheDocument();
  });

  it('displays the selected option label as its value', () => {
    render(<SearchableSelect value="task2" onChange={jest.fn()} options={options} />);

    expect(screen.getByRole('combobox')).toHaveValue('Service Task 2 (task2) — serviceTask');
  });

  it('does not show the option list until focused', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select --" />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows all options on focus', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select --" />);

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getByText('User Task 1 (task1) — userTask')).toBeInTheDocument();
    expect(screen.getByText('Service Task 2 (task2) — serviceTask')).toBeInTheDocument();
    expect(screen.getByText('Sub Process (subprocess1) — subProcess')).toBeInTheDocument();
    // The placeholder is offered as a pinned, selectable entry too
    expect(screen.getByText('-- Select --')).toBeInTheDocument();
  });

  it('filters options as the user types, matching label or id substrings', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select --" />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'service' } });

    expect(screen.getByText('Service Task 2 (task2) — serviceTask')).toBeInTheDocument();
    expect(screen.queryByText('User Task 1 (task1) — userTask')).not.toBeInTheDocument();
    expect(screen.queryByText('Sub Process (subprocess1) — subProcess')).not.toBeInTheDocument();
  });

  it('filters by id as well as by label', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select --" />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'task2' } });

    expect(screen.getByText('Service Task 2 (task2) — serviceTask')).toBeInTheDocument();
    expect(screen.queryByText('User Task 1 (task1) — userTask')).not.toBeInTheDocument();
  });

  it('calls onChange with the option value when an option is clicked', () => {
    const handleChange = jest.fn();
    render(<SearchableSelect value="" onChange={handleChange} options={options} placeholder="-- Select --" />);

    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Sub Process (subprocess1) — subProcess'));

    expect(handleChange).toHaveBeenCalledWith('subprocess1');
  });

  it('clears the value when the pinned placeholder option is chosen', () => {
    const handleChange = jest.fn();
    render(<SearchableSelect value="task1" onChange={handleChange} options={options} placeholder="-- Select --" />);

    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('-- Select --'));

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('selects the highlighted option with the keyboard', () => {
    const handleChange = jest.fn();
    render(<SearchableSelect value="" onChange={handleChange} options={options} placeholder="-- Select --" />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // ArrowDown past the placeholder onto the first real option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith('task1');
  });

  it('reverts unmatched typed text on blur without calling onChange', () => {
    const handleChange = jest.fn();
    render(<SearchableSelect value="task1" onChange={handleChange} options={options} placeholder="-- Select --" />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzz no match' } });
    fireEvent.blur(input);

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('User Task 1 (task1) — userTask');
  });

  it('closes the list on Escape and reverts the typed text', () => {
    render(<SearchableSelect value="task1" onChange={jest.fn()} options={options} />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'something else' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('User Task 1 (task1) — userTask');
  });

  it('shows "No matches" when nothing matches the typed text', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} placeholder="-- Select --" />);

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'does-not-exist' } });

    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('does not offer a clearable placeholder entry when none is configured', () => {
    render(<SearchableSelect value="task1" onChange={jest.fn()} options={options} />);

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getAllByRole('option')).toHaveLength(options.length);
  });

  it('is disabled when the disabled prop is set', () => {
    render(<SearchableSelect value="" onChange={jest.fn()} options={options} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
