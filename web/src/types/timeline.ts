import { z } from "zod";

export type TimelineMetadata = {
  author?: string;
  language?: "de" | "en";
  version?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TimelineAxis = {
  minYear?: number;
  maxYear?: number;
  tickStep?: number;
  targetTickCount?: number;
};

export type TimelineEvent = {
  id: string;
  title: string;
  description?: string;
  year?: number;
  startYear?: number;
  endYear?: number;
  imageUrl?: string;
  videoUrl?: string;
  sourceUrl?: string;
};

export type Epoch = {
  id: string;
  title: string;
  description?: string;
  startYear: number;
  endYear: number;
  color?: string;
};

export type Timeline = {
  id: string;
  title: string;
  description?: string;
  events: TimelineEvent[];
  epochs: Epoch[];
  axis?: TimelineAxis;
  metadata?: TimelineMetadata;
};

export const TimelineMetadataSchema = z.object({
  author: z.string().min(1).optional(),
  language: z.enum(["de", "en"]).optional(),
  version: z.string().min(1).optional(),
  createdAt: z.string().min(1).optional(),
  updatedAt: z.string().min(1).optional(),
});

export const TimelineAxisSchema = z
  .object({
    minYear: z.number().int().optional(),
    maxYear: z.number().int().optional(),
    tickStep: z.number().int().positive().optional(),
    targetTickCount: z.number().int().min(2).max(50).optional(),
  })
  .superRefine((val, ctx) => {
    if (typeof val.minYear === "number" && typeof val.maxYear === "number") {
      if (val.maxYear < val.minYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "axis.maxYear must be greater than or equal to axis.minYear.",
          path: ["maxYear"],
        });
      }
    }
  });

export const TimelineEventSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    year: z.number().int().optional(),
    startYear: z.number().int().optional(),
    endYear: z.number().int().optional(),
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
  })
  .superRefine((val, ctx) => {
    const hasSingleYear = typeof val.year === "number";
    const hasRange = typeof val.startYear === "number" || typeof val.endYear === "number";

    if (hasSingleYear && hasRange) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use either year OR startYear+endYear, not both.",
        path: ["year"],
      });
      return;
    }

    if (!hasSingleYear && !hasRange) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either year OR startYear+endYear.",
        path: ["year"],
      });
      return;
    }

    if (hasRange) {
      if (typeof val.startYear !== "number" || typeof val.endYear !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Both startYear and endYear must be set when using a range.",
          path: ["startYear"],
        });
        return;
      }
      if (val.endYear < val.startYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "endYear must be greater than or equal to startYear.",
          path: ["endYear"],
        });
      }
    }
  });

export const EpochSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    startYear: z.number().int(),
    endYear: z.number().int(),
    color: z.string().min(1).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.endYear < val.startYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endYear must be greater than or equal to startYear.",
        path: ["endYear"],
      });
    }
  });

export const TimelineSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  events: z.array(TimelineEventSchema),
  epochs: z.array(EpochSchema),
  axis: TimelineAxisSchema.optional(),
  metadata: TimelineMetadataSchema.optional(),
});
