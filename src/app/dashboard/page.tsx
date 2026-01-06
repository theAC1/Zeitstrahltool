'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/Button';
import { ImportModal, TemplateSelectionModal } from '@/components/zeitstrahl';
import {
  ladeZeitstrahlListe,
  ladeRecentListe,
  ladeZeitstrahl,
  loescheZeitstrahl,
  exportiereZeitstrahl,
  speichereZeitstrahl,
  type TimelineMetaInfo,
  type RecentTimeline,
} from '@/lib/storage/timelineStorage';
import type { Zeitstrahl } from '@/types';

/**
 * Dashboard Page - Timeline Management
 */
export default function DashboardPage() {
  const router = useRouter();

  const [timelines, setTimelines] = useState<TimelineMetaInfo[]>([]);
  const [recentTimelines, setRecentTimelines] = useState<RecentTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Load timelines on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTimelines(ladeZeitstrahlListe());
    setRecentTimelines(ladeRecentListe());
    setIsLoading(false);
  };

  const handleNewTimeline = () => {
    setIsTemplateModalOpen(true);
  };

  const handleSelectTemplate = (zeitstrahl: Zeitstrahl) => {
    try {
      // Generate new ID if not already set
      if (!zeitstrahl.id) {
        zeitstrahl.id = uuidv4();
      }

      speichereZeitstrahl(zeitstrahl);
      router.push(`/editor?id=${zeitstrahl.id}`);
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      alert('Fehler beim Erstellen des Zeitstrahls aus Vorlage');
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/editor?id=${id}`);
  };

  const handleDelete = (id: string, titel: string) => {
    if (confirm(`Möchten Sie "${titel}" wirklich löschen?`)) {
      try {
        loescheZeitstrahl(id);
        loadData();
      } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen des Zeitstrahls');
      }
    }
  };

  const handleExport = (id: string) => {
    try {
      const zeitstrahl = ladeZeitstrahl(id);
      if (zeitstrahl) {
        exportiereZeitstrahl(zeitstrahl);
      }
    } catch (error) {
      console.error('Fehler beim Exportieren:', error);
      alert('Fehler beim Exportieren des Zeitstrahls');
    }
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImport = (zeitstrahl: Zeitstrahl, isCSV?: boolean) => {
    try {
      speichereZeitstrahl(zeitstrahl);
      loadData();

      if (isCSV) {
        alert(`${zeitstrahl.ereignisse.length} Ereignisse aus CSV importiert`);
      } else {
        alert(`Zeitstrahl "${zeitstrahl.titel}" wurde erfolgreich importiert`);
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des importierten Zeitstrahls');
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="h-8 w-8 text-primary"
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
              <h1 className="text-3xl font-bold">Zeitstrahl</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleImportClick}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Importieren
              </Button>
              <Button onClick={handleNewTimeline}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Neuer Zeitstrahl
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Recent Timelines */}
        {recentTimelines.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold">Zuletzt geöffnet</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentTimelines.map((recent) => {
                const timeline = timelines.find((t) => t.id === recent.id);
                if (!timeline) return null;

                return (
                  <div
                    key={recent.id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
                    onClick={() => handleOpen(recent.id)}
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-primary">
                        {timeline.titel}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Geöffnet: {formatDate(recent.zuletztGeoeffnet)}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{timeline.ereignisAnzahl} Ereignisse</span>
                      <span>{timeline.epochenAnzahl} Epochen</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All Timelines */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Alle Zeitstrahlen</h2>

          {timelines.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">Keine Zeitstrahlen vorhanden</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Erstellen Sie Ihren ersten Zeitstrahl aus einer Vorlage oder importieren Sie eine vorhandene Datei.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={handleNewTimeline}>Neuer Zeitstrahl</Button>
                <Button variant="outline" onClick={handleImportClick}>
                  Importieren
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b text-left text-sm">
                    <th className="px-6 py-3 font-medium">Titel</th>
                    <th className="px-6 py-3 font-medium">Ereignisse</th>
                    <th className="px-6 py-3 font-medium">Epochen</th>
                    <th className="px-6 py-3 font-medium">Geändert</th>
                    <th className="px-6 py-3 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {timelines.map((timeline) => (
                    <tr key={timeline.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpen(timeline.id)}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {timeline.titel}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {timeline.ereignisAnzahl}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {timeline.epochenAnzahl}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(timeline.geaendertAm)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(timeline.id);
                            }}
                            className="rounded p-1 hover:bg-accent"
                            title="Exportieren"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(timeline.id, timeline.titel);
                            }}
                            className="rounded p-1 text-red-600 hover:bg-red-50"
                            title="Löschen"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
