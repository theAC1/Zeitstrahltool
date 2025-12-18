"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { z } from "zod";
import type { Timeline, TimelineAxis, TimelineEvent } from "../../types/timeline";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

export type TimelineState = {
  timeline: Timeline;
};

export type TimelineAction =
  | { type: "timeline/replace"; payload: Timeline }
  | { type: "timeline/reset" }
  | { type: "timeline/updateTitle"; payload: { title: string } }
  | { type: "timeline/updateAxis"; payload: { axis?: TimelineAxis } }
  | { type: "event/add"; payload: TimelineEvent }
  | { type: "event/update"; payload: TimelineEvent }
  | { type: "event/delete"; payload: { id: string } };

const STORAGE_KEY = "zeitstrahltool.timeline.v1";

const StorageSchema = z.object({
  schemaVersion: z.literal(1),
  timeline: TimelineSchema,
});
type StorageValue = z.infer<typeof StorageSchema>;

export const initialState: TimelineState = {
  timeline: sampleTimeline,
};

export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case "timeline/replace":
      return { ...state, timeline: action.payload };

    case "timeline/reset":
      return initialState;

    case "timeline/updateTitle":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          title: action.payload.title,
        },
      };

    case "timeline/updateAxis":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          axis: action.payload.axis,
        },
      };

    case "event/add":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          events: [...state.timeline.events, action.payload],
        },
      };

    case "event/update":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          events: state.timeline.events.map(ev => (ev.id === action.payload.id ? action.payload : ev)),
        },
      };

    case "event/delete":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          events: state.timeline.events.filter(ev => ev.id !== action.payload.id),
        },
      };

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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        hasLoadedFromStorage.current = true;
        return;
      }

      const parsedJson: unknown = JSON.parse(raw);

      const wrapped = StorageSchema.safeParse(parsedJson);
      if (wrapped.success) {
        dispatch({ type: "timeline/replace", payload: wrapped.data.timeline });
        return;
      }

      const legacy = TimelineSchema.safeParse(parsedJson);
      if (legacy.success) {
        dispatch({ type: "timeline/replace", payload: legacy.data });
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
      const payload: StorageValue = { schemaVersion: 1, timeline: state.timeline };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignorieren
    }
  }, [state.timeline]);

  return (
    <TimelineStateContext.Provider value={state}>
      <TimelineDispatchContext.Provider value={dispatch}>
        {children}
      </TimelineDispatchContext.Provider>
    </TimelineStateContext.Provider>
  );
}

export function useTimelineState(): TimelineState {
  const ctx = useContext(TimelineStateContext);
  if (!ctx) {
    throw new Error("useTimelineState must be used within TimelineProvider");
  }
  return ctx;
}

export function useTimelineDispatch(): React.Dispatch<TimelineAction> {
  const ctx = useContext(TimelineDispatchContext);
  if (!ctx) {
    throw new Error("useTimelineDispatch must be used within TimelineProvider");
  }
  return ctx;
}
