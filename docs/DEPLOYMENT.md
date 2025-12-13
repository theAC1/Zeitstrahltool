# Deployment-Anleitung

Diese Anleitung beschreibt, wie Zeitstrahl auf Vercel und anderen Plattformen deployed wird.

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Vercel Deployment](#vercel-deployment)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Build-Konfiguration](#build-konfiguration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring und Analytics](#monitoring-und-analytics)
- [Fehlerbehebung](#fehlerbehebung)
- [Alternative Plattformen](#alternative-plattformen)

---

## Voraussetzungen

### Lokale Entwicklung

- Node.js 18.17 oder hoeher
- npm 9.0+ oder pnpm 8.0+
- Git

### Deployment

- GitHub Account (fuer Repository)
- Vercel Account (kostenlos verfuegbar)
- Optional: Eigene Domain

---

## Vercel Deployment

### Methode 1: GitHub Integration (Empfohlen)

Die einfachste Methode ist die direkte Integration mit GitHub:

1. **Repository auf GitHub pushen**

   ```bash
   git remote add origin https://github.com/username/zeitstrahl.git
   git branch -M main
   git push -u origin main
   ```

2. **Bei Vercel anmelden**

   Gehe zu [vercel.com](https://vercel.com) und melde dich mit deinem GitHub-Account an.

3. **Projekt importieren**

   - Klicke auf "Add New Project"
   - Waehle das zeitstrahl Repository aus
   - Vercel erkennt automatisch, dass es sich um ein Next.js-Projekt handelt

4. **Konfiguration pruefen**

   | Einstellung | Wert |
   |-------------|------|
   | Framework Preset | Next.js |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |
   | Install Command | `npm install` |

5. **Deploy klicken**

   Das Deployment startet automatisch. Nach etwa 1-2 Minuten ist die Anwendung live.

### Methode 2: Vercel CLI

Fuer mehr Kontrolle kann die Vercel CLI verwendet werden:

1. **CLI installieren**

   ```bash
   npm install -g vercel
   ```

2. **Anmelden**

   ```bash
   vercel login
   ```

3. **Deployen**

   Fuer Vorschau (Preview):
   ```bash
   vercel
   ```

   Fuer Produktion:
   ```bash
   vercel --prod
   ```

### Automatische Deployments

Nach der GitHub-Integration werden Deployments automatisch ausgeloest:

| Branch | Deployment-Typ | URL |
|--------|----------------|-----|
| `main` | Production | zeitstrahl.vercel.app |
| `develop` | Preview | zeitstrahl-develop-xxx.vercel.app |
| Feature-Branches | Preview | zeitstrahl-feature-xxx.vercel.app |
| Pull Requests | Preview | Kommentar im PR |

---

## Umgebungsvariablen

### Konfiguration

Umgebungsvariablen werden in Vercel unter "Settings" > "Environment Variables" konfiguriert.

### Verfuegbare Variablen

```env
# Allgemein
NEXT_PUBLIC_APP_URL=https://zeitstrahl.vercel.app
NEXT_PUBLIC_APP_NAME=Zeitstrahl

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=zeitstrahl.vercel.app

# Feature Flags
NEXT_PUBLIC_ENABLE_CLOUD_SYNC=false
NEXT_PUBLIC_ENABLE_COLLABORATION=false

# Datenbank (optional, fuer Cloud-Features)
DATABASE_URL=postgresql://...
DATABASE_DIRECT_URL=postgresql://...

# Authentifizierung (optional)
AUTH_SECRET=your-secret-key
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Externe Services (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Umgebungen

Vercel unterscheidet zwischen drei Umgebungen:

| Umgebung | Verwendung |
|----------|------------|
| Production | Live-Seite, nur `main` Branch |
| Preview | Alle anderen Branches, PRs |
| Development | Lokale Entwicklung |

Variablen koennen pro Umgebung unterschiedlich gesetzt werden.

### Sensible Variablen

**WICHTIG**: Variablen ohne `NEXT_PUBLIC_` Prefix sind nur server-seitig verfuegbar und werden nicht an den Client gesendet.

```env
# Client-seitig verfuegbar (im Browser sichtbar!)
NEXT_PUBLIC_API_URL=https://api.example.com

# Nur Server-seitig (sicher)
DATABASE_URL=postgresql://user:password@host:5432/db
API_SECRET_KEY=super-secret
```

---

## Build-Konfiguration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimierungen fuer Produktion
  reactStrictMode: true,
  swcMinify: true,

  // Bildoptimierung
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers fuer Sicherheit
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/editor',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Build-Befehle

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm run type-check && npm run test"
  }
}
```

### vercel.json (Optional)

Fuer erweiterte Konfiguration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  # Linting und Type-Checking
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

  # Unit Tests
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # E2E Tests
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # Build Check
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Check bundle size
        run: npx next-bundle-analyzer

  # Deployment wird von Vercel uebernommen
  # Diese Jobs sind nur fuer Qualitaetssicherung
```

### Branch-Schutz

Empfohlene Einstellungen fuer den `main` Branch:

- [x] Require pull request reviews before merging
- [x] Require status checks to pass (lint, test, build)
- [x] Require branches to be up to date
- [x] Include administrators
- [ ] Allow force pushes (deaktiviert!)

---

## Monitoring und Analytics

### Vercel Analytics

Aktiviere Vercel Analytics im Dashboard:

1. Gehe zu Project Settings > Analytics
2. Aktiviere "Web Analytics"
3. Optional: Aktiviere "Speed Insights"

### Logging

```typescript
// lib/logger.ts

export function log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString();

  if (process.env.NODE_ENV === 'production') {
    // In Produktion: Strukturiertes Logging
    console.log(JSON.stringify({
      timestamp,
      level,
      message,
    }));
  } else {
    // In Entwicklung: Lesbares Format
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
  }
}
```

### Error Tracking (Optional)

Integration mit Sentry:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## Fehlerbehebung

### Haeufige Probleme

#### Build schlaegt fehl

**Problem**: `npm run build` schlaegt fehl mit TypeScript-Fehlern.

**Loesung**:
```bash
# Lokal testen
npm run type-check

# Strict Mode temporaer deaktivieren (nicht empfohlen)
# next.config.js: typescript: { ignoreBuildErrors: true }
```

#### Umgebungsvariablen nicht verfuegbar

**Problem**: `process.env.XXX` ist `undefined`.

**Loesung**:
- Pruefen, ob Variable in Vercel gesetzt ist
- Bei Client-Variablen: `NEXT_PUBLIC_` Prefix verwenden
- Nach Aenderung: Re-deploy ausloesen

#### Deployment haengt

**Problem**: Deployment bleibt bei "Building" haengen.

**Loesung**:
- Vercel Dashboard: Deployment abbrechen
- Logs pruefen
- Cache leeren: Settings > Functions > Purge Cache

#### 500 Error in Produktion

**Problem**: Anwendung funktioniert lokal, aber nicht in Produktion.

**Loesung**:
```bash
# Produktions-Build lokal testen
npm run build
npm run start

# Logs in Vercel pruefen
vercel logs zeitstrahl.vercel.app
```

### Logs abrufen

```bash
# Live Logs
vercel logs zeitstrahl.vercel.app --follow

# Gefilterte Logs
vercel logs zeitstrahl.vercel.app --since 1h
```

### Rollback

Falls ein Deployment Probleme verursacht:

1. Vercel Dashboard > Deployments
2. Finde das letzte funktionierende Deployment
3. Klicke auf "..." > "Promote to Production"

---

## Alternative Plattformen

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Docker / Self-Hosted

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build und Start
docker build -t zeitstrahl .
docker run -p 3000:3000 zeitstrahl
```

### Cloudflare Pages

```bash
npm install -D @cloudflare/next-on-pages

# Build fuer Cloudflare
npx @cloudflare/next-on-pages
```

---

## Checkliste fuer Produktion

Vor dem Go-Live:

- [ ] Alle Tests bestehen
- [ ] Umgebungsvariablen gesetzt
- [ ] Custom Domain konfiguriert
- [ ] SSL-Zertifikat aktiv
- [ ] Analytics aktiviert
- [ ] Error Tracking eingerichtet
- [ ] Performance getestet (Lighthouse)
- [ ] SEO-Metadaten geprueft
- [ ] Backup-Strategie definiert
- [ ] Monitoring eingerichtet

---

Bei Fragen zum Deployment, erstelle ein Issue mit dem Label `deployment`.
