import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Header height. */
  height?: string;
  children?: ReactNode;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(props, ref) {
  const { height = '60px', className, style, children, ...rest } = props;
  const ns = useNamespace('header');

  const headerStyle = { '--ec-header-height': height } as CSSProperties;

  return (
    <header ref={ref} className={cls(ns.b(), className)} style={{ ...headerStyle, ...style }} {...rest}>
      {children}
    </header>
  );
});
