import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer height. */
  height?: string;
  children?: ReactNode;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(props, ref) {
  const { height = '60px', className, style, children, ...rest } = props;
  const ns = useNamespace('footer');

  const footerStyle = { '--ec-footer-height': height } as CSSProperties;

  return (
    <footer ref={ref} className={cls(ns.b(), className)} style={{ ...footerStyle, ...style }} {...rest}>
      {children}
    </footer>
  );
});
