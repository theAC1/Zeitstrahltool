'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Epoche, HistorischesDatum } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { useTimeline } from './TimelineContext';

interface EpochEditorProps {
  /** Epoch to edit (null for new epoch) */
  epoche?: Epoche | null;
  /** Callback when save is clicked */
  onSave?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
}

/**
 * Form component for creating and editing epochs
 */
export function EpochEditor({ epoche, onSave, onCancel }: EpochEditorProps) {
  const { epocheHinzufuegen, epocheAktualisieren } = useTimeline();

  // Form state
  const [name, setName] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [start, setStart] = useState<HistorischesDatum>({ jahr: new Date().getFullYear() - 100 });
  const [ende, setEnde] = useState<HistorischesDatum>({ jahr: new Date().getFullYear() });
  const [farbe, setFarbe] = useState('#fbbf24');
  const [ebene, setEbene] = useState(0);

  // Initialize form with existing epoch data
  useEffect(() => {
    if (epoche) {
      setName(epoche.name);
      setBeschreibung(epoche.beschreibung ?? '');
      setStart(epoche.start);
      setEnde(epoche.ende);
      setFarbe(epoche.farbe);
      setEbene(epoche.ebene);
    }
  }, [epoche]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const epocheData: Epoche = {
      id: epoche?.id ?? uuidv4(),
      name,
      start,
      ende,
      farbe,
      ebene,
      beschreibung: beschreibung || undefined,
    };

    if (epoche) {
      // Update existing epoch
      epocheAktualisieren(epoche.id, epocheData);
    } else {
      // Create new epoch
      epocheHinzufuegen(epocheData);
    }

    onSave?.();
  };

  const handleReset = () => {
    setName('');
    setBeschreibung('');
    setStart({ jahr: new Date().getFullYear() - 100 });
    setEnde({ jahr: new Date().getFullYear() });
    setFarbe('#fbbf24');
    setEbene(0);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="epoch-name" className="mb-1 block text-sm font-medium">
          Name *
        </label>
        <Input
          id="epoch-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Weimarer Republik"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="epoch-description" className="mb-1 block text-sm font-medium">
          Beschreibung
        </label>
        <textarea
          id="epoch-description"
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          placeholder="Kurze Beschreibung der Epoche..."
          className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={2}
        />
      </div>

      {/* Start Date */}
      <div>
        <DatePicker
          label="Startdatum *"
          value={start}
          onChange={setStart}
        />
      </div>

      {/* End Date */}
      <div>
        <DatePicker
          label="Enddatum *"
          value={ende}
          onChange={setEnde}
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

      {/* Layer (Ebene) */}
      <div>
        <label htmlFor="epoch-layer" className="mb-1 block text-sm font-medium">
          Ebene (für Stapeln)
        </label>
        <Input
          id="epoch-layer"
          type="number"
          min={0}
          max={10}
          value={ebene}
          onChange={(e) => setEbene(Number(e.target.value))}
          placeholder="0"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Höhere Ebenen werden weiter oben angezeigt
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
          disabled={!name.trim()}
        >
          {epoche ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
