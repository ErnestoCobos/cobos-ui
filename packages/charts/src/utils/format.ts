/**
 * Format a number for axis ticks and labels with sensible defaults: thousands
 * grouping, compact suffixes for large magnitudes, and trimmed decimals.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return trim(value / 1_000_000_000) + 'B';
  if (abs >= 1_000_000) return trim(value / 1_000_000) + 'M';
  if (abs >= 10_000) return trim(value / 1_000) + 'k';

  // Group thousands for plain integers / short decimals.
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US');
  }
  return trim(value);
}

/** Round to at most one decimal place and drop a trailing `.0`. */
function trim(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
