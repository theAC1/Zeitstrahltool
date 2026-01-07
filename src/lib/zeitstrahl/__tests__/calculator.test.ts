import { describe, it, expect } from 'vitest';
import {
  berechneXPosition,
  berechneJahrVonPosition,
  berechneBreite,
  istSichtbar,
  filtereVonViewport,
  filtereEpochenVonViewport,
  berechneSichtbarenZeitraum,
  berechneZoomOffset,
  begrenzeOffset,
  berechneEreignisPositionen,
  type RenderKontext,
} from '../calculator';
import type { Ereignis, Epoche } from '@/types';

describe('berechneXPosition', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  it('should calculate position at start of timeline', () => {
    const pos = berechneXPosition({ jahr: 2000 }, kontext);
    expect(pos).toBe(0);
  });

  it('should calculate position at end of timeline', () => {
    const pos = berechneXPosition({ jahr: 2100 }, kontext);
    expect(pos).toBe(1000);
  });

  it('should calculate position in middle of timeline', () => {
    const pos = berechneXPosition({ jahr: 2050 }, kontext);
    expect(pos).toBe(500);
  });

  it('should handle zoom', () => {
    const zoomedKontext = { ...kontext, zoom: 2 };
    const pos = berechneXPosition({ jahr: 2050 }, zoomedKontext);
    expect(pos).toBe(1000); // 500 * 2
  });

  it('should handle offset', () => {
    const offsetKontext = { ...kontext, offset: { x: 100, y: 0 } };
    const pos = berechneXPosition({ jahr: 2050 }, offsetKontext);
    expect(pos).toBe(600); // 500 + 100
  });

  it('should handle dates with months', () => {
    const pos = berechneXPosition({ jahr: 2000, monat: 7 }, kontext);
    expect(pos).toBeGreaterThan(0);
    expect(pos).toBeLessThan(50);
  });
});

describe('berechneJahrVonPosition', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  it('should calculate year from position at start', () => {
    const jahr = berechneJahrVonPosition(0, kontext);
    expect(jahr).toBe(2000);
  });

  it('should calculate year from position at end', () => {
    const jahr = berechneJahrVonPosition(1000, kontext);
    expect(jahr).toBe(2100);
  });

  it('should calculate year from position in middle', () => {
    const jahr = berechneJahrVonPosition(500, kontext);
    expect(jahr).toBe(2050);
  });

  it('should handle zoom', () => {
    const zoomedKontext = { ...kontext, zoom: 2 };
    const jahr = berechneJahrVonPosition(1000, zoomedKontext);
    expect(jahr).toBe(2050); // Zoomed in, so 1000px = middle
  });

  it('should handle offset', () => {
    const offsetKontext = { ...kontext, offset: { x: 100, y: 0 } };
    const jahr = berechneJahrVonPosition(600, offsetKontext);
    expect(jahr).toBe(2050); // 600 - 100 = 500 = middle
  });

  it('should be inverse of berechneXPosition', () => {
    const datum = { jahr: 2025 };
    const x = berechneXPosition(datum, kontext);
    const jahr = berechneJahrVonPosition(x, kontext);
    expect(jahr).toBeCloseTo(2025, 1);
  });
});

describe('berechneBreite', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  it('should calculate width of full timeline', () => {
    const breite = berechneBreite({ jahr: 2000 }, { jahr: 2100 }, kontext);
    expect(breite).toBe(1000);
  });

  it('should calculate width of half timeline', () => {
    const breite = berechneBreite({ jahr: 2000 }, { jahr: 2050 }, kontext);
    expect(breite).toBe(500);
  });

  it('should calculate width of 10 year span', () => {
    const breite = berechneBreite({ jahr: 2000 }, { jahr: 2010 }, kontext);
    expect(breite).toBe(100);
  });

  it('should handle zoom', () => {
    const zoomedKontext = { ...kontext, zoom: 2 };
    const breite = berechneBreite({ jahr: 2000 }, { jahr: 2050 }, zoomedKontext);
    expect(breite).toBe(1000); // 500 * 2
  });
});

describe('istSichtbar', () => {
  it('should return true when element is fully visible', () => {
    expect(istSichtbar(100, 200, 1000, 0)).toBe(true);
  });

  it('should return true when element starts before viewport', () => {
    expect(istSichtbar(-50, 200, 1000, 0)).toBe(true);
  });

  it('should return true when element ends after viewport', () => {
    expect(istSichtbar(900, 200, 1000, 0)).toBe(true);
  });

  it('should return false when element is completely before viewport', () => {
    expect(istSichtbar(-300, 100, 1000, 0)).toBe(false);
  });

  it('should return false when element is completely after viewport', () => {
    expect(istSichtbar(1100, 100, 1000, 0)).toBe(false);
  });

  it('should use buffer for culling optimization', () => {
    // With 50px buffer, elements ending at -40 should be visible
    expect(istSichtbar(-50, 10, 1000, 50)).toBe(true);
    // But elements ending at -61 should not (x + breite = -61 + 10 = -51 < -50)
    expect(istSichtbar(-61, 10, 1000, 50)).toBe(false);
  });
});

describe('filtereVonViewport', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  const ereignisse: Ereignis[] = [
    {
      id: '1',
      titel: 'Event 1',
      datum: { jahr: 1990 }, // Before viewport
      beschreibung: '',
      kategorieId: 'cat1',
    },
    {
      id: '2',
      titel: 'Event 2',
      datum: { jahr: 2050 }, // In viewport
      beschreibung: '',
      kategorieId: 'cat1',
    },
    {
      id: '3',
      titel: 'Event 3',
      datum: { jahr: 2110 }, // After viewport
      beschreibung: '',
      kategorieId: 'cat1',
    },
  ];

  it('should filter out events outside viewport', () => {
    const sichtbar = filtereVonViewport(ereignisse, kontext, 0);
    expect(sichtbar).toHaveLength(1);
    expect(sichtbar[0].id).toBe('2');
  });

  it('should include events within buffer', () => {
    // With large buffer, might include more events
    const sichtbar = filtereVonViewport(ereignisse, kontext, 500);
    expect(sichtbar.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle events with end dates', () => {
    const spanEreignisse: Ereignis[] = [
      {
        id: '1',
        titel: 'Span Event',
        datum: { jahr: 1980 },
        endDatum: { jahr: 2020 }, // Spans into viewport
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const sichtbar = filtereVonViewport(spanEreignisse, kontext, 0);
    expect(sichtbar).toHaveLength(1);
  });
});

describe('filtereEpochenVonViewport', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  const epochen: Epoche[] = [
    {
      id: '1',
      name: 'Epoch 1',
      start: { jahr: 1900 },
      ende: { jahr: 1990 }, // Before viewport
      farbe: '#ff0000',
    },
    {
      id: '2',
      name: 'Epoch 2',
      start: { jahr: 2010 },
      ende: { jahr: 2090 }, // In viewport
      farbe: '#00ff00',
    },
    {
      id: '3',
      name: 'Epoch 3',
      start: { jahr: 2110 },
      ende: { jahr: 2200 }, // After viewport
      farbe: '#0000ff',
    },
  ];

  it('should filter out epochs outside viewport', () => {
    const sichtbar = filtereEpochenVonViewport(epochen, kontext, 0);
    expect(sichtbar).toHaveLength(1);
    expect(sichtbar[0].id).toBe('2');
  });

  it('should include epochs within buffer', () => {
    const sichtbar = filtereEpochenVonViewport(epochen, kontext, 500);
    expect(sichtbar.length).toBeGreaterThanOrEqual(1);
  });
});

describe('berechneSichtbarenZeitraum', () => {
  it('should calculate visible time range without zoom', () => {
    const kontext: RenderKontext = {
      breite: 1000,
      hoehe: 600,
      zeitraum: { start: 2000, ende: 2100 },
      zoom: 1,
      offset: { x: 0, y: 0 },
    };

    const sichtbar = berechneSichtbarenZeitraum(kontext);
    expect(sichtbar.start).toBe(2000);
    expect(sichtbar.ende).toBe(2100);
  });

  it('should calculate visible time range with zoom', () => {
    const kontext: RenderKontext = {
      breite: 1000,
      hoehe: 600,
      zeitraum: { start: 2000, ende: 2100 },
      zoom: 2,
      offset: { x: 0, y: 0 },
    };

    const sichtbar = berechneSichtbarenZeitraum(kontext);
    expect(sichtbar.ende - sichtbar.start).toBe(50); // Half the range due to 2x zoom
  });
});

describe('berechneZoomOffset', () => {
  it('should keep zoom center at same position', () => {
    const zoomZentrum = { x: 500, y: 300 };
    const alterOffset = { x: 0, y: 0 };

    const neuerOffset = berechneZoomOffset(zoomZentrum, 1, 2, alterOffset);

    // The point at 500,300 should stay at 500,300
    // Content coordinate = (500 - 0) / 1 = 500
    // New offset = 500 - 500 * 2 = -500
    expect(neuerOffset.x).toBe(-500);
    expect(neuerOffset.y).toBe(-300);
  });

  it('should handle zoom out', () => {
    const zoomZentrum = { x: 500, y: 300 };
    const alterOffset = { x: -500, y: -300 };

    const neuerOffset = berechneZoomOffset(zoomZentrum, 2, 1, alterOffset);

    expect(neuerOffset.x).toBe(0);
    expect(neuerOffset.y).toBe(0);
  });

  it('should handle offset zoom center', () => {
    const zoomZentrum = { x: 250, y: 150 };
    const alterOffset = { x: 0, y: 0 };

    const neuerOffset = berechneZoomOffset(zoomZentrum, 1, 2, alterOffset);

    expect(neuerOffset.x).toBe(-250);
    expect(neuerOffset.y).toBe(-150);
  });
});

describe('begrenzeOffset', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  it('should allow zero offset', () => {
    const offset = begrenzeOffset({ x: 0, y: 0 }, kontext, 1000, 600);
    expect(offset.x).toBe(0);
    expect(offset.y).toBe(0);
  });

  it('should prevent scrolling beyond right edge', () => {
    const offset = begrenzeOffset({ x: 100, y: 0 }, kontext, 1000, 600);
    expect(offset.x).toBe(0); // Max offset is 0
  });

  it('should prevent scrolling beyond left edge', () => {
    const offset = begrenzeOffset({ x: -2000, y: 0 }, kontext, 1000, 600);
    // Min offset when content = viewport is 0
    expect(offset.x).toBe(0);
  });

  it('should allow scrolling when zoomed', () => {
    const zoomedKontext = { ...kontext, zoom: 2 };
    const offset = begrenzeOffset({ x: -500, y: 0 }, zoomedKontext, 1000, 600);
    // Content is 2000px wide, viewport is 1000px, so can scroll
    expect(offset.x).toBe(-500);
  });

  it('should clamp to bounds when zoomed', () => {
    const zoomedKontext = { ...kontext, zoom: 2 };
    const offset = begrenzeOffset({ x: -2000, y: 0 }, zoomedKontext, 1000, 600);
    // Min offset = 1000 - 1000 * 2 = -1000
    expect(offset.x).toBe(-1000);
  });
});

describe('berechneEreignisPositionen', () => {
  const kontext: RenderKontext = {
    breite: 1000,
    hoehe: 600,
    zeitraum: { start: 2000, ende: 2100 },
    zoom: 1,
    offset: { x: 0, y: 0 },
  };

  it('should position single event at start Y', () => {
    const ereignisse: Ereignis[] = [
      {
        id: '1',
        titel: 'Event 1',
        datum: { jahr: 2050 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const positionen = berechneEreignisPositionen(ereignisse, kontext, 40, 10, 100);
    expect(positionen.get('1')).toBe(100);
  });

  it('should stack overlapping events', () => {
    const ereignisse: Ereignis[] = [
      {
        id: '1',
        titel: 'Event 1',
        datum: { jahr: 2050 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
      {
        id: '2',
        titel: 'Event 2',
        datum: { jahr: 2051 }, // Very close to event 1
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const positionen = berechneEreignisPositionen(ereignisse, kontext, 40, 10, 100);

    const y1 = positionen.get('1')!;
    const y2 = positionen.get('2')!;

    // Events should be at different Y positions
    expect(y1).not.toBe(y2);
    // Second event should be below first
    expect(y2).toBeGreaterThan(y1);
  });

  it('should not stack distant events', () => {
    const ereignisse: Ereignis[] = [
      {
        id: '1',
        titel: 'Event 1',
        datum: { jahr: 2000 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
      {
        id: '2',
        titel: 'Event 2',
        datum: { jahr: 2090 }, // Far from event 1
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const positionen = berechneEreignisPositionen(ereignisse, kontext, 40, 10, 100);

    // Both events should be at same Y (no overlap)
    expect(positionen.get('1')).toBe(100);
    expect(positionen.get('2')).toBe(100);
  });

  it('should handle span events', () => {
    const ereignisse: Ereignis[] = [
      {
        id: '1',
        titel: 'Span Event',
        datum: { jahr: 2040 },
        endDatum: { jahr: 2060 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
      {
        id: '2',
        titel: 'Point Event',
        datum: { jahr: 2050 }, // Within span
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const positionen = berechneEreignisPositionen(ereignisse, kontext, 40, 10, 100);

    const y1 = positionen.get('1')!;
    const y2 = positionen.get('2')!;

    // Events should be stacked because they overlap
    expect(y2).toBeGreaterThan(y1);
  });

  it('should sort events by date before positioning', () => {
    const ereignisse: Ereignis[] = [
      {
        id: '3',
        titel: 'Event 3',
        datum: { jahr: 2070 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
      {
        id: '1',
        titel: 'Event 1',
        datum: { jahr: 2030 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
      {
        id: '2',
        titel: 'Event 2',
        datum: { jahr: 2050 },
        beschreibung: '',
        kategorieId: 'cat1',
      },
    ];

    const positionen = berechneEreignisPositionen(ereignisse, kontext, 40, 10, 100);

    // All should be positioned (order doesn't matter for distant events)
    expect(positionen.size).toBe(3);
    expect(positionen.has('1')).toBe(true);
    expect(positionen.has('2')).toBe(true);
    expect(positionen.has('3')).toBe(true);
  });
});
