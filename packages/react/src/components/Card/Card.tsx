import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type CardShadow = 'always' | 'hover' | 'never';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Header content. Renders the header section when set. */
  header?: ReactNode;
  /** Footer content. Renders the footer section when set. */
  footer?: ReactNode;
  /** Inline styles applied to the body section. */
  bodyStyle?: CSSProperties;
  /** Extra class applied to the body section. */
  bodyClass?: string;
  /** When the drop shadow is shown. */
  shadow?: CardShadow;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const {
    header,
    footer,
    bodyStyle,
    bodyClass,
    shadow = 'always',
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('card');

  const classes = cls(ns.b(), ns.is(`${shadow}-shadow`), className);

  return (
    <div ref={ref} className={classes} style={style} {...rest}>
      {header !== undefined && header !== null && (
        <div className={ns.e('header')}>{header}</div>
      )}
      <div className={cls(ns.e('body'), bodyClass)} style={bodyStyle}>
        {children}
      </div>
      {footer !== undefined && footer !== null && (
        <div className={ns.e('footer')}>{footer}</div>
      )}
    </div>
  );
});
