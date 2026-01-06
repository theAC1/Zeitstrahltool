import type { HistorischesDatum, Ereignis, Epoche } from '@/types';
import { datumZuJahreszahl } from '@/lib/date';

/**
 * Render context containing viewport and scale information
 */
export interface RenderKontext {
  /** Total width of the timeline canvas in pixels */
  breite: number;
  /** Total height of the timeline canvas in pixels */
  hoehe: number;
  /** Visible time range */
  zeitraum: {
    start: number; // Year as decimal
    ende: number;  // Year as decimal
  };
  /** Current zoom level (1 = 100%) */
  zoom: number;
  /** Pan offset in pixels */
  offset: {
    x: number;
    y: number;
  };
}

/**
 * Calculate the X position for a given date on the timeline
 */
export function berechneXPosition(
  datum: HistorischesDatum,
  kontext: RenderKontext
): number {
  const jahr = datumZuJahreszahl(datum);
  const { start, ende } = kontext.zeitraum;
  const spanne = ende - start;

  // Calculate percentage position within the time range
  const prozent = (jahr - start) / spanne;

  // Apply zoom and offset
  return prozent * kontext.breite * kontext.zoom + kontext.offset.x;
}

/**
 * Calculate the year for a given X position on the timeline
 * (inverse of berechneXPosition)
 */
export function berechneJahrVonPosition(
  x: number,
  kontext: RenderKontext
): number {
  const { start, ende } = kontext.zeitraum;
  const spanne = ende - start;

  // Remove offset and zoom
  const positionOhneOffset = (x - kontext.offset.x) / kontext.zoom;

  // Calculate percentage and convert to year
  const prozent = positionOhneOffset / kontext.breite;
  return start + prozent * spanne;
}

/**
 * Calculate the width of a time span in pixels
 */
export function berechneBreite(
  start: HistorischesDatum,
  ende: HistorischesDatum,
  kontext: RenderKontext
): number {
  const startX = berechneXPosition(start, kontext);
  const endeX = berechneXPosition(ende, kontext);
  return endeX - startX;
}

/**
 * Check if an X position is within the visible viewport
 */
export function istSichtbar(
  x: number,
  breite: number,
  viewportBreite: number,
  puffer: number = 50
): boolean {
  return x + breite >= -puffer && x <= viewportBreite + puffer;
}

/**
 * Filter events to only those visible in the current viewport
 */
export function filtereVonViewport(
  ereignisse: Ereignis[],
  kontext: RenderKontext,
  puffer: number = 100
): Ereignis[] {
  return ereignisse.filter((ereignis) => {
    const x = berechneXPosition(ereignis.datum, kontext);

    // For events with end date, check if any part is visible
    if (ereignis.endDatum) {
      const endX = berechneXPosition(ereignis.endDatum, kontext);
      return istSichtbar(x, endX - x, kontext.breite, puffer);
    }

    // For point events, just check if the point is visible
    return x >= -puffer && x <= kontext.breite + puffer;
  });
}

/**
 * Filter epochs to only those visible in the current viewport
 */
export function filtereEpochenVonViewport(
  epochen: Epoche[],
  kontext: RenderKontext,
  puffer: number = 100
): Epoche[] {
  return epochen.filter((epoche) => {
    const startX = berechneXPosition(epoche.start, kontext);
    const endeX = berechneXPosition(epoche.ende, kontext);
    return istSichtbar(startX, endeX - startX, kontext.breite, puffer);
  });
}

/**
 * Calculate the visible time range based on viewport
 */
export function berechneSichtbarenZeitraum(
  kontext: RenderKontext
): { start: number; ende: number } {
  const visibleStart = berechneJahrVonPosition(0, kontext);
  const visibleEnd = berechneJahrVonPosition(kontext.breite, kontext);
  return { start: visibleStart, ende: visibleEnd };
}

/**
 * Calculate new offset after zooming to maintain center point
 */
export function berechneZoomOffset(
  zoomZentrum: { x: number; y: number },
  alterZoom: number,
  neuerZoom: number,
  alterOffset: { x: number; y: number }
): { x: number; y: number } {
  // Calculate the point in content coordinates
  const contentX = (zoomZentrum.x - alterOffset.x) / alterZoom;
  const contentY = (zoomZentrum.y - alterOffset.y) / alterZoom;

  // Calculate new offset to keep the center point at the same screen position
  const neuerOffsetX = zoomZentrum.x - contentX * neuerZoom;
  const neuerOffsetY = zoomZentrum.y - contentY * neuerZoom;

  return { x: neuerOffsetX, y: neuerOffsetY };
}

/**
 * Clamp offset to prevent scrolling beyond content bounds
 */
export function begrenzeOffset(
  offset: { x: number; y: number },
  kontext: RenderKontext,
  contentBreite: number,
  contentHoehe: number
): { x: number; y: number } {
  const maxOffsetX = 0;
  const minOffsetX = Math.min(0, kontext.breite - contentBreite * kontext.zoom);

  const maxOffsetY = 0;
  const minOffsetY = Math.min(0, kontext.hoehe - contentHoehe * kontext.zoom);

  return {
    x: Math.max(minOffsetX, Math.min(maxOffsetX, offset.x)),
    y: Math.max(minOffsetY, Math.min(maxOffsetY, offset.y)),
  };
}

/**
 * Calculate Y positions for events to avoid overlapping
 * Uses a simple greedy algorithm to stack events vertically
 */
export function berechneEreignisPositionen(
  ereignisse: Ereignis[],
  kontext: RenderKontext,
  eventHoehe: number = 40,
  abstand: number = 10,
  startY: number = 100
): Map<string, number> {
  const positionen = new Map<string, number>();

  // Sort events by date
  const sortiert = [...ereignisse].sort((a, b) => {
    return datumZuJahreszahl(a.datum) - datumZuJahreszahl(b.datum);
  });

  // Track occupied Y ranges for each X position
  const belegteBereiche: Array<{ start: number; ende: number; y: number }> = [];

  for (const ereignis of sortiert) {
    const x = berechneXPosition(ereignis.datum, kontext);
    const eventBreite = ereignis.endDatum
      ? berechneBreite(ereignis.datum, ereignis.endDatum, kontext)
      : 100; // Default width for point events

    // Find the lowest Y position that doesn't overlap with existing events
    let y = startY;
    let gefunden = false;

    while (!gefunden) {
      gefunden = true;

      for (const bereich of belegteBereiche) {
        // Check if this event overlaps horizontally with the existing one
        const ueberlapptX = x < bereich.ende + abstand && x + eventBreite > bereich.start - abstand;

        if (ueberlapptX && y < bereich.y + eventHoehe + abstand && y + eventHoehe > bereich.y) {
          // Overlap found, try next row
          y = bereich.y + eventHoehe + abstand;
          gefunden = false;
          break;
        }
      }
    }

    positionen.set(ereignis.id, y);
    belegteBereiche.push({ start: x, ende: x + eventBreite, y });
  }

  return positionen;
}
