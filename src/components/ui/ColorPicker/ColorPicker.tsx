'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Predefined color palette for epochs/categories
const DEFAULT_COLORS = [
  '#1e40af', // Blue (Politics)
  '#7c3aed', // Purple (Culture)
  '#059669', // Green (Science)
  '#dc2626', // Red (War)
  '#d97706', // Orange (Economy)
  '#0891b2', // Cyan (Social)
  '#be185d', // Pink
  '#4f46e5', // Indigo
  '#16a34a', // Emerald
  '#ca8a04', // Yellow
  '#64748b', // Slate
  '#1f2937', // Dark Gray
];

export interface ColorPickerProps {
  /** Currently selected color (hex) */
  value?: string;
  /** Callback when color changes */
  onChange: (color: string) => void;
  /** Label for the picker */
  label?: string;
  /** Predefined color options */
  colors?: string[];
  /** Whether to show custom color input */
  showCustomInput?: boolean;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Color picker with preset colors and optional custom input
 *
 * @example
 * <ColorPicker
 *   label="Farbe"
 *   value="#1e40af"
 *   onChange={setColor}
 * />
 */
export function ColorPicker({
  value = DEFAULT_COLORS[0],
  onChange,
  label,
  colors = DEFAULT_COLORS,
  showCustomInput = true,
  disabled,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update custom color when value changes
  useEffect(() => {
    if (value) {
      setCustomColor(value);
    }
  }, [value]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    // Only update if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Color Preview Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label={`Farbe auswählen: ${value}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className="h-5 w-5 rounded border border-input"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
        <span className="text-sm font-mono">{value?.toUpperCase()}</span>
        <svg
          className={cn('ml-auto h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 rounded-md border bg-popover p-3 shadow-md animate-fade-in">
          {/* Preset Colors */}
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={cn(
                  'h-8 w-8 rounded-md border-2 transition-transform hover:scale-110',
                  value === color ? 'border-foreground ring-2 ring-ring' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Farbe ${color}`}
                aria-pressed={value === color}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          {showCustomInput && (
            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border-0 p-0"
                aria-label="Benutzerdefinierte Farbe"
              />
              <input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                className={cn(
                  'flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm font-mono',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-label="Hex-Farbcode"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
