import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';

export type RadioValueType = string | number;

export interface RadioGroupContextValue {
  /** Currently selected value. */
  value: RadioValueType | undefined;
  /** Select the given value. */
  select: (value: RadioValueType) => void;
  /** Disable every descendant radio. */
  disabled: boolean;
  /** Size shared by descendant radios. */
  size: ComponentSize;
  /** Shared native `name`, grouping the radios. */
  name: string;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled selected value. */
  value?: RadioValueType;
  /** Default selected value when uncontrolled. */
  defaultValue?: RadioValueType;
  /** Fired when the selection changes. */
  onChange?: (value: RadioValueType) => void;
  /** Disable every radio in the group. */
  disabled?: boolean;
  /** Size shared by descendant radios. */
  size?: ComponentSize;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  props,
  ref,
) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    disabled: disabledProp,
    size: sizeProp,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('radio-group');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);
  const name = useId();

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<RadioValueType | undefined>(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const select = useCallback(
    (v: RadioValueType) => {
      if (v === value) return;
      if (!isControlled) setInternalValue(v);
      onChange?.(v);
    },
    [value, isControlled, onChange],
  );

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({ value, select, disabled, size, name }),
    [value, select, disabled, size, name],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div ref={ref} className={cls(ns.b(), className)} role="radiogroup" {...rest}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
