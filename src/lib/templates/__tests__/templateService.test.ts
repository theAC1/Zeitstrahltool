import { describe, it, expect } from 'vitest';
import {
  getAllTemplates,
  getTemplateMetadata,
  loadTemplate,
  createFromTemplate,
} from '../templateService';

describe('templateService', () => {
  describe('getAllTemplates', () => {
    it('should return all available templates', () => {
      const templates = getAllTemplates();
      expect(templates).toHaveLength(3);
      expect(templates.map((t) => t.id)).toContain('empty');
      expect(templates.map((t) => t.id)).toContain('deutsche-geschichte');
      expect(templates.map((t) => t.id)).toContain('weltgeschichte');
    });

    it('should return templates with metadata', () => {
      const templates = getAllTemplates();
      templates.forEach((template) => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('icon');
        expect(template).toHaveProperty('eventCount');
        expect(template).toHaveProperty('epochCount');
        expect(template).toHaveProperty('categoryCount');
        expect(template).toHaveProperty('difficulty');
        expect(template).toHaveProperty('tags');
      });
    });
  });

  describe('getTemplateMetadata', () => {
    it('should return metadata for valid template', () => {
      const metadata = getTemplateMetadata('empty');
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBe('empty');
      expect(metadata?.name).toBe('Leerer Zeitstrahl');
    });

    it('should return null for invalid template', () => {
      const metadata = getTemplateMetadata('non-existent');
      expect(metadata).toBeNull();
    });
  });

  describe('loadTemplate', () => {
    it('should load empty template', () => {
      const zeitstrahl = loadTemplate('empty');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toBe('Leerer Zeitstrahl');
      expect(zeitstrahl?.ereignisse).toHaveLength(0);
      expect(zeitstrahl?.epochen).toHaveLength(0);
      expect(zeitstrahl?.kategorien).toHaveLength(0);
    });

    it('should load German history template', () => {
      const zeitstrahl = loadTemplate('deutsche-geschichte');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toBe('Deutsche Geschichte');
      expect(zeitstrahl?.ereignisse.length).toBeGreaterThan(0);
      expect(zeitstrahl?.epochen.length).toBeGreaterThan(0);
      expect(zeitstrahl?.kategorien.length).toBeGreaterThan(0);
    });

    it('should load world history template', () => {
      const zeitstrahl = loadTemplate('weltgeschichte');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toBe('Weltgeschichte');
      expect(zeitstrahl?.ereignisse.length).toBeGreaterThan(0);
    });

    it('should return null for invalid template', () => {
      const zeitstrahl = loadTemplate('non-existent');
      expect(zeitstrahl).toBeNull();
    });

    it('should generate new timestamps', () => {
      const zeitstrahl = loadTemplate('empty');
      expect(zeitstrahl?.metadaten.erstelltAm).toBeDefined();
      expect(zeitstrahl?.metadaten.geaendertAm).toBeDefined();

      const timestamp = new Date(zeitstrahl!.metadaten.erstelltAm);
      expect(timestamp.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime());
    });
  });

  describe('createFromTemplate', () => {
    it('should create timeline with custom title', () => {
      const zeitstrahl = createFromTemplate('empty', 'Mein Zeitstrahl');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toBe('Mein Zeitstrahl');
    });

    it('should create timeline with default title for empty', () => {
      const zeitstrahl = createFromTemplate('empty');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toBe('Leerer Zeitstrahl');
    });

    it('should append "Kopie" for non-empty templates', () => {
      const zeitstrahl = createFromTemplate('deutsche-geschichte');
      expect(zeitstrahl).toBeDefined();
      expect(zeitstrahl?.titel).toContain('Kopie');
    });

    it('should return null for invalid template', () => {
      const zeitstrahl = createFromTemplate('non-existent');
      expect(zeitstrahl).toBeNull();
    });

    it('should create deep copy', () => {
      const zeitstrahl1 = loadTemplate('deutsche-geschichte');
      const zeitstrahl2 = loadTemplate('deutsche-geschichte');

      // Modify first timeline
      if (zeitstrahl1) {
        zeitstrahl1.titel = 'Modified';
      }

      // Second timeline should be unchanged
      expect(zeitstrahl2?.titel).toBe('Deutsche Geschichte');
    });
  });
});
