import type { Point } from './scale';

/** Round to 2 decimals for compact, stable path strings. */
function r(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Build an SVG path `d` string for a polyline through `points`.
 * Returns an empty string when there are no points.
 */
export function linePath(points: Point[]): string {
  if (points.length === 0) return '';
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${r(points[i].x)} ${r(points[i].y)}`;
  }
  return d;
}

/**
 * Build a smooth (monotone-ish) cubic Bézier path through `points`. The control
 * points use the Catmull-Rom → Bézier conversion with a tension that avoids the
 * overshoot/clipping you get from a naive spline, so the curve stays inside the
 * plot area.
 */
export function smoothPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length < 3) return linePath(points);

  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

/**
 * Close a line/curve path into a filled area by dropping to `baselineY` under
 * the last point, running back to the first x, and closing. Pass `smooth` to
 * match a curved line.
 */
export function areaPath(points: Point[], baselineY: number, smooth = false): string {
  if (points.length === 0) return '';
  const top = smooth ? smoothPath(points) : linePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${top} L ${r(last.x)} ${r(baselineY)} L ${r(first.x)} ${r(baselineY)} Z`;
}

/**
 * Build an SVG path `d` for an annular (donut) arc, or a pie slice when
 * `innerRadius` is 0. Angles are in radians, measured clockwise from 12 o'clock.
 */
export function arcPath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const fullCircle = Math.abs(endAngle - startAngle) >= Math.PI * 2 - 1e-6;
  // SVG cannot draw a complete circle with a single arc; split into two halves.
  if (fullCircle) {
    const mid = startAngle + Math.PI;
    return (
      arcPath(cx, cy, outerRadius, innerRadius, startAngle, mid) +
      ' ' +
      arcPath(cx, cy, outerRadius, innerRadius, mid, endAngle)
    );
  }

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const oStart = polar(cx, cy, outerRadius, startAngle);
  const oEnd = polar(cx, cy, outerRadius, endAngle);

  if (innerRadius <= 0) {
    // Pie slice: outer arc + two radii back to the center.
    return [
      `M ${r(cx)} ${r(cy)}`,
      `L ${r(oStart.x)} ${r(oStart.y)}`,
      `A ${r(outerRadius)} ${r(outerRadius)} 0 ${largeArc} 1 ${r(oEnd.x)} ${r(oEnd.y)}`,
      'Z',
    ].join(' ');
  }

  const iEnd = polar(cx, cy, innerRadius, endAngle);
  const iStart = polar(cx, cy, innerRadius, startAngle);
  return [
    `M ${r(oStart.x)} ${r(oStart.y)}`,
    `A ${r(outerRadius)} ${r(outerRadius)} 0 ${largeArc} 1 ${r(oEnd.x)} ${r(oEnd.y)}`,
    `L ${r(iEnd.x)} ${r(iEnd.y)}`,
    `A ${r(innerRadius)} ${r(innerRadius)} 0 ${largeArc} 0 ${r(iStart.x)} ${r(iStart.y)}`,
    'Z',
  ].join(' ');
}

/** Convert a polar coordinate (angle clockwise from 12 o'clock) to x/y. */
export function polar(cx: number, cy: number, radius: number, angle: number): Point {
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

/**
 * Build an SVG path `d` for a rectangle with optionally rounded top corners,
 * used for bars. Handles both upward and downward (negative value) bars by
 * normalising the rectangle, and clamps the corner radius to half the smaller
 * side so it never inverts.
 */
export function roundedTopRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  const w = Math.abs(width);
  const h = Math.abs(height);
  const left = Math.min(x, x + width);
  const top = Math.min(y, y + height);
  if (w === 0 || h === 0) return '';

  const rad = Math.max(0, Math.min(radius, w / 2, h));
  if (rad === 0) {
    return `M ${r(left)} ${r(top)} h ${r(w)} v ${r(h)} h ${r(-w)} Z`;
  }
  return [
    `M ${r(left)} ${r(top + h)}`,
    `V ${r(top + rad)}`,
    `Q ${r(left)} ${r(top)} ${r(left + rad)} ${r(top)}`,
    `H ${r(left + w - rad)}`,
    `Q ${r(left + w)} ${r(top)} ${r(left + w)} ${r(top + rad)}`,
    `V ${r(top + h)}`,
    'Z',
  ].join(' ');
}
