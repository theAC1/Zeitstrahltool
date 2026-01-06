'use client';

import { useMemo } from 'react';
import { useTimeline } from './TimelineContext';

interface TimelineLegendProps {
  /** Whether to show categories */
  showCategories?: boolean;
  /** Whether to show epochs */
  showEpochs?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Legend component showing categories and/or epochs
 */
export function TimelineLegend({
  showCategories = true,
  showEpochs = false,
  className = '',
}: TimelineLegendProps) {
  const { kategorien, epochen, ereignisse } = useTimeline();

  // Count events per category
  const kategorieZaehler = useMemo(() => {
    const zaehler = new Map<string, number>();
    for (const ereignis of ereignisse) {
      if (ereignis.kategorie) {
        zaehler.set(ereignis.kategorie, (zaehler.get(ereignis.kategorie) || 0) + 1);
      }
    }
    return zaehler;
  }, [ereignisse]);

  // Filter out categories with no events
  const verwendeteKategorien = useMemo(
    () => kategorien.filter((kat) => kategorieZaehler.get(kat.id) || 0 > 0),
    [kategorien, kategorieZaehler]
  );

  if (!showCategories && !showEpochs) {
    return null;
  }

  const hasContent = (showCategories && verwendeteKategorien.length > 0) || (showEpochs && epochen.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <div className={`rounded-lg border bg-background p-4 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold">Legende</h3>

      <div className="space-y-4">
        {/* Categories */}
        {showCategories && verwendeteKategorien.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Kategorien
            </h4>
            <div className="space-y-2">
              {verwendeteKategorien.map((kategorie) => (
                <div key={kategorie.id} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-sm"
                    style={{ backgroundColor: kategorie.farbe }}
                  />
                  <span className="flex-1 text-sm">{kategorie.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {kategorieZaehler.get(kategorie.id) || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Epochs */}
        {showEpochs && epochen.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Epochen
            </h4>
            <div className="space-y-2">
              {epochen
                .slice()
                .sort((a, b) => a.ebene - b.ebene)
                .map((epoche) => (
                  <div key={epoche.id} className="flex items-center gap-2">
                    <div
                      className="h-3 w-8 flex-shrink-0 rounded-sm"
                      style={{ backgroundColor: epoche.farbe, opacity: 0.7 }}
                    />
                    <span className="flex-1 text-sm">{epoche.name}</span>
                    {epoche.ebene > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Ebene {epoche.ebene}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
