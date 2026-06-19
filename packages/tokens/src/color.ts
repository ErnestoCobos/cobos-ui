export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  const to = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/**
 * Mix two colors. `weight` is the fraction (0..1) of `c1`.
 * Mirrors the SCSS `mix(c1, c2, weight)` used by Element Plus to build color ramps.
 */
export function mix(c1: string, c2: string, weight: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex([
    a[0] * weight + b[0] * (1 - weight),
    a[1] * weight + b[1] * (1 - weight),
    a[2] * weight + b[2] * (1 - weight),
  ]);
}
