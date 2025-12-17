export type TickOptions = {
  step?: number;
  targetTickCount?: number;
};

function niceStep(span: number, targetTickCount: number): number {
  if (span <= 0) return 1;

  const raw = span / Math.max(1, targetTickCount - 1);
  if (!Number.isFinite(raw) || raw <= 0) return 1;

  const exp = Math.floor(Math.log10(raw));
  const base = 10 ** exp;
  const f = raw / base;

  let niceF: number;
  if (f <= 1) niceF = 1;
  else if (f <= 2) niceF = 2;
  else if (f <= 5) niceF = 5;
  else niceF = 10;

  const step = niceF * base;

  // Years are integers in our model, so keep ticks integer.
  if (!Number.isFinite(step) || step < 1) return 1;
  return Math.round(step);
}

export function generateTicks(min: number, max: number, options: TickOptions = {}): number[] {
  const a = Math.min(min, max);
  const b = Math.max(min, max);

  if (a === b) return [a];

  const targetTickCount = options.targetTickCount ?? 6;

  const step = options.step ?? niceStep(b - a, targetTickCount);
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error("step must be a positive finite number");
  }

  const start = Math.floor(a / step) * step;
  const end = Math.ceil(b / step) * step;

  const ticks: number[] = [];
  const maxIterations = 10000;

  for (let t = start, i = 0; t <= end && i < maxIterations; t += step, i += 1) {
    ticks.push(t);
  }

  return ticks;
}
