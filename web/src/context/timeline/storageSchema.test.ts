import { describe, it, expect } from "vitest";
import { z } from "zod";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

const StorageV2Schema = z.object({
  schemaVersion: z.literal(2),
  timelines: z.array(TimelineSchema).min(1),
  activeTimelineId: z.string().min(1),
});

describe("LocalStorage wrapper schema (v2)", () => {
  it("accepts schemaVersion=2 with timelines and activeTimelineId", () => {
    const payload = { schemaVersion: 2 as const, timelines: [sampleTimeline], activeTimelineId: sampleTimeline.id };
    const roundtrip = JSON.parse(JSON.stringify(payload)) as unknown;

    const r = StorageV2Schema.safeParse(roundtrip);
    expect(r.success).toBe(true);
  });
});
