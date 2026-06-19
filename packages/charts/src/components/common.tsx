import { type ReactNode } from 'react';
import { useNamespace } from '../utils';

/** A single (x, y) datum for line/area charts. */
export interface CartesianPoint {
  x: number | string;
  /** The numeric value plotted on the y axis. */
  y: number;
}

/** A named, optionally colored series of cartesian points. */
export interface CartesianSeries {
  name?: string;
  /** Override color; defaults to the theme palette entry for this series. */
  color?: string;
  data: CartesianPoint[];
}

/** A single labelled value for bar/donut charts. */
export interface CategoryDatum {
  label: string;
  value: number;
  /** Override color; defaults to the theme palette entry. */
  color?: string;
}

/** A named, optionally colored series of values for grouped/stacked bars. */
export interface CategorySeries {
  name?: string;
  color?: string;
  /** Values aligned with the shared category labels. */
  data: number[];
}

/** Render a centered, theme-aware empty state inside a chart container. */
export function EmptyState({
  message = 'No data',
  height,
}: {
  message?: ReactNode;
  height: number;
}): ReactNode {
  const ns = useNamespace('chart');
  return (
    <div
      className={ns.e('empty')}
      style={{ height }}
      role="img"
      aria-label={typeof message === 'string' ? message : 'No data'}
    >
      {message}
    </div>
  );
}
