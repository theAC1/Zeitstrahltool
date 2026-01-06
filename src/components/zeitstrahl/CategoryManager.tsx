'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Kategorie } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { useTimeline } from './TimelineContext';

/**
 * Component for managing categories
 */
export function CategoryManager() {
  const { zeitstrahl, ladeZeitstrahl } = useTimeline();
  const kategorien = zeitstrahl?.kategorien ?? [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [farbe, setFarbe] = useState('#6366f1');
  const [beschreibung, setBeschreibung] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !zeitstrahl) return;

    const neueKategorie: Kategorie = {
      id: uuidv4(),
      name: name.trim(),
      farbe,
      beschreibung: beschreibung.trim() || undefined,
    };

    ladeZeitstrahl({
      ...zeitstrahl,
      kategorien: [...kategorien, neueKategorie],
      metadaten: {
        ...zeitstrahl.metadaten,
        geaendertAm: new Date().toISOString(),
      },
    });

    // Reset form
    setName('');
    setFarbe('#6366f1');
    setBeschreibung('');
    setIsAdding(false);
  };

  const handleEdit = (kategorie: Kategorie) => {
    setEditingId(kategorie.id);
    setName(kategorie.name);
    setFarbe(kategorie.farbe);
    setBeschreibung(kategorie.beschreibung ?? '');
  };

  const handleUpdate = () => {
    if (!name.trim() || !editingId || !zeitstrahl) return;

    ladeZeitstrahl({
      ...zeitstrahl,
      kategorien: kategorien.map((kat) =>
        kat.id === editingId
          ? { ...kat, name: name.trim(), farbe, beschreibung: beschreibung.trim() || undefined }
          : kat
      ),
      metadaten: {
        ...zeitstrahl.metadaten,
        geaendertAm: new Date().toISOString(),
      },
    });

    // Reset form
    setEditingId(null);
    setName('');
    setFarbe('#6366f1');
    setBeschreibung('');
  };

  const handleDelete = (id: string) => {
    if (!zeitstrahl) return;
    if (!confirm('Kategorie wirklich löschen? Zugewiesene Ereignisse behalten ihre Kategorie-Referenz.')) return;

    ladeZeitstrahl({
      ...zeitstrahl,
      kategorien: kategorien.filter((kat) => kat.id !== id),
      metadaten: {
        ...zeitstrahl.metadaten,
        geaendertAm: new Date().toISOString(),
      },
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setFarbe('#6366f1');
    setBeschreibung('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Kategorien</h3>
        {!isAdding && !editingId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Neu
          </Button>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {kategorien.map((kategorie) => (
          <div
            key={kategorie.id}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            {editingId === kategorie.id ? (
              // Edit mode
              <div className="flex-1 space-y-2">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kategorie-Name"
                  className="h-8"
                />
                <ColorPicker
                  value={farbe}
                  onChange={setFarbe}
                  showCustomInput={false}
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleUpdate}
                    disabled={!name.trim()}
                  >
                    Speichern
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div
                  className="h-4 w-4 flex-shrink-0 rounded"
                  style={{ backgroundColor: kategorie.farbe }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{kategorie.name}</div>
                  {kategorie.beschreibung && (
                    <div className="text-xs text-muted-foreground truncate">
                      {kategorie.beschreibung}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(kategorie)}
                    className="rounded p-1 hover:bg-accent"
                    title="Bearbeiten"
                    type="button"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(kategorie.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    title="Löschen"
                    type="button"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="space-y-3 rounded-md border p-3">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kategorie-Name"
            autoFocus
          />
          <Input
            type="text"
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
            placeholder="Beschreibung (optional)"
          />
          <ColorPicker
            value={farbe}
            onChange={setFarbe}
            showCustomInput={false}
          />
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleAdd}
              disabled={!name.trim()}
            >
              Hinzufügen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      {kategorien.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground">
          Noch keine Kategorien vorhanden.
        </p>
      )}
    </div>
  );
}
