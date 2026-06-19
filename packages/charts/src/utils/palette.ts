/**
 * The default theme-aware series palette.
 *
 * Each entry is a CSS custom property reference, so charts automatically follow
 * the active light/dark mode and the brand themes (cobos / enkiflow / getdecant
 * / voltaflow) with no extra configuration — provided the `--ec-*` variables are
 * present on the page (they ship with `@cobos/tokens`, loaded via
 * `@cobos/react/styles.css`).
 */
export const SERIES_PALETTE: string[] = [
  'var(--ec-color-primary)',
  'var(--ec-color-success)',
  'var(--ec-color-warning)',
  'var(--ec-color-danger)',
  'var(--ec-color-info)',
];

/** Default grid / separator color (subtle, theme-aware). */
export const GRID_COLOR = 'var(--ec-border-color-lighter)';

/** Default color for axis lines, ticks and labels (theme-aware). */
export const AXIS_COLOR = 'var(--ec-text-color-secondary)';

/**
 * Resolve a color for the series at `index`, cycling through `colors` when there
 * are more series than palette entries.
 */
export function colorAt(colors: string[], index: number): string {
  if (colors.length === 0) return SERIES_PALETTE[index % SERIES_PALETTE.length];
  return colors[index % colors.length];
}
