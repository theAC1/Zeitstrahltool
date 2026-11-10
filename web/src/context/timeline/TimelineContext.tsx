"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef, useCallback } from "react";
import { z } from "zod";
import type { Timeline, TimelineAxis, TimelineEvent, Epoch } from "../../types/timeline";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

import { migrateStoredState, STORAGE_SCHEMA_VERSION } from "./storageSchema";

// Maximum number of undo steps to keep
const MAX_HISTORY_SIZE = 50;

export type TimelineState = {
  timelines: Timeline[];
  activeTimelineId: string;
  /** Past states for undo (most recent at end) */
  past: TimelineState[];
  /** Future states for redo (most recent at start) */
  future: TimelineState[];
};

export type TimelineViewState = {
  timeline: Timeline;
  timelines: Timeline[];
  activeTimelineId: string;
  canUndo: boolean;
  canRedo: boolean;
};

export type TimelineAction =
  | { type: "state/replace"; payload: { timelines: Timeline[]; activeTimelineId: string } }
  | { type: "timeline/select"; payload: { id: string } }
  | { type: "timeline/add"; payload: { timeline: Timeline } }
  | { type: "timeline/createEmpty"; payload: { id: string; title: string } }
  | { type: "timeline/delete"; payload: { id: string } }
  | { type: "timeline/replace"; payload: Timeline }
  | { type: "timeline/reset" }
  | { type: "timeline/updateTitle"; payload: { title: string } }
  | { type: "timeline/updateAxis"; payload: { axis?: TimelineAxis } }
  | { type: "event/add"; payload: TimelineEvent }
  | { type: "event/update"; payload: TimelineEvent }
  | { type: "event/delete"; payload: { id: string } }
  | { type: "epoch/add"; payload: Epoch }
  | { type: "epoch/update"; payload: Epoch }
  | { type: "epoch/delete"; payload: { id: string } }
  | { type: "history/undo" }
  | { type: "history/redo" };

const STORAGE_KEY_V1 = "zeitstrahltool.timeline.v1";
const STORAGE_KEY_V2 = "zeitstrahltool.timeline.v2";

const StorageV1Schema = z.object({
  schemaVersion: z.literal(1),
  timeline: TimelineSchema,
});

const StorageV2Schema = z.object({
  schemaVersion: z.literal(2),
  timelines: z.array(TimelineSchema).min(1),
  activeTimelineId: z.string().min(1),
});

export const initialState: TimelineState = {
  timelines: [sampleTimeline],
  activeTimelineId: sampleTimeline.id,
  past: [],
  future: [],
};

function getActiveTimeline(state: TimelineState): Timeline {
  return state.timelines.find(t => t.id === state.activeTimelineId) ?? state.timelines[0];
}

function replaceActiveTimeline(state: TimelineState, nextTimeline: Timeline): TimelineState {
  const idx = state.timelines.findIndex(t => t.id === state.activeTimelineId);
  const useIdx = idx >= 0 ? idx : 0;

  const nextTimelines = state.timelines.slice();
  nextTimelines[useIdx] = nextTimeline;

  // Deduplicate by id (in case id changed)
  const seen = new Set<string>();
  const deduped: Timeline[] = [];
  for (const t of nextTimelines) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    deduped.push(t);
  }

  return {
    ...state,
    timelines: deduped.length ? deduped : [nextTimeline],
    activeTimelineId: nextTimeline.id,
  };
}

function updateActiveTimeline(state: TimelineState, fn: (t: Timeline) => Timeline): TimelineState {
  const active = getActiveTimeline(state);
  const updated = fn(active);
  return replaceActiveTimeline(state, updated);
}

/** 
 * Create a snapshot of the current state (without history) for undo stack 
 */
function createSnapshot(state: TimelineState): TimelineState {
  return {
    timelines: state.timelines,
    activeTimelineId: state.activeTimelineId,
    past: [],
    future: [],
  };
}

/**
 * Push current state to history before a mutation
 */
function pushToHistory(state: TimelineState): TimelineState {
  const snapshot = createSnapshot(state);
  const newPast = [...state.past, snapshot].slice(-MAX_HISTORY_SIZE);
  return {
    ...state,
    past: newPast,
    future: [], // Clear redo stack on new action
  };
}

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    // History actions (no history push)
    case "history/undo": {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      const currentSnapshot = createSnapshot(state);

      return {
        ...previous,
        past: newPast,
        future: [currentSnapshot, ...state.future],
      };
    }

    case "history/redo": {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot = createSnapshot(state);

      return {
        ...next,
        past: [...state.past, currentSnapshot],
        future: newFuture,
      };
    }

    // State replacement (no history - used for initial load)
    case "state/replace":
      return {
        ...state,
        timelines: action.payload.timelines,
        activeTimelineId: action.payload.activeTimelineId,
        past: [],
        future: [],
      };

    // Selection actions (no history push - just view change)
    case "timeline/select":
      if (state.timelines.some(t => t.id === action.payload.id)) {
        return { ...state, activeTimelineId: action.payload.id };
      }
      return state;

    // Mutating actions (push to history first)
    case "timeline/add": {
      const stateWithHistory = pushToHistory(state);
      const next = action.payload.timeline;
      const exists = stateWithHistory.timelines.some(t => t.id === next.id);
      const nextTimelines = exists ? stateWithHistory.timelines : [...stateWithHistory.timelines, next];
      return {
        ...stateWithHistory,
        timelines: nextTimelines,
        activeTimelineId: next.id,
      };
    }

    case "timeline/createEmpty": {
      const stateWithHistory = pushToHistory(state);
      const { id, title } = action.payload;
      const empty: Timeline = { id, title, events: [], epochs: [], metadata: { language: "en" } };
      const exists = stateWithHistory.timelines.some(t => t.id === id);
      const nextTimelines = exists ? stateWithHistory.timelines : [...stateWithHistory.timelines, empty];
      return { ...stateWithHistory, timelines: nextTimelines, activeTimelineId: id };
    }

    case "timeline/delete": {
      if (state.timelines.length <= 1) return state;
      const stateWithHistory = pushToHistory(state);
      const id = action.payload.id;
      const remaining = stateWithHistory.timelines.filter(t => t.id !== id);
      if (remaining.length === stateWithHistory.timelines.length) return state;
      const nextActive =
        stateWithHistory.activeTimelineId === id
          ? remaining[0].id
          : (remaining.some(t => t.id === stateWithHistory.activeTimelineId)
            ? stateWithHistory.activeTimelineId
            : remaining[0].id);
      return {
        ...stateWithHistory,
        timelines: remaining,
        activeTimelineId: nextActive,
      };
    }

    case "timeline/replace": {
      const stateWithHistory = pushToHistory(state);
      return replaceActiveTimeline(stateWithHistory, action.payload);
    }

    case "timeline/reset":
      return { ...initialState, past: [], future: [] };

    case "timeline/updateTitle": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({ ...t, title: action.payload.title }));
    }

    case "timeline/updateAxis": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({ ...t, axis: action.payload.axis }));
    }

    case "event/add": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({ ...t, events: [...t.events, action.payload] }));
    }

    case "event/update": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({
        ...t,
        events: t.events.map(ev => (ev.id === action.payload.id ? action.payload : ev)),
      }));
    }

    case "event/delete": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({
        ...t,
        events: t.events.filter(ev => ev.id !== action.payload.id),
      }));
    }

    // Epoch actions
    case "epoch/add": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({ ...t, epochs: [...t.epochs, action.payload] }));
    }

    case "epoch/update": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({
        ...t,
        epochs: t.epochs.map(ep => (ep.id === action.payload.id ? action.payload : ep)),
      }));
    }

    case "epoch/delete": {
      const stateWithHistory = pushToHistory(state);
      return updateActiveTimeline(stateWithHistory, (t) => ({
        ...t,
        epochs: t.epochs.filter(ep => ep.id !== action.payload.id),
      }));
    }

    default:
      return state;
  }
}

const TimelineStateContext = createContext<TimelineState | undefined>(undefined);
const TimelineDispatchContext = createContext<React.Dispatch<TimelineAction> | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);
  const hasLoadedFromStorage = useRef(false);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z / Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "history/undo" });
      }
      // Ctrl+Y / Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: "history/redo" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      const raw = rawV2 ?? localStorage.getItem(STORAGE_KEY_V1);
      if (!raw) return;

      const parsedJson: unknown = JSON.parse(raw);

      // v2
      const v2 = StorageV2Schema.safeParse(parsedJson);
      if (v2.success) {
        dispatch({
          type: "state/replace",
          payload: {
            timelines: v2.data.timelines,
            activeTimelineId: v2.data.activeTimelineId,
          },
        });
        return;
      }

      // v1 wrapper
      const v1 = StorageV1Schema.safeParse(parsedJson);
      if (v1.success) {
        dispatch({
          type: "state/replace",
          payload: {
            timelines: [v1.data.timeline],
            activeTimelineId: v1.data.timeline.id,
          },
        });
        return;
      }

      // legacy raw timeline
      const legacy = TimelineSchema.safeParse(parsedJson);
      if (legacy.success) {
        dispatch({
          type: "state/replace",
          payload: {
            timelines: [legacy.data],
            activeTimelineId: legacy.data.id,
          },
        });
      }
    } catch {
      // Ignorieren
    } finally {
      hasLoadedFromStorage.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;

    try {
      const payload = {
        schemaVersion: STORAGE_SCHEMA_VERSION as 2,
        timelines: state.timelines,
        activeTimelineId: state.activeTimelineId,
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(payload));
    } catch {
      // Ignorieren
    }
  }, [state.timelines, state.activeTimelineId]);

  return (
    <TimelineStateContext.Provider value={state}>
      <TimelineDispatchContext.Provider value={dispatch}>
        {children}
      </TimelineDispatchContext.Provider>
    </TimelineStateContext.Provider>
  );
}

export function useTimelineState(): TimelineViewState {
  const ctx = useContext(TimelineStateContext);
  if (!ctx) {
    throw new Error("useTimelineState must be used within TimelineProvider");
  }

  return {
    timeline: getActiveTimeline(ctx),
    timelines: ctx.timelines,
    activeTimelineId: ctx.activeTimelineId,
    canUndo: ctx.past.length > 0,
    canRedo: ctx.future.length > 0,
  };
}

export function useTimelineDispatch(): React.Dispatch<TimelineAction> {
  const ctx = useContext(TimelineDispatchContext);
  if (!ctx) {
    throw new Error("useTimelineDispatch must be used within TimelineProvider");
  }
  return ctx;
}

/**
 * Hook for undo/redo actions
 */
export function useTimelineHistory() {
  const dispatch = useTimelineDispatch();
  const { canUndo, canRedo } = useTimelineState();

  const undo = useCallback(() => {
    dispatch({ type: "history/undo" });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: "history/redo" });
  }, [dispatch]);

  return { undo, redo, canUndo, canRedo };
}
