# API-Dokumentation

Diese Dokumentation beschreibt die internen APIs und Datenformate von Zeitstrahl.

## Inhaltsverzeichnis

- [Ueberblick](#ueberblick)
- [Datenformate](#datenformate)
- [Lokale Speicherung](#lokale-speicherung)
- [Import/Export API](#importexport-api)
- [REST API (Optional)](#rest-api-optional)
- [Embed API](#embed-api)
- [Hooks API](#hooks-api)
- [Ereignisse und Callbacks](#ereignisse-und-callbacks)

---

## Ueberblick

Zeitstrahl ist primaer eine Client-seitige Anwendung. Die meisten "APIs" sind JavaScript/TypeScript-Schnittstellen fuer:

1. **Datenformate**: JSON-Strukturen fuer Zeitstrahlen
2. **Lokale Speicherung**: LocalStorage/IndexedDB Abstraktion
3. **Import/Export**: Datei-Import und -Export
4. **Embed**: Einbettung in andere Webseiten
5. **Hooks**: React Hooks fuer Entwickler

Die optionale REST API ist nur fuer Cloud-Features wie Speicherung und Teilen relevant.

---

## Datenformate

### Zeitstrahl JSON Format

Das Hauptformat fuer Zeitstrahlen:

```typescript
interface ZeitstrahlJSON {
  // Metadaten
  $schema: string;           // Schema-Version
  version: "1.0";            // Format-Version
  id: string;                // Eindeutige ID (UUID)

  // Inhalt
  titel: string;
  beschreibung?: string;

  // Ereignisse
  ereignisse: EreignisJSON[];

  // Epochen
  epochen: EpocheJSON[];

  // Kategorien
  kategorien: KategorieJSON[];

  // Einstellungen
  einstellungen: EinstellungenJSON;

  // Metadaten
  metadaten: {
    erstelltAm: string;      // ISO 8601
    geaendertAm: string;     // ISO 8601
    autor?: string;
    quelle?: string;
    lizenz?: string;
  };
}
```

### Ereignis Format

```typescript
interface EreignisJSON {
  id: string;
  titel: string;

  // Datum
  datum: {
    jahr: number;            // Positiv = n.Chr., Negativ = v.Chr.
    monat?: number;          // 1-12
    tag?: number;            // 1-31
    ungenau?: boolean;       // "ca." Markierung
  };

  // Optional: Enddatum fuer Zeitspannen
  endDatum?: {
    jahr: number;
    monat?: number;
    tag?: number;
    ungenau?: boolean;
  };

  // Inhalt
  beschreibung?: string;     // Markdown unterstuetzt

  // Kategorisierung
  kategorie?: string;        // Kategorie-ID
  tags?: string[];

  // Medien
  bild?: {
    url: string;
    alt: string;
    quelle?: string;
  };

  // Links
  links?: Array<{
    titel: string;
    url: string;
  }>;

  // Darstellung
  farbe?: string;            // Hex-Farbe, ueberschreibt Kategorie
  icon?: string;             // Icon-Name
  wichtigkeit?: 1 | 2 | 3;   // 1 = niedrig, 3 = hoch
}
```

### Epoche Format

```typescript
interface EpocheJSON {
  id: string;
  name: string;

  // Zeitraum
  start: {
    jahr: number;
    monat?: number;
    tag?: number;
  };
  ende: {
    jahr: number;
    monat?: number;
    tag?: number;
  };

  // Darstellung
  farbe: string;             // Hex-Farbe
  ebene: number;             // Vertikale Ebene (0 = oben)

  // Inhalt
  beschreibung?: string;
}
```

### Kategorie Format

```typescript
interface KategorieJSON {
  id: string;
  name: string;
  farbe: string;             // Hex-Farbe
  icon?: string;             // Icon-Name
  beschreibung?: string;
}
```

### Einstellungen Format

```typescript
interface EinstellungenJSON {
  // Zeitraum
  zeitraum: {
    start: { jahr: number };
    ende: { jahr: number };
    automatisch?: boolean;   // Automatisch aus Ereignissen
  };

  // Darstellung
  ansicht: "horizontal" | "vertikal";
  skalierung: "linear" | "logarithmisch" | "adaptiv";

  // UI
  theme: "hell" | "dunkel" | "system";
  sprache: "de" | "en";

  // Export-Defaults
  export: {
    breite: number;          // Pixel
    hoehe: number;           // Pixel
    hintergrund: string;     // Hex-Farbe
    qualitaet: number;       // 0.0 - 1.0 fuer JPEG/WebP
  };
}
```

### Beispiel

```json
{
  "$schema": "https://zeitstrahl.vercel.app/schema/v1.json",
  "version": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titel": "Deutsche Geschichte im 20. Jahrhundert",
  "beschreibung": "Wichtige Ereignisse der deutschen Geschichte von 1900 bis 2000",

  "ereignisse": [
    {
      "id": "evt-001",
      "titel": "Ende des Ersten Weltkriegs",
      "datum": {
        "jahr": 1918,
        "monat": 11,
        "tag": 11
      },
      "beschreibung": "Der Waffenstillstand von Compiegne beendet die Kampfhandlungen.",
      "kategorie": "kat-politik",
      "wichtigkeit": 3
    },
    {
      "id": "evt-002",
      "titel": "Fall der Berliner Mauer",
      "datum": {
        "jahr": 1989,
        "monat": 11,
        "tag": 9
      },
      "beschreibung": "Die Berliner Mauer faellt nach 28 Jahren.",
      "kategorie": "kat-politik",
      "wichtigkeit": 3,
      "bild": {
        "url": "https://example.com/mauerfall.jpg",
        "alt": "Menschen auf der Berliner Mauer"
      }
    }
  ],

  "epochen": [
    {
      "id": "epo-001",
      "name": "Weimarer Republik",
      "start": { "jahr": 1918 },
      "ende": { "jahr": 1933 },
      "farbe": "#FFA500",
      "ebene": 0
    },
    {
      "id": "epo-002",
      "name": "NS-Zeit",
      "start": { "jahr": 1933 },
      "ende": { "jahr": 1945 },
      "farbe": "#8B0000",
      "ebene": 0
    }
  ],

  "kategorien": [
    {
      "id": "kat-politik",
      "name": "Politik",
      "farbe": "#1E40AF",
      "icon": "landmark"
    },
    {
      "id": "kat-kultur",
      "name": "Kultur",
      "farbe": "#7C3AED",
      "icon": "palette"
    }
  ],

  "einstellungen": {
    "zeitraum": {
      "start": { "jahr": 1900 },
      "ende": { "jahr": 2000 },
      "automatisch": false
    },
    "ansicht": "horizontal",
    "skalierung": "linear",
    "theme": "hell",
    "sprache": "de",
    "export": {
      "breite": 1920,
      "hoehe": 1080,
      "hintergrund": "#FFFFFF",
      "qualitaet": 0.9
    }
  },

  "metadaten": {
    "erstelltAm": "2024-01-15T10:30:00Z",
    "geaendertAm": "2024-01-20T14:45:00Z",
    "autor": "Max Mustermann",
    "lizenz": "CC BY-SA 4.0"
  }
}
```

---

## Lokale Speicherung

### Storage API

```typescript
// lib/storage/index.ts

interface SpeicherAPI {
  // Zeitstrahl speichern
  speichern(zeitstrahl: Zeitstrahl): Promise<void>;

  // Zeitstrahl laden
  laden(id: string): Promise<Zeitstrahl | null>;

  // Alle Zeitstrahlen auflisten
  auflisten(): Promise<ZeitstrahlMeta[]>;

  // Zeitstrahl loeschen
  loeschen(id: string): Promise<void>;

  // Export als Datei
  exportieren(id: string, format: 'json' | 'png' | 'svg' | 'pdf'): Promise<Blob>;

  // Import aus Datei
  importieren(datei: File): Promise<Zeitstrahl>;
}

interface ZeitstrahlMeta {
  id: string;
  titel: string;
  beschreibung?: string;
  geaendertAm: string;
  ereignisAnzahl: number;
  vorschau?: string;        // Base64 Thumbnail
}
```

### Verwendung

```typescript
import { speicher } from '@/lib/storage';

// Speichern
await speicher.speichern(meinZeitstrahl);

// Laden
const zeitstrahl = await speicher.laden('550e8400-e29b-41d4...');

// Auflisten
const alleZeitstrahlen = await speicher.auflisten();

// Loeschen
await speicher.loeschen('550e8400-e29b-41d4...');
```

### LocalStorage Keys

```
zeitstrahl:meta                    # Liste aller Zeitstrahl-IDs
zeitstrahl:data:{id}               # Zeitstrahl-Daten
zeitstrahl:settings                # Globale Einstellungen
zeitstrahl:recent                  # Zuletzt geoeffnete IDs
```

---

## Import/Export API

### Unterstuetzte Formate

| Format | Import | Export | Beschreibung |
|--------|--------|--------|--------------|
| JSON | Ja | Ja | Natives Zeitstrahl-Format |
| PNG | Nein | Ja | Rasterbild |
| SVG | Nein | Ja | Vektorbild |
| PDF | Nein | Ja | Druckformat |
| CSV | Ja | Ja | Tabellenformat (nur Ereignisse) |

### Export API

```typescript
// lib/export/index.ts

interface ExportOptionen {
  breite?: number;
  hoehe?: number;
  hintergrund?: string;
  qualitaet?: number;        // 0.0-1.0 fuer PNG/JPEG
  sichtbarerBereich?: boolean;  // Nur aktuellen Viewport
  metadaten?: boolean;       // Metadaten einbetten
}

// JSON Export
async function exportiereAlsJSON(
  zeitstrahl: Zeitstrahl
): Promise<Blob> {
  const json = JSON.stringify(zeitstrahl, null, 2);
  return new Blob([json], { type: 'application/json' });
}

// PNG Export
async function exportiereAlsPNG(
  zeitstrahl: Zeitstrahl,
  optionen?: ExportOptionen
): Promise<Blob> {
  // Rendert SVG zu Canvas, dann zu PNG
}

// SVG Export
async function exportiereAlsSVG(
  zeitstrahl: Zeitstrahl,
  optionen?: ExportOptionen
): Promise<Blob> {
  // Generiert SVG-Markup
}

// PDF Export
async function exportiereAlsPDF(
  zeitstrahl: Zeitstrahl,
  optionen?: ExportOptionen
): Promise<Blob> {
  // Nutzt jsPDF oder aehnliche Bibliothek
}
```

### Import API

```typescript
// lib/import/index.ts

interface ImportErgebnis {
  erfolg: boolean;
  zeitstrahl?: Zeitstrahl;
  warnungen?: string[];
  fehler?: string;
}

// JSON Import
async function importiereVonJSON(datei: File): Promise<ImportErgebnis> {
  const text = await datei.text();
  const daten = JSON.parse(text);

  // Validierung
  const validiert = validiereZeitstrahlJSON(daten);

  if (!validiert.gueltig) {
    return {
      erfolg: false,
      fehler: validiert.fehler,
    };
  }

  return {
    erfolg: true,
    zeitstrahl: validiert.zeitstrahl,
    warnungen: validiert.warnungen,
  };
}

// CSV Import (nur Ereignisse)
async function importiereVonCSV(datei: File): Promise<ImportErgebnis> {
  // Erwartet Spalten: Titel, Datum, Beschreibung, Kategorie
}
```

### Datei-Download Helper

```typescript
// lib/utils/download.ts

function downloadBlob(blob: Blob, dateiname: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = dateiname;
  link.click();
  URL.revokeObjectURL(url);
}

// Verwendung
const blob = await exportiereAlsPNG(zeitstrahl);
downloadBlob(blob, 'mein-zeitstrahl.png');
```

---

## REST API (Optional)

Die REST API ist nur aktiv, wenn Cloud-Features aktiviert sind.

### Basis-URL

```
Produktion: https://zeitstrahl.vercel.app/api
Entwicklung: http://localhost:3000/api
```

### Authentifizierung

```http
Authorization: Bearer <token>
```

### Endpunkte

#### Zeitstrahlen

```http
# Liste aller Zeitstrahlen des Benutzers
GET /api/zeitstrahlen
Response: ZeitstrahlMeta[]

# Einzelnen Zeitstrahl abrufen
GET /api/zeitstrahlen/:id
Response: Zeitstrahl

# Neuen Zeitstrahl erstellen
POST /api/zeitstrahlen
Body: Zeitstrahl (ohne id, metadaten.erstelltAm)
Response: Zeitstrahl

# Zeitstrahl aktualisieren
PUT /api/zeitstrahlen/:id
Body: Zeitstrahl
Response: Zeitstrahl

# Zeitstrahl loeschen
DELETE /api/zeitstrahlen/:id
Response: { erfolg: true }
```

#### Teilen

```http
# Oeffentlichen Link erstellen
POST /api/zeitstrahlen/:id/teilen
Body: { ablauf?: string, passwort?: string }
Response: { url: string, code: string }

# Geteilten Zeitstrahl abrufen (keine Auth)
GET /api/geteilt/:code
Response: Zeitstrahl (nur lesen)
```

### Fehler-Antworten

```typescript
interface APIFehler {
  fehler: {
    code: string;
    nachricht: string;
    details?: unknown;
  };
}

// Beispiel
{
  "fehler": {
    "code": "NICHT_GEFUNDEN",
    "nachricht": "Zeitstrahl mit ID xyz wurde nicht gefunden"
  }
}
```

### Fehler-Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `NICHT_AUTHENTIFIZIERT` | 401 | Fehlender oder ungueltiger Token |
| `NICHT_AUTORISIERT` | 403 | Keine Berechtigung |
| `NICHT_GEFUNDEN` | 404 | Ressource nicht gefunden |
| `VALIDIERUNGSFEHLER` | 400 | Ungueltige Daten |
| `LIMIT_ERREICHT` | 429 | Rate Limit ueberschritten |
| `SERVER_FEHLER` | 500 | Interner Fehler |

---

## Embed API

Zeitstrahlen koennen in andere Webseiten eingebettet werden.

### iFrame Einbettung

```html
<iframe
  src="https://zeitstrahl.vercel.app/embed/550e8400-e29b-41d4..."
  width="100%"
  height="400"
  frameborder="0"
  allowfullscreen
></iframe>
```

### JavaScript Einbettung

```html
<div id="mein-zeitstrahl"></div>

<script src="https://zeitstrahl.vercel.app/embed.js"></script>
<script>
  Zeitstrahl.render({
    container: '#mein-zeitstrahl',
    id: '550e8400-e29b-41d4...',
    optionen: {
      hoehe: 400,
      theme: 'hell',
      interaktiv: true,
      vollbild: true,
    }
  });
</script>
```

### Embed-Optionen

```typescript
interface EmbedOptionen {
  // Container
  container: string | HTMLElement;

  // Datenquelle (eine von beiden)
  id?: string;               // Zeitstrahl-ID
  daten?: Zeitstrahl;        // Inline-Daten

  // Darstellung
  hoehe?: number | string;
  breite?: number | string;
  theme?: 'hell' | 'dunkel' | 'auto';

  // Interaktion
  interaktiv?: boolean;      // Zoom/Navigation erlauben
  vollbild?: boolean;        // Vollbild-Button anzeigen

  // Callbacks
  onLaden?: () => void;
  onFehler?: (fehler: Error) => void;
  onEreignisKlick?: (ereignis: Ereignis) => void;
}
```

### postMessage API

Fuer Kommunikation mit dem eingebetteten iFrame:

```javascript
// Im Parent
const iframe = document.querySelector('iframe');

// Zum Ereignis navigieren
iframe.contentWindow.postMessage({
  typ: 'NAVIGIERE_ZU_EREIGNIS',
  ereignisId: 'evt-001'
}, 'https://zeitstrahl.vercel.app');

// Zoom aendern
iframe.contentWindow.postMessage({
  typ: 'SETZE_ZOOM',
  level: 1.5
}, 'https://zeitstrahl.vercel.app');

// Nachrichten empfangen
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://zeitstrahl.vercel.app') return;

  if (event.data.typ === 'EREIGNIS_GEKLICKT') {
    console.log('Ereignis geklickt:', event.data.ereignis);
  }
});
```

---

## Hooks API

React Hooks fuer Entwickler, die Zeitstrahl erweitern moechten.

### useZeitstrahl

```typescript
import { useZeitstrahl } from '@zeitstrahl/react';

function MeineKomponente() {
  const {
    // State
    zeitstrahl,
    ereignisse,
    epochen,
    ausgewaehlterZeitraum,

    // Actions
    ereignisHinzufuegen,
    ereignisAktualisieren,
    ereignisLoeschen,
    epocheHinzufuegen,

    // Navigation
    zoom,
    setZoom,
    position,
    setPosition,

    // Auswahl
    ausgewaehltesEreignis,
    waehleEreignis,
  } = useZeitstrahl();

  return (
    <button onClick={() => ereignisHinzufuegen({
      titel: 'Neues Ereignis',
      datum: { jahr: 2024 }
    })}>
      Ereignis hinzufuegen
    </button>
  );
}
```

### useZoom

```typescript
import { useZoom } from '@zeitstrahl/react';

function ZoomControls() {
  const { zoom, zoomIn, zoomOut, resetZoom, zoomToFit } = useZoom();

  return (
    <div>
      <button onClick={zoomOut}>-</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button onClick={zoomIn}>+</button>
      <button onClick={zoomToFit}>Einpassen</button>
    </div>
  );
}
```

### useExport

```typescript
import { useExport } from '@zeitstrahl/react';

function ExportButton() {
  const { exportieren, istExportierend } = useExport();

  const handleExport = async () => {
    const blob = await exportieren('png', {
      breite: 1920,
      hoehe: 1080,
    });

    // Download ausloesen
    downloadBlob(blob, 'zeitstrahl.png');
  };

  return (
    <button onClick={handleExport} disabled={istExportierend}>
      {istExportierend ? 'Exportiere...' : 'Als PNG exportieren'}
    </button>
  );
}
```

### useDragDrop

```typescript
import { useDragDrop } from '@zeitstrahl/react';

function DraggableEreignis({ ereignis }) {
  const { dragProps, isDragging } = useDragDrop({
    typ: 'ereignis',
    daten: ereignis,
    onDragEnd: (neuePosition) => {
      // Ereignis wurde verschoben
    },
  });

  return (
    <div {...dragProps} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {ereignis.titel}
    </div>
  );
}
```

---

## Ereignisse und Callbacks

### Verfuegbare Ereignisse

```typescript
interface ZeitstrahlEreignisse {
  // Lifecycle
  'bereit': () => void;
  'fehler': (fehler: Error) => void;

  // Daten
  'ereignis:hinzugefuegt': (ereignis: Ereignis) => void;
  'ereignis:aktualisiert': (ereignis: Ereignis) => void;
  'ereignis:geloescht': (id: string) => void;
  'epoche:hinzugefuegt': (epoche: Epoche) => void;
  'zeitstrahl:geaendert': (zeitstrahl: Zeitstrahl) => void;
  'zeitstrahl:gespeichert': () => void;

  // Interaktion
  'ereignis:geklickt': (ereignis: Ereignis) => void;
  'ereignis:hover': (ereignis: Ereignis | null) => void;
  'zoom:geaendert': (level: number) => void;
  'position:geaendert': (position: { x: number; y: number }) => void;

  // Export
  'export:gestartet': (format: string) => void;
  'export:abgeschlossen': (blob: Blob) => void;
  'export:fehler': (fehler: Error) => void;
}
```

### Event Listener

```typescript
import { zeitstrahlEvents } from '@zeitstrahl/core';

// Listener registrieren
const unsubscribe = zeitstrahlEvents.on('ereignis:geklickt', (ereignis) => {
  console.log('Ereignis geklickt:', ereignis.titel);
});

// Listener entfernen
unsubscribe();

// Einmalig hoeren
zeitstrahlEvents.once('bereit', () => {
  console.log('Zeitstrahl ist bereit');
});
```

---

## Versionierung

### API-Versionen

Die API folgt Semantic Versioning:

- **v1.x**: Aktuelle stabile Version
- Aenderungen innerhalb einer Major-Version sind rueckwaertskompatibel
- Breaking Changes erhoehen die Major-Version

### Schema-Migration

```typescript
// lib/migration/index.ts

function migriere(daten: unknown): Zeitstrahl {
  const version = (daten as any).version || '0.0';

  switch (version) {
    case '0.0':
      daten = migriereVon0zu1(daten);
      // fall through
    case '1.0':
      // Aktuelle Version, keine Migration noetig
      break;
    default:
      throw new Error(`Unbekannte Version: ${version}`);
  }

  return daten as Zeitstrahl;
}
```

---

Bei Fragen zur API, erstelle ein Issue mit dem Label `api`.
