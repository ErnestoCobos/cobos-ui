import {
  type AnchorHTMLAttributes,
  forwardRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Icon } from '../Icon';

export type LinkType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual variant. */
  type?: LinkType;
  /** Show an underline on hover. */
  underline?: boolean;
  /** Disable the link (removes `href` and blocks interaction). */
  disabled?: boolean;
  /** Destination URL. Ignored when disabled. */
  href?: string;
  /** Where to open the linked document. */
  target?: string;
  /** Leading icon. */
  icon?: ReactNode;
  children?: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    type = 'default',
    underline = true,
    disabled = false,
    href,
    target,
    icon,
    className,
    style,
    children,
    onClick,
    ...rest
  } = props;

  const ns = useNamespace('link');

  // An anchor has no native `disabled` attribute, so when disabled we must
  // guard the click ourselves: block default navigation and suppress the
  // consumer's handler. Stripping `href` only prevents navigation, not the
  // firing of `onClick`/other handlers.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const classes = cls(
    ns.b(),
    type && type !== 'default' && ns.m(type),
    ns.is('underline', underline && !disabled),
    ns.is('disabled', disabled),
    className,
  );

  return (
    <a
      ref={ref}
      className={classes}
      href={disabled ? undefined : href}
      target={disabled ? undefined : target}
      aria-disabled={disabled || undefined}
      style={style}
      onClick={handleClick}
      {...rest}
    >
      {icon && <Icon className={ns.e('icon')}>{icon}</Icon>}
      {children !== undefined && children !== null && (
        <span className={ns.e('inner')}>{children}</span>
      )}
    </a>
  );
});
