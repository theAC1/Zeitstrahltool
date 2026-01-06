'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useTimeline } from './TimelineContext';
import { formatDatum } from '@/lib/date';

interface EpochDetailsPanelProps {
  /** Callback when edit is clicked */
  onEdit: () => void;
}

/**
 * Panel showing details of the selected epoch
 */
export function EpochDetailsPanel({ onEdit }: EpochDetailsPanelProps) {
  const {
    epochen,
    ausgewaehlteEpoche,
    waehleEpoche,
    epocheLoeschen,
  } = useTimeline();

  const epoche = useMemo(
    () => epochen.find((e) => e.id === ausgewaehlteEpoche),
    [epochen, ausgewaehlteEpoche]
  );

  if (!epoche) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">
          Wählen Sie eine Epoche aus, um Details anzuzeigen
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Möchten Sie die Epoche "${epoche.name}" wirklich löschen?`)) {
      epocheLoeschen(epoche.id);
      waehleEpoche(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b p-4">
        <div className="flex-1">
          <h3 className="font-semibold">{epoche.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDatum(epoche.start)} – {formatDatum(epoche.ende)}
          </p>
        </div>
        <button
          onClick={() => waehleEpoche(null)}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          aria-label="Schließen"
          type="button"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Description */}
        {epoche.beschreibung && (
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Beschreibung
            </h4>
            <p className="text-sm">{epoche.beschreibung}</p>
          </div>
        )}

        {/* Color */}
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            Farbe
          </h4>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-16 rounded border"
              style={{ backgroundColor: epoche.farbe, opacity: 0.7 }}
            />
            <span className="text-sm font-mono text-muted-foreground">
              {epoche.farbe}
            </span>
          </div>
        </div>

        {/* Layer */}
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            Ebene
          </h4>
          <p className="text-sm">
            {epoche.ebene === 0 ? 'Unterste Ebene' : `Ebene ${epoche.ebene}`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Höhere Ebenen werden weiter oben angezeigt
          </p>
        </div>

        {/* Time Span Info */}
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            Zeitspanne
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Start: {formatDatum(epoche.start)}</p>
            <p>Ende: {formatDatum(epoche.ende)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t p-4">
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex-1"
        >
          Bearbeiten
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
