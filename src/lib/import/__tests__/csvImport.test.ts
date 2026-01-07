import { describe, it, expect } from 'vitest';
import { parseCSV, parseDate, csvToEreignisse, validateCSV } from '../csvImport';

describe('csvImport', () => {
  describe('parseCSV', () => {
    it('should parse simple CSV', () => {
      const csv = 'a,b,c\n1,2,3\n4,5,6';
      const result = parseCSV(csv);
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['1', '2', '3'],
        ['4', '5', '6'],
      ]);
    });

    it('should handle quoted fields', () => {
      const csv = '"hello, world",test,"value"\n1,2,3';
      const result = parseCSV(csv);
      expect(result).toEqual([
        ['hello, world', 'test', 'value'],
        ['1', '2', '3'],
      ]);
    });

    it('should handle escaped quotes', () => {
      const csv = '"hello ""quoted"" world",test\n1,2';
      const result = parseCSV(csv);
      expect(result).toEqual([
        ['hello "quoted" world', 'test'],
        ['1', '2'],
      ]);
    });

    it('should skip empty rows', () => {
      const csv = 'a,b,c\n\n1,2,3\n\n4,5,6';
      const result = parseCSV(csv, { skipEmptyRows: true });
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['1', '2', '3'],
        ['4', '5', '6'],
      ]);
    });

    it('should handle different delimiters', () => {
      const csv = 'a;b;c\n1;2;3';
      const result = parseCSV(csv, { delimiter: ';' });
      expect(result).toEqual([
        ['a', 'b', 'c'],
        ['1', '2', '3'],
      ]);
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date', () => {
      const result = parseDate('2024-06-15', 'ISO');
      expect(result).toMatchObject({ jahr: 2024, monat: 6, tag: 15 });
    });

    it('should parse German date', () => {
      const result = parseDate('15.06.2024', 'DD.MM.YYYY');
      expect(result).toMatchObject({ jahr: 2024, monat: 6, tag: 15 });
    });

    it('should parse US date', () => {
      const result = parseDate('06/15/2024', 'MM/DD/YYYY');
      expect(result).toMatchObject({ jahr: 2024, monat: 6, tag: 15 });
    });

    it('should parse year only', () => {
      const result = parseDate('2024', 'ISO');
      expect(result).toMatchObject({ jahr: 2024 });
    });

    it('should parse BCE date', () => {
      const result = parseDate('753 v.Chr.', 'ISO');
      expect(result).toMatchObject({ jahr: -753 });
    });

    it('should parse approximate date', () => {
      const result = parseDate('ca. 500', 'ISO');
      expect(result).toMatchObject({ jahr: 500, ungenau: true });
    });

    it('should parse BCE approximate date', () => {
      const result = parseDate('ca. 500 v.Chr.', 'ISO');
      expect(result).toMatchObject({ jahr: -500, ungenau: true });
    });

    it('should return null for invalid date', () => {
      const result = parseDate('invalid', 'ISO');
      expect(result).toBeNull();
    });
  });

  describe('csvToEreignisse', () => {
    it('should convert CSV to events', () => {
      const rows = [
        ['Titel', 'Datum', 'Beschreibung'],
        ['Test Event', '2024-06-15', 'Test description'],
      ];
      const { ereignisse, errors } = csvToEreignisse(rows, {
        hasHeader: true,
        dateFormat: 'ISO',
      });

      expect(errors).toHaveLength(0);
      expect(ereignisse).toHaveLength(1);
      expect(ereignisse[0]!.titel).toBe('Test Event');
      expect(ereignisse[0]!.datum).toMatchObject({ jahr: 2024, monat: 6, tag: 15 });
      expect(ereignisse[0]!.beschreibung).toBe('Test description');
    });

    it('should report errors for invalid dates', () => {
      const rows = [
        ['Titel', 'Datum', 'Beschreibung'],
        ['Test Event', 'invalid-date', 'Test description'],
      ];
      const { ereignisse, errors } = csvToEreignisse(rows, {
        hasHeader: true,
        dateFormat: 'ISO',
      });

      expect(ereignisse).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Zeile 2');
    });

    it('should handle missing required fields', () => {
      const rows = [
        ['Titel', 'Datum', 'Beschreibung'],
        ['', '2024', 'Desc'],
      ];
      const { ereignisse, errors } = csvToEreignisse(rows, {
        hasHeader: true,
        dateFormat: 'ISO',
      });

      expect(ereignisse).toHaveLength(0);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCSV', () => {
    it('should validate correct CSV', () => {
      const csv = 'Titel,Datum,Beschreibung\nTest,2024,Desc';
      const result = validateCSV(csv, { hasHeader: true, dateFormat: 'ISO' });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty CSV', () => {
      const csv = '';
      const result = validateCSV(csv, { hasHeader: true, dateFormat: 'ISO' });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect inconsistent column count', () => {
      const csv = 'a,b,c\n1,2\n4,5,6';
      const result = validateCSV(csv, { hasHeader: true, dateFormat: 'ISO' });

      expect(result.valid).toBe(true); // Should be valid but with warnings
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
