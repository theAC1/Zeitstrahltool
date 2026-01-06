'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useTimeline } from './TimelineContext';
import { formatDatum } from '@/lib/date';

interface EventDetailsPanelProps {
  /** Callback when edit is clicked */
  onEdit: () => void;
}

/**
 * Panel showing details of the selected event
 */
export function EventDetailsPanel({ onEdit }: EventDetailsPanelProps) {
  const {
    ereignisse,
    kategorien,
    ausgewaehltesEreignis,
    waehleEreignis,
    ereignisLoeschen,
  } = useTimeline();

  const ereignis = useMemo(
    () => ereignisse.find((e) => e.id === ausgewaehltesEreignis),
    [ereignisse, ausgewaehltesEreignis]
  );

  const kategorie = useMemo(
    () => kategorien.find((k) => k.id === ereignis?.kategorie),
    [kategorien, ereignis]
  );

  if (!ereignis) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">
          Wählen Sie ein Ereignis aus, um Details anzuzeigen
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Möchten Sie das Ereignis "${ereignis.titel}" wirklich löschen?`)) {
      ereignisLoeschen(ereignis.id);
      waehleEreignis(null);
    }
  };

  const istZeitspanne = !!ereignis.endDatum;
  const wichtigkeitLabel = ereignis.wichtigkeit === 1 ? 'Niedrig' : ereignis.wichtigkeit === 3 ? 'Hoch' : 'Mittel';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b p-4">
        <div className="flex-1">
          <h3 className="font-semibold">{ereignis.titel}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDatum(ereignis.datum)}
            {istZeitspanne && ` – ${formatDatum(ereignis.endDatum!)}`}
          </p>
        </div>
        <button
          onClick={() => waehleEreignis(null)}
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
        {ereignis.beschreibung && (
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Beschreibung
            </h4>
            <p className="text-sm">{ereignis.beschreibung}</p>
          </div>
        )}

        {/* Category */}
        {kategorie && (
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Kategorie
            </h4>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: kategorie.farbe }}
              />
              <span className="text-sm">{kategorie.name}</span>
            </div>
          </div>
        )}

        {/* Importance */}
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            Wichtigkeit
          </h4>
          <p className="text-sm">{wichtigkeitLabel}</p>
        </div>

        {/* Tags */}
        {ereignis.tags && ereignis.tags.length > 0 && (
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1">
              {ereignis.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Color */}
        {ereignis.farbe && (
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Farbe
            </h4>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded border"
                style={{ backgroundColor: ereignis.farbe }}
              />
              <span className="text-sm font-mono text-muted-foreground">
                {ereignis.farbe}
              </span>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            Metadaten
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              Erstellt:{' '}
              {new Date(ereignis.metadaten.erstelltAm).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              Geändert:{' '}
              {new Date(ereignis.metadaten.geaendertAm).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
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
