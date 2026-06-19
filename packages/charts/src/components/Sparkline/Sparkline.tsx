import { forwardRef, type SVGAttributes } from 'react';
import {
  areaPath,
  cls,
  extent,
  linearScale,
  linePath,
  type Point,
  smoothPath,
  useNamespace,
} from '../../utils';

let gradientCounter = 0;

export interface SparklineProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'data' | 'height' | 'width'> {
  /** The values to plot, left to right. */
  data: number[];
  /** Intrinsic width in pixels (also drives the viewBox). */
  width?: number;
  /** Intrinsic height in pixels. */
  height?: number;
  /** Line/area color; defaults to the theme primary. */
  color?: string;
  /** Fill a subtle gradient area under the line. */
  area?: boolean;
  /** Render the line as a smooth curve. */
  smooth?: boolean;
  /** Line stroke width in pixels. */
  strokeWidth?: number;
  /** Accessible summary; a sensible default is generated when omitted. */
  ariaLabel?: string;
}

/**
 * A tiny inline line/area chart with no axes or grid — for stat cards and
 * dense tables. Theme-aware: the default color follows `--ec-color-primary`.
 */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  props,
  ref,
) {
  const {
    data,
    width = 120,
    height = 32,
    color = 'var(--ec-color-primary)',
    area = false,
    smooth = false,
    strokeWidth = 1.5,
    ariaLabel,
    className,
    ...rest
  } = props;

  const ns = useNamespace('chart-sparkline');

  if (!data || data.length === 0) {
    return (
      <span
        className={ns.b('empty')}
        style={{ display: 'inline-block', width, height }}
        role="img"
        aria-label={ariaLabel ?? 'No data'}
      />
    );
  }

  // Inset by the stroke so the line never clips at the edges.
  const inset = strokeWidth;
  const [min, max] = extent(data);
  const xScale = linearScale(0, Math.max(1, data.length - 1), inset, width - inset);
  const yScale = linearScale(min, max, height - inset, inset);

  const points: Point[] =
    data.length === 1
      ? [{ x: width / 2, y: height / 2 }]
      : data.map((v, i) => ({ x: xScale(i), y: yScale(v) }));

  const d = smooth ? smoothPath(points) : linePath(points);
  const gradientId = `ec-chart-sparkline-grad-${gradientCounter++}`;
  const label = ariaLabel ?? `Sparkline of ${data.length} values`;

  return (
    <svg
      ref={ref}
      className={cls(ns.b(), className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      {...rest}
    >
      <title>{label}</title>
      {area && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            className={ns.e('area')}
            d={areaPath(points, height - inset, smooth)}
            fill={`url(#${gradientId})`}
            stroke="none"
          />
        </>
      )}
      <path
        className={ns.e('path')}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
});
