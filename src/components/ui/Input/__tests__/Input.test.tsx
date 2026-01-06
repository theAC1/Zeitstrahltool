import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('should render basic input', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    const label = screen.getByText('Username');
    const input = screen.getByLabelText('Username');
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('should generate id from label', () => {
    render(<Input label="User Name" />);
    const input = screen.getByLabelText('User Name');
    expect(input).toHaveAttribute('id', 'user-name');
  });

  it('should use custom id when provided', () => {
    render(<Input label="Username" id="custom-id" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('should render with error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    const error = screen.getByText('Invalid email');
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('should mark input as invalid when error is present', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error to input with aria-describedby', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(errorId).toContain('email-error');
  });

  it('should render with helper text', () => {
    render(<Input label="Password" helperText="Must be at least 8 characters" />);
    const helper = screen.getByText('Must be at least 8 characters');
    expect(helper).toBeInTheDocument();
  });

  it('should not show helper text when error is present', () => {
    render(
      <Input
        label="Password"
        helperText="Must be at least 8 characters"
        error="Password too short"
      />
    );

    expect(screen.getByText('Password too short')).toBeInTheDocument();
    expect(screen.queryByText('Must be at least 8 characters')).not.toBeInTheDocument();
  });

  it('should handle user input', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('John Doe');
  });

  it('should support different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Input label="Name" disabled />);
    const input = screen.getByLabelText('Name');
    expect(input).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Input label="Name" className="custom-class" />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveClass('custom-class');
  });

  it('should forward ref to input element', () => {
    const ref = vi.fn();
    render(<Input label="Name" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should support placeholder', () => {
    render(<Input label="Search" placeholder="Type to search..." />);
    const input = screen.getByPlaceholderText('Type to search...');
    expect(input).toBeInTheDocument();
  });

  it('should support required attribute', () => {
    render(<Input label="Email" required />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeRequired();
  });

  it('should support min and max for number inputs', () => {
    render(<Input type="number" label="Age" min={0} max={120} />);
    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '120');
  });

  it('should apply error styling when error is present', () => {
    render(<Input label="Email" error="Invalid" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-destructive');
  });
});
