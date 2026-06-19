import { forwardRef } from 'react';
import { LineChart, type LineChartProps } from '../LineChart';

export interface AreaChartProps extends LineChartProps {
  /**
   * Fill the area under each line. Defaults to `true` — this is the distinction
   * from {@link LineChart}, which is otherwise identical.
   */
  area?: boolean;
}

/**
 * A thin wrapper over {@link LineChart} with `area` defaulted to `true`.
 * Supports every LineChart prop (smooth, multiple series, custom colors, etc.).
 */
export const AreaChart = forwardRef<SVGSVGElement, AreaChartProps>(function AreaChart(
  { area = true, ...rest },
  ref,
) {
  return <LineChart ref={ref} area={area} {...rest} />;
});
