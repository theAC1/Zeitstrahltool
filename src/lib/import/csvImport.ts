import { v4 as uuidv4 } from 'uuid';
import type { Ereignis, HistorischesDatum } from '@/types';

// ============================================
// CSV Import Types
// ============================================

export interface CSVImportOptions {
  delimiter?: string;
  hasHeader?: boolean;
  dateFormat?: 'ISO' | 'DD.MM.YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  skipEmptyRows?: boolean;
}

export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  columnCount: number;
}

// ============================================
// CSV Parser
// ============================================

/**
 * Parse CSV string to 2D array
 */
export function parseCSV(
  csvText: string,
  options: CSVImportOptions = {}
): string[][] {
  const {
    delimiter = ',',
    skipEmptyRows = true,
  } = options;

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());

        if (!skipEmptyRows || currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }

        currentRow = [];
        currentField = '';
      }

      // Skip \r\n combination
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentField += char;
    }
  }

  // Add last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (!skipEmptyRows || currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// ============================================
// Date Parsing
// ============================================

/**
 * Parse date string to HistorischesDatum
 */
export function parseDate(
  dateStr: string,
  format: CSVImportOptions['dateFormat'] = 'ISO'
): HistorischesDatum | null {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  const trimmed = dateStr.trim();

  // Check for "ca." prefix
  const isApprox = trimmed.toLowerCase().startsWith('ca.');
  const cleanDate = isApprox ? trimmed.substring(3).trim() : trimmed;

  // Check for BCE/v.Chr.
  const isBCE =
    cleanDate.toLowerCase().includes('v.chr') ||
    cleanDate.toLowerCase().includes('bce') ||
    cleanDate.toLowerCase().includes('bc');

  const yearStr = cleanDate.replace(/[^\d-]/g, '');

  try {
    switch (format) {
      case 'ISO': {
        // ISO format: YYYY-MM-DD or YYYY
        const parts = yearStr.split('-');
        if (!parts[0]) return null;

        const jahr = parseInt(parts[0]);
        const monat = parts[1] ? parseInt(parts[1]) : undefined;
        const tag = parts[2] ? parseInt(parts[2]) : undefined;

        return {
          jahr: isBCE ? -Math.abs(jahr) : jahr,
          monat,
          tag,
          ungenau: isApprox,
        };
      }

      case 'DD.MM.YYYY': {
        // German format: DD.MM.YYYY
        const parts = cleanDate.split('.');
        if (parts.length < 2 || !parts[2]) {
          return { jahr: parseInt(yearStr), ungenau: isApprox };
        }

        return {
          jahr: isBCE ? -Math.abs(parseInt(parts[2])) : parseInt(parts[2]),
          monat: parts[1] ? parseInt(parts[1]) : undefined,
          tag: parts[0] ? parseInt(parts[0]) : undefined,
          ungenau: isApprox,
        };
      }

      case 'MM/DD/YYYY': {
        // US format: MM/DD/YYYY
        const parts = cleanDate.split('/');
        if (parts.length < 2 || !parts[2]) {
          return { jahr: parseInt(yearStr), ungenau: isApprox };
        }

        return {
          jahr: isBCE ? -Math.abs(parseInt(parts[2])) : parseInt(parts[2]),
          monat: parts[0] ? parseInt(parts[0]) : undefined,
          tag: parts[1] ? parseInt(parts[1]) : undefined,
          ungenau: isApprox,
        };
      }

      case 'YYYY-MM-DD':
      default: {
        const parts = cleanDate.split('-');
        if (parts.length < 2 || !parts[0]) {
          return { jahr: parseInt(yearStr), ungenau: isApprox };
        }

        return {
          jahr: isBCE ? -Math.abs(parseInt(parts[0])) : parseInt(parts[0]),
          monat: parts[1] ? parseInt(parts[1]) : undefined,
          tag: parts[2] ? parseInt(parts[2]) : undefined,
          ungenau: isApprox,
        };
      }
    }
  } catch {
    // Fallback: try to parse just the year
    const jahr = parseInt(yearStr);
    if (!isNaN(jahr)) {
      return { jahr: isBCE ? -Math.abs(jahr) : jahr, ungenau: isApprox };
    }
    return null;
  }
}

// ============================================
// CSV to Events Mapping
// ============================================

/**
 * Map CSV rows to Ereignis objects
 * Expected columns: Titel, Datum, Beschreibung, Kategorie, Tags, Wichtigkeit
 */
export function csvToEreignisse(
  rows: string[][],
  options: CSVImportOptions = {}
): { ereignisse: Ereignis[]; errors: string[] } {
  const { hasHeader = true, dateFormat = 'ISO' } = options;

  const ereignisse: Ereignis[] = [];
  const errors: string[] = [];

  const startRow = hasHeader ? 1 : 0;
  const now = new Date().toISOString();

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    if (!row) continue;

    try {
      // Skip empty rows
      if (row.every((cell) => !cell || cell.trim() === '')) {
        continue;
      }

      const titel = row[0]?.trim();
      const datumStr = row[1]?.trim();
      const beschreibung = row[2]?.trim();
      const kategorieStr = row[3]?.trim();
      const tagsStr = row[4]?.trim();
      const wichtigkeitStr = row[5]?.trim();

      // Validate required fields
      if (!titel) {
        errors.push(`Zeile ${rowNum}: Titel fehlt`);
        continue;
      }

      if (!datumStr) {
        errors.push(`Zeile ${rowNum}: Datum fehlt`);
        continue;
      }

      // Parse date
      const datum = parseDate(datumStr, dateFormat);
      if (!datum) {
        errors.push(`Zeile ${rowNum}: Ungültiges Datum "${datumStr}"`);
        continue;
      }

      // Parse tags
      const tags = tagsStr
        ? tagsStr.split(';').map((t) => t.trim()).filter((t) => t.length > 0)
        : undefined;

      // Parse importance
      let wichtigkeit: 1 | 2 | 3 | undefined;
      if (wichtigkeitStr) {
        const w = parseInt(wichtigkeitStr);
        if (w >= 1 && w <= 3) {
          wichtigkeit = w as 1 | 2 | 3;
        }
      }

      // Create event
      const ereignis: Ereignis = {
        id: uuidv4(),
        titel,
        datum,
        beschreibung: beschreibung || undefined,
        kategorie: kategorieStr || undefined,
        tags,
        wichtigkeit,
        metadaten: {
          erstelltAm: now,
          geaendertAm: now,
        },
      };

      ereignisse.push(ereignis);
    } catch (error) {
      errors.push(`Zeile ${rowNum}: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  }

  return { ereignisse, errors };
}

// ============================================
// CSV Import Validation
// ============================================

/**
 * Validate CSV structure before import
 */
export function validateCSV(
  csvText: string,
  options: CSVImportOptions = {}
): CSVValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const rows = parseCSV(csvText, options);

    if (rows.length === 0 || !rows[0]) {
      errors.push('CSV-Datei ist leer');
      return { valid: false, errors, warnings, rowCount: 0, columnCount: 0 };
    }

    const columnCount = rows[0].length;

    // Check minimum columns
    if (columnCount < 2) {
      errors.push('CSV muss mindestens 2 Spalten haben (Titel, Datum)');
    }

    // Check column consistency
    const inconsistentRows: number[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row && row.length !== columnCount) {
        inconsistentRows.push(i + 1);
      }
    }

    if (inconsistentRows.length > 0) {
      warnings.push(
        `${inconsistentRows.length} Zeile(n) haben unterschiedliche Spaltenanzahl: ${inconsistentRows.slice(0, 5).join(', ')}${inconsistentRows.length > 5 ? '...' : ''}`
      );
    }

    // Check for empty required fields
    const { hasHeader = true } = options;
    const startRow = hasHeader ? 1 : 0;
    let emptyTitleCount = 0;
    let emptyDateCount = 0;

    for (let i = startRow; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      if (!row[0] || row[0].trim() === '') emptyTitleCount++;
      if (!row[1] || row[1].trim() === '') emptyDateCount++;
    }

    if (emptyTitleCount > 0) {
      warnings.push(`${emptyTitleCount} Zeile(n) ohne Titel`);
    }

    if (emptyDateCount > 0) {
      warnings.push(`${emptyDateCount} Zeile(n) ohne Datum`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      rowCount: rows.length,
      columnCount,
    };
  } catch (error) {
    errors.push(`Parsing-Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    return { valid: false, errors, warnings, rowCount: 0, columnCount: 0 };
  }
}

// ============================================
// CSV Export Template
// ============================================

/**
 * Generate CSV template for event import
 */
export function generateCSVTemplate(): string {
  const header = 'Titel,Datum,Beschreibung,Kategorie,Tags,Wichtigkeit';
  const example1 = 'Erster Weltkrieg beginnt,1914-07-28,Beginn des Ersten Weltkriegs,Politik,Krieg;Europa,3';
  const example2 = 'Mauerfall,1989-11-09,Fall der Berliner Mauer,Geschichte,Deutschland;Wiedervereinigung,3';
  const example3 = 'Mondlandung,1969-07-21,Neil Armstrong betritt den Mond,Wissenschaft,Raumfahrt;USA,2';

  return `${header}\n${example1}\n${example2}\n${example3}`;
}

/**
 * Download CSV template
 */
export function downloadCSVTemplate(): void {
  const csv = generateCSVTemplate();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'zeitstrahl_vorlage.csv';
  link.click();

  URL.revokeObjectURL(url);
}
