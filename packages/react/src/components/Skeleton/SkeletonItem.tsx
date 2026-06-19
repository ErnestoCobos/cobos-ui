import { forwardRef, type HTMLAttributes } from 'react';
import { cls, useNamespace } from '../../utils';

export type SkeletonVariant =
  | 'p'
  | 'text'
  | 'h1'
  | 'h3'
  | 'caption'
  | 'button'
  | 'image'
  | 'circle'
  | 'rect';

export interface SkeletonItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape of the placeholder. */
  variant?: SkeletonVariant;
}

export const SkeletonItem = forwardRef<HTMLDivElement, SkeletonItemProps>(function SkeletonItem(
  props,
  ref,
) {
  const { variant = 'text', className, ...rest } = props;
  const ns = useNamespace('skeleton');

  return (
    <div ref={ref} className={cls(ns.e('item'), ns.m(variant), className)} {...rest} />
  );
});
