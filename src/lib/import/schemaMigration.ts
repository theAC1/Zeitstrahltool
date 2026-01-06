import type { Zeitstrahl, Ereignis, Epoche, Kategorie } from '@/types';

// ============================================
// Schema Version Types
// ============================================

export const CURRENT_SCHEMA_VERSION = '1.0';

interface LegacyZeitstrahl {
  id: string;
  titel: string;
  ereignisse: unknown[];
  epochen?: unknown[];
  kategorien?: unknown[];
  einstellungen?: unknown;
  metadaten?: {
    version?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ============================================
// Migration Functions
// ============================================

/**
 * Migrate timeline data to current schema version
 */
export function migrateZeitstrahl(data: unknown): Zeitstrahl {
  if (!data || typeof data !== 'object') {
    throw new Error('Ungültige Timeline-Daten');
  }

  const legacy = data as LegacyZeitstrahl;

  // Check if migration is needed
  const version = legacy.metadaten?.version || '0.1';

  if (version === CURRENT_SCHEMA_VERSION) {
    // Already current version, just validate
    return validateZeitstrahl(legacy as unknown as Zeitstrahl);
  }

  // Perform migration based on version
  let migrated: Zeitstrahl;

  if (compareVersions(version, '0.5') < 0) {
    migrated = migrateFrom0_1(legacy);
  } else if (compareVersions(version, '1.0') < 0) {
    migrated = migrateFrom0_5(legacy);
  } else {
    migrated = legacy as unknown as Zeitstrahl;
  }

  // Validate after migration
  return validateZeitstrahl(migrated);
}

/**
 * Migrate from version 0.1 to current
 */
function migrateFrom0_1(legacy: LegacyZeitstrahl): Zeitstrahl {
  const now = new Date().toISOString();

  return {
    id: legacy.id,
    titel: legacy.titel || 'Unbenannter Zeitstrahl',
    beschreibung: (legacy as { beschreibung?: string }).beschreibung,
    ereignisse: (legacy.ereignisse || []).map((e: unknown) => migrateEreignis(e)),
    epochen: (legacy.epochen || []).map((e: unknown) => migrateEpoche(e)),
    kategorien: (legacy.kategorien || []).map((k: unknown) => migrateKategorie(k)),
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
      version: CURRENT_SCHEMA_VERSION,
      erstelltAm: legacy.metadaten?.erstelltAm as string || now,
      geaendertAm: now,
      autor: legacy.metadaten?.autor as string,
      quelle: legacy.metadaten?.quelle as string,
      lizenz: legacy.metadaten?.lizenz as string,
    },
  };
}

/**
 * Migrate from version 0.5 to current
 */
function migrateFrom0_5(legacy: LegacyZeitstrahl): Zeitstrahl {
  const now = new Date().toISOString();

  // Version 0.5 is closer to current, just update missing fields
  return {
    ...(legacy as unknown as Zeitstrahl),
    ereignisse: (legacy.ereignisse || []).map((e: unknown) => migrateEreignis(e)),
    epochen: (legacy.epochen || []).map((e: unknown) => migrateEpoche(e)),
    kategorien: (legacy.kategorien || []).map((k: unknown) => migrateKategorie(k)),
    metadaten: {
      version: CURRENT_SCHEMA_VERSION,
      erstelltAm: legacy.metadaten?.erstelltAm as string || now,
      geaendertAm: now,
      autor: legacy.metadaten?.autor as string,
      quelle: legacy.metadaten?.quelle as string,
      lizenz: legacy.metadaten?.lizenz as string,
    },
  };
}

/**
 * Migrate single event
 */
function migrateEreignis(data: unknown): Ereignis {
  if (!data || typeof data !== 'object') {
    throw new Error('Ungültiges Ereignis');
  }

  const legacy = data as Record<string, unknown>;
  const now = new Date().toISOString();

  // Handle old date format
  let datum = legacy.datum;
  if (datum && typeof datum === 'object') {
    const d = datum as Record<string, unknown>;
    // Check for old format: { jahr: number, istVorChristus: boolean }
    if ('istVorChristus' in d && d.istVorChristus === true) {
      datum = { ...d, jahr: -(Math.abs(d.jahr as number)) };
      delete (datum as Record<string, unknown>).istVorChristus;
    }
  }

  return {
    id: legacy.id as string,
    titel: legacy.titel as string || 'Unbenannt',
    datum: datum as Ereignis['datum'],
    endDatum: legacy.endDatum as Ereignis['endDatum'],
    beschreibung: legacy.beschreibung as string,
    kategorie: legacy.kategorie as string,
    tags: legacy.tags as string[],
    farbe: legacy.farbe as string,
    icon: legacy.icon as string,
    wichtigkeit: legacy.wichtigkeit as 1 | 2 | 3,
    bild: legacy.bild as Ereignis['bild'],
    links: legacy.links as Ereignis['links'],
    position: legacy.position as Ereignis['position'],
    metadaten: {
      erstelltAm: (legacy.metadaten as { erstelltAm?: string })?.erstelltAm || now,
      geaendertAm: now,
    },
  };
}

/**
 * Migrate single epoch
 */
function migrateEpoche(data: unknown): Epoche {
  if (!data || typeof data !== 'object') {
    throw new Error('Ungültige Epoche');
  }

  const legacy = data as Record<string, unknown>;

  // Handle old date format for start/end
  let start = legacy.start;
  let ende = legacy.ende;

  if (start && typeof start === 'object') {
    const s = start as Record<string, unknown>;
    if ('istVorChristus' in s && s.istVorChristus === true) {
      start = { ...s, jahr: -(Math.abs(s.jahr as number)) };
      delete (start as Record<string, unknown>).istVorChristus;
    }
  }

  if (ende && typeof ende === 'object') {
    const e = ende as Record<string, unknown>;
    if ('istVorChristus' in e && e.istVorChristus === true) {
      ende = { ...e, jahr: -(Math.abs(e.jahr as number)) };
      delete (ende as Record<string, unknown>).istVorChristus;
    }
  }

  return {
    id: legacy.id as string,
    name: legacy.name as string || 'Unbenannt',
    start: start as Epoche['start'],
    ende: ende as Epoche['ende'],
    farbe: legacy.farbe as string || '#000000',
    ebene: (legacy.ebene as number) || 0,
    beschreibung: legacy.beschreibung as string,
  };
}

/**
 * Migrate single category
 */
function migrateKategorie(data: unknown): Kategorie {
  if (!data || typeof data !== 'object') {
    throw new Error('Ungültige Kategorie');
  }

  const legacy = data as Record<string, unknown>;

  return {
    id: legacy.id as string,
    name: legacy.name as string || 'Unbenannt',
    farbe: legacy.farbe as string || '#000000',
    icon: legacy.icon as string,
    beschreibung: legacy.beschreibung as string,
  };
}

// ============================================
// Validation
// ============================================

/**
 * Validate timeline structure
 */
function validateZeitstrahl(zeitstrahl: Zeitstrahl): Zeitstrahl {
  if (!zeitstrahl.id) {
    throw new Error('Timeline ID fehlt');
  }

  if (!zeitstrahl.titel) {
    throw new Error('Timeline Titel fehlt');
  }

  if (!Array.isArray(zeitstrahl.ereignisse)) {
    throw new Error('Ereignisse müssen ein Array sein');
  }

  if (!Array.isArray(zeitstrahl.epochen)) {
    zeitstrahl.epochen = [];
  }

  if (!Array.isArray(zeitstrahl.kategorien)) {
    zeitstrahl.kategorien = [];
  }

  if (!zeitstrahl.einstellungen) {
    throw new Error('Einstellungen fehlen');
  }

  if (!zeitstrahl.metadaten) {
    throw new Error('Metadaten fehlen');
  }

  return zeitstrahl;
}

// ============================================
// Helpers
// ============================================

/**
 * Compare semantic versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }

  return 0;
}

/**
 * Check if data needs migration
 */
export function needsMigration(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const legacy = data as LegacyZeitstrahl;
  const version = legacy.metadaten?.version || '0.1';

  return version !== CURRENT_SCHEMA_VERSION;
}

/**
 * Get schema version from data
 */
export function getSchemaVersion(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return 'unknown';
  }

  const legacy = data as LegacyZeitstrahl;
  return legacy.metadaten?.version || '0.1';
}
