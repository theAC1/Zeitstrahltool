# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure with Next.js 14
- Basic timeline component
- Event editor with form
- Export as PNG and SVG

### Changed
- (no changes yet)

### Deprecated
- (no deprecated features yet)

### Removed
- (nothing removed yet)

### Fixed
- (no fixes yet)

### Security
- (no security updates yet)

---

## [0.1.0] - 2024-01-15

### Added
- **Timeline Editor**: Basic functionality for creating timelines
  - Add, edit, and delete events
  - Date input with BCE support
  - Categories and color coding
- **Visualization**: SVG-based timeline rendering
  - Seamless zooming
  - Horizontal scrolling
  - Responsive display
- **Export**: Export timelines as images
  - PNG format for web
  - SVG format for scalability
- **Storage**: Local browser storage
  - Auto-save
  - Project import and export as JSON
- **Templates**: Initial timeline templates
  - German history
  - World history overview
- **Accessibility**: WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader support
  - High color contrast

### Technical Details
- Next.js 14 with App Router
- TypeScript 5.0 for type safety
- Tailwind CSS for styling
- Vercel for hosting

---

## Versioning Scheme

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Incompatible API changes
- **MINOR** (0.X.0): New features, backwards compatible
- **PATCH** (0.0.X): Backwards compatible bug fixes

### Examples

| Version | Description |
|---------|-------------|
| 1.0.0 | First stable release |
| 1.1.0 | New feature: Collaboration |
| 1.1.1 | Bug fix: Date display corrected |
| 2.0.0 | New architecture, API changes |

---

## Change Types

- **Added** for new features
- **Changed** for changes to existing features
- **Deprecated** for features to be removed soon
- **Removed** for removed features
- **Fixed** for bug fixes
- **Security** for security updates

---

## Links

- [All Releases](https://github.com/zeitstrahl-org/zeitstrahl/releases)
- [Compare Versions](https://github.com/zeitstrahl-org/zeitstrahl/compare)

[Unreleased]: https://github.com/zeitstrahl-org/zeitstrahl/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/zeitstrahl-org/zeitstrahl/releases/tag/v0.1.0
