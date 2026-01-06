'use client';

import { useState, useCallback, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { Zeitstrahl } from '@/types';
import {
  parseCSV,
  csvToEreignisse,
  validateCSV,
  downloadCSVTemplate,
  type CSVImportOptions,
} from '@/lib/import/csvImport';
import { migrateZeitstrahl } from '@/lib/import/schemaMigration';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (zeitstrahl: Zeitstrahl, isCSV?: boolean) => void;
}

type ImportFormat = 'json' | 'csv';

const DATE_FORMAT_OPTIONS = [
  { value: 'ISO', label: 'ISO (YYYY-MM-DD)' },
  { value: 'DD.MM.YYYY', label: 'Deutsch (DD.MM.YYYY)' },
  { value: 'MM/DD/YYYY', label: 'Amerikanisch (MM/DD/YYYY)' },
  { value: 'YYYY-MM-DD', label: 'International (YYYY-MM-DD)' },
];

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [format, setFormat] = useState<ImportFormat>('json');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvOptions, setCSVOptions] = useState<CSVImportOptions>({
    delimiter: ',',
    hasHeader: true,
    dateFormat: 'ISO',
    skipEmptyRows: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFormatChange = useCallback((value: string) => {
    setFormat(value as ImportFormat);
    setError(null);
  }, []);

  const handleDateFormatChange = useCallback((value: string) => {
    setCSVOptions((prev) => ({
      ...prev,
      dateFormat: value as CSVImportOptions['dateFormat'],
    }));
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);

      try {
        const text = await file.text();

        if (format === 'json') {
          // JSON Import
          const data = JSON.parse(text);

          // Check if migration is needed and migrate to current version
          // Migrate and validate
          const zeitstrahl = migrateZeitstrahl(data);
          onImport(zeitstrahl, false);
          onClose();
        } else {
          // CSV Import
          // Validate CSV
          const validation = validateCSV(text, csvOptions);

          if (!validation.valid) {
            setError(`CSV-Validierung fehlgeschlagen:\n${validation.errors.join('\n')}`);
            setIsProcessing(false);
            return;
          }

          if (validation.warnings.length > 0) {
            console.warn('CSV Warnungen:', validation.warnings);
          }

          // Parse CSV
          const rows = parseCSV(text, csvOptions);
          const { ereignisse, errors } = csvToEreignisse(rows, csvOptions);

          if (errors.length > 0) {
            setError(`Fehler beim Importieren:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... und ${errors.length - 5} weitere` : ''}`);
            setIsProcessing(false);
            return;
          }

          if (ereignisse.length === 0) {
            setError('Keine Ereignisse gefunden');
            setIsProcessing(false);
            return;
          }

          // Create timeline from CSV events
          const zeitstrahl: Zeitstrahl = {
            id: crypto.randomUUID(),
            titel: file.name.replace(/\.csv$/i, ''),
            ereignisse,
            epochen: [],
            kategorien: [],
            einstellungen: {
              zeitraum: {
                start: { jahr: 1900 },
                ende: { jahr: 2000 },
                automatisch: true,
              },
              skalierung: 'linear',
              ansicht: 'horizontal',
              sprache: 'de',
              theme: 'system',
              export: {
                breite: 1920,
                hoehe: 1080,
                hintergrund: '#ffffff',
                qualitaet: 0.9,
              },
            },
            metadaten: {
              version: '1.0',
              erstelltAm: new Date().toISOString(),
              geaendertAm: new Date().toISOString(),
            },
          };

          onImport(zeitstrahl, true);
          onClose();
        }
      } catch (err) {
        console.error('Import error:', err);
        setError(err instanceof Error ? err.message : 'Import fehlgeschlagen');
      } finally {
        setIsProcessing(false);
      }
    },
    [format, csvOptions, onImport, onClose]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      // Check file extension
      const expectedExt = format === 'json' ? '.json' : '.csv';
      if (!file.name.toLowerCase().endsWith(expectedExt)) {
        setError(`Bitte wählen Sie eine ${expectedExt}-Datei`);
        return;
      }

      handleFileSelect(file);
    },
    [format, handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      handleFileSelect(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleDownloadTemplate = useCallback(() => {
    downloadCSVTemplate();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zeitstrahl importieren">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Import-Format *</label>
          <Select
            value={format}
            onChange={handleFormatChange}
            options={[
              { value: 'json', label: 'JSON (Vollständiger Zeitstrahl)' },
              { value: 'csv', label: 'CSV (Nur Ereignisse)' },
            ]}
          />
        </div>

        {/* CSV Options */}
        {format === 'csv' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium">Datumsformat</label>
              <Select
                value={csvOptions.dateFormat || 'ISO'}
                onChange={handleDateFormatChange}
                options={DATE_FORMAT_OPTIONS}
              />
            </div>

            <div className="rounded-md bg-blue-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-blue-900">CSV-Format</h4>
              <p className="mb-2 text-xs text-blue-700">
                Ihre CSV-Datei sollte folgende Spalten haben:
              </p>
              <ul className="mb-2 list-inside list-disc text-xs text-blue-700">
                <li>Titel (Pflichtfeld)</li>
                <li>Datum (Pflichtfeld, z.B. 1989-11-09)</li>
                <li>Beschreibung (optional)</li>
                <li>Kategorie (optional)</li>
                <li>Tags (optional, getrennt durch Semikolon)</li>
                <li>Wichtigkeit (optional, 1-3)</li>
              </ul>
              <Button variant="link" size="sm" onClick={handleDownloadTemplate} className="p-0 h-auto">
                CSV-Vorlage herunterladen
              </Button>
            </div>
          </>
        )}

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClickUpload}
          className={`
            cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="h-12 w-12 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">Verarbeite...</p>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-4 text-sm font-medium">
                {format === 'json' ? 'JSON' : 'CSV'}-Datei hierher ziehen
              </p>
              <p className="mt-1 text-xs text-muted-foreground">oder klicken zum Auswählen</p>
            </>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-red-900">Fehler</h4>
            <pre className="whitespace-pre-wrap text-xs text-red-700">{error}</pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Abbrechen
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={format === 'json' ? '.json' : '.csv'}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </Modal>
  );
}
