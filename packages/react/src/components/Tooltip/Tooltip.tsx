import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type Placement, Popper } from '../Overlay';

export type TooltipTrigger = 'hover' | 'click' | 'focus';
export type TooltipEffect = 'dark' | 'light';

export interface TooltipProps {
  /** Tooltip content. */
  content: ReactNode;
  /** Placement of the tooltip relative to the trigger. */
  placement?: Placement;
  /** How the tooltip opens. */
  trigger?: TooltipTrigger;
  /** Disable the tooltip; the trigger renders without one. */
  disabled?: boolean;
  /** Visual theme of the tooltip surface. */
  effect?: TooltipEffect;
  /** Show the arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Gap between the trigger and the tooltip, in px. */
  offset?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. */
  children: ReactElement;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const {
    content,
    placement = 'top',
    trigger = 'hover',
    disabled = false,
    effect = 'dark',
    showArrow = true,
    offset = 8,
    open,
    defaultOpen,
    onOpenChange,
    children,
  } = props;

  const ns = useNamespace('tooltip');

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  // Hold the user-provided ref on the trigger; Popper merges in its own.
  const reference = ref ? cloneElement(children, { ref } as Record<string, unknown>) : children;

  return (
    <Popper
      reference={reference}
      trigger={trigger}
      placement={placement}
      offset={offset}
      role="tooltip"
      showArrow={showArrow}
      disabled={disabled || content == null || content === ''}
      popperClass={cls(ns.b(), ns.m(effect))}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <div className={ns.e('content')}>{content}</div>
    </Popper>
  );
});
