import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface TabPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /** Unique identifier for the pane, matched against the active value. */
  name: string;
  /** Tab header label. */
  label?: ReactNode;
  /** Disable selecting this pane. */
  disabled?: boolean;
  /** Allow this specific pane to be closed (overrides the parent `closable`). */
  closable?: boolean;
  /** Only render the pane content once it has been activated. */
  lazy?: boolean;
  children?: ReactNode;
}

/**
 * Configuration carrier for a single tab. `Tabs` reads these props to build the
 * header; when rendered on its own it falls back to a simple tab panel.
 */
export const TabPane = forwardRef<HTMLDivElement, TabPaneProps>(function TabPane(props, ref) {
  const {
    name,
    label,
    disabled = false,
    closable,
    lazy,
    className,
    children,
    ...rest
  } = props;

  // `label`, `disabled`, `closable` and `lazy` are consumed by the parent Tabs.
  void label;
  void disabled;
  void closable;
  void lazy;

  const ns = useNamespace('tab-pane');

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-name={name}
      className={cls(ns.b(), className)}
      {...rest}
    >
      {children}
    </div>
  );
});
