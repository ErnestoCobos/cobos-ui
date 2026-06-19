import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { cls, useNamespace } from '../../utils';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M13.41 12l5.3-5.29a1 1 0 1 0-1.42-1.42L12 10.59l-5.29-5.3a1 1 0 0 0-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L12 13.41l5.29 5.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
      />
    </svg>
  );
}

export type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controlled visibility. */
  open: boolean;
  /** Called when the drawer requests to close (escape, overlay click, close button). */
  onClose?: () => void;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Title shown in the header. */
  title?: ReactNode;
  /** Edge the panel slides in from. Default `'rtl'` (slides in from the right). */
  direction?: DrawerDirection;
  /**
   * Panel size. Drives the width for `rtl`/`ltr` and the height for
   * `ttb`/`btt`. Default `'30%'`.
   */
  size?: number | string;
  /** Show the backdrop. Default `true`. */
  modal?: boolean;
  /** Close when clicking the overlay. Default `true`. */
  closeOnClickModal?: boolean;
  /** Close when pressing Escape. Default `true`. */
  closeOnPressEscape?: boolean;
  /** Show the close button. Default `true`. */
  showClose?: boolean;
  /** Render the header region. Default `true`. */
  withHeader?: boolean;
  /** Footer content. */
  footer?: ReactNode;
  /** Lock body scroll while open. Default `true`. */
  lockScroll?: boolean;
  /** Keep the drawer mounted while closed. Default `false`. */
  keepMounted?: boolean;
  children?: ReactNode;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(props, ref) {
  const {
    open,
    onClose,
    onOpenChange,
    title,
    direction = 'rtl',
    size = '30%',
    modal = true,
    closeOnClickModal = true,
    closeOnPressEscape = true,
    showClose = true,
    withHeader = true,
    footer,
    lockScroll = true,
    keepMounted = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('drawer');
  const reactId = useId();
  const titleId = `${ns.b()}-title-${reactId}`;

  const emitClose = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange?.(true);
    } else {
      emitClose();
    }
  };

  const { refs, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
  });

  const dismiss = useDismiss(context, {
    outsidePress: modal && closeOnClickModal,
    escapeKey: closeOnPressEscape,
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!open && !keepMounted) return null;

  // Horizontal drawers are sized by width, vertical drawers by height.
  const isHorizontal = direction === 'rtl' || direction === 'ltr';
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  const panelClasses = cls(ns.b(), ns.m(direction), className);

  const panelStyle: CSSProperties = {
    [ns.cssVar('size')]: sizeValue,
    ...style,
  } as CSSProperties;

  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledByProp,
    ...restProps
  } = rest as HTMLAttributes<HTMLDivElement>;

  // Expose an accessible name: prefer a consumer-supplied label, otherwise
  // reference the rendered title via its id (only when a header is rendered).
  const hasInternalLabel = withHeader && title != null;
  const ariaLabelledBy =
    ariaLabelledByProp ?? (!ariaLabel && hasInternalLabel ? titleId : undefined);

  const panel = (
    <FloatingFocusManager context={context} modal={modal} initialFocus={refs.floating}>
      <div
        ref={(node) => {
          refs.setFloating(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={panelClasses}
        style={panelStyle}
        data-direction={direction}
        role="dialog"
        aria-modal={modal || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...getFloatingProps(restProps)}
      >
        {withHeader && (
          <header className={cls(ns.e('header'), ns.is('with-close', showClose))}>
            <span id={titleId} className={ns.e('title')}>
              {title}
            </span>
            {showClose && (
              <button
                type="button"
                className={ns.e('close')}
                aria-label="Close"
                onClick={emitClose}
              >
                <CloseIcon />
              </button>
            )}
          </header>
        )}
        <div className={ns.e('body')}>{children}</div>
        {footer != null && <div className={ns.e('footer')}>{footer}</div>}
      </div>
    </FloatingFocusManager>
  );

  return (
    <FloatingPortal>
      {(open || keepMounted) &&
        (modal ? (
          <FloatingOverlay
            className={cls('ec-overlay', ns.e('mask'), ns.is('hidden', !open))}
            lockScroll={lockScroll && open}
            style={{
              display: open ? undefined : 'none',
              zIndex: 'var(--ec-index-popper)' as unknown as number,
            }}
          >
            <div className={cls(ns.e('wrapper'), ns.m(direction), ns.is('horizontal', isHorizontal))}>
              {panel}
            </div>
          </FloatingOverlay>
        ) : (
          // Non-modal: render no full-screen hit-testing overlay so the page
          // behind stays interactive. Only the panel re-enables pointer events.
          <div
            className={cls(
              'ec-overlay',
              ns.e('wrapper'),
              ns.m(direction),
              ns.is('horizontal', isHorizontal),
              ns.is('non-modal'),
              ns.is('hidden', !open),
            )}
            style={{
              display: open ? undefined : 'none',
              zIndex: 'var(--ec-index-popper)' as unknown as number,
            }}
          >
            {panel}
          </div>
        ))}
    </FloatingPortal>
  );
});
