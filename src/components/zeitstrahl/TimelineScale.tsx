'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { formatJahr, generiereSkalaMarker, berechneSkalaIntervall } from '@/lib/date';
import { berechneXPosition, type RenderKontext } from '@/lib/zeitstrahl';

interface TimelineScaleProps {
  kontext: RenderKontext;
  className?: string;
  hoehe?: number;
  position?: 'top' | 'bottom';
}

/**
 * Timeline scale component showing year markers
 */
export function TimelineScale({
  kontext,
  className,
  hoehe = 40,
  position = 'bottom',
}: TimelineScaleProps) {
  const { start, ende } = kontext.zeitraum;

  // Calculate scale markers
  const marker = useMemo(() => {
    const spanne = ende - start;
    const intervall = berechneSkalaIntervall(spanne / kontext.zoom);
    return generiereSkalaMarker(start, ende, intervall);
  }, [start, ende, kontext.zoom]);

  // Calculate sub-markers (smaller ticks between main markers)
  const subMarker = useMemo(() => {
    if (marker.length < 2) return [];
    const intervall = (marker[1] ?? 0) - (marker[0] ?? 0);
    const subIntervall = intervall / 5;
    const alleSub: number[] = [];

    for (let i = 0; i < marker.length - 1; i++) {
      const startMarker = marker[i] ?? 0;
      for (let j = 1; j < 5; j++) {
        const sub = startMarker + j * subIntervall;
        if (sub > start && sub < ende) {
          alleSub.push(sub);
        }
      }
    }

    return alleSub;
  }, [marker, start, ende]);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted/30 border-t border-border',
        position === 'top' && 'border-t-0 border-b',
        className
      )}
      style={{ height: hoehe }}
      role="img"
      aria-label="Zeitskala"
    >
      <svg
        width={kontext.breite}
        height={hoehe}
        className="block"
      >
        {/* Main axis line */}
        <line
          x1={0}
          y1={position === 'bottom' ? 0 : hoehe}
          x2={kontext.breite}
          y2={position === 'bottom' ? 0 : hoehe}
          stroke="currentColor"
          strokeOpacity={0.2}
          className="text-foreground"
        />

        {/* Sub markers (smaller ticks) */}
        {subMarker.map((jahr) => {
          const x = berechneXPosition({ jahr }, kontext);
          if (x < 0 || x > kontext.breite) return null;

          return (
            <line
              key={`sub-${jahr}`}
              x1={x}
              y1={position === 'bottom' ? 0 : hoehe}
              x2={x}
              y2={position === 'bottom' ? 8 : hoehe - 8}
              stroke="currentColor"
              strokeOpacity={0.1}
              className="text-foreground"
            />
          );
        })}

        {/* Main markers */}
        {marker.map((jahr) => {
          const x = berechneXPosition({ jahr }, kontext);
          if (x < -50 || x > kontext.breite + 50) return null;

          return (
            <g key={jahr}>
              {/* Tick mark */}
              <line
                x1={x}
                y1={position === 'bottom' ? 0 : hoehe}
                x2={x}
                y2={position === 'bottom' ? 16 : hoehe - 16}
                stroke="currentColor"
                strokeOpacity={0.3}
                className="text-foreground"
              />
              {/* Year label */}
              <text
                x={x}
                y={position === 'bottom' ? 28 : 14}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
                style={{ fontSize: '11px' }}
              >
                {formatJahr(jahr)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
