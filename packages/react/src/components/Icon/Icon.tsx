import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /** Icon size in px (number) or any CSS length. */
  size?: number | string;
  /** Icon color (defaults to currentColor). */
  color?: string;
  /** Continuously rotate the icon. */
  spin?: boolean;
  children?: ReactNode;
}

export const Icon = forwardRef<HTMLElement, IconProps>(function Icon(
  { size, color, spin = false, className, style, children, onClick, onKeyDown, role, tabIndex, ...rest },
  ref,
) {
  const ns = useNamespace('icon');
  const mergedStyle: CSSProperties = {
    fontSize: size === undefined ? undefined : typeof size === 'number' ? `${size}px` : size,
    color,
    ...style,
  };

  const ariaLabel = rest['aria-label'];
  const ariaLabelledBy = rest['aria-labelledby'];

  // The Icon primitive is also used as an interactive control (e.g. Input's
  // clear/password toggle, Tabs' close affordance). When a click handler or an
  // interactive role is supplied, expose it to the keyboard: make it focusable
  // and translate Enter/Space into the click handler.
  const interactive = role === 'button' || typeof onClick === 'function';

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (interactive && onClick && !event.defaultPrevented) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        onClick(event as unknown as MouseEvent<HTMLElement>);
      }
    }
  };

  // Default to role="img" for labelled, non-interactive icons so assistive tech
  // announces them as images rather than ignoring them.
  const resolvedRole =
    role ?? (!interactive && (ariaLabel || ariaLabelledBy) ? 'img' : undefined);

  // Keep focusability when the icon is interactive, unless a tabIndex was
  // explicitly provided by the caller.
  const resolvedTabIndex = tabIndex !== undefined ? tabIndex : interactive ? 0 : undefined;

  return (
    <i
      ref={ref}
      className={cls(ns.b(), spin && ns.is('loading'), className)}
      style={mergedStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-hidden={ariaLabel || ariaLabelledBy || interactive ? undefined : true}
      onClick={onClick}
      onKeyDown={interactive ? handleKeyDown : onKeyDown}
      {...rest}
    >
      {children}
    </i>
  );
});
