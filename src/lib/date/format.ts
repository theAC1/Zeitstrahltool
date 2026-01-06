import type { HistorischesDatum } from '@/types';

/**
 * Format a historical date to a human-readable string
 *
 * @example
 * formatDatum({ jahr: 1989, monat: 11, tag: 9 }) // "9. November 1989"
 * formatDatum({ jahr: -753, monat: 4, tag: 21 }) // "21. April 753 v.Chr."
 * formatDatum({ jahr: -753, ungenau: true }) // "ca. 753 v.Chr."
 */
export function formatDatum(datum: HistorischesDatum, locale: 'de' | 'en' = 'de'): string {
  const isNegative = datum.jahr < 0;
  const absYear = Math.abs(datum.jahr);

  const monthNames: Record<'de' | 'en', string[]> = {
    de: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  };

  const parts: string[] = [];

  // Approximate marker
  if (datum.ungenau) {
    parts.push(locale === 'de' ? 'ca.' : 'c.');
  }

  // Day
  if (datum.tag) {
    parts.push(locale === 'de' ? `${datum.tag}.` : `${datum.tag}`);
  }

  // Month
  if (datum.monat && datum.monat >= 1 && datum.monat <= 12) {
    parts.push(monthNames[locale][datum.monat - 1] ?? '');
  }

  // Year with era
  const era = isNegative
    ? (locale === 'de' ? 'v.Chr.' : 'BCE')
    : (locale === 'de' ? 'n.Chr.' : 'CE');

  // Only add era suffix for BCE or if explicitly showing CE
  if (isNegative) {
    parts.push(`${absYear} ${era}`);
  } else {
    parts.push(absYear.toString());
  }

  return parts.join(' ');
}

/**
 * Format a date as a short string (for labels, etc.)
 *
 * @example
 * formatDatumKurz({ jahr: 1989, monat: 11, tag: 9 }) // "1989"
 * formatDatumKurz({ jahr: -753 }) // "753 v.Chr."
 */
export function formatDatumKurz(datum: HistorischesDatum, locale: 'de' | 'en' = 'de'): string {
  const isNegative = datum.jahr < 0;
  const absYear = Math.abs(datum.jahr);

  if (isNegative) {
    return locale === 'de' ? `${absYear} v.Chr.` : `${absYear} BCE`;
  }

  return absYear.toString();
}

/**
 * Format a year as a string with BCE/CE marker
 */
export function formatJahr(jahr: number, locale: 'de' | 'en' = 'de'): string {
  const isNegative = jahr < 0;
  const absYear = Math.abs(jahr);

  if (isNegative) {
    return locale === 'de' ? `${absYear} v.Chr.` : `${absYear} BCE`;
  }

  return absYear.toString();
}

/**
 * Format a date range
 *
 * @example
 * formatZeitraum(
 *   { jahr: -753 },
 *   { jahr: 476 }
 * ) // "753 v.Chr. – 476 n.Chr."
 */
export function formatZeitraum(
  start: HistorischesDatum,
  ende: HistorischesDatum,
  locale: 'de' | 'en' = 'de'
): string {
  const startStr = formatDatumKurz(start, locale);
  const endStr = formatDatumKurz(ende, locale);
  return `${startStr} – ${endStr}`;
}
