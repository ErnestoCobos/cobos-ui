import {
  type FocusEvent,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useContext,
  useId,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { DropdownContext } from './Dropdown';
import { DropdownMenuContext } from './DropdownMenu';

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Payload passed to the parent `onCommand` handler when clicked. */
  command?: unknown;
  /** Disable the item. */
  disabled?: boolean;
  /** Render a separator above the item. */
  divided?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  children?: ReactNode;
}

export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  function DropdownItem(props, ref) {
    const {
      command,
      disabled = false,
      divided = false,
      icon,
      className,
      children,
      id: idProp,
      onFocus,
      onKeyDown,
      ...rest
    } = props;

    const ns = useNamespace('dropdown-menu');
    const context = useContext(DropdownContext);
    const menu = useContext(DropdownMenuContext);

    const generatedId = useId();
    const id = idProp ?? generatedId;

    /** Shared activation path for both pointer and keyboard. */
    const activate = () => {
      if (disabled) return;
      context?.onCommand(command);
      if (context?.hideOnClick) {
        context.close();
      }
    };

    const handleClick = (event: MouseEvent<HTMLLIElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      activate();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        // Space would otherwise scroll the page.
        event.preventDefault();
        activate();
      }
      onKeyDown?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLLIElement>) => {
      if (!disabled) {
        menu?.setActiveId(id);
      }
      onFocus?.(event);
    };

    const classes = cls(
      ns.e('item'),
      context && context.size !== 'default' && ns.m(context.size),
      ns.is('disabled', disabled),
      ns.is('divided', divided),
      className,
    );

    // Roving tabindex: the active item is the single tab stop. Before any item
    // has been focused, the first enabled item is reachable by Tab.
    const isActive = menu ? menu.activeId === id : true;
    const tabIndex = disabled ? -1 : isActive ? 0 : -1;

    return (
      <li
        ref={ref}
        id={id}
        className={classes}
        role="menuitem"
        tabIndex={tabIndex}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      >
        {icon && <span className={ns.e('icon')}>{icon}</span>}
        {children}
      </li>
    );
  },
);
