import {
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  autoUpdate,
  arrow as arrowMiddleware,
  flip,
  FloatingPortal,
  offset as offsetMiddleware,
  type Placement,
  safePolygon,
  shift,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { cls, useNamespace } from '../../utils';

export type { Placement };
export type PopperTrigger = 'click' | 'hover' | 'focus' | 'manual';
export type PopperRole = 'menu' | 'listbox' | 'tooltip' | 'dialog' | 'grid' | 'tree';

export interface PopperProps {
  /** Trigger element; it receives the floating ref and interaction handlers. */
  reference: ReactElement;
  /** Floating content. */
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  trigger?: PopperTrigger;
  /** Gap between trigger and floating element, in px. */
  offset?: number;
  disabled?: boolean;
  showArrow?: boolean;
  /** ARIA role applied to the floating element. */
  role?: PopperRole;
  /** Extra class on the floating box. */
  popperClass?: string;
  popperStyle?: CSSProperties;
  /** Match the floating element's min-width to the trigger width. */
  matchWidth?: boolean;
  /** Keep the floating element mounted while closed. */
  keepMounted?: boolean;
  /** Hover open/close delay, in ms. */
  hoverDelay?: number;
}

export function Popper(props: PopperProps) {
  const {
    reference,
    children,
    placement = 'bottom-start',
    trigger = 'click',
    offset = 8,
    disabled = false,
    showArrow = false,
    role = 'menu',
    popperClass,
    popperStyle,
    matchWidth = false,
    keepMounted = false,
    hoverDelay = 100,
  } = props;

  const ns = useNamespace('popper');
  const arrowRef = useRef<HTMLDivElement>(null);

  const isControlled = props.open !== undefined;
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = isControlled ? Boolean(props.open) : internalOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    props.onOpenChange?.(next);
  };

  const { refs, floatingStyles, context, middlewareData, placement: resolvedPlacement } =
    useFloating({
      open,
      onOpenChange: setOpen,
      placement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offsetMiddleware(offset),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        matchWidth
          ? sizeMiddleware({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  minWidth: `${rects.reference.width}px`,
                });
              },
            })
          : undefined,
        showArrow ? arrowMiddleware({ element: arrowRef, padding: 6 }) : undefined,
      ].filter(Boolean),
    });

  const click = useClick(context, { enabled: trigger === 'click' });
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    handleClose: safePolygon(),
    delay: { open: hoverDelay, close: hoverDelay },
  });
  const focus = useFocus(context, { enabled: trigger === 'focus' });
  const dismiss = useDismiss(context);
  const ariaRole = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
    ariaRole,
  ]);

  const childRef = (
    isValidElement(reference) ? ((reference.props as { ref?: Ref<unknown> }).ref ?? null) : null
  ) as Ref<unknown>;
  const mergedRef = useMergeRefs([refs.setReference, childRef]);

  if (disabled || !isValidElement(reference)) return <>{reference}</>;

  const triggerEl = cloneElement(reference, {
    ref: mergedRef,
    ...getReferenceProps((reference.props as Record<string, unknown>) ?? {}),
  } as Record<string, unknown>);

  const arrowSide = (
    { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  )[resolvedPlacement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right'];

  return (
    <>
      {triggerEl}
      {(open || keepMounted) && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className={cls(ns.b(), popperClass)}
            role={role}
            style={{
              ...floatingStyles,
              zIndex: 'var(--ec-index-popper)' as unknown as number,
              display: open ? undefined : 'none',
              ...popperStyle,
            }}
          >
            {children}
            {showArrow && (
              <div
                ref={arrowRef}
                className={ns.e('arrow')}
                style={{
                  position: 'absolute',
                  left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
                  top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
                  [arrowSide]: '-5px',
                }}
              />
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
