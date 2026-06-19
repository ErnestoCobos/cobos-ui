import {
  Children,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Popper } from '../Overlay';
import { type SubMenuContextValue, SubMenuContext, useMenuContext, useSubMenuContext } from './Menu';
import { MenuItem } from './MenuItem';

export interface SubMenuProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
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

export const SubMenu = forwardRef<HTMLLIElement, SubMenuProps>(function SubMenu(props, ref) {
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

  const handleTitleClick = () => {
    if (disabled) {
      return;
    }
    menu?.toggleMenu(index);
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      menu?.toggleMenu(index);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      menu?.openMenu(index);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      menu?.closeMenu(index);
    }
  };

  const titleClasses = cls(
    ns.e('title'),
    ns.is('disabled', disabled),
  );

  const titleContent = (
    <>
      {icon && <span className={ns.e('icon')}>{icon}</span>}
      <span className={ns.e('label')}>{title}</span>
      <span className={cls(ns.e('arrow-wrap'), ns.is('opened', open))}>
        <ChevronIcon />
      </span>
    </>
  );

  // Horizontal mode renders the children in a Popper popup. The Popper is
  // controlled by the menu context so the trigger can open it via keyboard and
  // its expanded state stays in sync with `openedMenus`.
  if (mode === 'horizontal') {
    const reference = (
      <li
        ref={ref}
        className={cls(ns.b(), ns.is('opened', open), ns.is('active', isActive), ns.is('disabled', disabled), className)}
        style={style}
        {...rest}
      >
        <div
          className={titleClasses}
          role="menuitem"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={popupId}
          aria-disabled={disabled || undefined}
          onKeyDown={handleTitleKeyDown}
        >
          {titleContent}
        </div>
      </li>
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
          <ul id={popupId} className={ns.e('popup')} role="menu">
            {children}
          </ul>
        </Popper>
      </SubMenuContext.Provider>
    );
  }

  // Vertical mode expands and collapses inline.
  return (
    <li
      ref={ref}
      className={cls(ns.b(), ns.is('opened', open), ns.is('active', isActive), ns.is('disabled', disabled), className)}
      style={style}
      {...rest}
    >
      <div
        className={titleClasses}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={popupId}
        aria-disabled={disabled || undefined}
        onClick={handleTitleClick}
        onKeyDown={handleTitleKeyDown}
      >
        {titleContent}
      </div>
      <ul
        id={popupId}
        role="menu"
        className={cls(ns.e('content'), ns.is('opened', open))}
      >
        <SubMenuContext.Provider value={subMenuContext}>{children}</SubMenuContext.Provider>
      </ul>
    </li>
  );
});
