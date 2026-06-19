import { forwardRef, type ReactNode, type SVGAttributes } from 'react';
import {
  AXIS_COLOR,
  cls,
  colorAt,
  extent,
  formatNumber,
  GRID_COLOR,
  linearScale,
  linePath,
  niceTicks,
  type Point,
  resolvePadding,
  SERIES_PALETTE,
  smoothPath,
  areaPath,
  useNamespace,
  type PartialPadding,
} from '../../utils';
import {
  type CartesianPoint,
  type CartesianSeries,
  EmptyState,
} from '../common';

const VIEW_WIDTH = 600;

export interface LineChartProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'data' | 'height' | 'width'> {
  /** Single-series data. Provide this OR `series`. */
  data?: CartesianPoint[];
  /** Multi-series data. Takes precedence over `data`. */
  series?: CartesianSeries[];
  /** Plot height in pixels (the chart is responsive in width). */
  height?: number;
  /** Series color palette; defaults to the theme token palette. */
  colors?: string[];
  /** Render lines as smooth curves. */
  smooth?: boolean;
  /** Fill a gradient area under each line. */
  area?: boolean;
  /** Show background gridlines. */
  showGrid?: boolean;
  /** Show the x axis labels. */
  showXAxis?: boolean;
  /** Show the y axis ticks/labels. */
  showYAxis?: boolean;
  /** Show a dot at each data point. */
  showDots?: boolean;
  /** Line stroke width in pixels. */
  strokeWidth?: number;
  /** Approximate number of y axis ticks. */
  yTicks?: number;
  /** Format an x value for axis labels. */
  formatX?: (value: number | string, index: number) => string;
  /** Format a y value for axis labels. */
  formatY?: (value: number) => string;
  /** Override the plot-area inset. */
  padding?: PartialPadding;
  /** Accessible summary; a sensible default is generated when omitted. */
  ariaLabel?: string;
  /** Content for the empty state. */
  emptyText?: ReactNode;
  /** Unique id seed for gradient defs (auto-generated when omitted). */
  idPrefix?: string;
}

let gradientCounter = 0;

/** Normalise the `data`/`series` props into a non-empty list of series. */
function toSeries(
  data: CartesianPoint[] | undefined,
  series: CartesianSeries[] | undefined,
): CartesianSeries[] {
  if (series && series.length > 0) return series.filter((s) => s.data.length > 0);
  if (data && data.length > 0) return [{ data }];
  return [];
}

export const LineChart = forwardRef<SVGSVGElement, LineChartProps>(function LineChart(
  props,
  ref,
) {
  const {
    data,
    series,
    height = 240,
    colors = SERIES_PALETTE,
    smooth = false,
    area = false,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showDots = false,
    strokeWidth = 2,
    yTicks = 5,
    formatX,
    formatY = formatNumber,
    padding,
    ariaLabel,
    emptyText,
    idPrefix,
    className,
    ...rest
  } = props;

  const ns = useNamespace('chart-line');
  const allSeries = toSeries(data, series);

  if (allSeries.length === 0) {
    return <EmptyState message={emptyText} height={height} />;
  }

  // The longest series defines the x axis category count.
  const longest = allSeries.reduce(
    (a, b) => (b.data.length > a.data.length ? b : a),
    allSeries[0],
  );
  const categoryCount = longest.data.length;

  const pad = resolvePadding(
    { top: 16, right: 16, bottom: showXAxis ? 28 : 12, left: showYAxis ? 44 : 12 },
    padding,
  );

  const plotLeft = pad.left;
  const plotRight = VIEW_WIDTH - pad.right;
  const plotTop = pad.top;
  const plotBottom = height - pad.bottom;
  const plotWidth = Math.max(1, plotRight - plotLeft);

  const yValues = allSeries.flatMap((s) => s.data.map((d) => d.y));
  const [rawMin, rawMax] = extent(yValues);
  const { min: yMin, max: yMax, ticks } = niceTicks(rawMin, rawMax, yTicks);

  const yScale = linearScale(yMin, yMax, plotBottom, plotTop);
  // X is positioned by category index so multiple series stay aligned.
  const xAt = (index: number): number => {
    if (categoryCount <= 1) return plotLeft + plotWidth / 2;
    return plotLeft + (plotWidth * index) / (categoryCount - 1);
  };

  const baselineY = yScale(Math.max(yMin, 0));
  const gradientId = idPrefix ?? `ec-chart-line-grad-${gradientCounter++}`;

  const label =
    ariaLabel ??
    `Line chart with ${allSeries.length} series and ${categoryCount} points`;

  const xLabels = longest.data.map((d, i) =>
    formatX ? formatX(d.x, i) : String(d.x),
  );

  return (
    <svg
      ref={ref}
      className={cls(ns.b(), 'ec-chart', smooth && ns.m('smooth'), className)}
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      {...rest}
    >
      <title>{label}</title>

      {area && (
        <defs>
          {allSeries.map((s, i) => {
            const color = s.color ?? colorAt(colors, i);
            return (
              <linearGradient
                key={i}
                id={`${gradientId}-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            );
          })}
        </defs>
      )}

      {showGrid && (
        <g className={ns.e('grid')}>
          {ticks.map((t) => {
            const y = yScale(t);
            return (
              <line
                key={t}
                className={ns.e('gridline')}
                x1={plotLeft}
                y1={y}
                x2={plotRight}
                y2={y}
                stroke={GRID_COLOR}
              />
            );
          })}
        </g>
      )}

      {showYAxis && (
        <g className={ns.e('axis')}>
          {ticks.map((t) => (
            <text
              key={t}
              className={ns.e('label')}
              x={plotLeft - 8}
              y={yScale(t)}
              dy="0.32em"
              textAnchor="end"
              fill={AXIS_COLOR}
            >
              {formatY(t)}
            </text>
          ))}
        </g>
      )}

      {showXAxis && (
        <g className={ns.e('axis')}>
          {xLabels.map((text, i) => (
            <text
              key={i}
              className={ns.e('label')}
              x={xAt(i)}
              y={plotBottom + 18}
              textAnchor="middle"
              fill={AXIS_COLOR}
            >
              {text}
            </text>
          ))}
        </g>
      )}

      {allSeries.map((s, i) => {
        const color = s.color ?? colorAt(colors, i);
        const points: Point[] = s.data.map((d, idx) => ({
          x: xAt(idx),
          y: yScale(d.y),
        }));
        const d = smooth ? smoothPath(points) : linePath(points);
        return (
          <g key={i} className={ns.e('series')}>
            {area && (
              <path
                className={ns.e('area')}
                d={areaPath(points, baselineY, smooth)}
                fill={`url(#${gradientId}-${i})`}
                stroke="none"
              />
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
            {showDots &&
              points.map((p, idx) => (
                <circle
                  key={idx}
                  className={ns.e('dot')}
                  cx={p.x}
                  cy={p.y}
                  r={strokeWidth + 1.5}
                  fill={color}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
});
