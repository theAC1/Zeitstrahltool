'use client';

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react';
import type { Zeitstrahl, Ereignis, Epoche } from '@/types';
import { type RenderKontext } from '@/lib/zeitstrahl';

// ============================================
// State Types
// ============================================

export interface TimelineState {
  /** Current timeline data */
  zeitstrahl: Zeitstrahl | null;
  /** View state */
  ansicht: {
    zoom: number;
    offset: { x: number; y: number };
    sichtbarerZeitraum: { start: number; ende: number };
  };
  /** UI state */
  ui: {
    ausgewaehltesEreignis: string | null;
    ausgewaehlteEpoche: string | null;
    istEditorOffen: boolean;
    aktivesWerkzeug: 'auswaehlen' | 'ereignis' | 'epoche' | 'navigation';
  };
  /** Undo/Redo history */
  history: {
    vergangenheit: Zeitstrahl[];
    zukunft: Zeitstrahl[];
  };
}

// ============================================
// Action Types
// ============================================

type TimelineAction =
  | { type: 'ZEITSTRAHL_LADEN'; payload: Zeitstrahl }
  | { type: 'ZEITSTRAHL_ZURUECKSETZEN' }
  | { type: 'EREIGNIS_HINZUFUEGEN'; payload: Ereignis }
  | { type: 'EREIGNIS_AKTUALISIEREN'; payload: { id: string; daten: Partial<Ereignis> } }
  | { type: 'EREIGNIS_LOESCHEN'; payload: { id: string } }
  | { type: 'EPOCHE_HINZUFUEGEN'; payload: Epoche }
  | { type: 'EPOCHE_AKTUALISIEREN'; payload: { id: string; daten: Partial<Epoche> } }
  | { type: 'EPOCHE_LOESCHEN'; payload: { id: string } }
  | { type: 'ZOOM_AENDERN'; payload: { zoom: number; zentrum?: { x: number; y: number } } }
  | { type: 'OFFSET_AENDERN'; payload: { x: number; y: number } }
  | { type: 'ZEITRAUM_AENDERN'; payload: { start: number; ende: number } }
  | { type: 'EREIGNIS_AUSWAEHLEN'; payload: { id: string | null } }
  | { type: 'EPOCHE_AUSWAEHLEN'; payload: { id: string | null } }
  | { type: 'WERKZEUG_WECHSELN'; payload: TimelineState['ui']['aktivesWerkzeug'] }
  | { type: 'EDITOR_TOGGLE'; payload: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ============================================
// Initial State
// ============================================

const initialState: TimelineState = {
  zeitstrahl: null,
  ansicht: {
    zoom: 1,
    offset: { x: 0, y: 0 },
    sichtbarerZeitraum: { start: 1900, ende: 2000 },
  },
  ui: {
    ausgewaehltesEreignis: null,
    ausgewaehlteEpoche: null,
    istEditorOffen: false,
    aktivesWerkzeug: 'auswaehlen',
  },
  history: {
    vergangenheit: [],
    zukunft: [],
  },
};

// ============================================
// Reducer
// ============================================

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case 'ZEITSTRAHL_LADEN':
      return {
        ...state,
        zeitstrahl: action.payload,
        history: { vergangenheit: [], zukunft: [] },
      };

    case 'ZEITSTRAHL_ZURUECKSETZEN':
      return initialState;

    case 'EREIGNIS_HINZUFUEGEN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          ereignisse: [...state.zeitstrahl.ereignisse, action.payload],
          metadaten: {
            ...state.zeitstrahl.metadaten,
            geaendertAm: new Date().toISOString(),
          },
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'EREIGNIS_AKTUALISIEREN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          ereignisse: state.zeitstrahl.ereignisse.map((e) =>
            e.id === action.payload.id
              ? { ...e, ...action.payload.daten, metadaten: { ...e.metadaten, geaendertAm: new Date().toISOString() } }
              : e
          ),
          metadaten: {
            ...state.zeitstrahl.metadaten,
            geaendertAm: new Date().toISOString(),
          },
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'EREIGNIS_LOESCHEN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          ereignisse: state.zeitstrahl.ereignisse.filter((e) => e.id !== action.payload.id),
          metadaten: {
            ...state.zeitstrahl.metadaten,
            geaendertAm: new Date().toISOString(),
          },
        },
        ui: {
          ...state.ui,
          ausgewaehltesEreignis:
            state.ui.ausgewaehltesEreignis === action.payload.id
              ? null
              : state.ui.ausgewaehltesEreignis,
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'EPOCHE_HINZUFUEGEN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          epochen: [...state.zeitstrahl.epochen, action.payload],
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'EPOCHE_AKTUALISIEREN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          epochen: state.zeitstrahl.epochen.map((e) =>
            e.id === action.payload.id ? { ...e, ...action.payload.daten } : e
          ),
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'EPOCHE_LOESCHEN':
      if (!state.zeitstrahl) return state;
      return {
        ...state,
        zeitstrahl: {
          ...state.zeitstrahl,
          epochen: state.zeitstrahl.epochen.filter((e) => e.id !== action.payload.id),
        },
        ui: {
          ...state.ui,
          ausgewaehlteEpoche:
            state.ui.ausgewaehlteEpoche === action.payload.id
              ? null
              : state.ui.ausgewaehlteEpoche,
        },
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: [],
        },
      };

    case 'ZOOM_AENDERN':
      return {
        ...state,
        ansicht: {
          ...state.ansicht,
          zoom: Math.max(0.1, Math.min(10, action.payload.zoom)),
        },
      };

    case 'OFFSET_AENDERN':
      return {
        ...state,
        ansicht: {
          ...state.ansicht,
          offset: action.payload,
        },
      };

    case 'ZEITRAUM_AENDERN':
      return {
        ...state,
        ansicht: {
          ...state.ansicht,
          sichtbarerZeitraum: action.payload,
        },
      };

    case 'EREIGNIS_AUSWAEHLEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          ausgewaehltesEreignis: action.payload.id,
          ausgewaehlteEpoche: null,
        },
      };

    case 'EPOCHE_AUSWAEHLEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          ausgewaehlteEpoche: action.payload.id,
          ausgewaehltesEreignis: null,
        },
      };

    case 'WERKZEUG_WECHSELN':
      return {
        ...state,
        ui: { ...state.ui, aktivesWerkzeug: action.payload },
      };

    case 'EDITOR_TOGGLE':
      return {
        ...state,
        ui: { ...state.ui, istEditorOffen: action.payload },
      };

    case 'UNDO':
      if (state.history.vergangenheit.length === 0 || !state.zeitstrahl) return state;
      const vorherig = state.history.vergangenheit[state.history.vergangenheit.length - 1];
      return {
        ...state,
        zeitstrahl: vorherig ?? null,
        history: {
          vergangenheit: state.history.vergangenheit.slice(0, -1),
          zukunft: [state.zeitstrahl, ...state.history.zukunft],
        },
      };

    case 'REDO':
      if (state.history.zukunft.length === 0 || !state.zeitstrahl) return state;
      const naechster = state.history.zukunft[0];
      return {
        ...state,
        zeitstrahl: naechster ?? null,
        history: {
          vergangenheit: [...state.history.vergangenheit, state.zeitstrahl],
          zukunft: state.history.zukunft.slice(1),
        },
      };

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface TimelineContextType {
  state: TimelineState;
  dispatch: React.Dispatch<TimelineAction>;
  // Computed values
  renderKontext: RenderKontext | null;
}

const TimelineContext = createContext<TimelineContextType | null>(null);

// ============================================
// Provider
// ============================================

interface TimelineProviderProps {
  children: ReactNode;
  breite?: number;
  hoehe?: number;
}

export function TimelineProvider({
  children,
  breite = 1200,
  hoehe = 600,
}: TimelineProviderProps) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);

  const renderKontext = useMemo<RenderKontext | null>(() => {
    return {
      breite,
      hoehe,
      zeitraum: state.ansicht.sichtbarerZeitraum,
      zoom: state.ansicht.zoom,
      offset: state.ansicht.offset,
    };
  }, [breite, hoehe, state.ansicht]);

  const value = useMemo(
    () => ({ state, dispatch, renderKontext }),
    [state, renderKontext]
  );

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTimeline() {
  const context = useContext(TimelineContext);

  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }

  const { state, dispatch, renderKontext } = context;

  // Memoized action creators
  const actions = useMemo(
    () => ({
      ladeZeitstrahl: (zeitstrahl: Zeitstrahl) =>
        dispatch({ type: 'ZEITSTRAHL_LADEN', payload: zeitstrahl }),

      zuruecksetzen: () => dispatch({ type: 'ZEITSTRAHL_ZURUECKSETZEN' }),

      ereignisHinzufuegen: (ereignis: Ereignis) =>
        dispatch({ type: 'EREIGNIS_HINZUFUEGEN', payload: ereignis }),

      ereignisAktualisieren: (id: string, daten: Partial<Ereignis>) =>
        dispatch({ type: 'EREIGNIS_AKTUALISIEREN', payload: { id, daten } }),

      ereignisLoeschen: (id: string) =>
        dispatch({ type: 'EREIGNIS_LOESCHEN', payload: { id } }),

      epocheHinzufuegen: (epoche: Epoche) =>
        dispatch({ type: 'EPOCHE_HINZUFUEGEN', payload: epoche }),

      epocheAktualisieren: (id: string, daten: Partial<Epoche>) =>
        dispatch({ type: 'EPOCHE_AKTUALISIEREN', payload: { id, daten } }),

      epocheLoeschen: (id: string) =>
        dispatch({ type: 'EPOCHE_LOESCHEN', payload: { id } }),

      setZoom: (zoom: number, zentrum?: { x: number; y: number }) =>
        dispatch({ type: 'ZOOM_AENDERN', payload: { zoom, zentrum } }),

      setOffset: (offset: { x: number; y: number }) =>
        dispatch({ type: 'OFFSET_AENDERN', payload: offset }),

      setZeitraum: (start: number, ende: number) =>
        dispatch({ type: 'ZEITRAUM_AENDERN', payload: { start, ende } }),

      waehleEreignis: (id: string | null) =>
        dispatch({ type: 'EREIGNIS_AUSWAEHLEN', payload: { id } }),

      waehleEpoche: (id: string | null) =>
        dispatch({ type: 'EPOCHE_AUSWAEHLEN', payload: { id } }),

      setWerkzeug: (werkzeug: TimelineState['ui']['aktivesWerkzeug']) =>
        dispatch({ type: 'WERKZEUG_WECHSELN', payload: werkzeug }),

      toggleEditor: (offen: boolean) =>
        dispatch({ type: 'EDITOR_TOGGLE', payload: offen }),

      undo: () => dispatch({ type: 'UNDO' }),

      redo: () => dispatch({ type: 'REDO' }),
    }),
    [dispatch]
  );

  return {
    // State
    zeitstrahl: state.zeitstrahl,
    ereignisse: state.zeitstrahl?.ereignisse ?? [],
    epochen: state.zeitstrahl?.epochen ?? [],
    kategorien: state.zeitstrahl?.kategorien ?? [],

    // View state
    zoom: state.ansicht.zoom,
    offset: state.ansicht.offset,
    sichtbarerZeitraum: state.ansicht.sichtbarerZeitraum,

    // UI state
    ausgewaehltesEreignis: state.ui.ausgewaehltesEreignis,
    ausgewaehlteEpoche: state.ui.ausgewaehlteEpoche,
    aktivesWerkzeug: state.ui.aktivesWerkzeug,
    istEditorOffen: state.ui.istEditorOffen,

    // History
    kannUndo: state.history.vergangenheit.length > 0,
    kannRedo: state.history.zukunft.length > 0,

    // Render context
    renderKontext,

    // Actions
    ...actions,
  };
}
