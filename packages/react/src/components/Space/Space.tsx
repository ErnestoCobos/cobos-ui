import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export type SpaceDirection = 'horizontal' | 'vertical';

export type SpaceSize = 'small' | 'default' | 'large' | number;

export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction. */
  direction?: SpaceDirection;
  /** Spacing between items. Named sizes map to small=8, default=12, large=16. */
  size?: SpaceSize;
  /** Cross-axis alignment of items. Defaults to `center`. */
  alignment?: SpaceAlign;
  /**
   * Cross-axis alignment of items.
   * @deprecated Use `alignment` to match the Element Plus API. Kept as an alias.
   */
  align?: SpaceAlign;
  /** Whether items wrap onto multiple lines. */
  wrap?: boolean;
  /** Whether items stretch to fill the available space. */
  fill?: boolean;
  children?: ReactNode;
}

const sizeMap: Record<Exclude<SpaceSize, number>, number> = {
  small: 8,
  default: 12,
  large: 16,
};

const alignMap: Record<SpaceAlign, CSSProperties['alignItems']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
};

export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(props, ref) {
  const {
    direction = 'horizontal',
    size = 'small',
    alignment,
    align,
    wrap = false,
    fill = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('space');

  const gap = typeof size === 'number' ? size : sizeMap[size];

  // `alignment` is the canonical prop; `align` is kept as a deprecated alias.
  const resolvedAlign: SpaceAlign = alignment ?? align ?? 'center';

  const classes = cls(
    ns.b(),
    ns.m(direction),
    ns.is('wrap', wrap),
    ns.is('fill', fill),
    className,
  );

  const spaceStyle: CSSProperties = {
    gap,
    alignItems: alignMap[resolvedAlign],
  };

  return (
    <div ref={ref} className={classes} style={{ ...spaceStyle, ...style }} {...rest}>
      {children}
    </div>
  );
});
