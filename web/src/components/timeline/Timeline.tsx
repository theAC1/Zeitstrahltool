type TimelineEvent = {
  id: string;
  year: number;
  title: string;
  description?: string;
};

const EVENTS: TimelineEvent[] = [
  { id: "e1", year: -44, title: "Caesar ermordet", description: "Iden des Maerz" },
  { id: "e2", year: 476, title: "Westroemisches Reich", description: "Traditionelles Ende" },
  { id: "e3", year: 1492, title: "Kolumbus", description: "Ankunft in der Karibik" },
  { id: "e4", year: 1789, title: "Franzoesische Revolution" },
  { id: "e5", year: 1989, title: "Mauerfall" },
];

function scaleYear(year: number, minYear: number, maxYear: number, width: number) {
  const span = maxYear - minYear || 1;
  return ((year - minYear) / span) * width;
}

export function Timeline() {
  const minYear = Math.min(...EVENTS.map(e => e.year));
  const maxYear = Math.max(...EVENTS.map(e => e.year));

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

        {EVENTS.map((ev) => {
          const x = paddingX + scaleYear(ev.year, minYear, maxYear, width - paddingX * 2);
          return (
            <g key={ev.id}>
              <circle cx={x} cy={lineY} r="6" fill="currentColor" />
              <line x1={x} y1={lineY} x2={x} y2={lineY - 24} stroke="currentColor" strokeWidth="2" />
              <text x={x} y={lineY - 32} textAnchor="middle" fontSize="12">
                {ev.year}
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
