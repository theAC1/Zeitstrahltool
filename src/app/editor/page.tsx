'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  TimelineProvider,
  Timeline,
  useTimeline,
  EventEditorModal,
  EventDetailsPanel,
  EpochEditorModal,
  EpochDetailsPanel,
  CategoryManager,
  TimelineLegend,
} from '@/components/zeitstrahl';
import { Button } from '@/components/ui/Button';
import { erstelleBeispielZeitstrahl } from '@/lib/zeitstrahl';
import {
  ladeZeitstrahl,
  exportiereZeitstrahl,
} from '@/lib/storage/timelineStorage';
import type { Ereignis, Epoche } from '@/types';

/**
 * Editor Page Content (needs to be inside TimelineProvider)
 */
function EditorContent() {
  const searchParams = useSearchParams();
  const timelineId = searchParams.get('id');

  const {
    zeitstrahl,
    ladeZeitstrahl: ladeZeitstrahlInContext,
    ereignisse,
    epochen,
    ausgewaehltesEreignis,
    ausgewaehlteEpoche,
    waehleEreignis,
    waehleEpoche,
    ereignisLoeschen,
    epocheLoeschen,
    kannUndo,
    kannRedo,
    undo,
    redo,
    aktivesWerkzeug,
    setWerkzeug,
    manuellesSpeichern,
    autoSaveEnabled,
    lastSaved,
  } = useTimeline();

  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Ereignis | null>(null);
  const [isEpochEditorOpen, setIsEpochEditorOpen] = useState(false);
  const [editingEpoch, setEditingEpoch] = useState<Epoche | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsType, setDetailsType] = useState<'event' | 'epoch'>('event');
  const [isSaving, setIsSaving] = useState(false);

  // Load timeline on mount
  useEffect(() => {
    if (!zeitstrahl) {
      if (timelineId) {
        // Load from storage
        const geladen = ladeZeitstrahl(timelineId);
        if (geladen) {
          ladeZeitstrahlInContext(geladen);
        } else {
          // Timeline not found, load example
          const beispiel = erstelleBeispielZeitstrahl();
          ladeZeitstrahlInContext(beispiel);
        }
      } else {
        // No ID provided, load example
        const beispiel = erstelleBeispielZeitstrahl();
        ladeZeitstrahlInContext(beispiel);
      }
    }
  }, [zeitstrahl, timelineId, ladeZeitstrahlInContext]);

  // Show details panel when event or epoch is selected
  useEffect(() => {
    if (ausgewaehltesEreignis) {
      setShowDetails(true);
      setDetailsType('event');
    } else if (ausgewaehlteEpoche) {
      setShowDetails(true);
      setDetailsType('epoch');
    } else {
      setShowDetails(false);
    }
  }, [ausgewaehltesEreignis, ausgewaehlteEpoche]);

  // Open event editor for new event
  const handleNewEvent = useCallback(() => {
    setEditingEvent(null);
    setIsEventEditorOpen(true);
  }, []);

  // Open event editor for editing
  const handleEditEvent = useCallback(() => {
    if (ausgewaehltesEreignis) {
      const ereignis = ereignisse.find((e) => e.id === ausgewaehltesEreignis);
      if (ereignis) {
        setEditingEvent(ereignis);
        setIsEventEditorOpen(true);
      }
    }
  }, [ausgewaehltesEreignis, ereignisse]);

  // Open epoch editor for new epoch
  const handleNewEpoch = useCallback(() => {
    setEditingEpoch(null);
    setIsEpochEditorOpen(true);
  }, []);

  // Open epoch editor for editing
  const handleEditEpoch = useCallback(() => {
    if (ausgewaehlteEpoche) {
      const epoche = epochen.find((e) => e.id === ausgewaehlteEpoche);
      if (epoche) {
        setEditingEpoch(epoche);
        setIsEpochEditorOpen(true);
      }
    }
  }, [ausgewaehlteEpoche, epochen]);

  // Manual save handler
  const handleManualSave = useCallback(async () => {
    if (!zeitstrahl) return;

    setIsSaving(true);
    try {
      manuellesSpeichern();
      // Show success feedback briefly
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Zeitstrahls');
      setIsSaving(false);
    }
  }, [zeitstrahl, manuellesSpeichern]);

  // Export handler
  const handleExport = useCallback(() => {
    if (!zeitstrahl) return;

    try {
      exportiereZeitstrahl(zeitstrahl);
    } catch (error) {
      console.error('Fehler beim Exportieren:', error);
      alert('Fehler beim Exportieren des Zeitstrahls');
    }
  }, [zeitstrahl]);

  // Format last saved time
  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return '';

    const date = new Date(lastSaved);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins === 1) return 'vor 1 Minute';
    if (diffMins < 60) return `vor ${diffMins} Minuten`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'vor 1 Stunde';
    if (diffHours < 24) return `vor ${diffHours} Stunden`;

    return date.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
  }, [lastSaved]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N - New event
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewEvent();
      }

      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }

      // Delete - Delete selected event or epoch
      if (e.key === 'Delete') {
        e.preventDefault();
        if (ausgewaehltesEreignis) {
          if (confirm('Möchten Sie das ausgewählte Ereignis wirklich löschen?')) {
            ereignisLoeschen(ausgewaehltesEreignis);
            waehleEreignis(null);
          }
        } else if (ausgewaehlteEpoche) {
          if (confirm('Möchten Sie die ausgewählte Epoche wirklich löschen?')) {
            epocheLoeschen(ausgewaehlteEpoche);
            waehleEpoche(null);
          }
        }
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && kannUndo) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z' && kannRedo) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y' && kannRedo)
      ) {
        e.preventDefault();
        redo();
      }

      // Escape - Deselect
      if (e.key === 'Escape') {
        waehleEreignis(null);
        waehleEpoche(null);
        setShowDetails(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNewEvent,
    handleManualSave,
    ausgewaehltesEreignis,
    ausgewaehlteEpoche,
    ereignisLoeschen,
    epocheLoeschen,
    waehleEreignis,
    waehleEpoche,
    kannUndo,
    kannRedo,
    undo,
    redo,
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Editor Header */}
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Zeitstrahl</span>
          </Link>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            {zeitstrahl?.titel ?? 'Neuer Zeitstrahl'}
          </span>
          {/* Auto-save status */}
          {autoSaveEnabled && lastSaved && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">
                Gespeichert {formatLastSaved()}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!kannUndo}
            title="Rückgängig (Ctrl+Z)"
            className="px-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!kannRedo}
            title="Wiederherstellen (Ctrl+Shift+Z)"
            className="px-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
              />
            </svg>
          </Button>

          <div className="mx-2 h-6 w-px bg-border" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={isSaving}
            title="Speichern (Ctrl+S)"
          >
            {isSaving ? (
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {isSaving ? 'Speichert...' : 'Speichern'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportieren
          </Button>
        </div>
      </header>

      {/* Editor Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Tools */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Werkzeuge</h3>
              <div className="space-y-2">
                <button
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    aktivesWerkzeug === 'auswaehlen'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setWerkzeug('auswaehlen')}
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  Auswählen
                </button>
                <button
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    aktivesWerkzeug === 'navigation'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setWerkzeug('navigation')}
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Navigation
                </button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Aktionen</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleNewEvent}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Neues Ereignis
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleNewEpoch}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  Neue Epoche
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Statistik</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Ereignisse:</span>
                  <span className="font-medium text-foreground">{ereignisse.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Epochen:</span>
                  <span className="font-medium text-foreground">{epochen.length}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <CategoryManager />

            {/* Legend */}
            <TimelineLegend showCategories showEpochs />

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Tastaturkürzel</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Neues Ereignis</span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl+N</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Speichern</span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Löschen</span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Del</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rückgängig</span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl+Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wiederherstellen</span>
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl+Y</kbd>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Timeline Area */}
        <main className="flex flex-1">
          <div className="flex-1">
            <Timeline className="h-full" />
          </div>

          {/* Right Sidebar - Details Panel */}
          {showDetails && (
            <aside className="w-80 border-l bg-background">
              {detailsType === 'event' ? (
                <EventDetailsPanel onEdit={handleEditEvent} />
              ) : (
                <EpochDetailsPanel onEdit={handleEditEpoch} />
              )}
            </aside>
          )}
        </main>
      </div>

      {/* Event Editor Modal */}
      <EventEditorModal
        isOpen={isEventEditorOpen}
        ereignis={editingEvent}
        onClose={() => {
          setIsEventEditorOpen(false);
          setEditingEvent(null);
        }}
      />

      {/* Epoch Editor Modal */}
      <EpochEditorModal
        isOpen={isEpochEditorOpen}
        epoche={editingEpoch}
        onClose={() => {
          setIsEpochEditorOpen(false);
          setEditingEpoch(null);
        }}
      />
    </div>
  );
}

/**
 * Editor Page (wrapper with TimelineProvider)
 */
export default function EditorPage() {
  return (
    <TimelineProvider>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      }>
        <EditorContent />
      </Suspense>
    </TimelineProvider>
  );
}
