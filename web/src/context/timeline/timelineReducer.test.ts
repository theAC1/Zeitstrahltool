import { describe, it, expect } from "vitest";
import type { Timeline, TimelineEvent } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";
import { initialState, timelineReducer } from "./TimelineContext";
import type { TimelineState } from "./TimelineContext";

function getActiveTimeline(state: TimelineState): Timeline {
  return state.timelines.find(t => t.id === state.activeTimelineId) ?? state.timelines[0];
}

describe("timelineReducer", () => {
  it("updates timeline title on active timeline", () => {
    const next = timelineReducer(initialState, {
      type: "timeline/updateTitle",
      payload: { title: "Neue Timeline" },
    });
    expect(getActiveTimeline(next).title).toBe("Neue Timeline");
  });

  it("updates axis on active timeline", () => {
    const next = timelineReducer(initialState, {
      type: "timeline/updateAxis",
      payload: { axis: { tickStep: 100 } },
    });
    expect(getActiveTimeline(next).axis?.tickStep).toBe(100);
  });

  it("adds a new timeline and makes it active", () => {
    const cloned: Timeline = { ...sampleTimeline, id: "t2", title: "Timeline 2" };
    const next = timelineReducer(initialState, {
      type: "timeline/add",
      payload: { timeline: cloned },
    });

    expect(next.timelines.length).toBe(2);
    expect(next.activeTimelineId).toBe("t2");
  });

  it("clears axis when set to undefined", () => {
    const next = timelineReducer(initialState, {
      type: "timeline/updateAxis",
      payload: { axis: undefined },
    });
    expect(getActiveTimeline(next).axis).toBeUndefined();
  });

  it("adds an event", () => {
    const newEvent: TimelineEvent = { id: "e999", title: "Neu", year: 2001 };
    const next = timelineReducer(initialState, { type: "event/add", payload: newEvent });

    expect(getActiveTimeline(next).events.length).toBe(sampleTimeline.events.length + 1);
    expect(getActiveTimeline(next).events.some(e => e.id === "e999")).toBe(true);
  });

  it("updates an event", () => {
    const base = timelineReducer(initialState, {
      type: "event/add",
      payload: { id: "e999", title: "Alt", year: 2001 },
    });

    const updated: TimelineEvent = { id: "e999", title: "Neu", year: 2002 };

    const next = timelineReducer(base, { type: "event/update", payload: updated });
    const found = getActiveTimeline(next).events.find(e => e.id === "e999");

    expect(found?.title).toBe("Neu");
    expect(found?.year).toBe(2002);
  });

  it("deletes an event", () => {
    const base = timelineReducer(initialState, {
      type: "event/add",
      payload: { id: "e999", title: "X", year: 2001 },
    });

    const next = timelineReducer(base, { type: "event/delete", payload: { id: "e999" } });
    expect(getActiveTimeline(next).events.some(e => e.id === "e999")).toBe(false);
  });

  it("resets to initialState", () => {
    const base = timelineReducer(initialState, {
      type: "event/add",
      payload: { id: "e999", title: "X", year: 2001 },
    });

    const next = timelineReducer(base, { type: "timeline/reset" });
    expect(next).toEqual(initialState);
  });
});
