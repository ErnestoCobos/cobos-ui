import {
  createContext,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type RowAlign = 'top' | 'middle' | 'bottom';

export interface RowContextValue {
  /** Horizontal gutter (in px) shared with descendant columns. */
  gutter: number;
}

export const RowContext = createContext<RowContextValue>({ gutter: 0 });

export interface RowProps extends HTMLAttributes<HTMLElement> {
  /** Grid spacing between columns, in pixels. */
  gutter?: number;
  /** Horizontal alignment of columns. */
  justify?: RowJustify;
  /** Vertical alignment of columns. */
  align?: RowAlign;
  /** Custom element tag for the root node. */
  tag?: keyof React.JSX.IntrinsicElements;
  children?: ReactNode;
}

const justifyMap: Record<RowJustify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly',
};

const alignMap: Record<RowAlign, CSSProperties['alignItems']> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

export const Row = forwardRef<HTMLElement, RowProps>(function Row(props, ref) {
  const {
    gutter = 0,
    justify = 'start',
    align,
    tag = 'div',
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('row');

  const rowStyle = useMemo<CSSProperties>(() => {
    const next: CSSProperties = {
      justifyContent: justifyMap[justify],
    };
    if (align) {
      next.alignItems = alignMap[align];
    }
    if (gutter) {
      const half = gutter / 2;
      next.marginLeft = -half;
      next.marginRight = -half;
    }
    return next;
  }, [gutter, justify, align]);

  const context = useMemo<RowContextValue>(() => ({ gutter }), [gutter]);

  const Tag = tag as React.ElementType;

  return (
    <RowContext.Provider value={context}>
      <Tag
        ref={ref}
        className={cls(ns.b(), className)}
        style={{ ...rowStyle, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    </RowContext.Provider>
  );
});
