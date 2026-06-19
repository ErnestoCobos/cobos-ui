import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Displayed value. */
  value?: number | string;
  /** Maximum value; numbers above it render as `{max}+`. */
  max?: number;
  /** Render a small dot instead of the value. */
  isDot?: boolean;
  /** Hide the badge. */
  hidden?: boolean;
  /** Color variant. */
  type?: BadgeType;
  /** Show the badge even when the value is zero. */
  showZero?: boolean;
  /** Custom background color, overriding the type color. */
  color?: string;
  /** Offset of the badge, as `[x, y]` in pixels. */
  offset?: [number, number];
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(props, ref) {
  const {
    value,
    max = 99,
    isDot = false,
    hidden = false,
    type = 'danger',
    showZero = false,
    color,
    offset,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('badge');

  // Numbers over `max` collapse to "{max}+".
  const content: ReactNode = (() => {
    if (isDot) return undefined;
    if (typeof value === 'number' && typeof max === 'number' && value > max) {
      return `${max}+`;
    }
    return value;
  })();

  // Hide when explicitly hidden, or when the value is an empty/zero number and
  // showZero is not set (dots always show unless hidden).
  const isZero = value === 0 || value === '0';
  const isEmpty = value === undefined || value === null || value === '';
  const shouldShow = !hidden && !isEmpty && (isDot || showZero || !isZero);

  const badgeStyle: CSSProperties | undefined = (() => {
    const style: CSSProperties = {};
    if (color) style.backgroundColor = color;
    if (offset) {
      const [x, y] = offset;
      style.transform = `translateY(-50%) translateX(100%) translate(${x}px, ${y}px)`;
    }
    return Object.keys(style).length ? style : undefined;
  })();

  const badge = shouldShow ? (
    <sup
      className={cls(
        ns.e('content'),
        ns.em('content', type),
        ns.is('fixed', children != null),
        ns.is('dot', isDot),
      )}
      style={badgeStyle}
    >
      {content}
    </sup>
  ) : null;

  // Without children the badge renders inline (no positioned wrapper needed).
  if (children == null) {
    return (
      <div ref={ref} className={cls(ns.b(), className)} {...rest}>
        {badge}
      </div>
    );
  }

  return (
    <div ref={ref} className={cls(ns.b(), className)} {...rest}>
      {children}
      {badge}
    </div>
  );
});
