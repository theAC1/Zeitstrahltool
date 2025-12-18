import { z } from "zod";
import { TimelineSchema } from "../../types/timeline";

export const STORAGE_SCHEMA_VERSION = 2;

export const StoredStateSchema = z.object({
  schemaVersion: z.number().int().min(1),
  timelines: z.array(TimelineSchema),
  activeTimelineId: z.string().min(1),
});

export type StoredState = z.infer<typeof StoredStateSchema>;

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

export function migrateStoredState(input: unknown): unknown {
  if (!isRecord(input)) return input;

  const schemaVersion = input.schemaVersion;
  if (typeof schemaVersion !== "number") {
    // v1 -> v2

    const timelines = input.timelines;
    const activeTimelineId = input.activeTimelineId;

    // Already multi timeline shape, just add version
    if (Array.isArray(timelines) && typeof activeTimelineId === "string") {
      return { ...input, schemaVersion: STORAGE_SCHEMA_VERSION };
    }

    // Legacy single timeline shape: { timeline: {...} }
    const legacyTimeline = input.timeline;
    if (isRecord(legacyTimeline)) {
      const id = typeof legacyTimeline.id === "string" && legacyTimeline.id ? legacyTimeline.id : "t1";
      return {
        schemaVersion: STORAGE_SCHEMA_VERSION,
        timelines: [legacyTimeline],
        activeTimelineId: id,
      };
    }

    // Fallback: attach version, validation will decide
    return { ...input, schemaVersion: STORAGE_SCHEMA_VERSION };
  }

  // Current or future: keep as-is
  return input;
}
