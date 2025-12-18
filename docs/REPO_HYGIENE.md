# Repo hygiene

Ziel: Build Artefakte, temporaere Dateien und lokale Secrets duerfen nie in Git landen. Das reduziert PR Laerm und verhindert kaputte Builds.

## Nie committen
- Build Artefakte
  - web/.next/
  - web/node_modules/
- Lokale Umgebungsvariablen und Secrets
  - web/.env.local
  - web/.env.* (ausser .env.example)
- Temp und Editor Dateien
  - *.log, *.tmp, .DS_Store
- Paket Artefakte
  - *.tgz

Hinweis: Diese Dinge sollten via .gitignore abgedeckt sein. Wenn trotzdem etwas in Git landet, ist es meist bereits getrackt.

## Vor jedem Commit
1) Status pruefen
- git status
- git diff

2) Qualitaet pruefen
- npm --prefix web run lint
- npm --prefix web run test
- npm --prefix web run build

## Wenn aus Versehen Artefakte getrackt wurden
Beispiele: .next, node_modules, grosse Logs.

1) Aus dem Index entfernen, lokal behalten
- git rm -r --cached web/.next web/node_modules 2>/dev/null || true

2) Danach committen und pushen
- git add .gitignore
- git commit -m "chore: stop tracking build artifacts"
- git push

## CI Erwartung
GitHub Actions muss mindestens diese Checks bestehen:
- lint
- test
- build
