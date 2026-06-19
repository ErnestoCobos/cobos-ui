import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface AsideProps extends HTMLAttributes<HTMLElement> {
  /** Aside width. */
  width?: string;
  children?: ReactNode;
}

export const Aside = forwardRef<HTMLElement, AsideProps>(function Aside(props, ref) {
  const { width = '300px', className, style, children, ...rest } = props;
  const ns = useNamespace('aside');

  const asideStyle = { '--ec-aside-width': width } as CSSProperties;

  return (
    <aside ref={ref} className={cls(ns.b(), className)} style={{ ...asideStyle, ...style }} {...rest}>
      {children}
    </aside>
  );
});
