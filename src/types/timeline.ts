/**
 * Core types for the Zeitstrahl Timeline Tool
 * Based on ARCHITECTURE.md:254-364
 */

import { z } from 'zod';

// ============================================================================
// Historical Date Types
// ============================================================================

/**
 * Represents a historical year with BCE/CE support
 */
export interface HistoricalYear {
  /** Year number (positive for CE, negative for BCE) */
  year: number;
  /** Whether this is a BCE year */
  isBCE: boolean;
}

/**
 * A date that supports historical periods including BCE
 */
export interface HistoricalDate {
  /** Year information */
  year: HistoricalYear;
  /** Optional month (1-12) */
  month?: number;
  /** Optional day (1-31) */
  day?: number;
  /** Marks approximate dates (e.g., "ca. 500 BCE") */
  isApproximate?: boolean;
}

// ============================================================================
// Timeline Event
// ============================================================================

/**
 * A single event on the timeline
 */
export interface TimelineEvent {
  /** Unique identifier */
  id: string;
  /** Event title */
  title: string;
  /** Event date */
  date: HistoricalDate;
  /** Optional end date for time spans */
  endDate?: HistoricalDate;
  /** Event description (supports Markdown) */
  description?: string;
  /** Category ID */
  category?: string;
  /** Event color (hex or CSS color) */
  color?: string;
  /** Optional image */
  image?: {
    url: string;
    alt: string;
  };
  /** Related links */
  links?: Array<{
    title: string;
    url: string;
  }>;
  /** Display position (for custom layouts) */
  position?: {
    x: number;
    y: number;
  };
  /** Event metadata */
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

// ============================================================================
// Epoch (Time Period)
// ============================================================================

/**
 * An epoch representing a time period/era on the timeline
 */
export interface Epoch {
  /** Unique identifier */
  id: string;
  /** Epoch name */
  name: string;
  /** Start date */
  startDate: HistoricalDate;
  /** End date */
  endDate: HistoricalDate;
  /** Display color */
  color: string;
  /** Optional description */
  description?: string;
  /** Layer/level for stacked epochs */
  level: number;
}

// ============================================================================
// Category
// ============================================================================

/**
 * Category for organizing events
 */
export interface Category {
  /** Unique identifier */
  id: string;
  /** Category name */
  name: string;
  /** Category color */
  color: string;
  /** Optional icon identifier */
  icon?: string;
}

// ============================================================================
// Timeline Settings
// ============================================================================

/**
 * Display and behavior settings for the timeline
 */
export interface TimelineSettings {
  /** Visible time range */
  timeRange: {
    start: HistoricalDate;
    end: HistoricalDate;
  };
  /** Scale type */
  scaling: 'linear' | 'logarithmic' | 'adaptive';
  /** Timeline orientation */
  orientation: 'horizontal' | 'vertical';
  /** Language */
  language: 'de' | 'en';
  /** Theme */
  theme: 'light' | 'dark' | 'system';
  /** Export settings */
  export?: {
    width: number;
    height: number;
    backgroundColor: string;
  };
}

// ============================================================================
// Metadata
// ============================================================================

/**
 * Timeline metadata
 */
export interface TimelineMetadata {
  /** Schema version */
  version: string;
  /** Creation timestamp (ISO 8601) */
  createdAt: string;
  /** Last update timestamp (ISO 8601) */
  updatedAt: string;
  /** Optional author */
  author?: string;
  /** Optional source */
  source?: string;
  /** Optional license */
  license?: string;
}

// ============================================================================
// Complete Timeline
// ============================================================================

/**
 * Complete timeline with all events, epochs, and settings
 */
export interface Timeline {
  /** Unique identifier */
  id: string;
  /** Timeline title */
  title: string;
  /** Optional description */
  description?: string;
  /** All events */
  events: TimelineEvent[];
  /** All epochs */
  epochs: Epoch[];
  /** Event categories */
  categories: Category[];
  /** Display settings */
  settings: TimelineSettings;
  /** Timeline metadata */
  metadata: TimelineMetadata;
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

/**
 * Schema for HistoricalYear
 */
export const HistoricalYearSchema = z.object({
  year: z.number().int(),
  isBCE: z.boolean(),
});

/**
 * Schema for HistoricalDate
 */
export const HistoricalDateSchema = z.object({
  year: HistoricalYearSchema,
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  isApproximate: z.boolean().optional(),
});

/**
 * Schema for TimelineEvent
 */
export const TimelineEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  date: HistoricalDateSchema,
  endDate: HistoricalDateSchema.optional(),
  description: z.string().max(5000).optional(),
  category: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  image: z
    .object({
      url: z.string().url(),
      alt: z.string().max(200),
    })
    .optional(),
  links: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        url: z.string().url(),
      })
    )
    .optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

/**
 * Schema for Epoch
 */
export const EpochSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  startDate: HistoricalDateSchema,
  endDate: HistoricalDateSchema,
  color: z.string().max(50),
  description: z.string().max(1000).optional(),
  level: z.number().int().min(0),
});

/**
 * Schema for Category
 */
export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  color: z.string().max(50),
  icon: z.string().max(50).optional(),
});

/**
 * Schema for TimelineSettings
 */
export const TimelineSettingsSchema = z.object({
  timeRange: z.object({
    start: HistoricalDateSchema,
    end: HistoricalDateSchema,
  }),
  scaling: z.enum(['linear', 'logarithmic', 'adaptive']),
  orientation: z.enum(['horizontal', 'vertical']),
  language: z.enum(['de', 'en']),
  theme: z.enum(['light', 'dark', 'system']),
  export: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      backgroundColor: z.string(),
    })
    .optional(),
});

/**
 * Schema for TimelineMetadata
 */
export const TimelineMetadataSchema = z.object({
  version: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.string().max(200).optional(),
  source: z.string().max(500).optional(),
  license: z.string().max(100).optional(),
});

/**
 * Schema for complete Timeline
 */
export const TimelineSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  events: z.array(TimelineEventSchema),
  epochs: z.array(EpochSchema),
  categories: z.array(CategorySchema),
  settings: TimelineSettingsSchema,
  metadata: TimelineMetadataSchema,
});

// ============================================================================
// Type Inference Helpers
// ============================================================================

/**
 * Validates and parses timeline data
 */
export function parseTimeline(data: unknown): Timeline {
  return TimelineSchema.parse(data);
}

/**
 * Validates timeline data without throwing
 */
export function validateTimeline(data: unknown): {
  success: boolean;
  data?: Timeline;
  errors?: z.ZodError;
} {
  const result = TimelineSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validates a single event
 */
export function parseTimelineEvent(data: unknown): TimelineEvent {
  return TimelineEventSchema.parse(data);
}

/**
 * Validates an epoch
 */
export function parseEpoch(data: unknown): Epoch {
  return EpochSchema.parse(data);
}
