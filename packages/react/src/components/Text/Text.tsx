import {
  type CSSProperties,
  createElement,
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type TextType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type TextSize = 'large' | 'default' | 'small';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Visual variant. */
  type?: TextType;
  /** Size. */
  size?: TextSize;
  /** Rendered host element. */
  tag?: ElementType;
  /** Truncate to a single line with an ellipsis. */
  truncated?: boolean;
  /** Clamp to a number of lines with an ellipsis. */
  lineClamp?: number | string;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(props, ref) {
  const {
    type,
    size = 'default',
    tag = 'span',
    truncated = false,
    lineClamp,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('text');
  const hasClamp = lineClamp !== undefined && lineClamp !== null;

  const classes = cls(
    ns.b(),
    type && ns.m(type),
    size !== 'default' && ns.m(size),
    ns.is('truncated', truncated && !hasClamp),
    ns.is('line-clamp', hasClamp),
    className,
  );

  const mergedStyle: CSSProperties = hasClamp
    ? { ...style, [ns.cssVar('line-clamp')]: String(lineClamp) }
    : (style as CSSProperties);

  return createElement(
    tag,
    { ref, className: classes, style: mergedStyle, ...rest },
    children,
  );
});
