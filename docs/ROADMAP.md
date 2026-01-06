# Roadmap - Zeitstrahl

Diese Roadmap dokumentiert den aktuellen Projektstand und die geplanten Meilensteine.

**Stand**: Januar 2026
**Aktuelle Phase**: Dokumentation abgeschlossen, Implementierung ausstehend

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
| Quellcode | **Nicht vorhanden** |
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

### Infrastruktur (0% abgeschlossen)

- [ ] `package.json` mit Dependencies erstellen
- [ ] `tsconfig.json` konfigurieren
- [ ] `next.config.js` erstellen
- [ ] `tailwind.config.js` konfigurieren
- [ ] `.eslintrc` und `.prettierrc` einrichten
- [ ] `.env.example` erstellen
- [ ] `vercel.json` erstellen
- [ ] `.github/workflows/ci.yml` erstellen
- [ ] Dockerfile erstellen

### Quellcode (0% abgeschlossen)

- [ ] Next.js App Router Struktur aufsetzen
- [ ] UI-Komponenten implementieren (Button, Input, Modal, etc.)
- [ ] Timeline-Komponenten implementieren
- [ ] Custom Hooks implementieren
- [ ] State Management implementieren
- [ ] Persistence Layer (LocalStorage/IndexedDB)
- [ ] Export-Funktionen (PNG, SVG, PDF, JSON)
- [ ] Import-Funktionen (JSON, CSV)

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
**Status**: Ausstehend
**Geschaetzter Aufwand**: 1-2 Tage

| Aufgabe | Status |
|---------|--------|
| Next.js 14 Projekt initialisieren | [ ] |
| TypeScript konfigurieren | [ ] |
| Tailwind CSS einrichten | [ ] |
| ESLint + Prettier konfigurieren | [ ] |
| Git Hooks (husky) einrichten | [ ] |
| Verzeichnisstruktur nach ARCHITECTURE.md anlegen | [ ] |
| Basis-Layout erstellen | [ ] |

**Abnahmekriterien**:
- `npm run dev` startet erfolgreich
- `npm run build` kompiliert ohne Fehler
- Leere Homepage wird angezeigt

---

### Milestone 1: Core UI Components
**Status**: Ausstehend
**Geschaetzter Aufwand**: 3-5 Tage

| Aufgabe | Status |
|---------|--------|
| Button-Komponente | [ ] |
| Input-Komponente | [ ] |
| Modal-Komponente | [ ] |
| Dropdown-Komponente | [ ] |
| DatePicker mit BCE-Support | [ ] |
| ColorPicker | [ ] |
| Toast/Notification | [ ] |
| Skeleton-Loader | [ ] |

**Abnahmekriterien**:
- Alle UI-Komponenten sind implementiert
- Storybook oder Komponentenkatalog vorhanden
- WCAG 2.1 AA konform
- Keyboard-Navigation funktioniert

---

### Milestone 2: Timeline Engine
**Status**: Ausstehend
**Geschaetzter Aufwand**: 5-7 Tage

| Aufgabe | Status |
|---------|--------|
| Zeitstrahl-Datentypen implementieren | [ ] |
| Datums-Utilities (BCE/CE-Berechnung) | [ ] |
| Position-Calculator | [ ] |
| SVG-Renderer Basisimplementierung | [ ] |
| Zoom-Logik | [ ] |
| Pan/Scroll-Logik | [ ] |
| Viewport-Culling | [ ] |
| Zeit-Skala-Rendering | [ ] |

**Abnahmekriterien**:
- Leerer Zeitstrahl wird gerendert
- Zoom funktioniert (Mausrad + Buttons)
- Pan/Scroll funktioniert
- Jahresskala wird korrekt angezeigt

---

### Milestone 3: Ereignis-Verwaltung
**Status**: Ausstehend
**Geschaetzter Aufwand**: 5-7 Tage

| Aufgabe | Status |
|---------|--------|
| ZeitstrahlContext implementieren | [ ] |
| useZeitstrahl Hook | [ ] |
| Ereignis-Komponente | [ ] |
| Ereignis-Editor (Formular) | [ ] |
| Ereignis hinzufuegen | [ ] |
| Ereignis bearbeiten | [ ] |
| Ereignis loeschen | [ ] |
| Ereignis-Positionierung auf Timeline | [ ] |
| Drag-and-Drop fuer Ereignisse | [ ] |

**Abnahmekriterien**:
- Ereignisse koennen erstellt werden
- Ereignisse werden auf Timeline angezeigt
- Ereignisse sind bearbeitbar und loeschbar
- Undo/Redo funktioniert

---

### Milestone 4: Epochen und Kategorien
**Status**: Ausstehend
**Geschaetzter Aufwand**: 3-4 Tage

| Aufgabe | Status |
|---------|--------|
| Epoche-Komponente | [ ] |
| Epoche-Editor | [ ] |
| Epochen-Rendering (farbige Balken) | [ ] |
| Epochen-Stacking (mehrere Ebenen) | [ ] |
| Kategorie-Verwaltung | [ ] |
| Kategorie-Farbzuweisung | [ ] |
| Legende-Komponente | [ ] |

**Abnahmekriterien**:
- Epochen werden als farbige Balken angezeigt
- Mehrere Epochen koennen gestapelt werden
- Kategorien mit Farbcodierung funktionieren
- Legende zeigt alle Kategorien

---

### Milestone 5: Lokale Speicherung
**Status**: Ausstehend
**Geschaetzter Aufwand**: 2-3 Tage

| Aufgabe | Status |
|---------|--------|
| LocalStorage API implementieren | [ ] |
| Auto-Save Funktion | [ ] |
| Zeitstrahl-Liste (Dashboard) | [ ] |
| Zeitstrahl laden | [ ] |
| Zeitstrahl loeschen | [ ] |
| Zuletzt geoeffnet Liste | [ ] |
| IndexedDB fuer grosse Daten (optional) | [ ] |

**Abnahmekriterien**:
- Zeitstrahlen werden automatisch gespeichert
- Dashboard zeigt alle gespeicherten Zeitstrahlen
- Zeitstrahlen koennen geladen und geloescht werden
- Daten bleiben nach Browser-Neustart erhalten

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
| 0. Projektinitialisierung | 7 | Ausstehend |
| 1. Core UI Components | 8 | Ausstehend |
| 2. Timeline Engine | 8 | Ausstehend |
| 3. Ereignis-Verwaltung | 9 | Ausstehend |
| 4. Epochen und Kategorien | 7 | Ausstehend |
| 5. Lokale Speicherung | 7 | Ausstehend |
| 6. Export-Funktionen | 7 | Ausstehend |
| 7. Import-Funktionen | 5 | Ausstehend |
| 8. Vorlagen-System | 6 | Ausstehend |
| 9. Accessibility & i18n | 8 | Ausstehend |
| 10. Testing & QA | 8 | Ausstehend |
| 11. Deployment & Launch | 8 | Ausstehend |
| **Gesamt** | **88** | **0% abgeschlossen** |

---

*Letzte Aktualisierung: Januar 2026*
