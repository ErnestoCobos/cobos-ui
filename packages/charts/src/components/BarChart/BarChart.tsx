import { forwardRef, type ReactNode, type SVGAttributes } from 'react';
import {
  AXIS_COLOR,
  cls,
  colorAt,
  formatNumber,
  GRID_COLOR,
  linearScale,
  niceTicks,
  resolvePadding,
  SERIES_PALETTE,
  useNamespace,
  type PartialPadding,
} from '../../utils';
import {
  type CategoryDatum,
  type CategorySeries,
  EmptyState,
} from '../common';

const VIEW_WIDTH = 600;

export interface BarChartProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'data' | 'height' | 'width'> {
  /** Single-series data. Provide this OR `series` + `categories`. */
  data?: CategoryDatum[];
  /** Grouped/stacked series. Requires `categories` for the x labels. */
  series?: CategorySeries[];
  /** Category labels shared by every series (when using `series`). */
  categories?: string[];
  /** Plot height in pixels (responsive width). */
  height?: number;
  /** Series color palette; defaults to the theme token palette. */
  colors?: string[];
  /** Lay bars out horizontally instead of vertically. */
  horizontal?: boolean;
  /** Stack grouped series instead of placing them side by side. */
  stacked?: boolean;
  /** Show background gridlines. */
  showGrid?: boolean;
  /** Show the category axis labels. */
  showXAxis?: boolean;
  /** Show the value axis ticks/labels. */
  showYAxis?: boolean;
  /** Corner radius for the bar's leading edge. */
  radius?: number;
  /** Gap between category groups, as a fraction of the band (0–1). */
  categoryGap?: number;
  /** Gap between bars within a group, as a fraction of the band (0–1). */
  barGap?: number;
  /** Approximate number of value axis ticks. */
  valueTicks?: number;
  /** Format a value for the value axis. */
  formatValue?: (value: number) => string;
  /** Override the plot-area inset. */
  padding?: PartialPadding;
  /** Accessible summary; a sensible default is generated when omitted. */
  ariaLabel?: string;
  /** Content for the empty state. */
  emptyText?: ReactNode;
}

interface Normalized {
  categories: string[];
  series: CategorySeries[];
}

/** Normalise the `data`/`series` props into shared categories + series rows. */
function normalize(
  data: CategoryDatum[] | undefined,
  series: CategorySeries[] | undefined,
  categories: string[] | undefined,
): Normalized {
  if (series && series.length > 0) {
    const labels =
      categories ?? series[0].data.map((_, i) => `#${i + 1}`);
    return { categories: labels, series };
  }
  if (data && data.length > 0) {
    return {
      categories: data.map((d) => d.label),
      // A single series; preserve per-datum color overrides.
      series: [{ data: data.map((d) => d.value) }],
    };
  }
  return { categories: [], series: [] };
}

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(function BarChart(
  props,
  ref,
) {
  const {
    data,
    series,
    categories,
    height = 240,
    colors = SERIES_PALETTE,
    horizontal = false,
    stacked = false,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    radius = 4,
    categoryGap = 0.3,
    barGap = 0.15,
    valueTicks = 5,
    formatValue = formatNumber,
    padding,
    ariaLabel,
    emptyText,
    className,
    ...rest
  } = props;

  const ns = useNamespace('chart-bar');
  const { categories: cats, series: allSeries } = normalize(data, series, categories);

  if (cats.length === 0 || allSeries.length === 0) {
    return <EmptyState message={emptyText} height={height} />;
  }

  // Per-datum color overrides only apply to the single-series form.
  const singleColors =
    !series && data ? data.map((d) => d.color) : undefined;

  const seriesCount = allSeries.length;

  // Value extent: stacked sums per category, otherwise the global max.
  let valueMax = 0;
  let valueMin = 0;
  if (stacked) {
    for (let c = 0; c < cats.length; c++) {
      let pos = 0;
      let neg = 0;
      for (const s of allSeries) {
        const v = s.data[c] ?? 0;
        if (v >= 0) pos += v;
        else neg += v;
      }
      valueMax = Math.max(valueMax, pos);
      valueMin = Math.min(valueMin, neg);
    }
  } else {
    for (const s of allSeries) {
      for (const v of s.data) {
        valueMax = Math.max(valueMax, v);
        valueMin = Math.min(valueMin, v);
      }
    }
  }

  const { min: vMin, max: vMax, ticks } = niceTicks(valueMin, valueMax, valueTicks);

  const pad = resolvePadding(
    horizontal
      ? { top: 12, right: 16, bottom: showXAxis ? 28 : 12, left: showYAxis ? 64 : 12 }
      : { top: 16, right: 16, bottom: showXAxis ? 28 : 12, left: showYAxis ? 44 : 12 },
    padding,
  );

  const plotLeft = pad.left;
  const plotRight = VIEW_WIDTH - pad.right;
  const plotTop = pad.top;
  const plotBottom = height - pad.bottom;
  const plotWidth = Math.max(1, plotRight - plotLeft);
  const plotHeight = Math.max(1, plotBottom - plotTop);

  // The "value scale" maps a data value to a pixel along the value axis.
  const valueScale = horizontal
    ? linearScale(vMin, vMax, plotLeft, plotRight)
    : linearScale(vMin, vMax, plotBottom, plotTop);
  const zero = valueScale(Math.max(vMin, Math.min(vMax, 0)));

  // Band geometry along the category axis.
  const bandSpan = horizontal ? plotHeight : plotWidth;
  const band = bandSpan / cats.length;
  const innerBand = band * (1 - categoryGap);
  const groupCount = stacked ? 1 : seriesCount;
  const gapPx = innerBand * barGap;
  const barThickness =
    groupCount > 1
      ? (innerBand - gapPx * (groupCount - 1)) / groupCount
      : innerBand;

  const bandStart = (c: number): number =>
    (horizontal ? plotTop : plotLeft) + c * band + (band - innerBand) / 2;

  const label =
    ariaLabel ??
    `Bar chart with ${cats.length} categories${
      seriesCount > 1 ? ` and ${seriesCount} series` : ''
    }`;

  const rects: ReactNode[] = [];

  for (let c = 0; c < cats.length; c++) {
    let stackPos = 0; // running positive offset (value units)
    let stackNeg = 0; // running negative offset (value units)

    for (let s = 0; s < seriesCount; s++) {
      const v = allSeries[s].data[c] ?? 0;
      const color =
        singleColors?.[c] ?? allSeries[s].color ?? colorAt(colors, s);

      let x: number;
      let y: number;
      let w: number;
      let h: number;

      if (stacked) {
        const base = v >= 0 ? stackPos : stackNeg;
        const top = base + v;
        if (v >= 0) stackPos = top;
        else stackNeg = top;

        if (horizontal) {
          const x0 = valueScale(base);
          const x1 = valueScale(top);
          x = Math.min(x0, x1);
          w = Math.abs(x1 - x0);
          y = bandStart(c);
          h = barThickness;
        } else {
          const y0 = valueScale(base);
          const y1 = valueScale(top);
          y = Math.min(y0, y1);
          h = Math.abs(y1 - y0);
          x = bandStart(c);
          w = barThickness;
        }
      } else {
        const offset = bandStart(c) + s * (barThickness + gapPx);
        const end = valueScale(v);
        if (horizontal) {
          x = Math.min(zero, end);
          w = Math.abs(end - zero);
          y = offset;
          h = barThickness;
        } else {
          y = Math.min(zero, end);
          h = Math.abs(end - zero);
          x = offset;
          w = barThickness;
        }
      }

      // Rounded leading edge: top for vertical, right for horizontal.
      // We rotate the rounded-top rect into the correct orientation by
      // composing it from the geometric edges; for simplicity, round the
      // value-end corners for positive bars, square otherwise.
      const positive = v >= 0;
      const d = barPath(x, y, w, h, radius, horizontal, positive);

      rects.push(
        <path
          key={`${c}-${s}`}
          className={cls(ns.e('bar'), stacked && ns.m('stacked'))}
          d={d}
          fill={color}
        />,
      );
    }
  }

  return (
    <svg
      ref={ref}
      className={cls(
        ns.b(),
        'ec-chart',
        horizontal && ns.m('horizontal'),
        stacked && ns.m('stacked'),
        className,
      )}
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      {...rest}
    >
      <title>{label}</title>

      {showGrid && (
        <g className={ns.e('grid')}>
          {ticks.map((t) => {
            if (horizontal) {
              const x = valueScale(t);
              return (
                <line
                  key={t}
                  className={ns.e('gridline')}
                  x1={x}
                  y1={plotTop}
                  x2={x}
                  y2={plotBottom}
                  stroke={GRID_COLOR}
                />
              );
            }
            const y = valueScale(t);
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

      {/* Value axis labels */}
      {showYAxis && !horizontal && (
        <g className={ns.e('axis')}>
          {ticks.map((t) => (
            <text
              key={t}
              className={ns.e('label')}
              x={plotLeft - 8}
              y={valueScale(t)}
              dy="0.32em"
              textAnchor="end"
              fill={AXIS_COLOR}
            >
              {formatValue(t)}
            </text>
          ))}
        </g>
      )}
      {showXAxis && horizontal && (
        <g className={ns.e('axis')}>
          {ticks.map((t) => (
            <text
              key={t}
              className={ns.e('label')}
              x={valueScale(t)}
              y={plotBottom + 18}
              textAnchor="middle"
              fill={AXIS_COLOR}
            >
              {formatValue(t)}
            </text>
          ))}
        </g>
      )}

      {/* Category axis labels */}
      {showXAxis && !horizontal && (
        <g className={ns.e('axis')}>
          {cats.map((c, i) => (
            <text
              key={i}
              className={ns.e('label')}
              x={bandStart(i) + innerBand / 2}
              y={plotBottom + 18}
              textAnchor="middle"
              fill={AXIS_COLOR}
            >
              {c}
            </text>
          ))}
        </g>
      )}
      {showYAxis && horizontal && (
        <g className={ns.e('axis')}>
          {cats.map((c, i) => (
            <text
              key={i}
              className={ns.e('label')}
              x={plotLeft - 8}
              y={bandStart(i) + innerBand / 2}
              dy="0.32em"
              textAnchor="end"
              fill={AXIS_COLOR}
            >
              {c}
            </text>
          ))}
        </g>
      )}

      <g className={ns.e('bars')}>{rects}</g>
    </svg>
  );
});

/**
 * Build a bar path rounding only the "leading" edge (top for vertical bars,
 * right for horizontal bars) on the value side. Negative bars round the
 * opposite edge so the rounding always faces away from the baseline.
 */
function barPath(
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  horizontal: boolean,
  positive: boolean,
): string {
  if (w <= 0 || h <= 0) return '';
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r === 0) {
    return `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
  }

  if (!horizontal) {
    // Vertical bar: round the top edge for positive values, bottom for negative.
    if (positive) {
      return [
        `M ${x} ${y + h}`,
        `V ${y + r}`,
        `Q ${x} ${y} ${x + r} ${y}`,
        `H ${x + w - r}`,
        `Q ${x + w} ${y} ${x + w} ${y + r}`,
        `V ${y + h}`,
        'Z',
      ].join(' ');
    }
    return [
      `M ${x} ${y}`,
      `H ${x + w}`,
      `V ${y + h - r}`,
      `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
      `H ${x + r}`,
      `Q ${x} ${y + h} ${x} ${y + h - r}`,
      'Z',
    ].join(' ');
  }

  // Horizontal bar: round the right edge for positive, left for negative.
  if (positive) {
    return [
      `M ${x} ${y}`,
      `H ${x + w - r}`,
      `Q ${x + w} ${y} ${x + w} ${y + r}`,
      `V ${y + h - r}`,
      `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
      `H ${x}`,
      'Z',
    ].join(' ');
  }
  return [
    `M ${x + w} ${y}`,
    `H ${x + r}`,
    `Q ${x} ${y} ${x} ${y + r}`,
    `V ${y + h - r}`,
    `Q ${x} ${y + h} ${x + r} ${y + h}`,
    `H ${x + w}`,
    'Z',
  ].join(' ');
}
