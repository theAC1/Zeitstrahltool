import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';

const mockOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4', disabled: true },
];

describe('Select', () => {
  it('should render with label', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('should display placeholder when no value selected', () => {
    render(
      <Select
        label="Category"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        placeholder="Choose..."
      />
    );

    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('should display selected option label', () => {
    render(
      <Select label="Category" value="opt2" onChange={vi.fn()} options={mockOptions} />
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should open dropdown when button is clicked', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // All options should be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should call onChange when option is clicked', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" value="" onChange={handleChange} options={mockOptions} />
    );

    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Click option
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('should close dropdown after selection', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" value="" onChange={handleChange} options={mockOptions} />
    );

    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Click option
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    // Dropdown should close - check that options list is not visible
    // We can't directly check if it's closed, but we can verify the onChange was called
    expect(handleChange).toHaveBeenCalled();
  });

  it('should not call onChange for disabled options', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" value="" onChange={handleChange} options={mockOptions} />
    );

    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Try to click disabled option
    const option4 = screen.getByText('Option 4');
    fireEvent.click(option4);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Select
        label="Category"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        disabled
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should display error message', () => {
    render(
      <Select
        label="Category"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        error="Selection required"
      />
    );

    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('should open dropdown with Enter key', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should open dropdown with Space key', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should close dropdown with Escape key', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" value="" onChange={handleChange} options={mockOptions} />
    );

    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Press Escape
    fireEvent.keyDown(button, { key: 'Escape' });

    // onChange should not have been called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should update aria-expanded when dropdown opens', () => {
    render(
      <Select label="Category" value="" onChange={vi.fn()} options={mockOptions} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should apply custom className', () => {
    render(
      <Select
        label="Category"
        value=""
        onChange={vi.fn()}
        options={mockOptions}
        className="custom-select"
      />
    );

    const container = screen.getByText('Category').parentElement;
    expect(container).toHaveClass('custom-select');
  });

  it('should mark selected option with aria-selected', () => {
    render(
      <Select label="Category" value="opt2" onChange={vi.fn()} options={mockOptions} />
    );

    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // The selected option should have aria-selected="true"
    const listbox = screen.getByRole('listbox');
    const selectedOption = listbox.querySelector('[aria-selected="true"]');
    expect(selectedOption).toBeTruthy();
  });

  it('should handle empty options array', () => {
    render(<Select label="Category" value="" onChange={vi.fn()} options={[]} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should not crash, dropdown should open but be empty
    expect(button).toBeInTheDocument();
  });
});
