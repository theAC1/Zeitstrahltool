import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  speichereZeitstrahl,
  ladeZeitstrahl,
  ladeZeitstrahlListe,
  loescheZeitstrahl,
  ladeRecentListe,
  pruefeStorage,
  loescheAlleZeitstrahlen,
  type TimelineMetaInfo as _TimelineMetaInfo,
  type RecentTimeline as _RecentTimeline,
} from '../timelineStorage';
import type { Zeitstrahl } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
    hasOwnProperty: (key: string) => key in store,
  };
})();

// @ts-expect-error - Mock localStorage for testing
global.localStorage = localStorageMock;

describe('timelineStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const mockZeitstrahl: Zeitstrahl = {
    id: 'test-123',
    titel: 'Test Timeline',
    beschreibung: 'A test timeline',
    ereignisse: [
      {
        id: 'event-1',
        titel: 'Event 1',
        datum: { jahr: 2000 },
        beschreibung: 'Test event',
        kategorieId: 'cat-1',
      },
    ],
    epochen: [
      {
        id: 'epoch-1',
        name: 'Epoch 1',
        start: { jahr: 1990 },
        ende: { jahr: 2010 },
        farbe: '#ff0000',
      },
    ],
    kategorien: [
      {
        id: 'cat-1',
        name: 'Category 1',
        farbe: '#00ff00',
        symbol: '●',
      },
    ],
    einstellungen: {
      startJahr: 1900,
      endJahr: 2100,
      sprache: 'de',
      thema: 'light',
    },
    metadaten: {
      version: '1.0',
      erstelltAm: '2024-01-01T00:00:00.000Z',
      geaendertAm: '2024-01-01T00:00:00.000Z',
    },
  };

  describe('speichereZeitstrahl', () => {
    it('should save timeline to localStorage', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const key = 'zeitstrahl_test-123';
      const saved = localStorage.getItem(key);

      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.id).toBe('test-123');
      expect(parsed.titel).toBe('Test Timeline');
    });

    it('should update timeline list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const liste = ladeZeitstrahlListe();
      expect(liste).toHaveLength(1);
      expect(liste[0].id).toBe('test-123');
      expect(liste[0].titel).toBe('Test Timeline');
      expect(liste[0].ereignisAnzahl).toBe(1);
      expect(liste[0].epochenAnzahl).toBe(1);
    });

    it('should update existing timeline in list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const updated = { ...mockZeitstrahl, titel: 'Updated Timeline' };
      speichereZeitstrahl(updated);

      const liste = ladeZeitstrahlListe();
      expect(liste).toHaveLength(1);
      expect(liste[0].titel).toBe('Updated Timeline');
    });

    it('should update recent list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const recent = ladeRecentListe();
      expect(recent).toHaveLength(1);
      expect(recent[0].id).toBe('test-123');
    });

    it('should handle save errors gracefully', () => {
      const invalidZeitstrahl = { ...mockZeitstrahl };

      // Mock setItem to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      expect(() => speichereZeitstrahl(invalidZeitstrahl)).toThrow(
        'Zeitstrahl konnte nicht gespeichert werden'
      );

      localStorage.setItem = originalSetItem;
    });
  });

  describe('ladeZeitstrahl', () => {
    it('should load timeline from localStorage', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const loaded = ladeZeitstrahl('test-123');
      expect(loaded).not.toBeNull();
      expect(loaded!.id).toBe('test-123');
      expect(loaded!.titel).toBe('Test Timeline');
      expect(loaded!.ereignisse).toHaveLength(1);
    });

    it('should return null for non-existent timeline', () => {
      const loaded = ladeZeitstrahl('non-existent');
      expect(loaded).toBeNull();
    });

    it('should update recent list when loading', () => {
      speichereZeitstrahl(mockZeitstrahl);
      localStorageMock.removeItem('zeitstrahl_recent'); // Clear recent list

      ladeZeitstrahl('test-123');

      const recent = ladeRecentListe();
      expect(recent).toHaveLength(1);
      expect(recent[0].id).toBe('test-123');
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('zeitstrahl_test-123', 'invalid json');

      const loaded = ladeZeitstrahl('test-123');
      expect(loaded).toBeNull();
    });
  });

  describe('ladeZeitstrahlListe', () => {
    it('should return empty array when no timelines exist', () => {
      const liste = ladeZeitstrahlListe();
      expect(liste).toEqual([]);
    });

    it('should return list of all timelines', () => {
      speichereZeitstrahl(mockZeitstrahl);
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-456', titel: 'Timeline 2' });

      const liste = ladeZeitstrahlListe();
      expect(liste).toHaveLength(2);
      expect(liste.map((t) => t.id)).toContain('test-123');
      expect(liste.map((t) => t.id)).toContain('test-456');
    });

    it('should handle corrupted list data', () => {
      localStorage.setItem('zeitstrahl_list', 'invalid json');

      const liste = ladeZeitstrahlListe();
      expect(liste).toEqual([]);
    });
  });

  describe('loescheZeitstrahl', () => {
    it('should remove timeline from localStorage', () => {
      speichereZeitstrahl(mockZeitstrahl);

      loescheZeitstrahl('test-123');

      const loaded = ladeZeitstrahl('test-123');
      expect(loaded).toBeNull();
    });

    it('should update timeline list', () => {
      speichereZeitstrahl(mockZeitstrahl);
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-456' });

      loescheZeitstrahl('test-123');

      const liste = ladeZeitstrahlListe();
      expect(liste).toHaveLength(1);
      expect(liste[0].id).toBe('test-456');
    });

    it('should update recent list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      loescheZeitstrahl('test-123');

      const recent = ladeRecentListe();
      expect(recent.find((r) => r.id === 'test-123')).toBeUndefined();
    });

    it('should handle deletion errors', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Cannot remove');
      });

      expect(() => loescheZeitstrahl('test-123')).toThrow(
        'Zeitstrahl konnte nicht gelöscht werden'
      );

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('ladeRecentListe', () => {
    it('should return empty array when no recent items', () => {
      const recent = ladeRecentListe();
      expect(recent).toEqual([]);
    });

    it('should return recent timelines in order', () => {
      speichereZeitstrahl(mockZeitstrahl);
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-456', titel: 'Timeline 2' });

      const recent = ladeRecentListe();
      expect(recent).toHaveLength(2);
      expect(recent[0].id).toBe('test-456'); // Most recent first
      expect(recent[1].id).toBe('test-123');
    });

    it('should limit to 10 recent items', () => {
      for (let i = 0; i < 15; i++) {
        speichereZeitstrahl({ ...mockZeitstrahl, id: `test-${i}`, titel: `Timeline ${i}` });
      }

      const recent = ladeRecentListe();
      expect(recent).toHaveLength(10);
    });

    it('should move item to front when accessed again', () => {
      speichereZeitstrahl(mockZeitstrahl);
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-456', titel: 'Timeline 2' });

      // Access first timeline again
      ladeZeitstrahl('test-123');

      const recent = ladeRecentListe();
      expect(recent[0].id).toBe('test-123'); // Now most recent
    });

    it('should handle corrupted recent list', () => {
      localStorage.setItem('zeitstrahl_recent', 'invalid json');

      const recent = ladeRecentListe();
      expect(recent).toEqual([]);
    });
  });

  describe('pruefeStorage', () => {
    it('should detect available storage', () => {
      const result = pruefeStorage();
      expect(result.verfuegbar).toBe(true);
    });

    it('should check storage space usage', () => {
      // Add some data to storage
      localStorage.setItem('test-data', 'x'.repeat(1000));

      const result = pruefeStorage();
      expect(result.verfuegbar).toBe(true);
      // Our mock doesn't simulate size limits, so just check it runs
      expect(typeof result.platzmangel).toBe('boolean');
    });

    it('should handle unavailable storage', () => {
      const originalSetItem = localStorage.setItem;
      const originalRemoveItem = localStorage.removeItem;

      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage not available');
      });
      localStorage.removeItem = vi.fn();

      const result = pruefeStorage();
      expect(result.verfuegbar).toBe(false);

      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('loescheAlleZeitstrahlen', () => {
    it('should remove all timelines', () => {
      speichereZeitstrahl(mockZeitstrahl);
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-456' });
      speichereZeitstrahl({ ...mockZeitstrahl, id: 'test-789' });

      loescheAlleZeitstrahlen();

      const liste = ladeZeitstrahlListe();
      expect(liste).toEqual([]);

      expect(ladeZeitstrahl('test-123')).toBeNull();
      expect(ladeZeitstrahl('test-456')).toBeNull();
      expect(ladeZeitstrahl('test-789')).toBeNull();
    });

    it('should clear timeline list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      loescheAlleZeitstrahlen();

      expect(localStorage.getItem('zeitstrahl_list')).toBeNull();
    });

    it('should clear recent list', () => {
      speichereZeitstrahl(mockZeitstrahl);

      loescheAlleZeitstrahlen();

      expect(localStorage.getItem('zeitstrahl_recent')).toBeNull();
    });

    it('should handle deletion errors', () => {
      speichereZeitstrahl(mockZeitstrahl);

      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Cannot remove');
      });

      expect(() => loescheAlleZeitstrahlen()).toThrow('Fehler beim Löschen aller Zeitstrahlen');

      localStorage.removeItem = originalRemoveItem;
    });
  });
});
