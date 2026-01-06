'use client';

import { useMemo, memo } from 'react';
import type { Epoche } from '@/types';
import { useTimeline } from './TimelineContext';
import {
  type RenderKontext,
  berechneXPosition,
  berechneBreite,
  filtereEpochenVonViewport,
} from '@/lib/zeitstrahl';

interface TimelineEpochsProps {
  kontext: RenderKontext;
}

/**
 * Renders epoch bars on the timeline
 */
export const TimelineEpochs = memo(function TimelineEpochs({
  kontext,
}: TimelineEpochsProps) {
  const { epochen, ausgewaehlteEpoche, waehleEpoche } = useTimeline();

  // Filter epochs to only those visible in viewport
  const sichtbareEpochen = useMemo(
    () => filtereEpochenVonViewport(epochen, kontext),
    [epochen, kontext]
  );

  // Group epochs by layer (ebene) for stacking
  const epochenNachEbene = useMemo(() => {
    const gruppen = new Map<number, Epoche[]>();
    for (const epoche of sichtbareEpochen) {
      const ebene = epoche.ebene ?? 0;
      if (!gruppen.has(ebene)) {
        gruppen.set(ebene, []);
      }
      gruppen.get(ebene)!.push(epoche);
    }
    return gruppen;
  }, [sichtbareEpochen]);

  // Calculate epoch bar dimensions
  const EPOCH_HEIGHT = 24;
  const EPOCH_GAP = 4;
  const START_Y = 8;

  return (
    <g className="timeline-epochs">
      {Array.from(epochenNachEbene.entries()).map(([ebene, epochenInEbene]) => {
        const yPosition = START_Y + ebene * (EPOCH_HEIGHT + EPOCH_GAP);

        return (
          <g key={`ebene-${ebene}`} className="epoch-layer">
            {epochenInEbene.map((epoche) => {
              const x = berechneXPosition(epoche.start, kontext);
              const breite = berechneBreite(epoche.start, epoche.ende, kontext);
              const isSelected = ausgewaehlteEpoche === epoche.id;

              return (
                <g
                  key={epoche.id}
                  className="epoch-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    waehleEpoche(epoche.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Epoch background bar */}
                  <rect
                    x={x}
                    y={yPosition}
                    width={Math.max(breite, 1)}
                    height={EPOCH_HEIGHT}
                    rx={4}
                    fill={epoche.farbe}
                    fillOpacity={isSelected ? 0.9 : 0.6}
                    stroke={isSelected ? 'currentColor' : 'none'}
                    strokeWidth={isSelected ? 2 : 0}
                    className={isSelected ? 'text-primary' : ''}
                  />

                  {/* Epoch label - only show if wide enough */}
                  {breite > 60 && (
                    <text
                      x={x + breite / 2}
                      y={yPosition + EPOCH_HEIGHT / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={11}
                      fontWeight={500}
                      style={{
                        pointerEvents: 'none',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {breite > 150 ? epoche.name : truncateText(epoche.name, Math.floor(breite / 8))}
                    </text>
                  )}

                  {/* Tooltip title for narrow epochs */}
                  <title>{`${epoche.name}${epoche.beschreibung ? `: ${epoche.beschreibung}` : ''}`}</title>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
});

/**
 * Truncate text to a maximum length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
