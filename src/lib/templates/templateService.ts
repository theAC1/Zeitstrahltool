import type { Zeitstrahl } from '@/types';
import emptyTemplate from '@/data/templates/empty.json';
import deutscheGeschichteTemplate from '@/data/templates/deutsche-geschichte.json';
import weltgeschichteTemplate from '@/data/templates/weltgeschichte.json';

/**
 * Template metadata for display purposes
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  preview: string;
  icon: string;
  eventCount: number;
  epochCount: number;
  categoryCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

/**
 * Available timeline templates
 */
export const TEMPLATES: Record<string, TemplateMetadata> = {
  empty: {
    id: 'empty',
    name: 'Leerer Zeitstrahl',
    description: 'Ein leerer Zeitstrahl zum selbst gestalten. Ideal für eigene Projekte.',
    preview: '📝',
    icon: '📝',
    eventCount: 0,
    epochCount: 0,
    categoryCount: 0,
    difficulty: 'beginner',
    tags: ['Leer', 'Custom', 'Eigenes Projekt'],
  },
  'deutsche-geschichte': {
    id: 'deutsche-geschichte',
    name: 'Deutsche Geschichte',
    description:
      'Wichtige Ereignisse der deutschen Geschichte von der Antike bis heute. Von der Schlacht im Teutoburger Wald bis zur Wiedervereinigung.',
    preview: '🇩🇪',
    icon: '🇩🇪',
    eventCount: 18,
    epochCount: 7,
    categoryCount: 3,
    difficulty: 'intermediate',
    tags: ['Deutschland', 'Geschichte', 'Europa'],
  },
  weltgeschichte: {
    id: 'weltgeschichte',
    name: 'Weltgeschichte',
    description:
      'Bedeutende Ereignisse der Weltgeschichte von der Antike bis zur Gegenwart. Von der Gründung Roms bis zur COVID-19 Pandemie.',
    preview: '🌍',
    icon: '🌍',
    eventCount: 24,
    epochCount: 7,
    categoryCount: 7,
    difficulty: 'advanced',
    tags: ['Welt', 'Global', 'Epochen'],
  },
};

/**
 * Get all available templates
 */
export function getAllTemplates(): TemplateMetadata[] {
  return Object.values(TEMPLATES);
}

/**
 * Get template metadata by ID
 */
export function getTemplateMetadata(templateId: string): TemplateMetadata | null {
  return TEMPLATES[templateId] || null;
}

/**
 * Load a template and return a complete Zeitstrahl object
 * The returned timeline will have a new ID and updated timestamps
 */
export function loadTemplate(templateId: string): Zeitstrahl | null {
  let template: unknown;

  switch (templateId) {
    case 'empty':
      template = emptyTemplate;
      break;
    case 'deutsche-geschichte':
      template = deutscheGeschichteTemplate;
      break;
    case 'weltgeschichte':
      template = weltgeschichteTemplate;
      break;
    default:
      return null;
  }

  // Create a deep copy to avoid mutations
  const zeitstrahl = JSON.parse(JSON.stringify(template)) as Zeitstrahl;

  // Generate new ID and timestamps
  const now = new Date().toISOString();
  zeitstrahl.metadaten.erstelltAm = now;
  zeitstrahl.metadaten.geaendertAm = now;

  // Update all event timestamps
  zeitstrahl.ereignisse.forEach((ereignis) => {
    ereignis.metadaten.erstelltAm = now;
    ereignis.metadaten.geaendertAm = now;
  });

  return zeitstrahl;
}

/**
 * Create a new timeline from a template with a custom title
 */
export function createFromTemplate(templateId: string, customTitle?: string): Zeitstrahl | null {
  const zeitstrahl = loadTemplate(templateId);

  if (!zeitstrahl) {
    return null;
  }

  // Apply custom title if provided
  if (customTitle) {
    zeitstrahl.titel = customTitle;
  } else if (templateId !== 'empty') {
    // For non-empty templates, append "Kopie" to distinguish from original
    zeitstrahl.titel = `${zeitstrahl.titel} (Kopie)`;
  }

  return zeitstrahl;
}

/**
 * Get template tags for filtering
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(TEMPLATES).forEach((template) => {
    template.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Filter templates by tag
 */
export function filterTemplatesByTag(tag: string): TemplateMetadata[] {
  return Object.values(TEMPLATES).filter((template) => template.tags.includes(tag));
}

/**
 * Search templates by name or description
 */
export function searchTemplates(query: string): TemplateMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(TEMPLATES).filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
