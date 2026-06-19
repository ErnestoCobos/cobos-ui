import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export type DividerDirection = 'horizontal' | 'vertical';

export type DividerContentPosition = 'left' | 'center' | 'right';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Divider orientation. */
  direction?: DividerDirection;
  /** Position of the text label (horizontal direction only). */
  contentPosition?: DividerContentPosition;
  /** Border line style. */
  borderStyle?: CSSProperties['borderStyle'];
  children?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(props, ref) {
  const {
    direction = 'horizontal',
    contentPosition = 'center',
    borderStyle = 'solid',
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('divider');

  const classes = cls(
    ns.b(),
    ns.m(direction),
    direction === 'horizontal' && ns.is(contentPosition),
    className,
  );

  const dividerStyle = {
    '--ec-divider-border-style': borderStyle,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={classes}
      style={dividerStyle}
      role="separator"
      aria-orientation={direction}
      {...rest}
    >
      {direction === 'horizontal' && children !== undefined && children !== null && (
        <span className={ns.e('text')}>{children}</span>
      )}
    </div>
  );
});
