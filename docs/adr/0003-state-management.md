# ADR 0003: State Management Ansatz

Datum: 2025-12-16

## Status

Akzeptiert

## Kontext

Das Zeitstrahl-Tool hat komplexen Client-State: Ereignisse, Epochen, Zoom, Viewport,
Undo/Redo History. ARCHITECTURE.md:389-444 schlaegt React Context + useReducer vor.

Anforderungen:
- Globaler State fuer Zeitstrahl-Daten (Ereignisse, Epochen)
- UI State (Zoom, Viewport, ausgewaehltes Event)
- Undo/Redo Funktionalitaet
- LocalStorage Persistierung
- Type-safe State Updates

Constraints:
- Offline-First (kein Server State Management noetig)
- Minimale Bundle Size
- Einfache Developer Experience

## Entscheidung

Wir verwenden **React Context + useReducer** fuer den MVP.

State-Architektur:
- Ein globaler `ZeitstrahlContext` mit useReducer
- Typed Actions (TypeScript Union Types)
- Custom Hooks fuer State Access (`useZeitstrahl`, `useZoom`)
- Undo/Redo durch History Array im State
- LocalStorage Sync via useEffect

Keine externe State Library initial.

## Alternativen

**Alternative 1: Zustand**
- Pro: Minimal (3KB), einfache API, kein Context Boilerplate
- Contra: Externe Dependency, overkill fuer MVP

**Alternative 2: Jotai (Atoms)**
- Pro: Granulare Re-Renders, moderne API
- Contra: Anderes Mental Model, Lernkurve

**Alternative 3: Redux Toolkit**
- Pro: DevTools, etabliert, viele Patterns
- Contra: Viel Boilerplate, grosse Bundle Size, overkill fuer kleine App

**Alternative 4: XState (State Machines)**
- Pro: Explizite State Transitions, robust
- Contra: Steile Lernkurve, ueberkomplex fuer MVP

**Alternative 5: Recoil**
- Pro: Von Facebook, gut fuer React
- Contra: Noch experimental Status, unsichere Zukunft

## Konsequenzen

**Positiv:**
- Null externe Dependencies fuer State Management
- React-native Loesung, Team kennt useReducer bereits
- Type Safety durch TypeScript Actions
- Volle Kontrolle ueber State Updates
- Context API ist stabil und gut dokumentiert

**Negativ:**
- Context Re-Render Probleme bei schlechter Struktur
- Mehr Boilerplate als bei Zustand/Jotai
- DevTools nicht so komfortabel wie Redux DevTools
- Manuelle Optimierung mit useMemo/useCallback noetig

**Risiken:**
- Bei vielen gleichzeitigen State Updates koennte Performance leiden
- Undo/Redo History kann bei grossen Timelines viel Memory brauchen

**Migration Pfad (falls noetig):**
1. Falls Performance-Probleme: Context in mehrere Contexts splitten
   (DataContext, UIContext, ViewportContext)
2. Falls zu viel Boilerplate: Migration zu Zustand (einfach, API aehnlich)
3. Falls komplexe State Logik: Einzelne Reducer zu XState Machines migrieren

**Implementierungs-Details:**
- History auf letzte 50 States limitieren (Memory)
- State Updates via Actions loggen (Debug Mode)
- Selector Pattern mit useMemo fuer derived State
- LocalStorage Sync debounced (1000ms) um Schreibzugriffe zu reduzieren

**Naechste Schritte:**
1. ZeitstrahlContext mit initialem State Type erstellen
2. Action Types als TypeScript Union definieren
3. Reducer mit allen CRUD Actions implementieren
4. Custom Hooks (useZeitstrahl, useZoom) bauen
5. LocalStorage Hook mit Auto-Sync erstellen
