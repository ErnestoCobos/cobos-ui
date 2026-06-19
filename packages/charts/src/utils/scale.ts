/** A point in SVG user-space coordinates. */
export interface Point {
  x: number;
  y: number;
}

/** Inner padding (the plot area inset) for a chart, in pixels. */
export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type PartialPadding = Partial<Padding>;

/** Merge a partial padding onto a default, keeping every side defined. */
export function resolvePadding(base: Padding, override?: PartialPadding): Padding {
  return {
    top: override?.top ?? base.top,
    right: override?.right ?? base.right,
    bottom: override?.bottom ?? base.bottom,
    left: override?.left ?? base.left,
  };
}

/**
 * Build a linear scale mapping a numeric domain `[min, max]` onto a pixel range
 * `[from, to]`. A zero-width domain is nudged so the function never divides by
 * zero (the value maps to the middle of the range).
 */
export function linearScale(
  min: number,
  max: number,
  from: number,
  to: number,
): (value: number) => number {
  const span = max - min;
  if (span === 0) {
    const mid = (from + to) / 2;
    return () => mid;
  }
  const ratio = (to - from) / span;
  return (value: number) => from + (value - min) * ratio;
}

/**
 * Compute a "nice" rounded upper bound and a list of evenly spaced tick values
 * for an axis covering `[min, max]`. Always includes 0 when the data is
 * non-negative so bar/area baselines sit on a real gridline.
 */
export function niceTicks(
  min: number,
  max: number,
  count = 5,
): { min: number; max: number; ticks: number[] } {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    // Degenerate domain: build a small symmetric range around the value.
    const base = Number.isFinite(max) ? max : 0;
    const lo = base === 0 ? 0 : Math.min(0, base);
    const hi = base === 0 ? 1 : Math.max(0, base);
    return buildTicks(lo, hi, count);
  }
  const lo = Math.min(min, 0) === 0 && min > 0 ? 0 : min;
  return buildTicks(lo, max, count);
}

function buildTicks(min: number, max: number, count: number) {
  const span = max - min || 1;
  const rawStep = span / Math.max(1, count);
  const step = niceStep(rawStep);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  // Guard the loop against floating-point drift.
  for (let v = niceMin; v <= niceMax + step / 2; v += step) {
    ticks.push(roundTo(v, step));
  }
  return { min: niceMin, max: niceMax, ticks };
}

/** Round a step up to the nearest 1, 2, 5 × 10^n. */
function niceStep(raw: number): number {
  const exponent = Math.floor(Math.log10(raw));
  const magnitude = Math.pow(10, exponent);
  const fraction = raw / magnitude;
  let nice: number;
  if (fraction <= 1) nice = 1;
  else if (fraction <= 2) nice = 2;
  else if (fraction <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

/** Round a value to the precision implied by `step` to kill FP noise. */
function roundTo(value: number, step: number): number {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  const factor = Math.pow(10, Math.min(10, decimals));
  return Math.round(value * factor) / factor;
}

/** Extract the numeric extent `[min, max]` of a list of values. */
export function extent(values: number[]): [number, number] {
  if (values.length === 0) return [0, 1];
  let min = values[0];
  let max = values[0];
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}
