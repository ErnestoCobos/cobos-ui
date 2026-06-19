import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useState,
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

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controlled visibility. */
  open: boolean;
  /** Called when the dialog requests to close (escape, overlay click, close button). */
  onClose?: () => void;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Title shown in the header. Ignored when `header` is provided. */
  title?: ReactNode;
  /** Custom header content; overrides the title area. */
  header?: ReactNode;
  /** Footer content. */
  footer?: ReactNode;
  /** Dialog width. Default `'50%'`. */
  width?: string | number;
  /** Take up the whole viewport. */
  fullscreen?: boolean;
  /** Distance from the top of the viewport. Ignored when `alignCenter`/`fullscreen`. Default `'15vh'`. */
  top?: string;
  /** Vertically center the dialog. */
  alignCenter?: boolean;
  /** Show the backdrop. Default `true`. */
  modal?: boolean;
  /** Close when clicking the overlay. Default `true`. */
  closeOnClickModal?: boolean;
  /** Close when pressing Escape. Default `true`. */
  closeOnPressEscape?: boolean;
  /** Show the close button. Default `true`. */
  showClose?: boolean;
  /**
   * Intercept a close request. Receives a `done` callback; the dialog only
   * closes (firing `onClose`/`onOpenChange(false)`) once `done()` is invoked,
   * allowing async confirmation. Applies to escape, overlay click and the close
   * button. Mirrors Element Plus's `before-close`.
   */
  beforeClose?: (done: () => void) => void;
  /** Center the header and footer text. */
  center?: boolean;
  /** Lock body scroll while open. Default `true`. */
  lockScroll?: boolean;
  /** Always portal to `document.body` (kept for API parity). */
  appendTo?: unknown;
  /** Keep the dialog mounted while closed. Default `false`. */
  keepMounted?: boolean;
  /** Destroy the body content every time the dialog closes. */
  destroyOnClose?: boolean;
  children?: ReactNode;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const {
    open,
    onClose,
    onOpenChange,
    title,
    header,
    footer,
    width = '50%',
    fullscreen = false,
    top = '15vh',
    alignCenter = false,
    modal = true,
    closeOnClickModal = true,
    closeOnPressEscape = true,
    showClose = true,
    center = false,
    lockScroll = true,
    keepMounted = false,
    destroyOnClose = false,
    beforeClose,
    appendTo: _appendTo,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('dialog');
  const reactId = useId();
  const titleId = `${ns.b()}-title-${reactId}`;

  // Track whether the body has ever been opened, for destroyOnClose semantics.
  const [renderedOnce, setRenderedOnce] = useState(open);
  useEffect(() => {
    if (open) setRenderedOnce(true);
    else if (destroyOnClose) setRenderedOnce(false);
  }, [open, destroyOnClose]);

  const emitClose = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const requestClose = () => {
    if (beforeClose) {
      beforeClose(emitClose);
    } else {
      emitClose();
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange?.(true);
    } else {
      requestClose();
    }
  };

  const { refs, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
  });

  const dismiss = useDismiss(context, {
    // In non-modal mode no mask is rendered, so there is no overlay to click
    // "outside" of; only the escape key can dismiss.
    outsidePress: modal && closeOnClickModal,
    escapeKey: closeOnPressEscape,
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!open && !keepMounted) return null;

  const panelClasses = cls(
    ns.b(),
    ns.is('fullscreen', fullscreen),
    ns.is('center', center),
    ns.is('align-center', alignCenter && !fullscreen),
    className,
  );

  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const panelStyle: CSSProperties = {
    [ns.cssVar('width')]: fullscreen ? undefined : widthValue,
    marginTop: fullscreen || alignCenter ? undefined : top,
    ...style,
  } as CSSProperties;

  const showBody = open || (keepMounted && !destroyOnClose) || renderedOnce;

  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledByProp,
    ...restProps
  } = rest as HTMLAttributes<HTMLDivElement>;

  // Always expose an accessible name: prefer a consumer-supplied
  // aria-labelledby/aria-label, otherwise reference the rendered header (custom
  // `header` slot or the default `title`) via its id.
  const hasInternalLabel = header != null || title != null;
  const ariaLabelledBy =
    ariaLabelledByProp ?? (!ariaLabel && hasInternalLabel ? titleId : undefined);

  const renderHeaderContent = () =>
    header != null ? (
      <span id={titleId} className={ns.e('header-content')}>
        {header}
      </span>
    ) : (
      <span id={titleId} className={ns.e('title')}>
        {title}
      </span>
    );

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
        role="dialog"
        aria-modal={modal || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...getFloatingProps(restProps)}
      >
        <div className={cls(ns.e('header'), ns.is('with-close', showClose))}>
          {renderHeaderContent()}
          {showClose && (
            <button
              type="button"
              className={ns.e('headerbtn')}
              aria-label="Close"
              onClick={requestClose}
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className={ns.e('body')}>{showBody ? children : null}</div>
        {footer != null && <div className={ns.e('footer')}>{footer}</div>}
      </div>
    </FloatingFocusManager>
  );

  return (
    <FloatingPortal>
      {(open || keepMounted) &&
        (modal ? (
          <FloatingOverlay
            className={cls('ec-overlay', ns.is('hidden', !open), ns.e('mask'))}
            lockScroll={lockScroll && open}
            style={{
              display: open ? undefined : 'none',
              zIndex: 'var(--ec-index-popper)' as unknown as number,
            }}
          >
            <div
              className={cls(ns.e('wrapper'), ns.is('align-center', alignCenter && !fullscreen))}
            >
              {panel}
            </div>
          </FloatingOverlay>
        ) : (
          // Non-modal: render no full-screen hit-testing overlay so the page
          // behind stays interactive. The wrapper centers the panel but lets
          // pointer events fall through except over the panel itself.
          <div
            className={cls(
              'ec-overlay',
              ns.e('wrapper'),
              ns.is('non-modal'),
              ns.is('hidden', !open),
              ns.is('align-center', alignCenter && !fullscreen),
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
