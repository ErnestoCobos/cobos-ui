import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';

export type CheckboxValueType = string | number;

export interface CheckboxGroupContextValue {
  /** Currently checked values. */
  value: CheckboxValueType[];
  /** Whether the given value is checked. */
  isChecked: (value: CheckboxValueType) => boolean;
  /** Toggle the given value, respecting `min`/`max`. */
  toggle: (value: CheckboxValueType) => void;
  /** Disable every descendant checkbox. */
  disabled: boolean;
  /** Size shared by descendant checkboxes. */
  size: ComponentSize;
  /** Minimum number of checked items. */
  min?: number;
  /** Maximum number of checked items. */
  max?: number;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled checked values. */
  value?: CheckboxValueType[];
  /** Default checked values when uncontrolled. */
  defaultValue?: CheckboxValueType[];
  /** Fired when the checked values change. */
  onChange?: (value: CheckboxValueType[]) => void;
  /** Disable every checkbox in the group. */
  disabled?: boolean;
  /** Size shared by descendant checkboxes. */
  size?: ComponentSize;
  /** Minimum number of checked items. */
  min?: number;
  /** Maximum number of checked items. */
  max?: number;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  props,
  ref,
) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    disabled: disabledProp,
    size: sizeProp,
    min,
    max,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('checkbox-group');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<CheckboxValueType[]>(defaultValue ?? []);
  const value = isControlled ? valueProp : internalValue;

  const isChecked = useCallback(
    (v: CheckboxValueType) => value.includes(v),
    [value],
  );

  const toggle = useCallback(
    (v: CheckboxValueType) => {
      const checked = value.includes(v);
      if (checked) {
        if (min !== undefined && value.length <= min) return;
      } else {
        if (max !== undefined && value.length >= max) return;
      }
      const next = checked ? value.filter((item) => item !== v) : [...value, v];
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [value, min, max, isControlled, onChange],
  );

  const ctx = useMemo<CheckboxGroupContextValue>(
    () => ({ value, isChecked, toggle, disabled, size, min, max }),
    [value, isChecked, toggle, disabled, size, min, max],
  );

  return (
    <CheckboxGroupContext.Provider value={ctx}>
      <div ref={ref} className={cls(ns.b(), className)} role="group" {...rest}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});
