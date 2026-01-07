import { describe, it, expect } from 'vitest';
import {
  datumZuJahreszahl,
  jahreDifferenz,
  vergleicheDaten,
  sortiereNachDatum,
  istImZeitraum,
  datumMittelpunkt,
  erweitereZeitraum,
  berechneSkalaIntervall,
  generiereSkalaMarker,
  berechneAutomatischenZeitraum,
} from '../calculate';
import type { HistorischesDatum } from '@/types';

describe('datumZuJahreszahl', () => {
  it('should convert simple year to number', () => {
    const result = datumZuJahreszahl({ jahr: 2000 });
    expect(result).toBe(2000);
  });

  it('should handle year with month', () => {
    const result = datumZuJahreszahl({ jahr: 2000, monat: 7 }); // July
    expect(result).toBeCloseTo(2000.5, 1);
  });

  it('should handle year with month and day', () => {
    const result = datumZuJahreszahl({ jahr: 2000, monat: 7, tag: 2 });
    expect(result).toBeGreaterThan(2000.5);
    expect(result).toBeLessThan(2000.6);
  });

  it('should handle negative years (BCE)', () => {
    const result = datumZuJahreszahl({ jahr: -753 });
    expect(result).toBe(-753);
  });

  it('should handle negative years with month (BCE)', () => {
    const result = datumZuJahreszahl({ jahr: -753, monat: 4 });
    // For negative years, fraction is subtracted
    expect(result).toBeLessThan(-753);
    expect(result).toBeGreaterThan(-754);
  });

  it('should handle January correctly', () => {
    const result = datumZuJahreszahl({ jahr: 2000, monat: 1 });
    expect(result).toBe(2000); // January = 0/12 of year
  });

  it('should handle December correctly', () => {
    const result = datumZuJahreszahl({ jahr: 2000, monat: 12 });
    expect(result).toBeCloseTo(2000.917, 2); // December = 11/12 of year
  });
});

describe('jahreDifferenz', () => {
  it('should calculate difference between two years', () => {
    const start: HistorischesDatum = { jahr: 2000 };
    const ende: HistorischesDatum = { jahr: 2010 };
    expect(jahreDifferenz(start, ende)).toBe(10);
  });

  it('should handle negative difference', () => {
    const start: HistorischesDatum = { jahr: 2010 };
    const ende: HistorischesDatum = { jahr: 2000 };
    expect(jahreDifferenz(start, ende)).toBe(-10);
  });

  it('should handle BCE to CE transition', () => {
    const start: HistorischesDatum = { jahr: -100 };
    const ende: HistorischesDatum = { jahr: 100 };
    expect(jahreDifferenz(start, ende)).toBe(200);
  });

  it('should handle dates with months', () => {
    const start: HistorischesDatum = { jahr: 2000, monat: 1 };
    const ende: HistorischesDatum = { jahr: 2000, monat: 7 };
    const diff = jahreDifferenz(start, ende);
    expect(diff).toBeCloseTo(0.5, 1);
  });
});

describe('vergleicheDaten', () => {
  it('should return negative when a < b', () => {
    const a: HistorischesDatum = { jahr: 2000 };
    const b: HistorischesDatum = { jahr: 2001 };
    expect(vergleicheDaten(a, b)).toBeLessThan(0);
  });

  it('should return positive when a > b', () => {
    const a: HistorischesDatum = { jahr: 2001 };
    const b: HistorischesDatum = { jahr: 2000 };
    expect(vergleicheDaten(a, b)).toBeGreaterThan(0);
  });

  it('should return 0 when dates are equal', () => {
    const a: HistorischesDatum = { jahr: 2000 };
    const b: HistorischesDatum = { jahr: 2000 };
    expect(vergleicheDaten(a, b)).toBe(0);
  });

  it('should handle BCE dates', () => {
    const a: HistorischesDatum = { jahr: -100 };
    const b: HistorischesDatum = { jahr: -50 };
    expect(vergleicheDaten(a, b)).toBeLessThan(0);
  });
});

describe('sortiereNachDatum', () => {
  it('should sort events by date', () => {
    const items = [
      { id: '1', datum: { jahr: 2000 } },
      { id: '2', datum: { jahr: 1990 } },
      { id: '3', datum: { jahr: 2010 } },
    ];

    const sorted = sortiereNachDatum(items);
    expect(sorted[0].id).toBe('2'); // 1990
    expect(sorted[1].id).toBe('1'); // 2000
    expect(sorted[2].id).toBe('3'); // 2010
  });

  it('should handle BCE dates', () => {
    const items = [
      { id: '1', datum: { jahr: 100 } },
      { id: '2', datum: { jahr: -100 } },
      { id: '3', datum: { jahr: 0 } },
    ];

    const sorted = sortiereNachDatum(items);
    expect(sorted[0].id).toBe('2'); // -100
    expect(sorted[1].id).toBe('3'); // 0
    expect(sorted[2].id).toBe('1'); // 100
  });

  it('should not modify original array', () => {
    const items = [
      { id: '1', datum: { jahr: 2000 } },
      { id: '2', datum: { jahr: 1990 } },
    ];

    const sorted = sortiereNachDatum(items);
    expect(items[0].id).toBe('1'); // Original unchanged
    expect(sorted[0].id).toBe('2'); // Sorted version
  });
});

describe('istImZeitraum', () => {
  it('should return true when date is within range', () => {
    const datum: HistorischesDatum = { jahr: 2000 };
    const start: HistorischesDatum = { jahr: 1990 };
    const ende: HistorischesDatum = { jahr: 2010 };
    expect(istImZeitraum(datum, start, ende)).toBe(true);
  });

  it('should return true for boundary dates', () => {
    const start: HistorischesDatum = { jahr: 1990 };
    const ende: HistorischesDatum = { jahr: 2010 };
    expect(istImZeitraum(start, start, ende)).toBe(true);
    expect(istImZeitraum(ende, start, ende)).toBe(true);
  });

  it('should return false when date is before range', () => {
    const datum: HistorischesDatum = { jahr: 1980 };
    const start: HistorischesDatum = { jahr: 1990 };
    const ende: HistorischesDatum = { jahr: 2010 };
    expect(istImZeitraum(datum, start, ende)).toBe(false);
  });

  it('should return false when date is after range', () => {
    const datum: HistorischesDatum = { jahr: 2020 };
    const start: HistorischesDatum = { jahr: 1990 };
    const ende: HistorischesDatum = { jahr: 2010 };
    expect(istImZeitraum(datum, start, ende)).toBe(false);
  });

  it('should handle BCE dates', () => {
    const datum: HistorischesDatum = { jahr: -50 };
    const start: HistorischesDatum = { jahr: -100 };
    const ende: HistorischesDatum = { jahr: 0 };
    expect(istImZeitraum(datum, start, ende)).toBe(true);
  });
});

describe('datumMittelpunkt', () => {
  it('should calculate midpoint between two dates', () => {
    const start: HistorischesDatum = { jahr: 2000 };
    const ende: HistorischesDatum = { jahr: 2010 };
    const mitte = datumMittelpunkt(start, ende);
    expect(mitte.jahr).toBe(2005);
  });

  it('should handle odd differences', () => {
    const start: HistorischesDatum = { jahr: 2000 };
    const ende: HistorischesDatum = { jahr: 2011 };
    const mitte = datumMittelpunkt(start, ende);
    expect(mitte.jahr).toBe(2006); // Rounded
  });

  it('should handle BCE to CE transition', () => {
    const start: HistorischesDatum = { jahr: -100 };
    const ende: HistorischesDatum = { jahr: 100 };
    const mitte = datumMittelpunkt(start, ende);
    expect(mitte.jahr).toBe(0);
  });
});

describe('erweitereZeitraum', () => {
  it('should expand time range by 10% by default', () => {
    const start: HistorischesDatum = { jahr: 2000 };
    const ende: HistorischesDatum = { jahr: 2100 };
    const erweitert = erweitereZeitraum(start, ende);

    // 100 years * 0.1 = 10 years padding on each side
    expect(erweitert.start.jahr).toBe(1990);
    expect(erweitert.ende.jahr).toBe(2110);
  });

  it('should allow custom expansion percentage', () => {
    const start: HistorischesDatum = { jahr: 2000 };
    const ende: HistorischesDatum = { jahr: 2100 };
    const erweitert = erweitereZeitraum(start, ende, 0.2);

    // 100 years * 0.2 = 20 years padding on each side
    expect(erweitert.start.jahr).toBe(1980);
    expect(erweitert.ende.jahr).toBe(2120);
  });

  it('should handle BCE dates', () => {
    const start: HistorischesDatum = { jahr: -100 };
    const ende: HistorischesDatum = { jahr: 0 };
    const erweitert = erweitereZeitraum(start, ende, 0.1);

    // 100 years * 0.1 = 10 years
    expect(erweitert.start.jahr).toBe(-110);
    expect(erweitert.ende.jahr).toBe(10);
  });
});

describe('berechneSkalaIntervall', () => {
  it('should return 1000 for very large spans', () => {
    expect(berechneSkalaIntervall(6000)).toBe(1000);
  });

  it('should return 500 for millennia', () => {
    expect(berechneSkalaIntervall(3000)).toBe(500);
  });

  it('should return 200 for 1000+ years', () => {
    expect(berechneSkalaIntervall(1500)).toBe(200);
  });

  it('should return 100 for 500+ years', () => {
    expect(berechneSkalaIntervall(600)).toBe(100);
  });

  it('should return 50 for 200+ years', () => {
    expect(berechneSkalaIntervall(300)).toBe(50);
  });

  it('should return 20 for 100+ years', () => {
    expect(berechneSkalaIntervall(150)).toBe(20);
  });

  it('should return 10 for 50+ years', () => {
    expect(berechneSkalaIntervall(75)).toBe(10);
  });

  it('should return 5 for 20+ years', () => {
    expect(berechneSkalaIntervall(30)).toBe(5);
  });

  it('should return 2 for 10+ years', () => {
    expect(berechneSkalaIntervall(15)).toBe(2);
  });

  it('should return 1 for small spans', () => {
    expect(berechneSkalaIntervall(5)).toBe(1);
  });
});

describe('generiereSkalaMarker', () => {
  it('should generate markers with automatic interval', () => {
    const markers = generiereSkalaMarker(2000, 2010);
    expect(markers).toContain(2000);
    expect(markers).toContain(2005);
    expect(markers).toContain(2010);
  });

  it('should generate markers with custom interval', () => {
    const markers = generiereSkalaMarker(2000, 2020, 10);
    expect(markers).toEqual([2000, 2010, 2020]);
  });

  it('should handle BCE dates', () => {
    const markers = generiereSkalaMarker(-100, 100, 50);
    expect(markers).toContain(-100);
    expect(markers).toContain(-50);
    expect(markers).toContain(0);
    expect(markers).toContain(50);
    expect(markers).toContain(100);
  });

  it('should round to nearest interval', () => {
    const markers = generiereSkalaMarker(1995, 2015, 10);
    expect(markers[0]).toBe(2000); // Rounded up from 1995
    expect(markers).toContain(2010);
  });

  it('should handle large spans', () => {
    const markers = generiereSkalaMarker(-5000, 5000, 1000);
    expect(markers.length).toBeGreaterThan(5);
    expect(markers).toContain(-5000);
    expect(markers).toContain(0);
    expect(markers).toContain(5000);
  });
});

describe('berechneAutomatischenZeitraum', () => {
  it('should return null for empty array', () => {
    expect(berechneAutomatischenZeitraum([])).toBeNull();
  });

  it('should calculate range from single event', () => {
    const ereignisse = [{ id: '1', datum: { jahr: 2000 } }];
    const zeitraum = berechneAutomatischenZeitraum(ereignisse);

    expect(zeitraum).not.toBeNull();
    expect(zeitraum!.start.jahr).toBeLessThan(2000);
    expect(zeitraum!.ende.jahr).toBeGreaterThan(2000);
  });

  it('should calculate range from multiple events', () => {
    const ereignisse = [
      { id: '1', datum: { jahr: 1990 } },
      { id: '2', datum: { jahr: 2000 } },
      { id: '3', datum: { jahr: 2010 } },
    ];
    const zeitraum = berechneAutomatischenZeitraum(ereignisse);

    expect(zeitraum).not.toBeNull();
    expect(zeitraum!.start.jahr).toBeLessThan(1990);
    expect(zeitraum!.ende.jahr).toBeGreaterThan(2010);
  });

  it('should consider event end dates', () => {
    const ereignisse = [
      { id: '1', datum: { jahr: 1990 }, endDatum: { jahr: 2020 } },
    ];
    const zeitraum = berechneAutomatischenZeitraum(ereignisse);

    expect(zeitraum).not.toBeNull();
    expect(zeitraum!.start.jahr).toBeLessThan(1990);
    expect(zeitraum!.ende.jahr).toBeGreaterThan(2020);
  });

  it('should add at least 1 year padding for single point', () => {
    const ereignisse = [{ id: '1', datum: { jahr: 2000 } }];
    const zeitraum = berechneAutomatischenZeitraum(ereignisse);

    expect(zeitraum).not.toBeNull();
    const spanne = zeitraum!.ende.jahr - zeitraum!.start.jahr;
    expect(spanne).toBeGreaterThanOrEqual(2); // At least 1 year padding on each side
  });

  it('should handle BCE dates', () => {
    const ereignisse = [
      { id: '1', datum: { jahr: -100 } },
      { id: '2', datum: { jahr: 100 } },
    ];
    const zeitraum = berechneAutomatischenZeitraum(ereignisse);

    expect(zeitraum).not.toBeNull();
    expect(zeitraum!.start.jahr).toBeLessThan(-100);
    expect(zeitraum!.ende.jahr).toBeGreaterThan(100);
  });
});
