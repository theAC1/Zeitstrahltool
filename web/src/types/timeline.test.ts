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


describe("TimelineEventSchema time precision", () => {
  it("accepts fuzzy with uncertaintyYears", () => {
    const res = TimelineEventSchema.safeParse({
      id: "e-fuzzy",
      title: "Some gradual shift",
      year: 1200,
      timePrecision: "fuzzy",
      uncertaintyYears: 25,
    });
    expect(res.success).toBe(true);
  });

  it("rejects fuzzy without uncertaintyYears", () => {
    const res = TimelineEventSchema.safeParse({
      id: "e-fuzzy2",
      title: "Missing uncertainty",
      year: 1200,
      timePrecision: "fuzzy",
    });
    expect(res.success).toBe(false);
  });

  it("rejects uncertaintyYears when timePrecision is not fuzzy", () => {
    const res = TimelineEventSchema.safeParse({
      id: "e-approx",
      title: "Approx date",
      year: 1200,
      timePrecision: "approx",
      uncertaintyYears: 10,
    });
    expect(res.success).toBe(false);
  });
});
