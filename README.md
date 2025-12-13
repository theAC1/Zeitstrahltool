# Zeitstrahl - Interactive Timeline Tool for Education

![Zeitstrahl Logo](./docs/assets/logo-placeholder.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

**Zeitstrahl** is a free, web-based tool for creating interactive historical timelines. Designed specifically for education, it enables teachers and students to visualize and experience history.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Core Functionality

- **Intuitive Timeline Creation**: Drag-and-drop interface for easily adding events
- **Flexible Time Periods**: Support from prehistory to present (including BCE/CE)
- **Events and Epochs**: Display both single events and time spans
- **Responsive Design**: Optimized for desktop, tablet, and smartphone
- **No Registration Required**: Start immediately without signing up

### Visualization

- **Zoom and Navigation**: Seamless zooming and scrolling through the timeline
- **Color Coding**: Visually distinguish epochs and categories
- **Multimedia Support**: Add images and descriptions to events
- **Multiple Display Modes**: Linear, compact, or detailed views

### Export and Sharing

- **Multiple Export Formats**: PNG, SVG, PDF
- **Shareable Links**: Share timelines via link
- **Embed Function**: Embed timelines in websites
- **Print Optimized**: Special print view for worksheets

### For the Classroom

- **Templates**: Ready-made timeline templates for various epochs
- **Collaborative Work**: Work together on timelines (in development)
- **Accessibility**: WCAG 2.1 AA compliant
- **Multilingual**: German and English

---

## Demo

> **Live Demo**: [https://zeitstrahl.vercel.app](https://zeitstrahl.vercel.app) *(Placeholder)*

### Screenshots

| Home | Editor | Presentation |
|------|--------|--------------|
| ![Home](./docs/assets/screenshot-home-placeholder.png) | ![Editor](./docs/assets/screenshot-editor-placeholder.png) | ![Presentation](./docs/assets/screenshot-presentation-placeholder.png) |

---

## Quick Start

For a quick local installation:

```bash
# Clone the repository
git clone https://github.com/zeitstrahl-org/zeitstrahl.git

# Navigate to project directory
cd zeitstrahl

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installation

### Prerequisites

- **Node.js** 18.17 or higher
- **npm** 9.0+ or **pnpm** 8.0+
- **Git** (optional, for version control)

### Detailed Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zeitstrahl-org/zeitstrahl.git
   cd zeitstrahl
   ```

2. **Install dependencies**

   With npm:
   ```bash
   npm install
   ```

   Or with pnpm (recommended):
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file based on the template:
   ```bash
   cp .env.example .env.local
   ```

   Edit the file and add your configuration:
   ```env
   # Optional Analytics
   NEXT_PUBLIC_ANALYTICS_ID=

   # Database (optional, for cloud storage)
   DATABASE_URL=
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   npm run start
   ```

### Docker (Alternative)

```bash
# Build image
docker build -t zeitstrahl .

# Start container
docker run -p 3000:3000 zeitstrahl
```

---

## Usage

### Create a New Timeline

1. Open the application at [http://localhost:3000](http://localhost:3000)
2. Click "New Timeline"
3. Choose a template or start with an empty timeline
4. Add events via the "+ Event" menu

### Add Events

```
Title:       The Fall of the Berlin Wall
Date:        November 9, 1989
Description: The Berlin Wall falls after 28 years...
Category:    Politics
Image:       [Upload image]
```

### Define Epochs

Epochs span time periods and are displayed as colored bars:

```
Name:        Roman Empire
Start:       753 BCE
End:         476 CE
Color:       Red
```

### Export

- **PNG/SVG**: For presentations and websites
- **PDF**: For printing and worksheets
- **JSON**: For backup and exchange

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New event |
| `Ctrl + S` | Save |
| `Ctrl + E` | Export |
| `+` / `-` | Zoom |
| `Arrow Left/Right` | Navigation |
| `Esc` | Close dialog |

---

## Technology Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 14+ | React Framework with App Router |
| [React](https://react.dev/) | 18+ | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.0+ | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4+ | Utility-First CSS |
| [Framer Motion](https://www.framer.com/motion/) | 11+ | Animations |

### Visualization

| Technology | Description |
|------------|-------------|
| SVG | Vector-based timeline rendering |
| Canvas API | Performance-optimized views |
| D3.js | Complex data visualizations |

### Validation & Security

| Technology | Description |
|------------|-------------|
| Zod | Schema validation |
| DOMPurify | HTML sanitization |

### Export

| Technology | Description |
|------------|-------------|
| jsPDF | PDF generation |

### Backend & Infrastructure

| Technology | Description |
|------------|-------------|
| [Vercel](https://vercel.com/) | Hosting and Deployment |
| [GitHub Actions](https://github.com/features/actions) | CI/CD Pipeline |
| Edge Functions | Serverless API endpoints |

### Development Tools

| Tool | Description |
|------|-------------|
| ESLint | Code quality |
| Prettier | Code formatting |
| Vitest | Unit tests |
| Playwright | E2E tests |

---

## Documentation

Detailed documentation can be found in the `docs/` folder:

- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture and design decisions
- [Deployment](./docs/DEPLOYMENT.md) - Vercel deployment guide
- [API Reference](./docs/API.md) - API endpoints and data formats
- [Testing](./docs/TESTING.md) - Testing strategy and guidelines

---

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before getting started.

### Quick Overview

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

### Good First Issues

Check out issues labeled [`good first issue`](https://github.com/zeitstrahl-org/zeitstrahl/labels/good%20first%20issue) - these are great for beginners.

---

## Roadmap

- [x] MVP with basic timeline functionality
- [x] Export as PNG/SVG
- [ ] PDF export with print optimization
- [ ] Real-time collaborative editing
- [ ] Expand template library
- [ ] Mobile app (React Native)
- [ ] Offline mode with PWA

See [open issues](https://github.com/zeitstrahl-org/zeitstrahl/issues) for planned features and known issues.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

- Inspired by the work of dedicated history teachers
- Icons by [Lucide Icons](https://lucide.dev/)
- Thanks to all contributors and testers

---

## Contact

**Project Maintainers**

- GitHub: [@zeitstrahl-org](https://github.com/zeitstrahl-org)
- Email: contact@zeitstrahl.dev

**Community**

- [Discussions](https://github.com/zeitstrahl-org/zeitstrahl/discussions)
- [Report a Bug](https://github.com/zeitstrahl-org/zeitstrahl/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/zeitstrahl-org/zeitstrahl/issues/new?template=feature_request.md)

---

<p align="center">
  Built with passion for education
  <br>
  <a href="https://zeitstrahl.vercel.app">zeitstrahl.vercel.app</a>
</p>
