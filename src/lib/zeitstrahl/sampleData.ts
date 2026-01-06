import { v4 as uuidv4 } from 'uuid';
import type { Zeitstrahl, Kategorie, Epoche, Ereignis } from '@/types';

/**
 * Create sample categories
 */
function erstelleBeispielKategorien(): Kategorie[] {
  return [
    {
      id: 'kat-politik',
      name: 'Politik',
      farbe: '#ef4444',
      icon: 'government',
      beschreibung: 'Politische Ereignisse',
    },
    {
      id: 'kat-kultur',
      name: 'Kultur',
      farbe: '#8b5cf6',
      icon: 'palette',
      beschreibung: 'Kulturelle Ereignisse',
    },
    {
      id: 'kat-wissenschaft',
      name: 'Wissenschaft',
      farbe: '#06b6d4',
      icon: 'science',
      beschreibung: 'Wissenschaftliche Entdeckungen',
    },
    {
      id: 'kat-gesellschaft',
      name: 'Gesellschaft',
      farbe: '#10b981',
      icon: 'people',
      beschreibung: 'Gesellschaftliche Entwicklungen',
    },
  ];
}

/**
 * Create sample epochs (20th century periods)
 */
function erstelleBeispielEpochen(): Epoche[] {
  return [
    {
      id: 'epoche-1',
      name: 'Belle Époque',
      start: { jahr: 1890 },
      ende: { jahr: 1914 },
      farbe: '#fbbf24',
      ebene: 0,
      beschreibung: 'Friedliche Zeit vor dem Ersten Weltkrieg',
    },
    {
      id: 'epoche-2',
      name: 'Erster Weltkrieg',
      start: { jahr: 1914 },
      ende: { jahr: 1918 },
      farbe: '#ef4444',
      ebene: 0,
      beschreibung: 'Der erste globale Konflikt',
    },
    {
      id: 'epoche-3',
      name: 'Weimarer Republik',
      start: { jahr: 1918 },
      ende: { jahr: 1933 },
      farbe: '#fbbf24',
      ebene: 1,
      beschreibung: 'Demokratie in Deutschland',
    },
    {
      id: 'epoche-4',
      name: 'Zweiter Weltkrieg',
      start: { jahr: 1939 },
      ende: { jahr: 1945 },
      farbe: '#dc2626',
      ebene: 0,
      beschreibung: 'Der verheerendste Krieg der Geschichte',
    },
    {
      id: 'epoche-5',
      name: 'Kalter Krieg',
      start: { jahr: 1947 },
      ende: { jahr: 1991 },
      farbe: '#3b82f6',
      ebene: 0,
      beschreibung: 'Ost-West-Konflikt',
    },
  ];
}

/**
 * Create sample events (20th century)
 */
function erstelleBeispielEreignisse(): Ereignis[] {
  const now = new Date().toISOString();

  return [
    {
      id: uuidv4(),
      titel: 'Gründung der Relativitätstheorie',
      datum: { jahr: 1905 },
      beschreibung: 'Albert Einstein veröffentlicht seine spezielle Relativitätstheorie',
      kategorie: 'kat-wissenschaft',
      wichtigkeit: 3,
      tags: ['Physik', 'Einstein'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Beginn des Ersten Weltkriegs',
      datum: { jahr: 1914, monat: 7, tag: 28 },
      beschreibung: 'Österreich-Ungarn erklärt Serbien den Krieg',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Krieg', 'Europa'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Oktoberrevolution',
      datum: { jahr: 1917, monat: 11, tag: 7 },
      beschreibung: 'Bolschewistische Revolution in Russland',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Revolution', 'Russland'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Ende des Ersten Weltkriegs',
      datum: { jahr: 1918, monat: 11, tag: 11 },
      beschreibung: 'Waffenstillstand von Compiègne',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Krieg', 'Frieden'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Gründung der Weimarer Republik',
      datum: { jahr: 1919, monat: 1, tag: 19 },
      beschreibung: 'Erste deutsche Demokratie entsteht',
      kategorie: 'kat-politik',
      wichtigkeit: 2,
      tags: ['Deutschland', 'Demokratie'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Entdeckung des Penicillins',
      datum: { jahr: 1928 },
      beschreibung: 'Alexander Fleming entdeckt das erste Antibiotikum',
      kategorie: 'kat-wissenschaft',
      wichtigkeit: 3,
      tags: ['Medizin', 'Entdeckung'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Weltwirtschaftskrise',
      datum: { jahr: 1929 },
      endDatum: { jahr: 1933 },
      beschreibung: 'Börsencrash und globale Depression',
      kategorie: 'kat-gesellschaft',
      wichtigkeit: 3,
      tags: ['Wirtschaft', 'Krise'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Machtübernahme der Nationalsozialisten',
      datum: { jahr: 1933, monat: 1, tag: 30 },
      beschreibung: 'Adolf Hitler wird Reichskanzler',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Deutschland', 'NS-Zeit'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Beginn des Zweiten Weltkriegs',
      datum: { jahr: 1939, monat: 9, tag: 1 },
      beschreibung: 'Deutschland überfällt Polen',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Krieg', 'WWII'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Ende des Zweiten Weltkriegs',
      datum: { jahr: 1945, monat: 5, tag: 8 },
      beschreibung: 'Bedingungslose Kapitulation Deutschlands',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Krieg', 'Frieden', 'WWII'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Gründung der Vereinten Nationen',
      datum: { jahr: 1945, monat: 10, tag: 24 },
      beschreibung: 'UN-Charta tritt in Kraft',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['UN', 'International'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Beginn des Kalten Krieges',
      datum: { jahr: 1947 },
      beschreibung: 'Truman-Doktrin und Marshall-Plan',
      kategorie: 'kat-politik',
      wichtigkeit: 2,
      tags: ['Kalter Krieg', 'USA'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Gründung der Bundesrepublik Deutschland',
      datum: { jahr: 1949, monat: 5, tag: 23 },
      beschreibung: 'Grundgesetz tritt in Kraft',
      kategorie: 'kat-politik',
      wichtigkeit: 2,
      tags: ['Deutschland', 'BRD'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Mondlandung',
      datum: { jahr: 1969, monat: 7, tag: 20 },
      beschreibung: 'Apollo 11 - Erste Menschen auf dem Mond',
      kategorie: 'kat-wissenschaft',
      wichtigkeit: 3,
      tags: ['Raumfahrt', 'NASA', 'USA'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Fall der Berliner Mauer',
      datum: { jahr: 1989, monat: 11, tag: 9 },
      beschreibung: 'Öffnung der innerdeutschen Grenze',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Deutschland', 'Wiedervereinigung'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Deutsche Wiedervereinigung',
      datum: { jahr: 1990, monat: 10, tag: 3 },
      beschreibung: 'DDR tritt der BRD bei',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Deutschland', 'Wiedervereinigung'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
    {
      id: uuidv4(),
      titel: 'Ende der Sowjetunion',
      datum: { jahr: 1991, monat: 12, tag: 26 },
      beschreibung: 'Auflösung der UdSSR',
      kategorie: 'kat-politik',
      wichtigkeit: 3,
      tags: ['Russland', 'Kalter Krieg'],
      metadaten: { erstelltAm: now, geaendertAm: now },
    },
  ];
}

/**
 * Generate a complete sample timeline for the 20th century
 */
export function erstelleBeispielZeitstrahl(): Zeitstrahl {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    titel: 'Das 20. Jahrhundert',
    beschreibung: 'Wichtige Ereignisse des 20. Jahrhunderts',
    ereignisse: erstelleBeispielEreignisse(),
    epochen: erstelleBeispielEpochen(),
    kategorien: erstelleBeispielKategorien(),
    einstellungen: {
      zeitraum: {
        start: { jahr: 1890 },
        ende: { jahr: 2000 },
        automatisch: false,
      },
      skalierung: 'linear',
      ansicht: 'horizontal',
      sprache: 'de',
      theme: 'system',
      export: {
        breite: 1920,
        hoehe: 1080,
        hintergrund: '#ffffff',
        qualitaet: 0.95,
      },
    },
    metadaten: {
      version: '1.0.0',
      erstelltAm: now,
      geaendertAm: now,
      autor: 'Zeitstrahl Demo',
      quelle: 'Beispiel-Daten',
      lizenz: 'MIT',
    },
  };
}

/**
 * Generate an empty timeline
 */
export function erstelleLeerenZeitstrahl(): Zeitstrahl {
  const now = new Date().toISOString();
  const currentYear = new Date().getFullYear();

  return {
    id: uuidv4(),
    titel: 'Neuer Zeitstrahl',
    beschreibung: '',
    ereignisse: [],
    epochen: [],
    kategorien: erstelleBeispielKategorien(),
    einstellungen: {
      zeitraum: {
        start: { jahr: currentYear - 50 },
        ende: { jahr: currentYear + 50 },
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
        qualitaet: 0.95,
      },
    },
    metadaten: {
      version: '1.0.0',
      erstelltAm: now,
      geaendertAm: now,
    },
  };
}
