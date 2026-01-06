import type { Zeitstrahl } from '@/types';

// ============================================
// Constants
// ============================================

const STORAGE_PREFIX = 'zeitstrahl_';
const TIMELINE_LIST_KEY = `${STORAGE_PREFIX}list`;
const RECENT_KEY = `${STORAGE_PREFIX}recent`;
const MAX_RECENT = 10;

// ============================================
// Types
// ============================================

export interface TimelineMetaInfo {
  id: string;
  titel: string;
  erstelltAm: string;
  geaendertAm: string;
  ereignisAnzahl: number;
  epochenAnzahl: number;
}

export interface RecentTimeline {
  id: string;
  titel: string;
  zuletztGeoeffnet: string;
}

// ============================================
// Storage Operations
// ============================================

/**
 * Save a timeline to LocalStorage
 */
export function speichereZeitstrahl(zeitstrahl: Zeitstrahl): void {
  try {
    // Save timeline data
    const key = `${STORAGE_PREFIX}${zeitstrahl.id}`;
    localStorage.setItem(key, JSON.stringify(zeitstrahl));

    // Update timeline list
    const liste = ladeZeitstrahlListe();
    const meta: TimelineMetaInfo = {
      id: zeitstrahl.id,
      titel: zeitstrahl.titel,
      erstelltAm: zeitstrahl.metadaten.erstelltAm,
      geaendertAm: zeitstrahl.metadaten.geaendertAm,
      ereignisAnzahl: zeitstrahl.ereignisse.length,
      epochenAnzahl: zeitstrahl.epochen.length,
    };

    // Update or add to list
    const index = liste.findIndex((item) => item.id === zeitstrahl.id);
    if (index >= 0) {
      liste[index] = meta;
    } else {
      liste.push(meta);
    }

    localStorage.setItem(TIMELINE_LIST_KEY, JSON.stringify(liste));

    // Update recent list
    aktualisiereRecentListe(zeitstrahl.id, zeitstrahl.titel);
  } catch (error) {
    console.error('Fehler beim Speichern des Zeitstrahls:', error);
    throw new Error('Zeitstrahl konnte nicht gespeichert werden');
  }
}

/**
 * Load a timeline from LocalStorage
 */
export function ladeZeitstrahl(id: string): Zeitstrahl | null {
  try {
    const key = `${STORAGE_PREFIX}${id}`;
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    const zeitstrahl = JSON.parse(data) as Zeitstrahl;

    // Update recent list
    aktualisiereRecentListe(id, zeitstrahl.titel);

    return zeitstrahl;
  } catch (error) {
    console.error('Fehler beim Laden des Zeitstrahls:', error);
    return null;
  }
}

/**
 * Get list of all saved timelines
 */
export function ladeZeitstrahlListe(): TimelineMetaInfo[] {
  try {
    const data = localStorage.getItem(TIMELINE_LIST_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as TimelineMetaInfo[];
  } catch (error) {
    console.error('Fehler beim Laden der Zeitstrahl-Liste:', error);
    return [];
  }
}

/**
 * Delete a timeline from LocalStorage
 */
export function loescheZeitstrahl(id: string): void {
  try {
    // Remove timeline data
    const key = `${STORAGE_PREFIX}${id}`;
    localStorage.removeItem(key);

    // Update timeline list
    const liste = ladeZeitstrahlListe();
    const neueListe = liste.filter((item) => item.id !== id);
    localStorage.setItem(TIMELINE_LIST_KEY, JSON.stringify(neueListe));

    // Update recent list
    const recent = ladeRecentListe();
    const neueRecent = recent.filter((item) => item.id !== id);
    localStorage.setItem(RECENT_KEY, JSON.stringify(neueRecent));
  } catch (error) {
    console.error('Fehler beim Löschen des Zeitstrahls:', error);
    throw new Error('Zeitstrahl konnte nicht gelöscht werden');
  }
}

/**
 * Get list of recently opened timelines
 */
export function ladeRecentListe(): RecentTimeline[] {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as RecentTimeline[];
  } catch (error) {
    console.error('Fehler beim Laden der Recent-Liste:', error);
    return [];
  }
}

/**
 * Update the recent timelines list
 */
function aktualisiereRecentListe(id: string, titel: string): void {
  try {
    const recent = ladeRecentListe();

    // Remove if already exists
    const filtered = recent.filter((item) => item.id !== id);

    // Add to front
    const updated: RecentTimeline[] = [
      {
        id,
        titel,
        zuletztGeoeffnet: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT);

    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Recent-Liste:', error);
  }
}

/**
 * Export timeline as JSON file
 */
export function exportiereZeitstrahl(zeitstrahl: Zeitstrahl): void {
  const json = JSON.stringify(zeitstrahl, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${zeitstrahl.titel.replace(/[^a-z0-9]/gi, '_')}_${zeitstrahl.id}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import timeline from JSON file
 */
export function importiereZeitstrahl(file: File): Promise<Zeitstrahl> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const zeitstrahl = JSON.parse(text) as Zeitstrahl;

        // Validate basic structure
        if (!zeitstrahl.id || !zeitstrahl.titel || !zeitstrahl.ereignisse) {
          throw new Error('Ungültiges Zeitstrahl-Format');
        }

        resolve(zeitstrahl);
      } catch {
        reject(new Error('Datei konnte nicht importiert werden'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    reader.readAsText(file);
  });
}

/**
 * Check if LocalStorage is available and has space
 */
export function pruefeStorage(): { verfuegbar: boolean; platzmangel: boolean } {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);

    // Try to estimate space (rough estimate)
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }

    // Most browsers have 5-10MB limit
    const platzmangel = totalSize > 4 * 1024 * 1024; // Warn at 4MB

    return { verfuegbar: true, platzmangel };
  } catch {
    return { verfuegbar: false, platzmangel: false };
  }
}

/**
 * Clear all timeline data from storage
 */
export function loescheAlleZeitstrahlen(): void {
  try {
    const liste = ladeZeitstrahlListe();
    for (const item of liste) {
      const key = `${STORAGE_PREFIX}${item.id}`;
      localStorage.removeItem(key);
    }
    localStorage.removeItem(TIMELINE_LIST_KEY);
    localStorage.removeItem(RECENT_KEY);
  } catch (error) {
    console.error('Fehler beim Löschen aller Zeitstrahlen:', error);
    throw new Error('Fehler beim Löschen aller Zeitstrahlen');
  }
}
