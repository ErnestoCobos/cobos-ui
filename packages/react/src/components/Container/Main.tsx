import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface MainProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Main = forwardRef<HTMLElement, MainProps>(function Main(props, ref) {
  const { className, children, ...rest } = props;
  const ns = useNamespace('main');

  return (
    <main ref={ref} className={cls(ns.b(), className)} {...rest}>
      {children}
    </main>
  );
});
