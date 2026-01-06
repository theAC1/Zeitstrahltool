'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Ereignis, HistorischesDatum, Wichtigkeit } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { useTimeline } from './TimelineContext';

interface EventEditorProps {
  /** Event to edit (null for new event) */
  ereignis?: Ereignis | null;
  /** Callback when save is clicked */
  onSave?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
}

/**
 * Form component for creating and editing events
 */
export function EventEditor({ ereignis, onSave, onCancel }: EventEditorProps) {
  const { kategorien, ereignisHinzufuegen, ereignisAktualisieren } = useTimeline();

  // Form state
  const [titel, setTitel] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [datum, setDatum] = useState<HistorischesDatum>({ jahr: new Date().getFullYear() });
  const [endDatum, setEndDatum] = useState<HistorischesDatum | null>(null);
  const [istZeitspanne, setIstZeitspanne] = useState(false);
  const [kategorie, setKategorie] = useState<string>('');
  const [farbe, setFarbe] = useState('#6366f1');
  const [wichtigkeit, setWichtigkeit] = useState<Wichtigkeit>(2);
  const [tags, setTags] = useState('');

  // Initialize form with existing event data
  useEffect(() => {
    if (ereignis) {
      setTitel(ereignis.titel);
      setBeschreibung(ereignis.beschreibung ?? '');
      setDatum(ereignis.datum);
      setEndDatum(ereignis.endDatum ?? null);
      setIstZeitspanne(!!ereignis.endDatum);
      setKategorie(ereignis.kategorie ?? '');
      setFarbe(ereignis.farbe ?? '#6366f1');
      setWichtigkeit(ereignis.wichtigkeit ?? 2);
      setTags(ereignis.tags?.join(', ') ?? '');
    }
  }, [ereignis]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    const eventData: Ereignis = {
      id: ereignis?.id ?? uuidv4(),
      titel,
      datum,
      endDatum: istZeitspanne ? endDatum ?? undefined : undefined,
      beschreibung: beschreibung || undefined,
      kategorie: kategorie || undefined,
      farbe: farbe !== '#6366f1' ? farbe : undefined,
      wichtigkeit,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      metadaten: ereignis?.metadaten ?? {
        erstelltAm: now,
        geaendertAm: now,
      },
    };

    if (ereignis) {
      // Update existing event
      ereignisAktualisieren(ereignis.id, eventData);
    } else {
      // Create new event
      ereignisHinzufuegen(eventData);
    }

    onSave?.();
  };

  const handleReset = () => {
    setTitel('');
    setBeschreibung('');
    setDatum({ jahr: new Date().getFullYear() });
    setEndDatum(null);
    setIstZeitspanne(false);
    setKategorie('');
    setFarbe('#6366f1');
    setWichtigkeit(2);
    setTags('');
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="event-title" className="mb-1 block text-sm font-medium">
          Titel *
        </label>
        <Input
          id="event-title"
          type="text"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="z.B. Fall der Berliner Mauer"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="event-description" className="mb-1 block text-sm font-medium">
          Beschreibung
        </label>
        <textarea
          id="event-description"
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          placeholder="Kurze Beschreibung des Ereignisses..."
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
        />
      </div>

      {/* Time Span Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="event-timespan"
          checked={istZeitspanne}
          onChange={(e) => setIstZeitspanne(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
        />
        <label htmlFor="event-timespan" className="text-sm font-medium">
          Zeitspanne (mit Enddatum)
        </label>
      </div>

      {/* Start Date */}
      <div>
        <DatePicker
          label={istZeitspanne ? 'Startdatum *' : 'Datum *'}
          value={datum}
          onChange={setDatum}
        />
      </div>

      {/* End Date (if time span) */}
      {istZeitspanne && (
        <div>
          <DatePicker
            label="Enddatum *"
            value={endDatum ?? { jahr: datum.jahr }}
            onChange={setEndDatum}
          />
        </div>
      )}

      {/* Category */}
      {kategorien.length > 0 && (
        <div>
          <Select
            label="Kategorie"
            value={kategorie}
            onChange={setKategorie}
            options={[
              { value: '', label: 'Keine Kategorie' },
              ...kategorien.map((kat) => ({
                value: kat.id,
                label: kat.name,
              })),
            ]}
          />
        </div>
      )}

      {/* Importance */}
      <div>
        <Select
          label="Wichtigkeit"
          value={String(wichtigkeit)}
          onChange={(value) => setWichtigkeit(Number(value) as Wichtigkeit)}
          options={[
            { value: '1', label: 'Niedrig' },
            { value: '2', label: 'Mittel' },
            { value: '3', label: 'Hoch' },
          ]}
        />
      </div>

      {/* Color */}
      <div>
        <ColorPicker
          label="Farbe"
          value={farbe}
          onChange={setFarbe}
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="event-tags" className="mb-1 block text-sm font-medium">
          Tags
        </label>
        <Input
          id="event-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="z.B. Politik, Deutschland, 20. Jahrhundert"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Mehrere Tags mit Komma trennen
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          variant="default"
          disabled={!titel.trim()}
        >
          {ereignis ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
