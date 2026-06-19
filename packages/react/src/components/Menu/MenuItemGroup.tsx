import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface MenuItemGroupProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Group label. */
  title?: ReactNode;
  children?: ReactNode;
}

export const MenuItemGroup = forwardRef<HTMLLIElement, MenuItemGroupProps>(
  function MenuItemGroup(props, ref) {
    const { title, className, children, ...rest } = props;

    const ns = useNamespace('menu-item-group');

    return (
      <li ref={ref} className={cls(ns.b(), className)} role="presentation" {...rest}>
        {title !== undefined && title !== null && (
          <div className={ns.e('title')}>{title}</div>
        )}
        <ul className={ns.e('content')} role="group">
          {children}
        </ul>
      </li>
    );
  },
);
