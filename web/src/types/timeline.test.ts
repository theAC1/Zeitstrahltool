import { describe, it, expect } from "vitest";
import { TimelineEventSchema, TimelineSchema } from "./timeline";
import { sampleTimeline } from "../data/sampleTimeline";

describe("TimelineEventSchema refinements", () => {
  it("accepts single year", () => {
    const r = TimelineEventSchema.safeParse({ id: "e1", title: "X", year: 2000 });
    expect(r.success).toBe(true);
  });

  it("accepts range startYear+endYear", () => {
    const r = TimelineEventSchema.safeParse({ id: "e1", title: "X", startYear: 100, endYear: 200 });
    expect(r.success).toBe(true);
  });

  it("rejects missing year and missing range", () => {
    const r = TimelineEventSchema.safeParse({ id: "e1", title: "X" });
    expect(r.success).toBe(false);
  });

  it("rejects year together with a range", () => {
    const r = TimelineEventSchema.safeParse({ id: "e1", title: "X", year: 2000, startYear: 100, endYear: 200 });
    expect(r.success).toBe(false);
  });

  it("rejects invalid range where endYear < startYear", () => {
    const r = TimelineEventSchema.safeParse({ id: "e1", title: "X", startYear: 200, endYear: 100 });
    expect(r.success).toBe(false);
  });
});

describe("TimelineSchema", () => {
  it("accepts sampleTimeline", () => {
    const r = TimelineSchema.safeParse(sampleTimeline);
    expect(r.success).toBe(true);
  });
});
