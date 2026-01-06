import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply default variant styles', () => {
    render(<Button variant="default">Default</Button>);
    const button = screen.getByRole('button');

    expect(button.className).toContain('bg-primary');
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');

    expect(button.className).toContain('bg-secondary');
  });

  it('should apply outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');

    expect(button.className).toContain('border');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');

    expect(button.className).toContain('custom-class');
  });

  it('should support different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('h-9');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('h-11');
  });

  it('should handle loading state', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should support submit type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });
});
