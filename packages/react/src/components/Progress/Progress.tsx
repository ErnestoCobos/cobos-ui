import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type ProgressType = 'line' | 'circle' | 'dashboard';

export type ProgressStatus = 'success' | 'warning' | 'exception';

export type ProgressColor = string | string[] | ((percentage: number) => string);

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Completion percentage, 0–100. */
  percentage: number;
  /** Visual variant. */
  type?: ProgressType;
  /** Stroke thickness in pixels. */
  strokeWidth?: number;
  /** Status, which maps to a color. */
  status?: ProgressStatus;
  /** Custom color: a string, a list (picked by threshold), or a function of the percentage. */
  color?: ProgressColor;
  /** Show the progress text. */
  showText?: boolean;
  /** Render the text inside the bar (line type only). */
  textInside?: boolean;
  /** Shape of the stroke end. */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** Circle diameter in pixels (circle / dashboard). */
  width?: number;
  /** Animate as an indeterminate bar (line type only). */
  indeterminate?: boolean;
  /** Animation duration in seconds for the indeterminate animation. */
  duration?: number;
  /** Custom text formatter. */
  format?: (percentage: number) => ReactNode;
  children?: ReactNode;
}

const STATUS_COLORS: Record<ProgressStatus, string> = {
  success: 'var(--ec-color-success)',
  warning: 'var(--ec-color-warning)',
  exception: 'var(--ec-color-danger)',
};

/** Pick a stroke color from the color prop, optionally keyed on the percentage. */
function resolveColor(
  color: ProgressColor | undefined,
  status: ProgressStatus | undefined,
  percentage: number,
): string | undefined {
  if (typeof color === 'function') return color(percentage);
  if (Array.isArray(color)) {
    if (color.length === 0) return undefined;
    // Evenly partition the range across the provided colors.
    const span = 100 / color.length;
    const index = Math.min(color.length - 1, Math.floor(percentage / span));
    return color[index];
  }
  if (typeof color === 'string') return color;
  if (status) return STATUS_COLORS[status];
  return undefined;
}

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(props, ref) {
  const {
    percentage,
    type = 'line',
    strokeWidth,
    status,
    color,
    showText = true,
    textInside = false,
    strokeLinecap = 'round',
    width = 126,
    indeterminate = false,
    duration = 3,
    format,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('progress');
  const value = clamp(percentage);
  const isCircle = type === 'circle' || type === 'dashboard';
  const stroke = strokeWidth ?? (isCircle ? 8 : 6);
  const strokeColor = resolveColor(color, status, value);

  const classes = cls(
    ns.b(),
    ns.m(type),
    status && ns.is(status),
    ns.is('text-inside', textInside),
    ns.is('indeterminate', indeterminate),
    className,
  );

  const text: ReactNode = format ? format(value) : `${value}%`;

  const ariaProps = {
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
  } as const;

  if (!isCircle) {
    const barStyle: CSSProperties = { width: `${value}%` };
    if (strokeColor) barStyle.backgroundColor = strokeColor;
    if (indeterminate) barStyle.animationDuration = `${duration}s`;

    return (
      <div ref={ref} className={classes} {...ariaProps} {...rest}>
        <div className={ns.e('bar')}>
          <div className={ns.e('outer')} style={{ height: stroke }}>
            <div className={ns.e('inner')} style={barStyle}>
              {showText && textInside && (
                <span className={ns.e('innerText')}>{text}</span>
              )}
            </div>
          </div>
        </div>
        {showText && !textInside && <span className={ns.e('text')}>{text}</span>}
        {children}
      </div>
    );
  }

  // --- Circle / dashboard geometry ---
  const radius = 50 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  // Dashboard leaves a 75% gap at the bottom; circle is a full ring.
  const isDashboard = type === 'dashboard';
  const rate = isDashboard ? 0.75 : 1;
  const trackLength = circumference * rate;

  // Rotate so the dashboard opening sits at the bottom and circle starts at top.
  const rotation = isDashboard ? 90 + (1 - rate) * 360 * 0.5 : -90;

  const trackPath = (
    <path
      className={ns.e('circle-track')}
      d={describeArc(radius)}
      fill="none"
      strokeWidth={stroke}
      style={{
        strokeDasharray: `${trackLength}px ${circumference}px`,
        strokeDashoffset: 0,
      }}
    />
  );

  const progressDash = (value / 100) * trackLength;
  const pathStyle: CSSProperties = {
    strokeDasharray: `${progressDash}px ${circumference}px`,
    strokeDashoffset: 0,
    transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease',
  };
  if (strokeColor) pathStyle.stroke = strokeColor;

  return (
    <div ref={ref} className={classes} {...ariaProps} {...rest}>
      <div className={ns.e('circle')} style={{ width, height: width }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <g transform={`rotate(${rotation} 50 50)`}>
            {trackPath}
            <path
              className={ns.e('circle-path')}
              d={describeArc(radius)}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap={strokeLinecap}
              style={pathStyle}
            />
          </g>
        </svg>
        {showText && <span className={ns.e('text')}>{text}</span>}
      </div>
      {children}
    </div>
  );
});

/** A near-closed circular arc centered in the 100x100 viewBox, drawn from the top. */
function describeArc(radius: number): string {
  return [
    `M 50 50`,
    `m 0 -${radius}`,
    `a ${radius} ${radius} 0 1 1 0 ${radius * 2}`,
    `a ${radius} ${radius} 0 1 1 0 -${radius * 2}`,
  ].join(' ');
}
