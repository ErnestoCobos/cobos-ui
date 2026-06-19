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

/**
 * Relative luminance of an sRGB color, per WCAG 2.x.
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(hex: string): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio between two colors, ranging from 1:1 to 21:1.
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Dark ink used as the readable text color on light backgrounds. */
const DARK_INK = '#1a1a1a';

export interface ReadableTextOptions {
  /** Light text candidate (default '#ffffff'). */
  light?: string;
  /** Dark text candidate (default '#1a1a1a'). */
  dark?: string;
  /** Minimum WCAG contrast ratio to satisfy (default 4.5 — AA for normal text). */
  threshold?: number;
}

/**
 * Pick an accessible text color for a given background.
 *
 * Returns white when it clears the contrast threshold against `bg`; otherwise
 * returns the dark ink when it clears the threshold. If neither candidate
 * reaches the threshold (rare with real palettes), returns whichever yields the
 * higher contrast so the result is still the most legible option available.
 */
export function readableText(bg: string, opts: ReadableTextOptions = {}): string {
  const light = opts.light ?? '#ffffff';
  const dark = opts.dark ?? DARK_INK;
  const threshold = opts.threshold ?? 4.5;

  const lightContrast = contrastRatio(light, bg);
  if (lightContrast >= threshold) return light;

  const darkContrast = contrastRatio(dark, bg);
  if (darkContrast >= threshold) return dark;

  return lightContrast >= darkContrast ? light : dark;
}
