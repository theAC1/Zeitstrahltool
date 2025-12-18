import { describe, it, expect } from "vitest";
import type { TimelineEvent } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";
import { initialState, timelineReducer } from "./TimelineContext";

function activeTitle(state: { timelines: any[]; activeTimelineId: string }) {
  const active = state.timelines.find(t => t.id === state.activeTimelineId) ?? state.timelines[0];
  return active.title as string;
}

function activeAxisTickStep(state: { timelines: any[]; activeTimelineId: string }) {
  const active = state.timelines.find(t => t.id === state.activeTimelineId) ?? state.timelines[0];
  return active.axis?.tickStep as number | undefined;
}

function activeEventsLen(state: { timelines: any[]; activeTimelineId: string }) {
  const active = state.timelines.find(t => t.id === state.activeTimelineId) ?? state.timelines[0];
  return (active.events as any[]).length;
}

describe("timelineReducer", () => {
  it("updates timeline title on active timeline", () => {
    const next = timelineReducer(initialState, { type: "timeline/updateTitle", payload: { title: "Neue Timeline" } });
    expect(activeTitle(next)).toBe("Neue Timeline");
  });

  it("updates axis on active timeline", () => {
    const next = timelineReducer(initialState, { type: "timeline/updateAxis", payload: { axis: { tickStep: 100 } } });
    expect(activeAxisTickStep(next)).toBe(100);
  });

  it("clears axis when set to undefined", () => {
    const next = timelineReducer(initialState, { type: "timeline/updateAxis", payload: { axis: undefined } });
    expect(activeAxisTickStep(next)).toBeUndefined();
  });

  it("adds an event", () => {
    const newEvent: TimelineEvent = { id: "e999", title: "Neu", year: 2001 };
    const next = timelineReducer(initialState, { type: "event/add", payload: newEvent });

    expect(activeEventsLen(next)).toBe(sampleTimeline.events.length + 1);
  });

  it("updates an event", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "Alt", year: 2001 } });
    const updated: TimelineEvent = { id: "e999", title: "Neu", year: 2002 };

    const next = timelineReducer(base, { type: "event/update", payload: updated });
    const active = next.timelines.find(t => t.id === next.activeTimelineId) ?? next.timelines[0];
    const found = active.events.find((e: any) => e.id === "e999");

    expect(found?.title).toBe("Neu");
    expect(found?.year).toBe(2002);
  });

  it("deletes an event", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "X", year: 2001 } });
    const next = timelineReducer(base, { type: "event/delete", payload: { id: "e999" } });

    const active = next.timelines.find(t => t.id === next.activeTimelineId) ?? next.timelines[0];
    expect(active.events.some((e: any) => e.id === "e999")).toBe(false);
  });

  it("resets to initialState", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "X", year: 2001 } });
    const next = timelineReducer(base, { type: "timeline/reset" });

    expect(next).toEqual(initialState);
  });
});
