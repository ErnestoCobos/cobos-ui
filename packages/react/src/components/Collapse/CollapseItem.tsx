import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';
import { cls, useNamespace } from '../../utils';
import { type CollapseName, useCollapseContext } from './Collapse';

export interface CollapseItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Unique identifier, matched against the Collapse active names. */
  name: CollapseName;
  /** Header content. */
  title?: ReactNode;
  /** Disable toggling this item. */
  disabled?: boolean;
  /** Custom icon replacing the default chevron. */
  icon?: ReactNode;
  children?: ReactNode;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.4a32 32 0 0 0 0-44.736L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
      />
    </svg>
  );
}

export const CollapseItem = forwardRef<HTMLDivElement, CollapseItemProps>(function CollapseItem(
  props,
  ref,
) {
  const { name, title, disabled = false, icon, className, children, ...rest } = props;

  const ns = useNamespace('collapse-item');
  const context = useCollapseContext();
  const reactId = useId();
  const headerId = `${ns.b()}-head-${reactId}`;
  const panelId = `${ns.b()}-panel-${reactId}`;

  const isActive = context?.activeNames.includes(name) ?? false;

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    context?.toggle(name);
  };

  return (
    <div
      ref={ref}
      className={cls(
        ns.b(),
        ns.is('active', isActive),
        ns.is('disabled', disabled),
        className,
      )}
      {...rest}
    >
      <button
        type="button"
        id={headerId}
        className={cls(ns.e('header'), ns.is('active', isActive))}
        aria-expanded={isActive}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className={ns.e('title')}>{title}</span>
        <span className={cls(ns.e('arrow'), ns.is('active', isActive))} aria-hidden="true">
          {icon ?? <ChevronIcon />}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cls(ns.e('wrap'), ns.is('active', isActive))}
        hidden={!isActive}
      >
        <div className={ns.e('content')}>{children}</div>
      </div>
    </div>
  );
});
