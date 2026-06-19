import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { RowContext } from './Row';

export type ColBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ColResponsive {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

export type ColResponsiveProp = number | ColResponsive;

export interface ColProps extends HTMLAttributes<HTMLElement> {
  /** Column span (1-24). */
  span?: number;
  /** Number of columns to offset from the left. */
  offset?: number;
  /** Number of columns to move to the right. */
  push?: number;
  /** Number of columns to move to the left. */
  pull?: number;
  /** Layout for `<768px` viewports. */
  xs?: ColResponsiveProp;
  /** Layout for `≥768px` viewports. */
  sm?: ColResponsiveProp;
  /** Layout for `≥992px` viewports. */
  md?: ColResponsiveProp;
  /** Layout for `≥1200px` viewports. */
  lg?: ColResponsiveProp;
  /** Layout for `≥1920px` viewports. */
  xl?: ColResponsiveProp;
  /** Custom element tag for the root node. */
  tag?: keyof React.JSX.IntrinsicElements;
  children?: ReactNode;
}

const breakpoints: ColBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

function normalize(value: ColResponsiveProp): ColResponsive {
  return typeof value === 'number' ? { span: value } : value;
}

export const Col = forwardRef<HTMLElement, ColProps>(function Col(props, ref) {
  const {
    span = 24,
    offset,
    push,
    pull,
    xs,
    sm,
    md,
    lg,
    xl,
    tag = 'div',
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('col');
  const { gutter } = useContext(RowContext);

  const responsive = { xs, sm, md, lg, xl };

  const classes = cls(
    ns.b(),
    ns.b(String(span)),
    offset !== undefined && ns.b(`offset-${offset}`),
    push !== undefined && ns.b(`push-${push}`),
    pull !== undefined && ns.b(`pull-${pull}`),
    ...breakpoints.flatMap((bp) => {
      const raw = responsive[bp];
      if (raw === undefined) {
        return [] as string[];
      }
      const { span: bpSpan, offset: bpOffset, push: bpPush, pull: bpPull } = normalize(raw);
      return [
        bpSpan !== undefined && ns.b(`${bp}-${bpSpan}`),
        bpOffset !== undefined && ns.b(`${bp}-offset-${bpOffset}`),
        bpPush !== undefined && ns.b(`${bp}-push-${bpPush}`),
        bpPull !== undefined && ns.b(`${bp}-pull-${bpPull}`),
      ].filter(Boolean) as string[];
    }),
    className,
  );

  const colStyle = useMemo<CSSProperties>(() => {
    if (!gutter) {
      return {};
    }
    const half = gutter / 2;
    return { paddingLeft: half, paddingRight: half };
  }, [gutter]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ ...colStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
});
