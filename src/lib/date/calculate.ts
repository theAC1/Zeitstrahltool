import type { HistorischesDatum } from '@/types';

/**
 * Convert a HistorischesDatum to a decimal year value
 * This allows for precise positioning on the timeline
 *
 * @example
 * datumZuJahreszahl({ jahr: 1989, monat: 11, tag: 9 }) // ~1989.86
 * datumZuJahreszahl({ jahr: -753, monat: 4, tag: 21 }) // ~-752.7 (year 0 doesn't exist)
 */
export function datumZuJahreszahl(datum: HistorischesDatum): number {
  const jahr = datum.jahr;

  // Calculate fraction of year from month and day
  let fraction = 0;

  if (datum.monat) {
    // Each month is roughly 1/12 of a year
    // Subtract 1 because January is month 1 but represents 0/12
    fraction += (datum.monat - 1) / 12;

    if (datum.tag) {
      // Days within the month (simplified, assuming 30 days per month)
      fraction += (datum.tag - 1) / 365;
    }
  }

  // For negative years, subtract the fraction
  if (jahr < 0) {
    return jahr - fraction;
  }

  return jahr + fraction;
}

/**
 * Calculate the difference between two dates in years
 */
export function jahreDifferenz(start: HistorischesDatum, ende: HistorischesDatum): number {
  const startJahr = datumZuJahreszahl(start);
  const endeJahr = datumZuJahreszahl(ende);
  return endeJahr - startJahr;
}

/**
 * Compare two historical dates
 * Returns: negative if a < b, 0 if equal, positive if a > b
 */
export function vergleicheDaten(a: HistorischesDatum, b: HistorischesDatum): number {
  return datumZuJahreszahl(a) - datumZuJahreszahl(b);
}

/**
 * Sort an array of items by their date
 */
export function sortiereNachDatum<T extends { datum: HistorischesDatum }>(items: T[]): T[] {
  return [...items].sort((a, b) => vergleicheDaten(a.datum, b.datum));
}

/**
 * Check if a date falls within a range (inclusive)
 */
export function istImZeitraum(
  datum: HistorischesDatum,
  start: HistorischesDatum,
  ende: HistorischesDatum
): boolean {
  const d = datumZuJahreszahl(datum);
  const s = datumZuJahreszahl(start);
  const e = datumZuJahreszahl(ende);
  return d >= s && d <= e;
}

/**
 * Calculate the midpoint between two dates
 */
export function datumMittelpunkt(
  start: HistorischesDatum,
  ende: HistorischesDatum
): HistorischesDatum {
  const startJahr = datumZuJahreszahl(start);
  const endeJahr = datumZuJahreszahl(ende);
  const mitteJahr = (startJahr + endeJahr) / 2;

  return { jahr: Math.round(mitteJahr) };
}

/**
 * Expand a time range by a percentage on each side
 * Useful for adding padding to visible range
 */
export function erweitereZeitraum(
  start: HistorischesDatum,
  ende: HistorischesDatum,
  prozent: number = 0.1
): { start: HistorischesDatum; ende: HistorischesDatum } {
  const startJahr = datumZuJahreszahl(start);
  const endeJahr = datumZuJahreszahl(ende);
  const spanne = endeJahr - startJahr;
  const erweiterung = spanne * prozent;

  return {
    start: { jahr: Math.floor(startJahr - erweiterung) },
    ende: { jahr: Math.ceil(endeJahr + erweiterung) },
  };
}

/**
 * Get a nice round number for scale intervals based on time span
 * Returns interval in years
 */
export function berechneSkalaIntervall(jahrSpanne: number): number {
  // For very large spans (millennia), use 1000 or 500 year intervals
  if (jahrSpanne > 5000) return 1000;
  if (jahrSpanne > 2000) return 500;
  if (jahrSpanne > 1000) return 200;
  if (jahrSpanne > 500) return 100;
  if (jahrSpanne > 200) return 50;
  if (jahrSpanne > 100) return 20;
  if (jahrSpanne > 50) return 10;
  if (jahrSpanne > 20) return 5;
  if (jahrSpanne > 10) return 2;
  return 1;
}

/**
 * Generate scale markers for a time range
 */
export function generiereSkalaMarker(
  start: number,
  ende: number,
  intervall?: number
): number[] {
  const spanne = ende - start;
  const interval = intervall ?? berechneSkalaIntervall(spanne);

  // Find the first marker (round down to nearest interval)
  const ersterMarker = Math.ceil(start / interval) * interval;

  const marker: number[] = [];
  for (let jahr = ersterMarker; jahr <= ende; jahr += interval) {
    marker.push(jahr);
  }

  return marker;
}

/**
 * Calculate automatic time range from events
 */
export function berechneAutomatischenZeitraum(
  ereignisse: { datum: HistorischesDatum; endDatum?: HistorischesDatum }[]
): { start: HistorischesDatum; ende: HistorischesDatum } | null {
  if (ereignisse.length === 0) {
    return null;
  }

  let minJahr = Infinity;
  let maxJahr = -Infinity;

  for (const ereignis of ereignisse) {
    const startJahr = datumZuJahreszahl(ereignis.datum);
    minJahr = Math.min(minJahr, startJahr);
    maxJahr = Math.max(maxJahr, startJahr);

    if (ereignis.endDatum) {
      const endJahr = datumZuJahreszahl(ereignis.endDatum);
      maxJahr = Math.max(maxJahr, endJahr);
    }
  }

  // Add 10% padding
  const spanne = maxJahr - minJahr;
  const padding = Math.max(spanne * 0.1, 1);

  return {
    start: { jahr: Math.floor(minJahr - padding) },
    ende: { jahr: Math.ceil(maxJahr + padding) },
  };
}
