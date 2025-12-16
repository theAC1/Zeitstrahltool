# Agent Regeln (repoweit)

## Ziel
Dieses Projekt wird wieder aufgenommen. Prioritaet ist Stabilitaet, Nachvollziehbarkeit und schneller Fortschritt in kleinen Schritten.

## Gemeinsame Regeln fuer alle Agenten
- Arbeite in kleinen, reviewbaren Diffs
- Keine grossen Umbenennungen oder Refactors ohne begruendetes ADR
- Immer Verifikation angeben: build, tests, run, smoke checks
- Keine Geheimnisse oder Keys in Files
- Wenn etwas unklar ist: Default annehmen, klar markieren, dann weitermachen

## Standard Output
- Plan (kurz)
- Files die geaendert werden
- Patch Schritte
- Verifikation Commands
- Zusammenfassung

## Neustart Vorgehen
1) Repo Scan: Tech Stack, Entry, build, test, deploy
2) Risiken: Broken deps, veraltete configs, fehlende env vars
3) Minimaler Run: Hello world Pfad zum Start
4) Iterativ erweitern
