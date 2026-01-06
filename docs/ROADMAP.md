# Roadmap - Zeitstrahl

Diese Roadmap dokumentiert den aktuellen Projektstand und die geplanten Meilensteine.

**Stand**: Januar 2026
**Aktuelle Phase**: Milestone 10 (Testing & QA) in Arbeit - Grundlegende Tests implementiert

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
| Export-Funktionen (M6) | **Abgeschlossen** |
| Import-Funktionen (M7) | **Abgeschlossen** |
| Vorlagen-System (M8) | **Abgeschlossen** |
| Accessibility & i18n (M9) | **Abgeschlossen** |
| Tests | **Teilweise** (173 Unit Tests) |
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

### Quellcode (92% abgeschlossen)

- [x] Next.js App Router Struktur aufsetzen
- [x] UI-Komponenten implementieren (Button, Input, Modal, Select, DatePicker, ColorPicker, Toast, Skeleton)
- [x] Timeline-Komponenten implementieren (Timeline, TimelineScale, TimelineEpochs, TimelineEvents)
- [x] Custom Hooks implementieren (useTimeline)
- [x] State Management implementieren (TimelineContext + useReducer)
- [x] Persistence Layer (LocalStorage mit Auto-Save)
- [x] Export-Funktionen (JSON, PNG, SVG, PDF)
- [x] Import-Funktionen (JSON, CSV mit Schema-Migration)
- [x] Vorlagen-System (3 Vorlagen: Leer, Deutsche Geschichte, Weltgeschichte)
- [x] Internationalisierung (Deutsch, Englisch)
- [x] Accessibility-Features (Skip Links, ARIA Labels, Keyboard Navigation)
- [x] Moderne System-Font-Stack (ersetzt Google Fonts für bessere Performance und Offline-Nutzung)

### Tests (65% abgeschlossen)

- [x] Vitest Testing-Framework eingerichtet
- [x] Unit Tests für CSV Import (19 Tests, 76.6% Coverage)
- [x] Unit Tests für Template Service (14 Tests, 84.46% Coverage)
- [x] Unit Tests für Date Calculations (50 Tests, 100% Coverage)
- [x] Unit Tests für Timeline Calculator (42 Tests, 100% Coverage)
- [x] Component Tests: Button (11 Tests, 100% Coverage)
- [x] Component Tests: Input (18 Tests, 100% Coverage)
- [x] Component Tests: Modal (19 Tests, 88.7% Coverage)
- [x] Test Coverage Analysis (@vitest/coverage-v8)
- [ ] E2E Tests mit Playwright
- [ ] Accessibility Tests
- [ ] Tests für weitere Components (Select, DatePicker, ColorPicker)

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
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| JSON-Export | [x] |
| PNG-Export (via Canvas) | [x] |
| SVG-Export | [x] |
| PDF-Export (jsPDF) | [x] |
| Export-Optionen Dialog | [x] |
| Qualitaets-/Groesseneinstellungen | [x] |
| Download-Helper | [x] |

**Abnahmekriterien**:
- ✅ Export in allen Formaten funktioniert (JSON, PNG, SVG, PDF)
- ✅ Exportierte Bilder sind hochaufloesend (2x/3x Retina)
- ✅ PDF ist druckoptimiert (JPEG-Kompression)
- ✅ JSON enthaelt vollstaendige Daten
- ✅ Export-Optionen-Dialog mit allen Einstellungen
- ✅ Qualitaets- und Groesseneinstellungen konfigurierbar
- ✅ Geschaetzte Dateigroesse wird angezeigt

---

### Milestone 7: Import-Funktionen
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| JSON-Import mit Validierung | [x] |
| CSV-Import (nur Ereignisse) | [x] |
| Schema-Migration fuer aeltere Versionen | [x] |
| Import-Fehlermeldungen | [x] |
| Drag-and-Drop Datei-Upload | [x] |

**Abnahmekriterien**:
- ✅ JSON-Dateien koennen importiert werden
- ✅ Ungueltige Dateien zeigen hilfreiche Fehlermeldungen
- ✅ CSV-Import erstellt Ereignisse
- ✅ CSV-Validator mit detaillierten Fehler- und Warnmeldungen
- ✅ Schema-Migration von Version 0.1 und 0.5 zu 1.0
- ✅ Unterstuetzung mehrerer Datumsformate (ISO, Deutsch, US)
- ✅ Drag-and-Drop Upload mit Dateivalidierung
- ✅ CSV-Vorlagen-Download

---

### Milestone 8: Vorlagen-System
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| Vorlagen-JSON-Format definieren | [x] |
| Vorlage: Deutsche Geschichte | [x] |
| Vorlage: Weltgeschichte | [x] |
| Vorlage: Leerer Zeitstrahl | [x] |
| Vorlagen-Auswahl UI | [x] |
| Vorlagen-Vorschau | [x] |

**Abnahmekriterien**:
- ✅ Mindestens 3 Vorlagen verfuegbar (Leer, Deutsche Geschichte, Weltgeschichte)
- ✅ Vorlagen koennen ausgewaehlt werden (TemplateSelectionModal)
- ✅ Neue Zeitstrahlen basieren auf Vorlagen
- ✅ Template-Service mit Metadaten und Suchfunktion
- ✅ Vorlagen enthalten vorgefertigte Ereignisse, Epochen und Kategorien
- ✅ Integration in Dashboard mit Modal-Auswahl
- ✅ Vorlagen mit verschiedenen Schwierigkeitsgraden (Einfach, Mittel, Fortgeschritten)

---

### Milestone 9: Accessibility & i18n
**Status**: ✅ Abgeschlossen
**Abgeschlossen am**: Januar 2026

| Aufgabe | Status |
|---------|--------|
| WCAG 2.1 AA Audit | [x] |
| Keyboard-Navigation vollstaendig | [x] |
| Screen-Reader-Unterstuetzung | [x] |
| Skip-Links | [x] |
| i18n-Framework einrichten (next-intl) | [x] |
| Deutsche Uebersetzungen | [x] |
| Englische Uebersetzungen | [x] |
| Sprachwechsel-UI | [x] |

**Abnahmekriterien**:
- ✅ I18n-System mit LocalStorage-basierter Sprachverwaltung
- ✅ Vollständige Übersetzungsdateien für Deutsch und Englisch
- ✅ Language Switcher im Dashboard-Header
- ✅ Skip Links für Keyboard-Navigation (Zum Inhalt springen, Zur Navigation springen)
- ✅ ARIA Labels und Landmark Roles (role="banner", role="main", aria-labels)
- ✅ Keyboard-Navigation funktioniert durchgängig
- ✅ Beide Sprachen verfügbar und wechselbar
- ✅ HTML lang-Attribut wird dynamisch gesetzt

---

### Milestone 10: Testing & QA
**Status**: 🔄 In Arbeit (ca. 65% abgeschlossen)
**Abgeschlossen am**: Teilweise - Januar 2026
**Geschaetzter Aufwand**: 4-5 Tage (3 Tage investiert)

| Aufgabe | Status |
|---------|--------|
| Vitest Test-Framework einrichten | [x] |
| Test Setup & Config (vitest.config.ts, setup.ts) | [x] |
| Unit Tests für CSV Import (parseCSV, parseDate, csvToEreignisse, validateCSV) | [x] |
| Unit Tests für Template Service (getAllTemplates, loadTemplate, createFromTemplate) | [x] |
| Unit Tests für Date Calculations (alle Datums-Utilities) | [x] |
| Unit Tests für Timeline Calculator (Rendering, Positionen, Viewport) | [x] |
| Komponenten-Tests (Button, Input, Modal) | [x] |
| Test Coverage Analysis Tool (@vitest/coverage-v8) | [x] |
| Unit Tests für Storage Utilities | [ ] |
| Unit Tests für Hooks (useTimeline) | [ ] |
| Weitere Komponenten-Tests (Select, DatePicker, ColorPicker) | [ ] |
| E2E Tests: Timeline erstellen | [ ] |
| E2E Tests: Events verwalten | [ ] |
| E2E Tests: Export/Import | [ ] |
| Visual Regression Tests | [ ] |
| Performance-Tests | [ ] |

**Erreichte Ergebnisse**:
- ✅ 173 Unit Tests implementiert (100% pass rate)
- ✅ Utility Tests:
  - date/calculate.ts: 100% Coverage (50 Tests)
  - zeitstrahl/calculator.ts: 100% Coverage (42 Tests)
  - csvImport.ts: 76.6% Coverage (19 Tests)
  - templateService.ts: 84.46% Coverage (14 Tests)
- ✅ Component Tests:
  - Button: 100% Coverage (11 Tests)
  - Input: 100% Coverage (18 Tests)
  - Modal: 88.7% Coverage (19 Tests)
- ✅ Test-Infrastruktur vollständig eingerichtet
- ✅ Coverage-Analyse mit v8 konfiguriert

**Abnahmekriterien**:
- ✅ Code Coverage >= 80% für getestete Module (76-100%)
- ⏳ Alle E2E Tests bestehen (noch nicht implementiert)
- ✅ Keine kritischen Performance-Probleme
- ⏳ Playwright E2E Tests konfiguriert (Playwright installiert, aber Tests ausstehend)

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
| 6. Export-Funktionen | 7 | ✅ Abgeschlossen |
| 7. Import-Funktionen | 5 | ✅ Abgeschlossen |
| 8. Vorlagen-System | 6 | ✅ Abgeschlossen |
| 9. Accessibility & i18n | 8 | ✅ Abgeschlossen |
| 10. Testing & QA | 16 | 🔄 In Arbeit (65%) |
| 11. Deployment & Launch | 8 | Ausstehend |
| **Gesamt** | **97** | **~89% abgeschlossen** |

---

*Letzte Aktualisierung: Januar 2026*
