import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useNamespace } from '../../utils';
import { type Placement, Popper } from '../Overlay';

export type PopoverTrigger = 'hover' | 'click' | 'focus';

export interface PopoverProps {
  /** Popover body content. */
  content: ReactNode;
  /** Optional bold heading shown above the content. */
  title?: ReactNode;
  /** How the popover opens. */
  trigger?: PopoverTrigger;
  /** Placement of the popover relative to the trigger. */
  placement?: Placement;
  /** Fixed width of the popover surface. */
  width?: number | string;
  /** Show the arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Gap between the trigger and the popover, in px. */
  offset?: number;
  /** Disable the popover; the trigger renders without one. */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. */
  children: ReactElement;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const {
    content,
    title,
    trigger = 'click',
    placement = 'bottom',
    width,
    showArrow = true,
    offset = 8,
    disabled = false,
    open,
    defaultOpen,
    onOpenChange,
    children,
  } = props;

  const ns = useNamespace('popover');

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const reference = ref ? cloneElement(children, { ref } as Record<string, unknown>) : children;

  return (
    <Popper
      reference={reference}
      trigger={trigger}
      placement={placement}
      offset={offset}
      role="dialog"
      showArrow={showArrow}
      disabled={disabled}
      popperClass={ns.b()}
      popperStyle={width != null ? { width } : undefined}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {title != null && title !== '' && <div className={ns.e('title')}>{title}</div>}
      <div className={ns.e('content')}>{content}</div>
    </Popper>
  );
});
