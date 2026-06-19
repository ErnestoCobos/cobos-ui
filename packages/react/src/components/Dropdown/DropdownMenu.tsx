import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';

export interface DropdownMenuContextValue {
  /** Stable id of the item that currently holds the roving tab stop. */
  activeId: string | null;
  /** Register an item as the active (focusable) one, e.g. on focus/hover. */
  setActiveId: (id: string | null) => void;
}

/**
 * Scoped to a single `DropdownMenu` so each menu manages its own roving focus.
 */
export const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

export interface DropdownMenuProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

/** Enabled, focusable menu items in DOM order. */
function getItems(menu: HTMLUListElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
  );
}

export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  function DropdownMenu(props, ref) {
    const { className, children, onKeyDown, ...rest } = props;
    const ns = useNamespace('dropdown-menu');

    const menuRef = useRef<HTMLUListElement | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Seed the roving tab stop on the first enabled item so the menu has
    // exactly one tab stop before the user moves focus.
    useLayoutEffect(() => {
      if (activeId === null) {
        const first = getItems(menuRef.current)[0];
        if (first?.id) setActiveId(first.id);
      }
    });

    const setRefs = useCallback(
      (node: HTMLUListElement | null) => {
        menuRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const focusItem = useCallback((item: HTMLElement | undefined) => {
      if (item) {
        item.focus();
        setActiveId(item.id || null);
      }
    }, []);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLUListElement>) => {
        const items = getItems(menuRef.current);
        if (items.length > 0) {
          const current = document.activeElement as HTMLElement | null;
          const index = current ? items.indexOf(current) : -1;

          switch (event.key) {
            case 'ArrowDown': {
              event.preventDefault();
              focusItem(items[index < 0 ? 0 : (index + 1) % items.length]);
              break;
            }
            case 'ArrowUp': {
              event.preventDefault();
              focusItem(items[index <= 0 ? items.length - 1 : index - 1]);
              break;
            }
            case 'Home': {
              event.preventDefault();
              focusItem(items[0]);
              break;
            }
            case 'End': {
              event.preventDefault();
              focusItem(items[items.length - 1]);
              break;
            }
            default:
              break;
          }
        }

        onKeyDown?.(event);
      },
      [focusItem, onKeyDown],
    );

    return (
      <DropdownMenuContext.Provider value={{ activeId, setActiveId }}>
        <ul
          ref={setRefs}
          className={cls(ns.b(), className)}
          role="menu"
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </ul>
      </DropdownMenuContext.Provider>
    );
  },
);
