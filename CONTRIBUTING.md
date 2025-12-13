# Contributing to Zeitstrahl

Thank you for your interest in contributing to Zeitstrahl! This document explains how you can best contribute to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Questions and Help](#questions-and-help)

---

## Code of Conduct

This project and all participants are committed to respectful and inclusive behavior. We expect all contributors to:

- **Be respectful**: Treat others as you would like to be treated
- **Provide constructive feedback**: Criticism should be helpful and objective
- **Be open**: Be open to different opinions and perspectives
- **Focus on education**: Remember that this tool is designed for teachers and students

Inappropriate behavior may result in exclusion from the project.

---

## How Can I Contribute?

There are many ways to contribute to the project:

### Code Contributions

- **Bug Fixes**: Fix errors and improve stability
- **New Features**: Implement new functionality
- **Refactoring**: Improve code quality
- **Tests**: Increase test coverage

### Non-Code Contributions

- **Documentation**: Improve README, guides, and comments
- **Translations**: Help with localization
- **Design**: Suggest UI/UX improvements
- **Testing**: Find and report bugs
- **Ideas**: Submit feature suggestions

### For Educators

- **Feedback**: Provide feedback from classroom experience
- **Templates**: Create timeline templates for various epochs
- **Pedagogy**: Suggest improvements for educational use

---

## Development Setup

### Prerequisites

- Node.js 18.17+
- npm 9.0+ or pnpm 8.0+
- Git
- A code editor (VS Code recommended)

### Setup

1. **Create a Fork**

   Click "Fork" in the top right of the GitHub page.

2. **Clone the Repository**

   ```bash
   git clone https://github.com/YOUR-USERNAME/zeitstrahl.git
   cd zeitstrahl
   ```

3. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/zeitstrahl-org/zeitstrahl.git
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "usernamehw.errorlens"
  ]
}
```

---

## Code Style Guidelines

### General Principles

1. **Readability over brevity**: Code should be self-explanatory
2. **Consistency**: Follow existing patterns in the code
3. **Type safety**: Fully utilize TypeScript features
4. **Comments**: Add comments for complex logic

### TypeScript

```typescript
// Good: Explicit types for function parameters and return values
function calculateTimespan(start: Date, end: Date): number {
  // ...
}

// Bad: Avoid any types
function calculateTimespan(start: any, end: any) {
  // ...
}
```

### React Components

```tsx
// Prefer functional components with TypeScript
interface TimelineEventProps {
  title: string;
  date: Date;
  description?: string;
  category: EventCategory;
}

export function TimelineEvent({
  title,
  date,
  description,
  category,
}: TimelineEventProps) {
  return (
    <article className="event" role="listitem">
      <h3>{title}</h3>
      <time dateTime={date.toISOString()}>
        {formatDate(date)}
      </time>
      {description && <p>{description}</p>}
    </article>
  );
}
```

### File Structure

```
src/
  app/                    # Next.js App Router pages
  components/
    ui/                   # General UI components
    zeitstrahl/           # Timeline-specific components
  hooks/                  # Custom React Hooks
  lib/                    # Helper functions and utilities
  types/                  # TypeScript type definitions
  styles/                 # Global styles
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `TimelineEditor.tsx` |
| Hooks | camelCase with "use" | `useTimeline.ts` |
| Utilities | camelCase | `dateUtils.ts` |
| Types/Interfaces | PascalCase | `EventType` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_EVENTS` |
| CSS classes | kebab-case | `event-card` |

### Tailwind CSS

```tsx
// Prefer Tailwind classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">

// For many classes: Group with cn() helper
<div className={cn(
  "flex items-center gap-4",
  "p-4 bg-white",
  "rounded-lg shadow-md",
  isActive && "ring-2 ring-blue-500"
)}>
```

### Accessibility

- Use semantic HTML elements
- Add `aria-*` attributes where needed
- Ensure sufficient color contrast
- Support keyboard navigation

```tsx
// Good: Semantic HTML with ARIA
<button
  aria-label="Add event"
  aria-expanded={isOpen}
  onClick={toggleMenu}
>
  <PlusIcon aria-hidden="true" />
  <span className="sr-only">Add event</span>
</button>
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting (no code change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Add/modify tests |
| `chore` | Build process, dependencies |

### Examples

```bash
# Feature
feat(editor): add drag-and-drop for events

# Bug fix
fix(timeline): correct date calculation for BCE

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(hooks): extract zoom logic into separate hook
```

### Language

- Commit messages in English
- Use imperative mood ("Add" not "Added")
- First line maximum 72 characters

---

## Pull Request Process

### Preparation

1. **Create or find an issue**

   Ensure there is an associated issue.

2. **Create a branch**

   ```bash
   git checkout -b feature/short-description
   # or
   git checkout -b fix/issue-number-description
   ```

3. **Sync regularly**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Development

1. **Write tests**

   New features need tests. Bug fixes should have a test that reproduces the bug.

2. **Check code**

   ```bash
   # Linting
   npm run lint

   # Type checking
   npm run type-check

   # Tests
   npm run test

   # All together
   npm run check
   ```

3. **Commit changes**

   Keep commits small and focused.

### Create Pull Request

1. **Open PR**

   - Use the PR template
   - Link the associated issue
   - Describe your changes in detail

2. **Checklist**

   - [ ] Code follows the style guidelines
   - [ ] Tests were written/updated
   - [ ] Documentation was updated
   - [ ] All CI checks are green

3. **Review Process**

   - At least one maintainer must approve the PR
   - Respond promptly to feedback
   - Push additional commits for requested changes

### After Merge

```bash
# Delete local branch
git branch -d feature/short-description

# Delete remote branch (if not automatic)
git push origin --delete feature/short-description

# Update main
git checkout main
git pull upstream main
```

---

## Issue Guidelines

### Reporting Bugs

Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) and provide:

- **Description**: What happens?
- **Expected behavior**: What should happen?
- **Reproduction**: Steps to reproduce
- **Environment**: Browser, OS, etc.
- **Screenshots**: If helpful

### Requesting Features

Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) and describe:

- **Problem**: What problem does the feature solve?
- **Solution**: How do you envision the solution?
- **Alternatives**: Have you considered other solutions?
- **Context**: How would it be used in the classroom?

### Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Code error |
| `feature` | New feature |
| `documentation` | Documentation |
| `good first issue` | Good for beginners |
| `help wanted` | Help needed |
| `priority: high` | High priority |
| `wontfix` | Will not be implemented |

---

## Questions and Help

### Where Can I Get Help?

1. **Documentation**: Read the [Docs](./docs/)
2. **Discussions**: [GitHub Discussions](https://github.com/zeitstrahl-org/zeitstrahl/discussions)
3. **Issues**: Search existing [Issues](https://github.com/zeitstrahl-org/zeitstrahl/issues)

### Contact

- **General questions**: GitHub Discussions
- **Bug reports**: GitHub Issues
- **Security issues**: Direct email to security@zeitstrahl.dev

---

## Recognition

All contributors are mentioned in the [README](./README.md) and release notes. We appreciate every contribution - no matter how big or small!

---

Thank you for making Zeitstrahl better!
