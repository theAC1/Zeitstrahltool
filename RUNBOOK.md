# Runbook: Zeitstrahltool

## Ziel
Projekt sauber wieder aufnehmen: erst Inventar, dann Plan, dann kleine Inkremente.

## Start hier (immer)
1) git status
2) Projekt starten oder Tests laufen lassen (siehe unten)
3) Wenn es nicht laeuft: minimal lauffaehigen Zustand herstellen

## Standard Branching
- feat/<thema>
- fix/<thema>
- chore/<thema>

## Verifikation
- Build:
- Tests:
- Run:
- Smoke:

## Agent Rollen
- Claude (Router/PM): Aufgaben schneiden, Reihenfolge, Acceptance Criteria, ADRs
- Gemini (Research): externe Recherche, Vergleich, Doku, Optionen
- Codex (Implementer): Code Aenderungen, Tests, Diffs, PR Text

## Dateien fuer persistente Regeln
- CLAUDE.md: Arbeitsregeln und Projektmodus
- GEMINI.md: Research Regeln
- AGENTS.md: allgemeine Agent Regeln

## ADRs
- docs/adr/ verwenden fuer Architekturentscheidungen
