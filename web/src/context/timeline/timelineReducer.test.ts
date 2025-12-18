import { describe, it, expect } from "vitest";
import type { TimelineEvent } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";
import { initialState, timelineReducer } from "./TimelineContext";

describe("timelineReducer", () => {
  it("updates timeline title", () => {
    const next = timelineReducer(initialState, { type: "timeline/updateTitle", payload: { title: "Neue Timeline" } });
    expect(next.timeline.title).toBe("Neue Timeline");
  });

  it("updates axis", () => {
    const next = timelineReducer(initialState, { type: "timeline/updateAxis", payload: { axis: { tickStep: 100 } } });
    expect(next.timeline.axis?.tickStep).toBe(100);
  });

  it("adds an event", () => {
    const newEvent: TimelineEvent = { id: "e999", title: "Neu", year: 2001 };
    const next = timelineReducer(initialState, { type: "event/add", payload: newEvent });

    expect(next.timeline.events.some(e => e.id === "e999")).toBe(true);
    expect(next.timeline.events.length).toBe(sampleTimeline.events.length + 1);
  });

  it("updates an event", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "Alt", year: 2001 } });
    const updated: TimelineEvent = { id: "e999", title: "Neu", year: 2002 };

    const next = timelineReducer(base, { type: "event/update", payload: updated });
    const found = next.timeline.events.find(e => e.id === "e999");

    expect(found?.title).toBe("Neu");
    expect(found?.year).toBe(2002);
  });

  it("deletes an event", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "X", year: 2001 } });
    const next = timelineReducer(base, { type: "event/delete", payload: { id: "e999" } });

    expect(next.timeline.events.some(e => e.id === "e999")).toBe(false);
  });

  it("resets to initialState", () => {
    const base = timelineReducer(initialState, { type: "event/add", payload: { id: "e999", title: "X", year: 2001 } });
    const next = timelineReducer(base, { type: "timeline/reset" });

    expect(next).toEqual(initialState);
  });
});
