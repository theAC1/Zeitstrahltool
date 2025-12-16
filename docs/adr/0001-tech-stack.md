# ADR 0001: Tech Stack Entscheidung

Datum: 2025-12-16

## Status

Akzeptiert

## Kontext

Das Zeitstrahl-Projekt ist vollstaendig dokumentiert (README.md, ARCHITECTURE.md), aber
noch nicht implementiert. Vor dem Start der Implementierung muss der Tech Stack final
bestaetigt werden, da dies alle weiteren Architekturentscheidungen beeinflusst.

Anforderungen:
- Moderne, wartbare Codebasis mit TypeScript fuer Type Safety
- Server-Side Rendering und Static Generation fuer Performance
- Schnelle Entwicklungszyklen und gutes Developer Experience
- Vercel-Deployment (geplant)
- Offline-First Funktionalitaet
- Node.js LTS Version fuer Stabilitaet

## Entscheidung

Wir verwenden folgenden Tech Stack:

- **Framework**: Next.js 14+ mit App Router
- **UI Library**: React 18+
- **Sprache**: TypeScript 5.0+
- **Runtime**: Node.js 20 LTS
- **Package Manager**: npm (Standard, einfachste Einrichtung)
- **Styling**: Tailwind CSS 3.4+
- **Build Tool**: Next.js integriertes Build-System

## Alternativen

**Alternative 1: Vite + React SPA**
- Pro: Schnellerer Dev Server, einfacher
- Contra: Kein SSR, schlechtere SEO, mehr manuelle Konfiguration

**Alternative 2: Remix**
- Pro: Modernes Data Loading, progressives Enhancement
- Contra: Kleineres Ecosystem, weniger Vercel-Integration

**Alternative 3: Pages Router (Next.js)**
- Pro: Reifer, mehr Community-Ressourcen
- Contra: Veraltetes Pattern, Next.js investiert in App Router

**Alternative 4: pnpm/yarn als Package Manager**
- Pro: Schneller, disk-effizienter
- Contra: Zusaetzliche Tool-Anforderung, npm ist "good enough"

**Alternative 5: Node.js 18 LTS**
- Pro: Bereits im README dokumentiert
- Contra: Node 20 ist aktueller LTS (bis April 2026), bessere Performance

## Konsequenzen

**Positiv:**
- Next.js App Router ermoeglicht Server Components und moderne Patterns
- Vercel-Deployment ist nahtlos integriert
- TypeScript verhindert Runtime-Fehler durch Type Checking
- React 18 bietet Concurrent Features fuer bessere UX
- Node 20 LTS hat laengeren Support-Zeitraum

**Negativ:**
- App Router ist neuere API, weniger Stack Overflow Antworten
- TypeScript erfordert initiale Lernkurve und Setup-Zeit
- npm ist langsamer als pnpm (akzeptabler Trade-off)

**Migration/Risiken:**
- README.md referenziert Node 18.17+, muss auf Node 20+ aktualisiert werden
- Team muss sich mit App Router Patterns vertraut machen
- Alle Dependencies muessen Next.js 14+ kompatibel sein

**Naechste Schritte:**
1. Projekt initialisieren: `npx create-next-app@latest`
2. TypeScript strict mode aktivieren
3. README.md Node.js Version aktualisieren
4. package.json mit allen geplanten Dependencies erstellen
