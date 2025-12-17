# Timeline Types

TypeScript types and Zod validation schemas for the Zeitstrahl Timeline Tool.

## Usage

```typescript
import { Timeline, TimelineEvent, parseTimeline } from '@/types';
```

## Core Types

### HistoricalDate

Supports BCE/CE years:

```typescript
const ancientDate: HistoricalDate = {
  year: { year: -500, isBCE: true }, // 500 BCE
  month: 3,
  isApproximate: true, // ca. 500 BCE
};

const modernDate: HistoricalDate = {
  year: { year: 1989, isBCE: false },
  month: 11,
  day: 9,
};
```

### TimelineEvent

```typescript
const event: TimelineEvent = {
  id: 'event-1',
  title: 'Fall of the Berlin Wall',
  date: {
    year: { year: 1989, isBCE: false },
    month: 11,
    day: 9,
  },
  description: 'The Berlin Wall falls after 28 years...',
  category: 'politics',
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
```

### Epoch

Time periods/eras:

```typescript
const epoch: Epoch = {
  id: 'roman-empire',
  name: 'Roman Empire',
  startDate: {
    year: { year: -753, isBCE: true },
  },
  endDate: {
    year: { year: 476, isBCE: false },
  },
  color: '#DC2626',
  level: 0,
};
```

## Validation

### Parse with error throwing

```typescript
import { parseTimeline } from '@/types';

try {
  const timeline = parseTimeline(jsonData);
  // timeline is type-safe
} catch (error) {
  // Zod validation error
}
```

### Safe validation

```typescript
import { validateTimeline } from '@/types';

const result = validateTimeline(jsonData);
if (result.success) {
  const timeline = result.data; // type-safe
} else {
  console.error(result.errors); // ZodError
}
```

## Design Decisions

- **IDs as strings**: Flexible, supports UUIDs or custom schemes
- **BCE support**: Negative years + boolean flag for clarity
- **Optional fields**: Minimal required fields, extensive optional fields
- **ISO 8601 dates**: Standard format for timestamps
- **Extensible**: Easy to add new fields without breaking changes

## Schema Validation

All types have corresponding Zod schemas:

- `HistoricalYearSchema`
- `HistoricalDateSchema`
- `TimelineEventSchema`
- `EpochSchema`
- `CategorySchema`
- `TimelineSchema`

## Related Files

- `timeline.ts`: Type definitions and schemas
- `index.ts`: Public API exports
- `../../docs/ARCHITECTURE.md`: Detailed architecture documentation
