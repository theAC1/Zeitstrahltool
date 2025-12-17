import type { Timeline as TimelineType, TimelineEvent } from "../../types/timeline";

function scaleYear(year: number, minYear: number, maxYear: number, width: number) {
  const span = maxYear - minYear || 1;
  return ((year - minYear) / span) * width;
}

function eventAnchorYear(ev: TimelineEvent): number {
  if (typeof ev.year === "number") return ev.year;
  if (typeof ev.startYear === "number") return ev.startYear;
  if (typeof ev.endYear === "number") return ev.endYear;
  return 0;
}

export function Timeline({ timeline }: { timeline: TimelineType }) {
  const eventsSorted = [...timeline.events].sort((a, b) => {
    const ay = eventAnchorYear(a);
    const by = eventAnchorYear(b);
    if (ay !== by) return ay - by;
    return a.id.localeCompare(b.id);
  });

  const years = eventsSorted.flatMap((e) => {
    if (typeof e.year === "number") return [e.year];
    if (typeof e.startYear === "number" && typeof e.endYear === "number") return [e.startYear, e.endYear];
    return [];
  });

  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 1;

  const width = 1000;
  const height = 180;
  const paddingX = 40;
  const lineY = 80;

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-white p-4">
      <div className="mb-2 text-sm text-gray-600">
        Statischer MVP Slice (SVG). Jahre: {minYear} bis {maxYear}
      </div>

      <svg width={width} height={height} role="img" aria-label="Zeitstrahl">
        <line
          x1={paddingX}
          y1={lineY}
          x2={width - paddingX}
          y2={lineY}
          stroke="currentColor"
          strokeWidth="2"
        />

        {eventsSorted.map((ev) => {
          const labelYear = eventAnchorYear(ev);
          const x = paddingX + scaleYear(labelYear, minYear, maxYear, width - paddingX * 2);

          return (
            <g key={ev.id}>
              <circle cx={x} cy={lineY} r="6" fill="currentColor" />
              <line x1={x} y1={lineY} x2={x} y2={lineY - 24} stroke="currentColor" strokeWidth="2" />
              <text x={x} y={lineY - 32} textAnchor="middle" fontSize="12">
                {labelYear}
              </text>
              <text x={x} y={lineY + 28} textAnchor="middle" fontSize="12">
                {ev.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
