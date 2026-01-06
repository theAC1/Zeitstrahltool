'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
import type { Ereignis, Epoche } from '@/types';

/**
 * Editor Page Content (needs to be inside TimelineProvider)
 */
function EditorContent() {
  const {
    zeitstrahl,
    ladeZeitstrahl,
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
  } = useTimeline();

  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Ereignis | null>(null);
  const [isEpochEditorOpen, setIsEpochEditorOpen] = useState(false);
  const [editingEpoch, setEditingEpoch] = useState<Epoche | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsType, setDetailsType] = useState<'event' | 'epoch'>('event');

  // Load sample timeline on mount
  useEffect(() => {
    if (!zeitstrahl) {
      const beispiel = erstelleBeispielZeitstrahl();
      ladeZeitstrahl(beispiel);
    }
  }, [zeitstrahl, ladeZeitstrahl]);

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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N - New event
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewEvent();
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
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
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

          <Button variant="outline" size="sm">
            Speichern
          </Button>
          <Button variant="outline" size="sm">
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
      <EditorContent />
    </TimelineProvider>
  );
}
