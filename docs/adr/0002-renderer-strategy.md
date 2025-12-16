# ADR 0002: Timeline Renderer Strategie

Datum: 2025-12-16

## Status

Akzeptiert

## Kontext

Die Timeline-Visualisierung ist das Kernfeature des Projekts. ARCHITECTURE.md:495-583
beschreibt sowohl SVG- als auch Canvas-basiertes Rendering. Die Wahl des Renderers
beeinflusst Performance, Maintainability und Feature-Moeglichkeiten.

Anforderungen:
- Interaktive Ereignisse (Click, Hover, Drag & Drop)
- Zoom und Pan Funktionalitaet
- Export als PNG/SVG
- Responsive Design
- Accessibility (Screen Reader Support)
- Performance bei 100-1000 Ereignissen

Constraints:
- MVP muss schnell entwickelbar sein
- Team hat mehr React/SVG als Canvas Erfahrung
- Accessibility ist Pflicht (WCAG 2.1 AA)

## Entscheidung

Wir starten mit **SVG-basiertem Rendering** fuer den MVP.

Canvas wird als Performance-Optimierung fuer spaetere Versionen vorbereitet,
aber nicht initial implementiert.

Rendering-Architektur:
- SVG fuer alle Timeline-Elemente (Achse, Events, Epochen)
- React Komponenten generieren SVG Markup
- CSS fuer Styling und Animationen (mit Framer Motion)
- Viewport Culling (nur sichtbare Events rendern)
- Virtualisierung mit Intersection Observer

## Alternativen

**Alternative 1: Canvas von Anfang an**
- Pro: Bessere Performance bei >500 Events
- Contra: Komplexere Hit Detection, kein natives Accessibility, schwieriger zu debuggen

**Alternative 2: HTML/CSS Layout (kein SVG)**
- Pro: Einfachstes Rendering, natives DOM
- Contra: Schlechte Performance bei vielen Events, limitierte Transformationen

**Alternative 3: D3.js fuer Rendering**
- Pro: Battle-tested, viele Timeline-Beispiele
- Contra: Grosse Bundle Size, Lernkurve, nicht React-idiomatisch

**Alternative 4: Hybrid (SVG + Canvas)**
- Pro: Beste Performance + Accessibility
- Contra: Doppelte Rendering-Logik von Anfang an, ueberkomplex fuer MVP

## Konsequenzen

**Positiv:**
- SVG ist deklarativ und passt gut zu React
- CSS Transitions und Animations sind einfach
- Accessibility "free" durch native DOM Elements
- Export als SVG ist trivial (innerHTML serialization)
- DevTools funktionieren normal (Inspect Element)
- Einfaches Testing (Query by data-testid)

**Negativ:**
- Performance-Limitierung bei sehr grossen Timelines (>1000 Events)
- DOM Updates koennen bei vielen Events langsam werden
- Initiale Bundle Size durch Framer Motion

**Risiken:**
- Falls Performance-Probleme auftauchen, ist Canvas-Migration aufwendig
- SVG hat Browser-spezifische Rendering-Unterschiede

**Migration/Optimierung Pfad:**
1. MVP: Pures SVG mit React
2. Optimierung 1: Viewport Culling implementieren
3. Optimierung 2: React.memo und useMemo aggressiv nutzen
4. Optimierung 3: Canvas-Renderer als opt-in fuer grosse Timelines
5. Final: Automatisches Switching SVG <-> Canvas basierend auf Event-Anzahl

**Naechste Schritte:**
1. Einfache SVG Timeline Komponente bauen
2. Viewport Culling von Anfang an vorsehen (filtereVonViewport)
3. Performance mit React DevTools Profiler messen
4. Benchmark mit 100/500/1000 Events definieren
