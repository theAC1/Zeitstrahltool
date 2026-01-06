'use client';

import { useMemo, memo, useCallback } from 'react';
import type { Kategorie } from '@/types';
import { useTimeline } from './TimelineContext';
import {
  type RenderKontext,
  berechneXPosition,
  berechneBreite,
  filtereVonViewport,
  berechneEreignisPositionen,
} from '@/lib/zeitstrahl';
import { formatDatum } from '@/lib/date';

interface TimelineEventsProps {
  kontext: RenderKontext;
}

// Event rendering constants
const EVENT_HEIGHT = 36;
const EVENT_MIN_WIDTH = 100;
const EVENT_BORDER_RADIUS = 6;
const EVENT_START_Y = 100;
const EVENT_GAP = 8;

/**
 * Renders events on the timeline
 */
export const TimelineEvents = memo(function TimelineEvents({
  kontext,
}: TimelineEventsProps) {
  const {
    ereignisse,
    kategorien,
    ausgewaehltesEreignis,
    waehleEreignis,
    aktivesWerkzeug,
  } = useTimeline();

  // Filter events to only those visible in viewport
  const sichtbareEreignisse = useMemo(
    () => filtereVonViewport(ereignisse, kontext),
    [ereignisse, kontext]
  );

  // Calculate Y positions for events to avoid overlapping
  const ereignisPositionen = useMemo(
    () =>
      berechneEreignisPositionen(
        sichtbareEreignisse,
        kontext,
        EVENT_HEIGHT,
        EVENT_GAP,
        EVENT_START_Y
      ),
    [sichtbareEreignisse, kontext]
  );

  // Map category ID to category for quick lookup
  const kategorieMap = useMemo(() => {
    const map = new Map<string, Kategorie>();
    for (const kat of kategorien) {
      map.set(kat.id, kat);
    }
    return map;
  }, [kategorien]);

  // Handle event click
  const handleEventClick = useCallback(
    (ereignisId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (aktivesWerkzeug === 'auswaehlen' || aktivesWerkzeug === 'navigation') {
        waehleEreignis(ereignisId);
      }
    },
    [aktivesWerkzeug, waehleEreignis]
  );

  return (
    <g className="timeline-events">
      {sichtbareEreignisse.map((ereignis) => {
        const x = berechneXPosition(ereignis.datum, kontext);
        const y = ereignisPositionen.get(ereignis.id) ?? EVENT_START_Y;
        const isSelected = ausgewaehltesEreignis === ereignis.id;

        // Calculate width for time span events
        const istZeitspanne = !!ereignis.endDatum;
        const breite = istZeitspanne
          ? Math.max(berechneBreite(ereignis.datum, ereignis.endDatum!, kontext), EVENT_MIN_WIDTH)
          : EVENT_MIN_WIDTH;

        // Get color from event, category, or default
        const kategorie = ereignis.kategorie
          ? kategorieMap.get(ereignis.kategorie)
          : undefined;
        const farbe = ereignis.farbe ?? kategorie?.farbe ?? '#6366f1';

        // Get importance level styling
        const wichtigkeitStyle = getWichtigkeitStyle(ereignis.wichtigkeit ?? 2);

        return (
          <g
            key={ereignis.id}
            className="event-item"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleEventClick(ereignis.id, e)}
            role="button"
            tabIndex={0}
            aria-label={`${ereignis.titel}, ${formatDatum(ereignis.datum)}`}
          >
            {/* Connection line to axis */}
            <line
              x1={istZeitspanne ? x + breite / 2 : x + EVENT_MIN_WIDTH / 2}
              y1={y + EVENT_HEIGHT}
              x2={istZeitspanne ? x + breite / 2 : x + EVENT_MIN_WIDTH / 2}
              y2={kontext.hoehe / 2}
              stroke={farbe}
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="4 2"
            />

            {/* Event marker on axis */}
            <circle
              cx={istZeitspanne ? x + breite / 2 : x + EVENT_MIN_WIDTH / 2}
              cy={kontext.hoehe / 2}
              r={wichtigkeitStyle.markerRadius}
              fill={farbe}
              stroke="white"
              strokeWidth={2}
            />

            {/* Event card shadow */}
            <rect
              x={x + 2}
              y={y + 2}
              width={breite}
              height={EVENT_HEIGHT}
              rx={EVENT_BORDER_RADIUS}
              fill="black"
              fillOpacity={0.1}
            />

            {/* Event card background */}
            <rect
              x={x}
              y={y}
              width={breite}
              height={EVENT_HEIGHT}
              rx={EVENT_BORDER_RADIUS}
              fill="hsl(var(--background))"
              stroke={isSelected ? farbe : 'hsl(var(--border))'}
              strokeWidth={isSelected ? 2 : 1}
            />

            {/* Colored left border indicator */}
            <rect
              x={x}
              y={y}
              width={4}
              height={EVENT_HEIGHT}
              rx={2}
              fill={farbe}
            />

            {/* Event title */}
            <text
              x={x + 12}
              y={y + EVENT_HEIGHT / 2 - 4}
              fill="hsl(var(--foreground))"
              fontSize={wichtigkeitStyle.fontSize}
              fontWeight={wichtigkeitStyle.fontWeight}
              style={{ pointerEvents: 'none' }}
            >
              {truncateText(ereignis.titel, Math.floor((breite - 20) / 7))}
            </text>

            {/* Event date */}
            <text
              x={x + 12}
              y={y + EVENT_HEIGHT / 2 + 10}
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
              style={{ pointerEvents: 'none' }}
            >
              {formatDatum(ereignis.datum)}
              {istZeitspanne && ` – ${formatDatum(ereignis.endDatum!)}`}
            </text>

            {/* Category/Tag indicator */}
            {kategorie && breite > 150 && (
              <g>
                <rect
                  x={x + breite - 50}
                  y={y + 6}
                  width={44}
                  height={14}
                  rx={3}
                  fill={farbe}
                  fillOpacity={0.15}
                />
                <text
                  x={x + breite - 28}
                  y={y + 15}
                  textAnchor="middle"
                  fill={farbe}
                  fontSize={9}
                  fontWeight={500}
                  style={{ pointerEvents: 'none' }}
                >
                  {truncateText(kategorie.name, 6)}
                </text>
              </g>
            )}

            {/* Selection indicator */}
            {isSelected && (
              <rect
                x={x - 3}
                y={y - 3}
                width={breite + 6}
                height={EVENT_HEIGHT + 6}
                rx={EVENT_BORDER_RADIUS + 2}
                fill="none"
                stroke={farbe}
                strokeWidth={2}
                strokeOpacity={0.5}
                strokeDasharray="4 2"
              />
            )}

            {/* Tooltip */}
            <title>
              {`${ereignis.titel}\n${formatDatum(ereignis.datum)}${istZeitspanne ? ` – ${formatDatum(ereignis.endDatum!)}` : ''}\n${ereignis.beschreibung || ''}`}
            </title>
          </g>
        );
      })}
    </g>
  );
});

/**
 * Get styling based on importance level
 */
function getWichtigkeitStyle(wichtigkeit: 1 | 2 | 3): {
  fontSize: number;
  fontWeight: number;
  markerRadius: number;
} {
  switch (wichtigkeit) {
    case 1: // Low importance
      return { fontSize: 11, fontWeight: 400, markerRadius: 4 };
    case 2: // Medium importance
      return { fontSize: 12, fontWeight: 500, markerRadius: 6 };
    case 3: // High importance
      return { fontSize: 13, fontWeight: 600, markerRadius: 8 };
    default:
      return { fontSize: 12, fontWeight: 500, markerRadius: 6 };
  }
}

/**
 * Truncate text to a maximum length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (maxLength < 3) return text.slice(0, 1) + '…';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
