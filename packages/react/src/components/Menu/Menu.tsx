import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type MenuMode = 'vertical' | 'horizontal';

export interface MenuContextValue {
  /** Layout mode. */
  mode: MenuMode;
  /** Currently active item index. */
  activeIndex: string;
  /** Mark an item as active (no-op when its index already matches). */
  setActive: (index: string) => void;
  /** Indices of the currently expanded sub-menus. */
  openedMenus: string[];
  /** Expand or collapse a sub-menu by index. */
  toggleMenu: (index: string) => void;
  /** Open a sub-menu by index (no-op when already open). */
  openMenu: (index: string) => void;
  /** Collapse a sub-menu by index (no-op when already closed). */
  closeMenu: (index: string) => void;
  /** Collapse a sub-menu and its whole ancestor chain (used when selecting an item). */
  closeMenuBranch: (index: string) => void;
  /** Register a sub-menu and its parent sub-menu (if any) for ancestor tracking. */
  registerSubMenu: (index: string, parentIndex: string | null) => void;
  /** Remove a sub-menu registration. */
  unregisterSubMenu: (index: string) => void;
  /** Collapse vertical menus to icons only. */
  collapse: boolean;
  /** Allow only one sub-menu open at a time. */
  uniqueOpened: boolean;
}

/** Sub-menu context carrying the current sub-menu index to its descendants. */
export interface SubMenuContextValue {
  /** Index of the nearest enclosing sub-menu, used as the parent path. */
  parentIndex: string;
}

export const SubMenuContext = createContext<SubMenuContextValue | null>(null);

/** Access the nearest enclosing SubMenu context. Returns `null` at the top level. */
export function useSubMenuContext(): SubMenuContextValue | null {
  return useContext(SubMenuContext);
}

export const MenuContext = createContext<MenuContextValue | null>(null);

/** Access the nearest Menu context. Returns `null` when rendered outside a Menu. */
export function useMenuContext(): MenuContextValue | null {
  return useContext(MenuContext);
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange' | 'onSelect'> {
  /** Layout mode. */
  mode?: MenuMode;
  /** Active item index (controlled). */
  value?: string;
  /** Initial active item index (uncontrolled). */
  defaultActive?: string;
  /** Fired when the active index changes. */
  onChange?: (index: string) => void;
  /** Collapse to icons only. Vertical mode only. */
  collapse?: boolean;
  /** Sub-menu indices opened by default. */
  defaultOpeneds?: string[];
  /** Keep only one sub-menu open at a time. */
  uniqueOpened?: boolean;
  /** Fired when an item is selected. */
  onSelect?: (index: string) => void;
  /** Fired when a sub-menu expands. */
  onOpen?: (index: string) => void;
  /** Fired when a sub-menu collapses. */
  onClose?: (index: string) => void;
  children?: ReactNode;
}

export const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(props, ref) {
  const {
    mode = 'vertical',
    value,
    defaultActive,
    onChange,
    collapse = false,
    defaultOpeneds,
    uniqueOpened = false,
    onSelect,
    onOpen,
    onClose,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('menu');

  const isControlled = value !== undefined;
  const [internalActive, setInternalActive] = useState<string>(defaultActive ?? '');
  const activeIndex = isControlled ? value : internalActive;

  const [openedMenus, setOpenedMenus] = useState<string[]>(defaultOpeneds ?? []);

  // Maps each sub-menu index to its parent sub-menu index (or null at the top level).
  // Used to preserve the ancestor chain when `uniqueOpened` closes sibling branches.
  const parentMapRef = useRef<Map<string, string | null>>(new Map());

  const registerSubMenu = useCallback((index: string, parentIndex: string | null) => {
    parentMapRef.current.set(index, parentIndex);
  }, []);

  const unregisterSubMenu = useCallback((index: string) => {
    parentMapRef.current.delete(index);
  }, []);

  /** Collect the ancestor chain (parents, grandparents, ...) of a sub-menu index. */
  const collectAncestors = useCallback((index: string): string[] => {
    const ancestors: string[] = [];
    let current = parentMapRef.current.get(index) ?? null;
    while (current) {
      ancestors.push(current);
      current = parentMapRef.current.get(current) ?? null;
    }
    return ancestors;
  }, []);

  const setActive = useCallback(
    (index: string) => {
      if (!isControlled) {
        setInternalActive(index);
      }
      onSelect?.(index);
      if (index !== activeIndex) {
        onChange?.(index);
      }
    },
    [isControlled, onSelect, onChange, activeIndex],
  );

  const openMenu = useCallback(
    (index: string) => {
      setOpenedMenus((prev) => {
        if (prev.includes(index)) {
          return prev;
        }
        onOpen?.(index);
        if (!uniqueOpened) {
          return [...prev, index];
        }
        // With uniqueOpened, close sibling branches but keep this index's
        // ancestor chain open so nested sub-menus stay reachable.
        const keep = new Set([index, ...collectAncestors(index)]);
        return [...prev.filter((item) => keep.has(item)), index];
      });
    },
    [onOpen, uniqueOpened, collectAncestors],
  );

  const closeMenu = useCallback(
    (index: string) => {
      setOpenedMenus((prev) => {
        if (!prev.includes(index)) {
          return prev;
        }
        onClose?.(index);
        return prev.filter((item) => item !== index);
      });
    },
    [onClose],
  );

  const closeMenuBranch = useCallback(
    (index: string) => {
      const branch = new Set([index, ...collectAncestors(index)]);
      setOpenedMenus((prev) => {
        const next = prev.filter((item) => !branch.has(item));
        if (next.length === prev.length) {
          return prev;
        }
        for (const item of prev) {
          if (branch.has(item)) {
            onClose?.(item);
          }
        }
        return next;
      });
    },
    [collectAncestors, onClose],
  );

  const toggleMenu = useCallback(
    (index: string) => {
      if (openedMenus.includes(index)) {
        closeMenu(index);
      } else {
        openMenu(index);
      }
    },
    [openedMenus, openMenu, closeMenu],
  );

  const collapsed = mode === 'vertical' && collapse;

  const context = useMemo<MenuContextValue>(
    () => ({
      mode,
      activeIndex,
      setActive,
      openedMenus,
      toggleMenu,
      openMenu,
      closeMenu,
      closeMenuBranch,
      registerSubMenu,
      unregisterSubMenu,
      collapse: collapsed,
      uniqueOpened,
    }),
    [
      mode,
      activeIndex,
      setActive,
      openedMenus,
      toggleMenu,
      openMenu,
      closeMenu,
      closeMenuBranch,
      registerSubMenu,
      unregisterSubMenu,
      collapsed,
      uniqueOpened,
    ],
  );

  const classes = cls(
    ns.b(),
    ns.m(mode),
    ns.is('collapse', collapsed),
    className,
  );

  return (
    <MenuContext.Provider value={context}>
      <ul
        ref={ref}
        className={classes}
        role="menu"
        aria-orientation={mode === 'horizontal' ? 'horizontal' : 'vertical'}
        {...rest}
      >
        {children}
      </ul>
    </MenuContext.Provider>
  );
});
