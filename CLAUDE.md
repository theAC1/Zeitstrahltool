# Projekt Kontext (Claude)

## Ziel
Dieses Repository ist ein angefangenes Projekt, das jetzt strukturiert wieder aufgenommen wird.
Ziel ist ein sauberer Neustart auf Basis einer Bestandsaufnahme, klaren Entscheidungen und einem nachvollziehbaren Plan.

## Arbeitsmodus
- Erst analysieren, dann planen, dann implementieren.
- Kleine, reviewbare Schritte. Keine grossen Refactors ohne begruendete ADR.
- Jede Aenderung muss verifizierbar sein (Build, Tests, manueller Smoke Test).
- Wenn Anforderungen unklar sind, mache eine plausible Annahme und markiere sie als Annahme.

## Definition of Done
- Code kompiliert oder laeuft
- Relevante Tests laufen (oder es gibt eine begruendete Notiz, warum nicht)
- Dokumentiert: Was wurde geaendert, warum, wie testen

## Projekt Konventionen
- Standard Branch: main
- Arbeite in Feature Branches: feat/<thema>, fix/<thema>, chore/<thema>
- Commits klein halten und sinnvoll benennen
- Keine Geheimnisse in Repo (Tokens, Keys)

## Erste Aufgabe beim Neustart
1) Repo Inventar: Arch, Tech Stack, Entry Points, Build, Tests
2) Gap Analyse: Was ist kaputt, was fehlt, was ist unklar
3) Neustart Plan: Milestones und Quick Wins
4) Umsetzung in kleinen Inkrementen

## Output Formate
- Plan: Checkliste mit Prioritaet und Aufwand
- Entscheidungen: ADR in docs/adr/ mit Datum und Kontext
