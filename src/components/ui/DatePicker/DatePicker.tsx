'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { HistorischesDatum } from '@/types';

export interface DatePickerProps {
  /** Current date value */
  value?: HistorischesDatum;
  /** Callback when date changes */
  onChange: (date: HistorischesDatum) => void;
  /** Label for the date picker */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Whether to show approximate checkbox */
  showApproximate?: boolean;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Historical date picker with BCE/CE support
 * Supports dates from prehistory to present
 *
 * @example
 * <DatePicker
 *   label="Datum"
 *   value={{ jahr: -753, monat: 4, tag: 21 }}
 *   onChange={setDate}
 *   showApproximate
 * />
 */
export function DatePicker({
  value,
  onChange,
  label,
  error,
  helperText,
  showApproximate = true,
  disabled,
  className,
}: DatePickerProps) {
  const [year, setYear] = useState<string>(value?.jahr?.toString() || '');
  const [month, setMonth] = useState<string>(value?.monat?.toString() || '');
  const [day, setDay] = useState<string>(value?.tag?.toString() || '');
  const [era, setEra] = useState<'ce' | 'bce'>(
    value?.jahr !== undefined && value.jahr < 0 ? 'bce' : 'ce'
  );
  const [approximate, setApproximate] = useState(value?.ungenau || false);

  // Update local state when value changes externally
  useEffect(() => {
    if (value) {
      const absYear = Math.abs(value.jahr);
      setYear(absYear.toString());
      setMonth(value.monat?.toString() || '');
      setDay(value.tag?.toString() || '');
      setEra(value.jahr < 0 ? 'bce' : 'ce');
      setApproximate(value.ungenau || false);
    }
  }, [value]);

  const handleChange = (updates: Partial<{
    year: string;
    month: string;
    day: string;
    era: 'ce' | 'bce';
    approximate: boolean;
  }>) => {
    const newYear = updates.year !== undefined ? updates.year : year;
    const newMonth = updates.month !== undefined ? updates.month : month;
    const newDay = updates.day !== undefined ? updates.day : day;
    const newEra = updates.era !== undefined ? updates.era : era;
    const newApproximate = updates.approximate !== undefined ? updates.approximate : approximate;

    if (updates.year !== undefined) setYear(newYear);
    if (updates.month !== undefined) setMonth(newMonth);
    if (updates.day !== undefined) setDay(newDay);
    if (updates.era !== undefined) setEra(newEra);
    if (updates.approximate !== undefined) setApproximate(newApproximate);

    const yearNum = parseInt(newYear, 10);
    if (isNaN(yearNum)) return;

    const adjustedYear = newEra === 'bce' ? -Math.abs(yearNum) : Math.abs(yearNum);
    const monthNum = newMonth ? parseInt(newMonth, 10) : undefined;
    const dayNum = newDay ? parseInt(newDay, 10) : undefined;

    const newDate: HistorischesDatum = {
      jahr: adjustedYear,
      ...(monthNum && monthNum >= 1 && monthNum <= 12 ? { monat: monthNum } : {}),
      ...(dayNum && dayNum >= 1 && dayNum <= 31 ? { tag: dayNum } : {}),
      ...(newApproximate ? { ungenau: true } : {}),
    };

    onChange(newDate);
  };

  const months = [
    { value: '', label: 'Monat' },
    { value: '1', label: 'Januar' },
    { value: '2', label: 'Februar' },
    { value: '3', label: 'März' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Dezember' },
  ];

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Day Input */}
        <div className="w-16">
          <input
            type="number"
            placeholder="Tag"
            min={1}
            max={31}
            value={day}
            onChange={(e) => handleChange({ day: e.target.value })}
            disabled={disabled}
            aria-label="Tag"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive'
            )}
          />
        </div>

        {/* Month Select */}
        <div className="w-32">
          <select
            value={month}
            onChange={(e) => handleChange({ month: e.target.value })}
            disabled={disabled}
            aria-label="Monat"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !month && 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Input */}
        <div className="w-24">
          <input
            type="number"
            placeholder="Jahr"
            value={year}
            onChange={(e) => handleChange({ year: e.target.value })}
            disabled={disabled}
            aria-label="Jahr"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive'
            )}
          />
        </div>

        {/* Era Toggle */}
        <div className="flex rounded-md border border-input">
          <button
            type="button"
            onClick={() => handleChange({ era: 'bce' })}
            disabled={disabled}
            className={cn(
              'h-10 px-3 text-sm font-medium transition-colors rounded-l-md',
              era === 'bce'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            v.Chr.
          </button>
          <button
            type="button"
            onClick={() => handleChange({ era: 'ce' })}
            disabled={disabled}
            className={cn(
              'h-10 px-3 text-sm font-medium transition-colors rounded-r-md border-l border-input',
              era === 'ce'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            n.Chr.
          </button>
        </div>
      </div>

      {/* Approximate Checkbox */}
      {showApproximate && (
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={approximate}
            onChange={(e) => handleChange({ approximate: e.target.checked })}
            disabled={disabled}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          <span className="text-muted-foreground">ca. (ungefähres Datum)</span>
        </label>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
