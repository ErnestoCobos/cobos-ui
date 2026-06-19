import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export type TagSize = 'large' | 'default' | 'small';

export type TagEffect = 'dark' | 'light' | 'plain';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Visual variant. */
  type?: TagType;
  /** Size. */
  size?: TagSize;
  /** Theme intensity. */
  effect?: TagEffect;
  /** Rounded corners. */
  round?: boolean;
  /** Show a close button. */
  closable?: boolean;
  /** Highlight the border. */
  hit?: boolean;
  /** Custom background color. */
  color?: string;
  /** Disable the appearance transition. */
  disableTransitions?: boolean;
  /** Fired when the close button is clicked. */
  onClose?: (e: MouseEvent) => void;
  /** Fired when the tag body is clicked. */
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(props, ref) {
  const {
    type = 'primary',
    size = 'default',
    effect = 'light',
    round = false,
    closable = false,
    hit = false,
    color,
    disableTransitions = false,
    onClose,
    onClick,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('tag');

  const classes = cls(
    ns.b(),
    type && ns.m(type),
    size !== 'default' && ns.m(size),
    ns.m(effect),
    ns.is('round', round),
    ns.is('hit', hit),
    ns.is('closable', closable),
    ns.is('disable-transitions', disableTransitions),
    className,
  );

  const mergedStyle: CSSProperties = {
    ...style,
    backgroundColor: color ?? (style as CSSProperties | undefined)?.backgroundColor,
  };

  return (
    <span ref={ref} className={classes} style={mergedStyle} onClick={onClick} {...rest}>
      <span className={ns.e('content')}>{children}</span>
      {closable && (
        <button
          type="button"
          className={ns.e('close')}
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.(e);
          }}
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0-1.414-1.414L12 10.586Z"
            />
          </svg>
        </button>
      )}
    </span>
  );
});
