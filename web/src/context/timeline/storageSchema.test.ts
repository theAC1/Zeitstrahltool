import { describe, it, expect } from "vitest";
import { z } from "zod";
import { TimelineSchema } from "../../types/timeline";
import { sampleTimeline } from "../../data/sampleTimeline";

const StorageSchema = z.object({
  schemaVersion: z.literal(1),
  timeline: TimelineSchema,
});

describe("LocalStorage wrapper schema", () => {
  it("accepts schemaVersion=1 with a valid timeline payload", () => {
    const payload = { schemaVersion: 1 as const, timeline: sampleTimeline };
    const roundtrip = JSON.parse(JSON.stringify(payload)) as unknown;

    const r = StorageSchema.safeParse(roundtrip);
    expect(r.success).toBe(true);
  });
});
