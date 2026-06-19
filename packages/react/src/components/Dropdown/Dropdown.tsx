import {
  cloneElement,
  createContext,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useSize } from '../../config-provider';
import { type Placement, Popper } from '../Overlay';

export type DropdownTrigger = 'hover' | 'click';

export interface DropdownContextValue {
  /** Fire the parent `onCommand` handler with an item's command payload. */
  onCommand: (command: unknown) => void;
  /** Close the dropdown menu. */
  close: () => void;
  /** Resolved component size, shared with menu items. */
  size: ComponentSize;
  /** Close the menu after an item is clicked. */
  hideOnClick: boolean;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Trigger element (e.g. a Button) that toggles the menu. */
  children: ReactElement;
  /** Menu content, usually a `DropdownMenu` of `DropdownItem`. */
  menu: ReactNode;
  /** How the menu opens. */
  trigger?: DropdownTrigger;
  /** Placement of the menu relative to the trigger. */
  placement?: Placement;
  /** Disable the dropdown entirely. */
  disabled?: boolean;
  /** Close the menu when an item is clicked. */
  hideOnClick?: boolean;
  /** Size, applied to descendant items. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Fired with the clicked item's `command`. */
  onCommand?: (command: unknown) => void;
  /** Fired when the menu opens or closes. */
  onVisibleChange?: (visible: boolean) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(props, ref) {
  const {
    children,
    menu,
    trigger = 'hover',
    placement = 'bottom-end',
    disabled = false,
    hideOnClick = true,
    size: sizeProp,
    onCommand,
    onVisibleChange,
    className,
    style,
    ...rest
  } = props;

  const ns = useNamespace('dropdown');
  const size = useSize(sizeProp);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onVisibleChange?.(next);
  };

  const context = useMemo<DropdownContextValue>(
    () => ({
      onCommand: (command) => onCommand?.(command),
      close: () => {
        setOpen(false);
        onVisibleChange?.(false);
      },
      size,
      hideOnClick,
    }),
    [onCommand, onVisibleChange, size, hideOnClick],
  );

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const reference = cloneElement(children, {
    className: cls(ns.e('trigger'), (children.props as { className?: string }).className),
  } as Record<string, unknown>);

  return (
    <DropdownContext.Provider value={context}>
      <div
        ref={ref}
        className={cls(ns.b(), className)}
        style={style as CSSProperties}
        {...rest}
      >
        <Popper
          reference={reference}
          trigger={trigger}
          placement={placement}
          offset={6}
          role="dialog"
          popperClass={ns.e('popper')}
          disabled={disabled}
          open={open}
          onOpenChange={handleOpenChange}
        >
          {menu}
        </Popper>
      </div>
    </DropdownContext.Provider>
  );
});
