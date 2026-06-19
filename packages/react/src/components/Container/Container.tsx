import {
  Children,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useMemo,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Footer } from './Footer';
import { Header } from './Header';

export type ContainerDirection = 'horizontal' | 'vertical';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /**
   * Layout direction. When omitted, defaults to `vertical` if any direct child
   * is a Header or Footer, otherwise `horizontal`.
   */
  direction?: ContainerDirection;
  children?: ReactNode;
}

function hasVerticalChild(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) => isValidElement(child) && (child.type === Header || child.type === Footer),
  );
}

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  const { direction, className, children, ...rest } = props;
  const ns = useNamespace('container');

  const isVertical = useMemo(() => {
    if (direction) {
      return direction === 'vertical';
    }
    return hasVerticalChild(children);
  }, [direction, children]);

  const classes = cls(ns.b(), ns.is('vertical', isVertical), className);

  return (
    <section ref={ref} className={classes} {...rest}>
      {children}
    </section>
  );
});
