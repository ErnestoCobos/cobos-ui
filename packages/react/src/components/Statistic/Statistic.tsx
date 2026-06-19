import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export interface StatisticProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'> {
  /** The value to display. Numeric values are formatted; strings are shown as-is. */
  value: number | string;
  /** Title shown above the value. */
  title?: ReactNode;
  /** Content rendered before the value. */
  prefix?: ReactNode;
  /** Content rendered after the value. */
  suffix?: ReactNode;
  /** Number of decimal places to keep (numeric values only). */
  precision?: number;
  /** Thousands group separator. */
  groupSeparator?: string;
  /** Decimal separator. */
  decimalSeparator?: string;
  /** Inline style applied to the value element. */
  valueStyle?: CSSProperties;
  /** Custom formatter. When provided it overrides the built-in number formatting. */
  formatter?: (value: number | string) => ReactNode;
  children?: ReactNode;
}

/**
 * Format a numeric value applying precision and group/decimal separators.
 * Strings are returned untouched so callers can pass pre-formatted content.
 */
function formatNumber(
  value: number | string,
  precision: number | undefined,
  groupSeparator: string,
  decimalSeparator: string,
): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value);
  }

  const fixed = precision !== undefined ? value.toFixed(precision) : String(value);
  const negative = fixed.startsWith('-');
  const unsigned = negative ? fixed.slice(1) : fixed;
  const [intPart, decimalPart] = unsigned.split('.');

  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  const body = decimalPart !== undefined ? `${groupedInt}${decimalSeparator}${decimalPart}` : groupedInt;

  return negative ? `-${body}` : body;
}

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(props, ref) {
  const {
    value,
    title,
    prefix,
    suffix,
    precision,
    groupSeparator = ',',
    decimalSeparator = '.',
    valueStyle,
    formatter,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('statistic');

  const displayValue: ReactNode = formatter
    ? formatter(value)
    : formatNumber(value, precision, groupSeparator, decimalSeparator);

  return (
    <div ref={ref} className={cls(ns.b(), className)} {...rest}>
      {(title !== undefined && title !== null) && <div className={ns.e('head')}>{title}</div>}
      <div className={ns.e('content')}>
        {(prefix !== undefined && prefix !== null) && (
          <span className={ns.e('prefix')}>{prefix}</span>
        )}
        <span className={ns.e('number')} style={valueStyle}>
          {displayValue}
        </span>
        {(suffix !== undefined && suffix !== null) && (
          <span className={ns.e('suffix')}>{suffix}</span>
        )}
      </div>
      {children}
    </div>
  );
});
