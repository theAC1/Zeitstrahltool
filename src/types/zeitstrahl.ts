/**
 * Core types for Zeitstrahl - Interactive Timeline Tool
 *
 * Date format: Uses positive/negative numbers for years
 * Positive = CE (Common Era / n.Chr.)
 * Negative = BCE (Before Common Era / v.Chr.)
 */

// ============================================
// Date Types
// ============================================

/**
 * Historical date with optional month and day
 * Year: positive = CE, negative = BCE
 */
export interface HistorischesDatum {
  /** Year (positive = CE, negative = BCE, e.g., -753 for 753 BCE) */
  jahr: number;
  /** Month (1-12, optional) */
  monat?: number;
  /** Day (1-31, optional) */
  tag?: number;
  /** Approximate date marker ("ca.") */
  ungenau?: boolean;
}

// ============================================
// Event Types
// ============================================

/**
 * Importance level for events
 */
export type Wichtigkeit = 1 | 2 | 3;

/**
 * Image attachment for events
 */
export interface EventBild {
  url: string;
  alt: string;
  quelle?: string;
}

/**
 * Link attachment for events
 */
export interface EventLink {
  titel: string;
  url: string;
}

/**
 * Single event on the timeline
 */
export interface Ereignis {
  id: string;
  titel: string;
  datum: HistorischesDatum;
  /** Optional end date for time spans */
  endDatum?: HistorischesDatum;
  /** Description (Markdown supported) */
  beschreibung?: string;
  /** Category ID reference */
  kategorie?: string;
  /** Tags for filtering */
  tags?: string[];
  /** Custom color (overrides category) */
  farbe?: string;
  /** Icon name */
  icon?: string;
  /** Importance level */
  wichtigkeit?: Wichtigkeit;
  /** Image attachment */
  bild?: EventBild;
  /** Related links */
  links?: EventLink[];
  /** Position on canvas (for custom layouts) */
  position?: {
    x: number;
    y: number;
  };
  /** Metadata */
  metadaten: {
    erstelltAm: string;
    geaendertAm: string;
  };
}

// ============================================
// Epoch Types
// ============================================

/**
 * Time period / Era displayed as colored bar
 */
export interface Epoche {
  id: string;
  name: string;
  start: HistorischesDatum;
  ende: HistorischesDatum;
  /** Color (hex) */
  farbe: string;
  /** Vertical layer for stacking (0 = top) */
  ebene: number;
  /** Description */
  beschreibung?: string;
}

// ============================================
// Category Types
// ============================================

/**
 * Category for grouping events
 */
export interface Kategorie {
  id: string;
  name: string;
  /** Color (hex) */
  farbe: string;
  /** Icon name */
  icon?: string;
  /** Description */
  beschreibung?: string;
}

// ============================================
// Settings Types
// ============================================

/**
 * Scaling mode for timeline
 */
export type Skalierung = 'linear' | 'logarithmisch' | 'adaptiv';

/**
 * View orientation
 */
export type Ansicht = 'horizontal' | 'vertikal';

/**
 * Supported languages
 */
export type Sprache = 'de' | 'en';

/**
 * Theme modes
 */
export type Theme = 'hell' | 'dunkel' | 'system';

/**
 * Export settings
 */
export interface ExportEinstellungen {
  breite: number;
  hoehe: number;
  hintergrund: string;
  qualitaet: number;
}

/**
 * Timeline display settings
 */
export interface ZeitstrahlEinstellungen {
  zeitraum: {
    start: HistorischesDatum;
    ende: HistorischesDatum;
    automatisch?: boolean;
  };
  skalierung: Skalierung;
  ansicht: Ansicht;
  sprache: Sprache;
  theme: Theme;
  export: ExportEinstellungen;
}

// ============================================
// Complete Timeline Type
// ============================================

/**
 * Complete timeline with all data
 */
export interface Zeitstrahl {
  id: string;
  titel: string;
  beschreibung?: string;
  ereignisse: Ereignis[];
  epochen: Epoche[];
  kategorien: Kategorie[];
  einstellungen: ZeitstrahlEinstellungen;
  metadaten: {
    version: string;
    erstelltAm: string;
    geaendertAm: string;
    autor?: string;
    quelle?: string;
    lizenz?: string;
  };
}

// ============================================
// Utility Types
// ============================================

/**
 * Metadata for timeline list view
 */
export interface ZeitstrahlMeta {
  id: string;
  titel: string;
  beschreibung?: string;
  geaendertAm: string;
  ereignisAnzahl: number;
  vorschau?: string;
}

/**
 * Input type for creating a new event (without generated fields)
 */
export type NeuesEreignis = Omit<Ereignis, 'id' | 'metadaten'>;

/**
 * Input type for updating an event
 */
export type EreignisUpdate = Partial<Omit<Ereignis, 'id' | 'metadaten'>>;

/**
 * Input type for creating a new timeline
 */
export type NeuerZeitstrahl = Omit<Zeitstrahl, 'id' | 'metadaten'>;
