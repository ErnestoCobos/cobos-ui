import {
  forwardRef,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { SkeletonItem } from './SkeletonItem';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Whether to show the placeholder. When false, `children` are rendered. */
  loading?: boolean;
  /** Number of text rows in the default template. */
  rows?: number;
  /** Enable the shimmer animation. */
  animated?: boolean;
  /** Repeat the placeholder template this many times. */
  count?: number;
  /** Delay (ms) before the placeholder appears, avoiding flashes on fast loads. */
  throttle?: number;
  /** Real content, shown once `loading` is false. */
  children?: ReactNode;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(props, ref) {
  const {
    loading = true,
    rows = 3,
    animated = false,
    count = 1,
    throttle,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('skeleton');

  // When `throttle` is set, defer showing the placeholder until the delay
  // elapses so brief loads do not flash a skeleton.
  const [throttled, setThrottled] = useState(throttle != null && throttle > 0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (throttle == null || throttle <= 0) {
      setThrottled(false);
      return;
    }
    if (loading) {
      setThrottled(true);
      timer.current = setTimeout(() => setThrottled(false), throttle);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [throttle, loading]);

  const showPlaceholder = loading && !throttled;

  const classes = cls(ns.b(), ns.is('animated', animated), className);

  if (!showPlaceholder) {
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }

  const templates = Array.from({ length: Math.max(count, 1) }, (_, i) => (
    <Fragment key={i}>
      <div className={ns.e('template')}>
        <SkeletonItem variant="h3" style={{ width: '50%' }} />
        {Array.from({ length: Math.max(rows, 0) }, (_, row) => (
          <SkeletonItem
            key={row}
            variant="text"
            // The last row is intentionally shorter to mimic real prose.
            style={row === rows - 1 ? { width: '60%' } : undefined}
          />
        ))}
      </div>
    </Fragment>
  ));

  return (
    <div ref={ref} className={classes} aria-busy="true" aria-live="polite" {...rest}>
      {templates}
    </div>
  );
});
