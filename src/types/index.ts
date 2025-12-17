/**
 * Public API for timeline types and validation
 *
 * Usage:
 * ```typescript
 * import { Timeline, TimelineEvent, parseTimeline } from '@/types';
 * ```
 */

export type {
  // Core types
  Timeline,
  TimelineEvent,
  Epoch,
  Category,
  // Date types
  HistoricalYear,
  HistoricalDate,
  // Configuration
  TimelineSettings,
  TimelineMetadata,
} from './timeline';

export {
  // Zod schemas
  TimelineSchema,
  TimelineEventSchema,
  EpochSchema,
  CategorySchema,
  HistoricalYearSchema,
  HistoricalDateSchema,
  TimelineSettingsSchema,
  TimelineMetadataSchema,
  // Validation helpers
  parseTimeline,
  validateTimeline,
  parseTimelineEvent,
  parseEpoch,
} from './timeline';
