import { createContext, forwardRef, type HTMLAttributes, useMemo } from 'react';
import { cls, useNamespace } from '../../utils';
import type { ComponentSize } from '../../config-provider';
import type { ButtonType } from './Button';

export interface ButtonGroupContextValue {
  size?: ComponentSize;
  type?: ButtonType;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: ComponentSize;
  type?: ButtonType;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { size, type, className, children, ...rest },
  ref,
) {
  const ns = useNamespace('button-group');
  const ctx = useMemo<ButtonGroupContextValue>(() => ({ size, type }), [size, type]);
  return (
    <ButtonGroupContext.Provider value={ctx}>
      <div ref={ref} className={cls(ns.b(), className)} role="group" {...rest}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
});
