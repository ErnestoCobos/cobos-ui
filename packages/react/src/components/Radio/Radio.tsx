import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { RadioGroupContext, type RadioValueType } from './RadioGroup';

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'children'
  > {
  /** Value identifying the radio. Required inside a RadioGroup. */
  value?: RadioValueType;
  /** Controlled checked state (standalone). */
  checked?: boolean;
  /** Default checked state when uncontrolled (standalone). */
  defaultChecked?: boolean;
  /** Fired with this radio's value when it becomes checked. */
  onChange?: (value: RadioValueType | undefined) => void;
  /** Content; also rendered when no children are provided. */
  label?: ReactNode;
  /** Disable the radio. */
  disabled?: boolean;
  /** Wrap the radio in a bordered box. */
  border?: boolean;
  /** Size. Falls back to the nearest RadioGroup / ConfigProvider. */
  size?: ComponentSize;
  /** Native input `name`. */
  name?: string;
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const group = useContext(RadioGroupContext);
  const {
    value,
    checked: checkedProp,
    defaultChecked,
    onChange,
    label,
    disabled: disabledProp,
    border = false,
    size: sizeProp,
    name,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('radio');
  const size = useSize(sizeProp ?? group?.size);

  const isControlled = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const inGroup = group !== null;
  const checked = inGroup
    ? value !== undefined && group.value === value
    : isControlled
      ? checkedProp
      : internalChecked;

  const disabled = useDisabled(disabledProp || group?.disabled);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!event.target.checked) return;
    if (inGroup) {
      if (value !== undefined) group.select(value);
    } else {
      if (!isControlled) setInternalChecked(true);
      onChange?.(value);
    }
  };

  const content = children ?? label;

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('checked', checked),
    ns.is('disabled', disabled),
    ns.is('bordered', border),
    className,
  );

  return (
    <label className={classes} style={style}>
      <span className={ns.e('input')}>
        <input
          ref={ref}
          className={ns.e('original')}
          type="radio"
          name={inGroup ? group.name : name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        <span className={ns.e('inner')} />
      </span>
      {(content !== undefined && content !== null) && (
        <span className={ns.e('label')}>{content}</span>
      )}
    </label>
  );
});
