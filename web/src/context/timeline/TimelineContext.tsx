"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { z } from "zod";
import type { Timeline, TimelineAxis, TimelineEvent } from "../../types/timeline";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

export type TimelineState = {
  timelines: Timeline[];
  activeTimelineId: string;
};

export type TimelineViewState = {
  timeline: Timeline;
  timelines: Timeline[];
  activeTimelineId: string;
};

export type TimelineAction =
  | { type: "state/replace"; payload: TimelineState }
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
  | { type: "event/delete"; payload: { id: string } };

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
    timelines: deduped.length ? deduped : [nextTimeline],
    activeTimelineId: nextTimeline.id,
  };
}

function updateActiveTimeline(state: TimelineState, fn: (t: Timeline) => Timeline): TimelineState {
  const active = getActiveTimeline(state);
  const updated = fn(active);
  return replaceActiveTimeline(state, updated);
}

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case "state/replace":
      return action.payload;

    case "timeline/select":
      if (state.timelines.some(t => t.id === action.payload.id)) {
        return { ...state, activeTimelineId: action.payload.id };
      }
      return state;
    case "timeline/add": {
      const next = action.payload.timeline;

      const exists = state.timelines.some(t => t.id === next.id);
      const nextTimelines = exists ? state.timelines : [...state.timelines, next];

      return {
        timelines: nextTimelines,
        activeTimelineId: next.id,
      };
    }
    case "timeline/createEmpty": {
      const { id, title } = action.payload;
      const empty: Timeline = { id, title, events: [], epochs: [], metadata: { language: "en" } };

      const exists = state.timelines.some(t => t.id === id);
      const nextTimelines = exists ? state.timelines : [...state.timelines, empty];

      return { timelines: nextTimelines, activeTimelineId: id };
    }


    case "timeline/delete": {
      if (state.timelines.length <= 1) return state;

      const id = action.payload.id;
      const remaining = state.timelines.filter(t => t.id !== id);

      if (remaining.length === state.timelines.length) return state;

      const nextActive =
        state.activeTimelineId === id
          ? remaining[0].id
          : (remaining.some(t => t.id === state.activeTimelineId) ? state.activeTimelineId : remaining[0].id);

      return {
        timelines: remaining,
        activeTimelineId: nextActive,
      };
    }


    case "timeline/replace":
      return replaceActiveTimeline(state, action.payload);

    case "timeline/reset":
      return initialState;

    case "timeline/updateTitle":
      return updateActiveTimeline(state, (t) => ({ ...t, title: action.payload.title }));

    case "timeline/updateAxis":
      return updateActiveTimeline(state, (t) => ({ ...t, axis: action.payload.axis }));

    case "event/add":
      return updateActiveTimeline(state, (t) => ({ ...t, events: [...t.events, action.payload] }));

    case "event/update":
      return updateActiveTimeline(state, (t) => ({
        ...t,
        events: t.events.map(ev => (ev.id === action.payload.id ? action.payload : ev)),
      }));

    case "event/delete":
      return updateActiveTimeline(state, (t) => ({
        ...t,
        events: t.events.filter(ev => ev.id !== action.payload.id),
      }));

    default:
      return state;
  }
}

const TimelineStateContext = createContext<TimelineState | undefined>(undefined);
const TimelineDispatchContext = createContext<React.Dispatch<TimelineAction> | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);
  const hasLoadedFromStorage = useRef(false);

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
        schemaVersion: 2 as const,
        timelines: state.timelines,
        activeTimelineId: state.activeTimelineId,
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(payload));
    } catch {
      // Ignorieren
    }
  }, [state]);

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
  };
}

export function useTimelineDispatch(): React.Dispatch<TimelineAction> {
  const ctx = useContext(TimelineDispatchContext);
  if (!ctx) {
    throw new Error("useTimelineDispatch must be used within TimelineProvider");
  }
  return ctx;
}
