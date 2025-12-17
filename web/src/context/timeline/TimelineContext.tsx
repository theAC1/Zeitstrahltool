"use client";

import React, { createContext, useContext, useReducer } from "react";
import type { Timeline } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

export type TimelineState = {
  timeline: Timeline;
};

export type TimelineAction =
  | { type: "timeline/replace"; payload: Timeline }
  | { type: "timeline/reset" };

const initialState: TimelineState = {
  timeline: sampleTimeline,
};

function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
  switch (action.type) {
    case "timeline/replace":
      return { ...state, timeline: action.payload };
    case "timeline/reset":
      return initialState;
    default: {
      return state;
    }
  }
}

const TimelineStateContext = createContext<TimelineState | undefined>(undefined);
const TimelineDispatchContext = createContext<React.Dispatch<TimelineAction> | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timelineReducer, initialState);

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
