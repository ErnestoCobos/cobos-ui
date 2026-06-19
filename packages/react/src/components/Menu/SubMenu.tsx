import {
  Children,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Popper } from '../Overlay';
import { type SubMenuContextValue, SubMenuContext, useMenuContext, useSubMenuContext } from './Menu';
import { MenuItem } from './MenuItem';

export interface SubMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Unique identifier for the sub-menu. */
  index: string;
  /** Title rendered in the sub-menu trigger. */
  title?: ReactNode;
  /** Leading icon. */
  icon?: ReactNode;
  /** Disable interaction. */
  disabled?: boolean;
  children?: ReactNode;
}

function ChevronIcon() {
  return (
    <svg
      className="ec-sub-menu__arrow"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.776a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752 0z"
      />
    </svg>
  );
}

/** Collect the `index` of every MenuItem descendant so the sub-menu can reflect active state. */
function collectItemIndices(children: ReactNode, indices: string[]): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === MenuItem) {
      const idx = (child.props as { index?: string }).index;
      if (idx) {
        indices.push(idx);
      }
      return;
    }
    const grandChildren = (child.props as { children?: ReactNode }).children;
    if (grandChildren) {
      collectItemIndices(grandChildren, indices);
    }
  });
}

export const SubMenu = forwardRef<HTMLDivElement, SubMenuProps>(function SubMenu(props, ref) {
  const { index, title, icon, disabled = false, className, style, children, ...rest } = props;

  const ns = useNamespace('sub-menu');
  const menu = useMenuContext();
  const parent = useSubMenuContext();
  const popupId = useId();

  const mode = menu?.mode ?? 'vertical';
  // `openedMenus` drives both vertical (inline) and horizontal (popup) open state,
  // so the popup is controlled and its expanded state is observable to context.
  const open = menu?.openedMenus.includes(index) ?? false;

  const childIndices: string[] = [];
  collectItemIndices(children, childIndices);
  const isActive = menu?.activeIndex ? childIndices.includes(menu.activeIndex) : false;

  // Register this sub-menu's parent path so `uniqueOpened` can preserve ancestors.
  const parentIndex = parent?.parentIndex ?? null;
  const registerSubMenu = menu?.registerSubMenu;
  const unregisterSubMenu = menu?.unregisterSubMenu;
  useEffect(() => {
    registerSubMenu?.(index, parentIndex);
    return () => unregisterSubMenu?.(index);
  }, [registerSubMenu, unregisterSubMenu, index, parentIndex]);

  // Expose this sub-menu as the parent path for its descendants.
  const subMenuContext = useMemo<SubMenuContextValue>(() => ({ parentIndex: index }), [index]);

  const handleTitleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    // The trigger role lives on the `<div>`; stop the event from bubbling to an
    // enclosing (ancestor) sub-menu trigger `<div>`.
    event.stopPropagation();
    menu?.toggleMenu(index);
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      menu?.toggleMenu(index);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      menu?.openMenu(index);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      menu?.closeMenu(index);
    }
  };

  // The title span is the menuitem's direct text content, so it remains the
  // accessible name of the trigger. The icon and arrow sit inside it; a nested
  // `role="menu"` (the popup) is a sibling, not part of the name.
  const titleContent = (
    <span className={ns.e('title')}>
      {icon && <span className={ns.e('icon')}>{icon}</span>}
      <span className={ns.e('label')}>{title}</span>
      <span className={cls(ns.e('arrow-wrap'), ns.is('opened', open))}>
        <ChevronIcon />
      </span>
    </span>
  );

  // The trigger `<div>` carries `role="menuitem"`, so it is a valid direct child
  // of its `menu`/`menubar`/`group` parent without emitting any `li`.
  const triggerClasses = cls(
    ns.b(),
    ns.is('opened', open),
    ns.is('active', isActive),
    ns.is('disabled', disabled),
  );

  // Horizontal mode renders the children in a Popper popup. The Popper is
  // controlled by the menu context so the trigger can open it via keyboard and
  // its expanded state stays in sync with `openedMenus`. The floating box
  // carries `role="menu"`, so its `<div role="menuitem">` children get a valid
  // required parent without an intervening role.
  if (mode === 'horizontal') {
    // `aria-controls`/`aria-expanded` are supplied by the Popper's floating
    // interactions (pointing at the real floating element), so they are not
    // set explicitly here to avoid a dangling reference.
    const reference = (
      <div
        ref={ref}
        role="menuitem"
        className={cls(triggerClasses, className)}
        style={style}
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="menu"
        aria-disabled={disabled || undefined}
        onKeyDown={handleTitleKeyDown}
        {...rest}
      >
        {titleContent}
      </div>
    );

    return (
      <SubMenuContext.Provider value={subMenuContext}>
        <Popper
          reference={reference}
          open={open}
          onOpenChange={(next) => {
            if (disabled) {
              return;
            }
            if (next) {
              menu?.openMenu(index);
            } else {
              menu?.closeMenu(index);
            }
          }}
          trigger="hover"
          placement="bottom-start"
          offset={6}
          role="menu"
          disabled={disabled}
          popperClass="ec-menu__popper"
        >
          {/* The Popper floating box is the single `role="menu"`; the items
              render directly as its `<div role="menuitem">` children, so the
              menu owns only menuitems and introduces no stray role. */}
          {children}
        </Popper>
      </SubMenuContext.Provider>
    );
  }

  // Vertical mode expands and collapses inline. The `<div>` is the trigger
  // (`role="menuitem"`) and owns an inline `<div role="menu">` that it renders
  // as a child, so the submenu's menuitems get a valid `menu` parent and that
  // `menu` is owned by the menuitem.
  return (
    <div
      ref={ref}
      role="menuitem"
      className={cls(triggerClasses, className)}
      style={style}
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="menu"
      aria-expanded={open}
      // Only reference the inline menu while it is mounted (it renders on open),
      // so `aria-controls` never points at a missing element.
      aria-controls={open ? popupId : undefined}
      aria-disabled={disabled || undefined}
      onClick={handleTitleClick}
      onKeyDown={handleTitleKeyDown}
      {...rest}
    >
      {titleContent}
      {open && (
        <div id={popupId} role="menu" className={ns.e('content')}>
          <SubMenuContext.Provider value={subMenuContext}>{children}</SubMenuContext.Provider>
        </div>
      )}
    </div>
  );
});
