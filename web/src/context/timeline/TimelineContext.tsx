"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { Timeline, TimelineEvent } from "../../types/timeline";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

export type TimelineState = {
  timeline: Timeline;
};

export type TimelineAction =
  | { type: "timeline/replace"; payload: Timeline }
  | { type: "timeline/reset" }
  | { type: "timeline/updateTitle"; payload: { title: string } }
  | { type: "event/add"; payload: TimelineEvent }
  | { type: "event/update"; payload: TimelineEvent }
  | { type: "event/delete"; payload: { id: string } };

const STORAGE_KEY = "zeitstrahltool.timeline.v1";

const initialState: TimelineState = {
  timeline: sampleTimeline,
};

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
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
      const result = TimelineSchema.safeParse(parsedJson);

      if (result.success) {
        dispatch({ type: "timeline/replace", payload: result.data });
      }
    } catch {
      // Ignorieren, Default bleibt aktiv
    } finally {
      hasLoadedFromStorage.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.timeline));
    } catch {
      // Ignorieren (zB Private Mode, Quota, etc.)
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
