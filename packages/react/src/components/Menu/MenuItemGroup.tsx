import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';
import { cls, useNamespace } from '../../utils';

export interface MenuItemGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Group label. */
  title?: ReactNode;
  children?: ReactNode;
}

export const MenuItemGroup = forwardRef<HTMLDivElement, MenuItemGroupProps>(
  function MenuItemGroup(props, ref) {
    const { title, className, children, ...rest } = props;

    const ns = useNamespace('menu-item-group');
    const titleId = useId();
    const hasTitle = title !== undefined && title !== null;

    // The `<div>` itself is the `group`. A `group` is an allowed direct child of
    // a `menu`/`menubar`, so the contained `menuitem`s keep a valid required
    // parent. The group's children are placed directly inside the `group`, so
    // no intervening `ul`/`li` is emitted.
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={hasTitle ? titleId : undefined}
        className={cls(ns.b(), className)}
        {...rest}
      >
        {hasTitle && (
          <div id={titleId} className={ns.e('title')} aria-hidden="true">
            {title}
          </div>
        )}
        {children}
      </div>
    );
  },
);
