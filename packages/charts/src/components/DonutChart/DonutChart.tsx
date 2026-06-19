import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import {
  arcPath,
  cls,
  colorAt,
  formatNumber,
  SERIES_PALETTE,
  useNamespace,
} from '../../utils';
import { type CategoryDatum, EmptyState } from '../common';

export interface DonutChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Slices to render. */
  data: CategoryDatum[];
  /** Diameter of the chart in pixels. */
  size?: number;
  /** Ring thickness in pixels. Set to the radius (or use {@link PieChart}) for a full pie. */
  thickness?: number;
  /** Slice color palette; defaults to the theme token palette. */
  colors?: string[];
  /** Content rendered in the donut's center (donut mode only). */
  centerLabel?: ReactNode;
  /** Show a legend listing each slice. */
  showLegend?: boolean;
  /** Padding (in radians) between slices. */
  gap?: number;
  /** Format a value for legend display. */
  formatValue?: (value: number) => string;
  /** Accessible summary; a sensible default is generated when omitted. */
  ariaLabel?: string;
  /** Content for the empty state. */
  emptyText?: ReactNode;
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  props,
  ref,
) {
  const {
    data,
    size = 200,
    thickness = 32,
    colors = SERIES_PALETTE,
    centerLabel,
    showLegend = false,
    gap = 0,
    formatValue = formatNumber,
    ariaLabel,
    emptyText,
    className,
    ...rest
  } = props;

  const ns = useNamespace('chart-donut');

  // Only positive values contribute to a slice.
  const slices = data.filter((d) => d.value > 0);
  const total = slices.reduce((sum, d) => sum + d.value, 0);

  if (slices.length === 0 || total <= 0) {
    return <EmptyState message={emptyText} height={size} />;
  }

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2;
  const innerRadius = Math.max(0, outerRadius - thickness);

  const label =
    ariaLabel ??
    `${innerRadius > 0 ? 'Donut' : 'Pie'} chart with ${slices.length} segments`;

  let angle = 0;
  const paths = slices.map((d, i) => {
    const fraction = d.value / total;
    const sweep = fraction * Math.PI * 2;
    // Keep a tiny gap between slices when requested and when there is room.
    const pad = slices.length > 1 ? gap / 2 : 0;
    const start = angle + pad;
    const end = angle + sweep - pad;
    angle += sweep;
    const color = d.color ?? colorAt(colors, i);
    const dPath = arcPath(cx, cy, outerRadius, innerRadius, start, Math.max(start, end));
    return (
      <path
        key={i}
        className={ns.e('slice')}
        d={dPath}
        fill={color}
        aria-label={`${d.label}: ${formatValue(d.value)}`}
      />
    );
  });

  return (
    <div ref={ref} className={cls(ns.b(), 'ec-chart', className)} {...rest}>
      <div className={ns.e('figure')} style={{ width: size, height: size }}>
        <svg
          className={ns.e('svg')}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={label}
        >
          <title>{label}</title>
          {paths}
        </svg>
        {innerRadius > 0 && centerLabel != null && (
          <div className={ns.e('center')}>{centerLabel}</div>
        )}
      </div>

      {showLegend && (
        <ul className={ns.e('legend')}>
          {slices.map((d, i) => (
            <li key={i} className={ns.e('legend-item')}>
              <span
                className={ns.e('swatch')}
                style={{ background: d.color ?? colorAt(colors, i) }}
              />
              <span className={ns.e('legend-label')}>{d.label}</span>
              <span className={ns.e('legend-value')}>{formatValue(d.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export type PieChartProps = Omit<DonutChartProps, 'thickness' | 'centerLabel'>;

/**
 * A {@link DonutChart} with no inner radius — i.e. a full pie. Equivalent to
 * passing a `thickness` equal to the radius.
 */
export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(function PieChart(
  props,
  ref,
) {
  const size = props.size ?? 200;
  return <DonutChart ref={ref} thickness={size / 2} {...props} />;
});
