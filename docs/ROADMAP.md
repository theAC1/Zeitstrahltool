# Roadmap - Zeitstrahl

Diese Roadmap dokumentiert den aktuellen Projektstand und die geplanten Meilensteine.

**Stand**: Januar 2026
**Aktuelle Phase**: Milestone 5 (Lokale Speicherung) abgeschlossen

---

## Inhaltsverzeichnis

- [Aktueller Status](#aktueller-status)
- [Was bereits existiert](#was-bereits-existiert)
- [Was noch zu tun ist](#was-noch-zu-tun-ist)
- [Meilensteine](#meilensteine)
- [Bekannte Probleme](#bekannte-probleme)

---

## Aktueller Status

| Bereich | Status |
|---------|--------|
| Dokumentation | Abgeschlossen |
| Architektur-Design | Abgeschlossen |
| API-Spezifikation | Abgeschlossen |
| Infrastruktur (M0) | **Abgeschlossen** |
| UI-Komponenten (M1) | **Abgeschlossen** |
| Timeline Engine (M2) | **Abgeschlossen** |
| Ereignis-Verwaltung (M3) | **Abgeschlossen** |
| Epochen & Kategorien (M4) | **Abgeschlossen** |
| Lokale Speicherung (M5) | **Abgeschlossen** |
| Tests | Nicht vorhanden |
| Deployment | Nicht vorhanden |

---

## Was bereits existiert

### Dokumentation (100% abgeschlossen)

- [x] **README.md** - Projektbeschreibung, Features, Quick Start
- [x] **ARCHITECTURE.md** - Technische Architektur, Komponenten-Design, State Management
- [x] **API.md** - Datenformate, Storage API, REST API, Embed API, Hooks API
- [x] **DEPLOYMENT.md** - Vercel Deployment, CI/CD Pipeline, Monitoring
- [x] **CONTRIBUTING.md** - Beitragsrichtlinien, Code Style, PR-Prozess
- [x] **SECURITY.md** - Sicherheitsrichtlinie, Meldeprozess
- [x] **CODE_OF_CONDUCT.md** - Verhaltenskodex
- [x] **CHANGELOG.md** - Versionsverlauf
- [x] **LICENSE** - MIT-Lizenz

### Spezifikationen (100% abgeschlossen)

- [x] Datenmodell (Zeitstrahl, Ereignis, Epoche, Kategorie)
- [x] TypeScript-Typdefinitionen
- [x] State Management Architektur (React Context + useReducer)
- [x] Komponenten-Hierarchie (Compound Components Pattern)
- [x] Rendering-Pipeline (SVG + Canvas)
- [x] Import/Export-Formate (JSON, PNG, SVG, PDF, CSV)
- [x] REST API Endpunkte
- [x] Embed API Spezifikation
- [x] React Hooks API Design

---

## Was noch zu tun ist

### Infrastruktur (100% abgeschlossen)

- [x] `package.json` mit Dependencies erstellen
- [x] `tsconfig.json` konfigurieren
- [x] `next.config.js` erstellen
- [x] `tailwind.config.ts` konfigurieren
- [x] `eslint.config.mjs` und `.prettierrc` einrichten (ESLint 9 Flat Config)
- [x] `.env.example` erstellen
- [x] `vercel.json` erstellen
- [ ] `.github/workflows/ci.yml` erstellen
- [ ] Dockerfile erstellen

### Quellcode (60% abgeschlossen)

- [x] Next.js App Router Struktur aufsetzen
- [x] UI-Komponenten implementieren (Button, Input, Modal, Select, DatePicker, ColorPicker, Toast, Skeleton)
- [x] Timeline-Komponenten implementieren (Timeline, TimelineScale, TimelineEpochs, TimelineEvents)
- [x] Custom Hooks implementieren (useTimeline)
- [x] State Management implementieren (TimelineContext + useReducer)
- [x] Persistence Layer (LocalStorage mit Auto-Save)
- [x] Export-Funktionen (JSON)
- [x] Import-Funktionen (JSON)
- [ ] Export-Funktionen erweitert (PNG, SVG, PDF)
- [ ] Import-Funktionen erweitert (CSV)

### Tests (0% abgeschlossen)

- [ ] Unit Tests mit Vitest
- [ ] E2E Tests mit Playwright
- [ ] Accessibility Tests

### Assets (0% abgeschlossen)

- [ ] Logo erstellen
- [ ] Icons erstellen
- [ ] Screenshot-Platzhalter ersetzen
- [ ] Timeline-Vorlagen erstellen

---

## Meilensteine

### Milestone 0: Projektinitialisierung
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| Next.js 14 Projekt initialisieren | [x] |
| TypeScript konfigurieren | [x] |
| Tailwind CSS einrichten | [x] |
| ESLint + Prettier konfigurieren | [x] |
| Git Hooks (husky) einrichten | [ ] |
| Verzeichnisstruktur nach ARCHITECTURE.md anlegen | [x] |
| Basis-Layout erstellen | [x] |

**Abnahmekriterien**:
- ✅ `npm run dev` startet erfolgreich
- ✅ `npm run build` kompiliert ohne Fehler
- ✅ Homepage mit Hero-Section und Features wird angezeigt

---

### Milestone 1: Core UI Components
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| Button-Komponente | [x] |
| Input-Komponente | [x] |
| Modal-Komponente | [x] |
| Dropdown/Select-Komponente | [x] |
| DatePicker mit BCE-Support | [x] |
| ColorPicker | [x] |
| Toast/Notification | [x] |
| Skeleton-Loader | [x] |

**Abnahmekriterien**:
- ✅ Alle UI-Komponenten sind implementiert
- ⏳ Storybook oder Komponentenkatalog (optional, noch ausstehend)
- ✅ WCAG 2.1 AA konform (aria-labels, keyboard support)
- ✅ Keyboard-Navigation funktioniert

---

### Milestone 2: Timeline Engine
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| Zeitstrahl-Datentypen implementieren | [x] |
| Datums-Utilities (BCE/CE-Berechnung) | [x] |
| Position-Calculator | [x] |
| SVG-Renderer Basisimplementierung | [x] |
| Zoom-Logik | [x] |
| Pan/Scroll-Logik | [x] |
| Viewport-Culling | [x] |
| Zeit-Skala-Rendering | [x] |

**Abnahmekriterien**:
- ✅ Leerer Zeitstrahl wird gerendert
- ✅ Zoom funktioniert (Mausrad + Ctrl/Cmd-Taste)
- ✅ Pan/Scroll funktioniert (Maus-Drag und Touch)
- ✅ Jahresskala wird korrekt angezeigt (inkl. BCE/CE)

---

### Milestone 3: Ereignis-Verwaltung
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| ZeitstrahlContext implementieren | [x] |
| useZeitstrahl Hook | [x] |
| Ereignis-Komponente | [x] |
| Ereignis-Editor (Formular) | [x] |
| Ereignis hinzufuegen | [x] |
| Ereignis bearbeiten | [x] |
| Ereignis loeschen | [x] |
| Ereignis-Positionierung auf Timeline | [x] |
| Drag-and-Drop fuer Ereignisse | [ ] |

**Abnahmekriterien**:
- ✅ Ereignisse koennen erstellt werden
- ✅ Ereignisse werden auf Timeline angezeigt
- ✅ Ereignisse sind bearbeitbar und loeschbar
- ✅ Undo/Redo funktioniert

---

### Milestone 4: Epochen und Kategorien
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| Epoche-Komponente | [x] |
| Epoche-Editor | [x] |
| Epochen-Rendering (farbige Balken) | [x] |
| Epochen-Stacking (mehrere Ebenen) | [x] |
| Kategorie-Verwaltung | [x] |
| Kategorie-Farbzuweisung | [x] |
| Legende-Komponente | [x] |

**Abnahmekriterien**:
- ✅ Epochen werden als farbige Balken angezeigt
- ✅ Mehrere Epochen koennen gestapelt werden
- ✅ Kategorien mit Farbcodierung funktionieren
- ✅ Legende zeigt alle Kategorien

---

### Milestone 5: Lokale Speicherung
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| LocalStorage API implementieren | [x] |
| Auto-Save Funktion | [x] |
| Zeitstrahl-Liste (Dashboard) | [x] |
| Zeitstrahl laden | [x] |
| Zeitstrahl loeschen | [x] |
| Zuletzt geoeffnet Liste | [x] |
| JSON Export/Import | [x] |
| IndexedDB fuer grosse Daten (optional) | [ ] |

**Abnahmekriterien**:
- ✅ Zeitstrahlen werden automatisch gespeichert (2s Debounce)
- ✅ Dashboard zeigt alle gespeicherten Zeitstrahlen
- ✅ Zeitstrahlen koennen geladen und geloescht werden
- ✅ Daten bleiben nach Browser-Neustart erhalten
- ✅ Zuletzt geoeffnet Liste funktioniert
- ✅ JSON Export/Import funktioniert

---

### Milestone 6: Export-Funktionen
**Status**: Ausstehend
**Geschaetzter Aufwand**: 4-5 Tage

| Aufgabe | Status |
|---------|--------|
| JSON-Export | [ ] |
| PNG-Export (via Canvas) | [ ] |
| SVG-Export | [ ] |
| PDF-Export (jsPDF) | [ ] |
| Export-Optionen Dialog | [ ] |
| Qualitaets-/Groesseneinstellungen | [ ] |
| Download-Helper | [ ] |

**Abnahmekriterien**:
- Export in allen Formaten funktioniert
- Exportierte Bilder sind hochaufloesend
- PDF ist druckoptimiert
- JSON enthaelt vollstaendige Daten

---

### Milestone 7: Import-Funktionen
**Status**: Ausstehend
**Geschaetzter Aufwand**: 2-3 Tage

| Aufgabe | Status |
|---------|--------|
| JSON-Import mit Validierung | [ ] |
| CSV-Import (nur Ereignisse) | [ ] |
| Schema-Migration fuer aeltere Versionen | [ ] |
| Import-Fehlermeldungen | [ ] |
| Drag-and-Drop Datei-Upload | [ ] |

**Abnahmekriterien**:
- JSON-Dateien koennen importiert werden
- Ungueltige Dateien zeigen hilfreiche Fehlermeldungen
- CSV-Import erstellt Ereignisse

---

### Milestone 8: Vorlagen-System
**Status**: Ausstehend
**Geschaetzter Aufwand**: 2-3 Tage

| Aufgabe | Status |
|---------|--------|
| Vorlagen-JSON-Format definieren | [ ] |
| Vorlage: Deutsche Geschichte | [ ] |
| Vorlage: Weltgeschichte | [ ] |
| Vorlage: Leerer Zeitstrahl | [ ] |
| Vorlagen-Auswahl UI | [ ] |
| Vorlagen-Vorschau | [ ] |

**Abnahmekriterien**:
- Mindestens 3 Vorlagen verfuegbar
- Vorlagen koennen ausgewaehlt werden
- Neue Zeitstrahlen basieren auf Vorlagen

---

### Milestone 9: Accessibility & i18n
**Status**: Ausstehend
**Geschaetzter Aufwand**: 3-4 Tage

| Aufgabe | Status |
|---------|--------|
| WCAG 2.1 AA Audit | [ ] |
| Keyboard-Navigation vollstaendig | [ ] |
| Screen-Reader-Unterstuetzung | [ ] |
| Skip-Links | [ ] |
| i18n-Framework einrichten (next-intl) | [ ] |
| Deutsche Uebersetzungen | [ ] |
| Englische Uebersetzungen | [ ] |
| Sprachwechsel-UI | [ ] |

**Abnahmekriterien**:
- Lighthouse Accessibility Score >= 90
- Vollstaendige Keyboard-Navigation
- Beide Sprachen verfuegbar
- Sprachwechsel funktioniert

---

### Milestone 10: Testing & QA
**Status**: Ausstehend
**Geschaetzter Aufwand**: 4-5 Tage

| Aufgabe | Status |
|---------|--------|
| Unit Tests fuer Utilities | [ ] |
| Unit Tests fuer Hooks | [ ] |
| Komponenten-Tests | [ ] |
| E2E Tests: Timeline erstellen | [ ] |
| E2E Tests: Events verwalten | [ ] |
| E2E Tests: Export/Import | [ ] |
| Visual Regression Tests | [ ] |
| Performance-Tests | [ ] |

**Abnahmekriterien**:
- Code Coverage >= 80%
- Alle E2E Tests bestehen
- Keine kritischen Performance-Probleme

---

### Milestone 11: Deployment & Launch
**Status**: Ausstehend
**Geschaetzter Aufwand**: 2-3 Tage

| Aufgabe | Status |
|---------|--------|
| Vercel Projekt einrichten | [ ] |
| Umgebungsvariablen konfigurieren | [ ] |
| GitHub Actions CI/CD | [ ] |
| Custom Domain (optional) | [ ] |
| SEO-Optimierung | [ ] |
| Open Graph / Social Media Cards | [ ] |
| Analytics einrichten | [ ] |
| Error Tracking (Sentry) | [ ] |

**Abnahmekriterien**:
- Produktions-Deployment laeuft
- CI/CD Pipeline funktioniert
- Lighthouse Score >= 90 (alle Kategorien)

---

## Zukuenftige Features (nach v1.0)

### Phase 2: Erweiterungen

- [ ] Echtzeit-Kollaboration (WebSocket)
- [ ] Cloud-Speicherung
- [ ] Benutzer-Authentifizierung
- [ ] Embed-Funktion fuer Webseiten
- [ ] Erweiterte Vorlagen-Bibliothek
- [ ] Plugin-System

### Phase 3: Mobile & Offline

- [ ] Progressive Web App (PWA)
- [ ] Offline-Modus
- [ ] Mobile-optimierte Ansicht
- [ ] React Native App (optional)

---

## Bekannte Probleme

### Zu klaeren vor Implementierung

1. **Datumsformat-Inkonsistenz**
   - ARCHITECTURE.md: `{ jahr: number; istVorChristus: boolean }`
   - API.md: `jahr: number` (positiv/negativ)
   - **Empfehlung**: Einheitlich positiv/negativ verwenden (einfacher zu berechnen)

2. **Placeholder-Kontakte ersetzen**
   - `zeitstrahl-security@example.com` -> echte E-Mail
   - `contact@zeitstrahl.dev` -> echte E-Mail oder entfernen
   - GitHub Org registrieren falls nicht vorhanden

3. **Assets erstellen**
   - Logo (aktuell Placeholder)
   - Screenshots (aktuell Placeholder)
   - Favicons und Social Media Cards

4. **TESTING.md erstellen**
   - In README referenziert aber nicht vorhanden

---

## Gesamt-Uebersicht

| Milestone | Aufgaben | Status |
|-----------|----------|--------|
| 0. Projektinitialisierung | 7 | ✅ Abgeschlossen |
| 1. Core UI Components | 8 | ✅ Abgeschlossen |
| 2. Timeline Engine | 8 | ✅ Abgeschlossen |
| 3. Ereignis-Verwaltung | 9 | ✅ Abgeschlossen |
| 4. Epochen und Kategorien | 7 | ✅ Abgeschlossen |
| 5. Lokale Speicherung | 8 | ✅ Abgeschlossen |
| 6. Export-Funktionen | 7 | ⏳ Nächster Schritt |
| 7. Import-Funktionen | 5 | Ausstehend |
| 8. Vorlagen-System | 6 | Ausstehend |
| 9. Accessibility & i18n | 8 | Ausstehend |
| 10. Testing & QA | 8 | Ausstehend |
| 11. Deployment & Launch | 8 | Ausstehend |
| **Gesamt** | **89** | **~52% abgeschlossen** |

---

*Letzte Aktualisierung: Januar 2026*
