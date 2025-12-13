# Architektur-Dokumentation

Dieses Dokument beschreibt die technische Architektur von Zeitstrahl, einem webbasierten Tool zur Erstellung interaktiver historischer Zeitstrahlen.

## Inhaltsverzeichnis

- [Ueberblick](#ueberblick)
- [Systemarchitektur](#systemarchitektur)
- [Frontend-Architektur](#frontend-architektur)
- [Datenmodell](#datenmodell)
- [Komponenten-Hierarchie](#komponenten-hierarchie)
- [State Management](#state-management)
- [Rendering-Pipeline](#rendering-pipeline)
- [Performance-Optimierungen](#performance-optimierungen)
- [Sicherheit](#sicherheit)
- [Erweiterbarkeit](#erweiterbarkeit)

---

## Ueberblick

### Technologie-Stack

```
+-------------------+
|    Frontend       |
|  Next.js 14+      |
|  React 18+        |
|  TypeScript 5+    |
|  Tailwind CSS     |
+-------------------+
         |
         v
+-------------------+
|   Visualisierung  |
|  SVG / Canvas     |
|  D3.js (optional) |
+-------------------+
         |
         v
+-------------------+
|   Speicherung     |
|  LocalStorage     |
|  IndexedDB        |
|  (Cloud optional) |
+-------------------+
         |
         v
+-------------------+
|    Hosting        |
|  Vercel Edge      |
|  CDN              |
+-------------------+
```

### Design-Prinzipien

1. **Offline-First**: Grundfunktionen ohne Internetverbindung nutzbar
2. **Progressive Enhancement**: Basisfunktionen fuer alle, erweiterte fuer moderne Browser
3. **Accessibility-First**: Barrierefreiheit von Anfang an eingebaut
4. **Performance**: Schnelle Ladezeiten, fluessige Interaktionen
5. **Erweiterbarkeit**: Modulare Architektur fuer zukuenftige Features

---

## Systemarchitektur

### High-Level-Architektur

```
+------------------------------------------------------------------+
|                        Browser / Client                           |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  |   App Shell      |  |   Zeitstrahl     |  |    Export        |  |
|  |   (Next.js)      |  |   Engine         |  |    Service       |  |
|  +------------------+  +------------------+  +------------------+  |
|           |                    |                     |             |
|  +------------------+  +------------------+  +------------------+  |
|  |   UI Components  |  |   Renderer       |  |    File API      |  |
|  |   (React)        |  |   (SVG/Canvas)   |  |    (Browser)     |  |
|  +------------------+  +------------------+  +------------------+  |
|           |                    |                     |             |
|  +----------------------------------------------------------+     |
|  |                    State Management                       |     |
|  |              (React Context + useReducer)                 |     |
|  +----------------------------------------------------------+     |
|           |                    |                     |             |
|  +----------------------------------------------------------+     |
|  |                    Persistence Layer                      |     |
|  |         (LocalStorage / IndexedDB / Cloud Sync)           |     |
|  +----------------------------------------------------------+     |
|                                                                    |
+------------------------------------------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                         Vercel Edge                               |
+------------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------+  |
|  |   Static Assets  |  |   API Routes     |  |   Edge Functions |  |
|  |   (CDN cached)   |  |   (optional)     |  |   (optional)     |  |
|  +------------------+  +------------------+  +------------------+  |
+------------------------------------------------------------------+
```

### Verzeichnisstruktur

```
zeitstrahl/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (marketing)/          # Landing Pages
│   │   ├── editor/               # Zeitstrahl-Editor
│   │   ├── view/[id]/            # Ansichtsmodus
│   │   ├── api/                  # API-Routen
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # Homepage
│   │
│   ├── components/
│   │   ├── ui/                   # Generische UI-Komponenten
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   │
│   │   ├── zeitstrahl/           # Zeitstrahl-spezifisch
│   │   │   ├── Timeline/         # Haupt-Timeline-Komponente
│   │   │   ├── Event/            # Ereignis-Darstellung
│   │   │   ├── Epoch/            # Epochen-Darstellung
│   │   │   ├── Scale/            # Zeit-Skala
│   │   │   ├── Controls/         # Zoom, Navigation
│   │   │   └── Editor/           # Bearbeitungswerkzeuge
│   │   │
│   │   └── layout/               # Layout-Komponenten
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       └── Footer/
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useZeitstrahl.ts      # Zeitstrahl-State
│   │   ├── useZoom.ts            # Zoom-Logik
│   │   ├── useDragDrop.ts        # Drag & Drop
│   │   ├── useLocalStorage.ts    # Persistenz
│   │   └── useExport.ts          # Export-Funktionen
│   │
│   ├── lib/                      # Utilities
│   │   ├── zeitstrahl/
│   │   │   ├── calculator.ts     # Datums-Berechnungen
│   │   │   ├── renderer.ts       # Render-Logik
│   │   │   ├── parser.ts         # Import/Export
│   │   │   └── validator.ts      # Daten-Validierung
│   │   │
│   │   ├── date/                 # Datums-Utilities
│   │   │   ├── format.ts         # Formatierung
│   │   │   ├── parse.ts          # Parsing
│   │   │   └── calculate.ts      # Berechnungen
│   │   │
│   │   └── utils/                # Allgemeine Utilities
│   │       ├── cn.ts             # Classname Helper
│   │       └── debounce.ts       # Debounce/Throttle
│   │
│   ├── types/                    # TypeScript Typen
│   │   ├── zeitstrahl.ts         # Zeitstrahl-Typen
│   │   ├── event.ts              # Ereignis-Typen
│   │   └── export.ts             # Export-Typen
│   │
│   ├── context/                  # React Context
│   │   ├── ZeitstrahlContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   └── styles/                   # Globale Styles
│       └── globals.css
│
├── public/                       # Statische Dateien
│   ├── fonts/
│   ├── icons/
│   └── templates/                # Vorlagen-JSON
│
├── docs/                         # Dokumentation
├── tests/                        # Test-Dateien
└── ...
```

---

## Frontend-Architektur

### Next.js App Router

Wir nutzen den Next.js 14 App Router fuer:

- **Server Components**: Statische Teile (Header, Footer, Marketing-Seiten)
- **Client Components**: Interaktive Teile (Editor, Timeline)
- **Streaming**: Progressive Ladezustaende
- **Parallel Routes**: Sidebar + Hauptinhalt

```tsx
// src/app/editor/layout.tsx
export default function EditorLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r">{sidebar}</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Komponenten-Design

Wir folgen dem **Compound Component Pattern** fuer komplexe Komponenten:

```tsx
// Verwendung
<Timeline>
  <Timeline.Header>
    <Timeline.Title>Mein Zeitstrahl</Timeline.Title>
    <Timeline.Controls />
  </Timeline.Header>

  <Timeline.Canvas>
    <Timeline.Scale />
    <Timeline.Events>
      {events.map((event) => (
        <Timeline.Event key={event.id} data={event} />
      ))}
    </Timeline.Events>
    <Timeline.Epochs>
      {epochs.map((epoch) => (
        <Timeline.Epoch key={epoch.id} data={epoch} />
      ))}
    </Timeline.Epochs>
  </Timeline.Canvas>

  <Timeline.Footer>
    <Timeline.Legend />
  </Timeline.Footer>
</Timeline>
```

---

## Datenmodell

### Kern-Typen

```typescript
// types/zeitstrahl.ts

/**
 * Repraesentiert eine Jahreszahl mit optionaler v.Chr.-Markierung
 */
interface HistorischesJahr {
  jahr: number;
  istVorChristus: boolean;
}

/**
 * Ein Datum, das auch historische Daten unterstuetzt
 */
interface HistorischesDatum {
  jahr: HistorischesJahr;
  monat?: number;    // 1-12, optional
  tag?: number;      // 1-31, optional
  ungenau?: boolean; // "ca." Markierung
}

/**
 * Einzelnes Ereignis auf dem Zeitstrahl
 */
interface Ereignis {
  id: string;
  titel: string;
  datum: HistorischesDatum;
  beschreibung?: string;
  kategorie?: string;
  farbe?: string;
  bild?: {
    url: string;
    alt: string;
  };
  links?: Array<{
    titel: string;
    url: string;
  }>;
  position?: {
    x: number;
    y: number;
  };
  metadaten: {
    erstelltAm: string;
    geaendertAm: string;
  };
}

/**
 * Epoche / Zeitspanne
 */
interface Epoche {
  id: string;
  name: string;
  start: HistorischesDatum;
  ende: HistorischesDatum;
  farbe: string;
  beschreibung?: string;
  ebene: number;  // Fuer gestapelte Epochen
}

/**
 * Kategorie fuer Ereignisse
 */
interface Kategorie {
  id: string;
  name: string;
  farbe: string;
  icon?: string;
}

/**
 * Kompletter Zeitstrahl
 */
interface Zeitstrahl {
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
  };
}

/**
 * Einstellungen fuer die Darstellung
 */
interface ZeitstrahlEinstellungen {
  zeitraum: {
    start: HistorischesDatum;
    ende: HistorischesDatum;
  };
  skalierung: 'linear' | 'logarithmisch' | 'adaptiv';
  ansicht: 'horizontal' | 'vertikal';
  sprache: 'de' | 'en';
  theme: 'hell' | 'dunkel' | 'system';
  export: {
    breite: number;
    hoehe: number;
    hintergrundfarbe: string;
  };
}
```

### Datenfluss

```
+------------------+      +------------------+      +------------------+
|  Benutzer-       | ---> |  State           | ---> |  Renderer        |
|  Eingabe         |      |  (useReducer)    |      |  (SVG/Canvas)    |
+------------------+      +------------------+      +------------------+
        ^                         |                         |
        |                         v                         v
        |                 +------------------+      +------------------+
        |                 |  Validierung     |      |  DOM / Bild      |
        |                 +------------------+      +------------------+
        |                         |
        |                         v
        |                 +------------------+
        +-----------------|  Persistenz      |
                          |  (localStorage)  |
                          +------------------+
```

---

## State Management

### Architektur

Wir verwenden **React Context + useReducer** fuer den globalen State:

```typescript
// context/ZeitstrahlContext.tsx

type ZeitstrahlAction =
  | { type: 'EREIGNIS_HINZUFUEGEN'; payload: Ereignis }
  | { type: 'EREIGNIS_AKTUALISIEREN'; payload: { id: string; daten: Partial<Ereignis> } }
  | { type: 'EREIGNIS_LOESCHEN'; payload: { id: string } }
  | { type: 'EPOCHE_HINZUFUEGEN'; payload: Epoche }
  | { type: 'ZOOM_AENDERN'; payload: { level: number } }
  | { type: 'POSITION_AENDERN'; payload: { x: number; y: number } }
  | { type: 'ZEITSTRAHL_LADEN'; payload: Zeitstrahl }
  | { type: 'ZEITSTRAHL_ZURUECKSETZEN' };

interface ZeitstrahlState {
  zeitstrahl: Zeitstrahl | null;
  ansicht: {
    zoom: number;
    position: { x: number; y: number };
    ausgewaehltesEreignis: string | null;
  };
  ui: {
    istEditorOffen: boolean;
    istSidebarOffen: boolean;
    aktivesWerkzeug: 'auswaehlen' | 'ereignis' | 'epoche' | 'navigation';
  };
  history: {
    vergangenheit: Zeitstrahl[];
    zukunft: Zeitstrahl[];
  };
}

function zeitstrahlReducer(
  state: ZeitstrahlState,
  action: ZeitstrahlAction
): ZeitstrahlState {
  switch (action.type) {
    case 'EREIGNIS_HINZUFUEGEN':
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl!,
          ereignisse: [...state.zeitstrahl!.ereignisse, action.payload],
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl!],
          zukunft: [],
        },
      };
    // ... weitere Cases
  }
}
```

### Custom Hooks

```typescript
// hooks/useZeitstrahl.ts

export function useZeitstrahl() {
  const context = useContext(ZeitstrahlContext);

  if (!context) {
    throw new Error('useZeitstrahl muss innerhalb von ZeitstrahlProvider verwendet werden');
  }

  const { state, dispatch } = context;

  // Memoized Selectors
  const ereignisseNachDatum = useMemo(
    () => [...state.zeitstrahl.ereignisse].sort(sortiereNachDatum),
    [state.zeitstrahl.ereignisse]
  );

  // Actions
  const ereignisHinzufuegen = useCallback(
    (ereignis: Omit<Ereignis, 'id' | 'metadaten'>) => {
      dispatch({
        type: 'EREIGNIS_HINZUFUEGEN',
        payload: {
          ...ereignis,
          id: generateId(),
          metadaten: {
            erstelltAm: new Date().toISOString(),
            geaendertAm: new Date().toISOString(),
          },
        },
      });
    },
    [dispatch]
  );

  return {
    zeitstrahl: state.zeitstrahl,
    ereignisseNachDatum,
    ereignisHinzufuegen,
    // ... weitere exports
  };
}
```

---

## Rendering-Pipeline

### SVG-Renderer

Fuer die meisten Anwendungsfaelle nutzen wir SVG:

```typescript
// lib/zeitstrahl/renderer.ts

interface RenderKontext {
  breite: number;
  hoehe: number;
  zeitraum: { start: number; ende: number };
  zoom: number;
  offset: { x: number; y: number };
}

/**
 * Berechnet die X-Position fuer ein Datum
 */
function berechneXPosition(
  datum: HistorischesDatum,
  kontext: RenderKontext
): number {
  const jahr = datumZuJahresZahl(datum);
  const { start, ende } = kontext.zeitraum;
  const prozent = (jahr - start) / (ende - start);

  return prozent * kontext.breite * kontext.zoom + kontext.offset.x;
}

/**
 * Berechnet sichtbare Ereignisse (Culling)
 */
function filtereVonViewport(
  ereignisse: Ereignis[],
  kontext: RenderKontext
): Ereignis[] {
  const sichtbarerStart = -kontext.offset.x / kontext.zoom;
  const sichtbaresEnde = (kontext.breite - kontext.offset.x) / kontext.zoom;

  return ereignisse.filter((e) => {
    const x = berechneXPosition(e.datum, kontext);
    return x >= sichtbarerStart - PUFFER && x <= sichtbaresEnde + PUFFER;
  });
}
```

### Canvas-Renderer (optional)

Fuer sehr grosse Zeitstrahlen mit vielen Ereignissen:

```typescript
// lib/zeitstrahl/canvasRenderer.ts

class ZeitstrahlCanvas {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;
    this.setupHiDPI(canvas);
  }

  private setupHiDPI(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * this.dpr;
    canvas.height = rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  render(zeitstrahl: Zeitstrahl, kontext: RenderKontext) {
    this.ctx.clearRect(0, 0, kontext.breite, kontext.hoehe);

    // Epochen zuerst (Hintergrund)
    this.renderEpochen(zeitstrahl.epochen, kontext);

    // Dann Achse
    this.renderAchse(kontext);

    // Dann Ereignisse
    this.renderEreignisse(zeitstrahl.ereignisse, kontext);
  }

  // ... weitere Methoden
}
```

---

## Performance-Optimierungen

### Virtualisierung

Nur sichtbare Elemente werden gerendert:

```typescript
// components/zeitstrahl/VirtualizedEvents.tsx

function VirtualizedEvents({ ereignisse, kontext }: Props) {
  const sichtbareEreignisse = useMemo(
    () => filtereVonViewport(ereignisse, kontext),
    [ereignisse, kontext]
  );

  return (
    <g className="ereignisse">
      {sichtbareEreignisse.map((ereignis) => (
        <EreignisElement key={ereignis.id} ereignis={ereignis} />
      ))}
    </g>
  );
}
```

### Memoization

Teure Berechnungen werden gecacht:

```typescript
// Komponenten-Level
const EreignisElement = memo(function EreignisElement({ ereignis }: Props) {
  // ...
});

// Berechungs-Level
const sortierteEreignisse = useMemo(
  () => sortiereNachDatum(ereignisse),
  [ereignisse]
);

// Callback-Level
const handleClick = useCallback(
  (id: string) => setAusgewaehlt(id),
  []
);
```

### Lazy Loading

Schwere Komponenten werden lazy geladen:

```typescript
// Lazy Load des Editors
const ZeitstrahlEditor = dynamic(
  () => import('@/components/zeitstrahl/Editor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

// Lazy Load der Export-Funktionen
const exportAlsPNG = async (zeitstrahl: Zeitstrahl) => {
  const { renderZuPNG } = await import('@/lib/export/png');
  return renderZuPNG(zeitstrahl);
};
```

### Debouncing & Throttling

```typescript
// Zoom mit Throttling
const handleZoom = useThrottle((delta: number) => {
  dispatch({ type: 'ZOOM_AENDERN', payload: { level: zoom + delta } });
}, 16); // ~60fps

// Speichern mit Debouncing
const handleSave = useDebounce((zeitstrahl: Zeitstrahl) => {
  localStorage.setItem('zeitstrahl', JSON.stringify(zeitstrahl));
}, 1000);
```

---

## Sicherheit

### Input-Validierung

Alle Benutzereingaben werden validiert:

```typescript
// lib/zeitstrahl/validator.ts

import { z } from 'zod';

const EreignisSchema = z.object({
  titel: z.string().min(1).max(200),
  datum: HistorischesDatumSchema,
  beschreibung: z.string().max(5000).optional(),
  kategorie: z.string().max(50).optional(),
  // ...
});

export function validiereEreignis(daten: unknown): Ereignis {
  return EreignisSchema.parse(daten);
}
```

### Content Security

```typescript
// Sanitizing von Benutzereingaben
import DOMPurify from 'dompurify';

function sicheresBeschreibung(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
```

### Daten-Export

Sensible Daten werden beim Export gefiltert:

```typescript
function bereiteExportVor(zeitstrahl: Zeitstrahl): ExportZeitstrahl {
  return {
    ...zeitstrahl,
    metadaten: {
      ...zeitstrahl.metadaten,
      // Entferne ggf. sensible Informationen
      autor: undefined,
    },
  };
}
```

---

## Erweiterbarkeit

### Plugin-System (geplant)

```typescript
// types/plugin.ts

interface ZeitstrahlPlugin {
  name: string;
  version: string;

  // Lifecycle Hooks
  onInit?: (api: PluginAPI) => void;
  onEreignisHinzugefuegt?: (ereignis: Ereignis) => void;
  onExport?: (zeitstrahl: Zeitstrahl, format: string) => void;

  // UI Extensions
  toolbar?: React.ComponentType;
  sidebar?: React.ComponentType;
  contextMenu?: MenuItem[];

  // Neue Export-Formate
  exportFormate?: ExportFormat[];
}
```

### Vorlagen-System

```typescript
// lib/vorlagen/index.ts

interface ZeitstrahlVorlage {
  id: string;
  name: string;
  beschreibung: string;
  vorschau: string;
  kategorien: string[];
  daten: Omit<Zeitstrahl, 'id' | 'metadaten'>;
}

// Vorlagen werden aus public/templates/ geladen
async function ladeVorlagen(): Promise<ZeitstrahlVorlage[]> {
  const response = await fetch('/templates/index.json');
  return response.json();
}
```

---

## Fazit

Diese Architektur ermoeglicht:

1. **Skalierbarkeit**: Von einfachen bis zu komplexen Zeitstrahlen
2. **Wartbarkeit**: Klare Trennung von Concerns
3. **Performance**: Optimiert fuer grosse Datenmengen
4. **Erweiterbarkeit**: Plugin-System fuer zukuenftige Features
5. **Testbarkeit**: Isolierte, testbare Komponenten

Bei Fragen zur Architektur, erstelle ein Issue mit dem Label `architecture`.
