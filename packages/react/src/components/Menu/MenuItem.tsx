import { forwardRef, type LiHTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';
import { useMenuContext, useSubMenuContext } from './Menu';

export interface MenuItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Unique identifier used to mark the item active. */
  index: string;
  /** Disable interaction. */
  disabled?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  children?: ReactNode;
}

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(props, ref) {
  const { index, disabled = false, icon, className, style, children, ...rest } = props;

  const ns = useNamespace('menu-item');
  const menu = useMenuContext();
  const parent = useSubMenuContext();

  const isActive = menu?.activeIndex === index;

  const handleClick = () => {
    if (disabled) {
      return;
    }
    menu?.setActive(index);
    // Selecting an item inside a horizontal popup collapses the open sub-menu
    // chain, mirroring Element Plus. Inline (vertical) sub-menus stay expanded.
    if (menu?.mode === 'horizontal' && parent) {
      menu.closeMenuBranch(parent.parentIndex);
    }
  };

  const classes = cls(
    ns.b(),
    ns.is('active', isActive),
    ns.is('disabled', disabled),
    className,
  );

  return (
    <li
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={classes}
      style={style}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      {...rest}
    >
      {icon && <span className={ns.e('icon')}>{icon}</span>}
      <span className={ns.e('title')}>{children}</span>
    </li>
  );
});
