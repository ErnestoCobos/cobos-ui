import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { CheckboxGroupContext, type CheckboxValueType } from './CheckboxGroup';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'children'
  > {
  /** Controlled checked state (standalone). */
  checked?: boolean;
  /** Default checked state when uncontrolled (standalone). */
  defaultChecked?: boolean;
  /** Fired with the next checked state. */
  onChange?: (checked: boolean) => void;
  /** Value used to identify the checkbox inside a CheckboxGroup. */
  value?: CheckboxValueType;
  /** Content; also rendered when no children are provided. */
  label?: ReactNode;
  /** Disable the checkbox. */
  disabled?: boolean;
  /** Render the indeterminate (partial) state. */
  indeterminate?: boolean;
  /** Wrap the checkbox in a bordered box. */
  border?: boolean;
  /** Size. Falls back to the nearest CheckboxGroup / ConfigProvider. */
  size?: ComponentSize;
  /** Native input `name`. */
  name?: string;
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const group = useContext(CheckboxGroupContext);
  const {
    checked: checkedProp,
    defaultChecked,
    onChange,
    value,
    label,
    disabled: disabledProp,
    indeterminate = false,
    border = false,
    size: sizeProp,
    name,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('checkbox');
  const size = useSize(sizeProp ?? group?.size);

  const isControlled = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const inGroup = group !== null;
  const checked = inGroup
    ? value !== undefined && group.isChecked(value)
    : isControlled
      ? checkedProp
      : internalChecked;

  const disabled = useDisabled(disabledProp || group?.disabled);

  // In a group, block toggling that would violate min/max limits.
  const limited =
    inGroup &&
    value !== undefined &&
    ((checked && group.min !== undefined && group.value.length <= group.min) ||
      (!checked && group.max !== undefined && group.value.length >= group.max));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const next = event.target.checked;
    if (inGroup) {
      if (value !== undefined) group.toggle(value);
      onChange?.(next);
    } else {
      if (!isControlled) setInternalChecked(next);
      onChange?.(next);
    }
  };

  // The native `indeterminate` flag is a DOM property, not an attribute, so it
  // must be set imperatively. Merge that with the forwarded ref.
  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [indeterminate, ref],
  );

  const content = children ?? label;

  // A limit-blocked checkbox is non-interactive, so it must also read as disabled.
  const displayDisabled = disabled || limited;

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('checked', checked),
    ns.is('indeterminate', indeterminate),
    ns.is('disabled', displayDisabled),
    ns.is('bordered', border),
    className,
  );

  return (
    <label className={classes} style={style}>
      <span className={ns.e('input')}>
        <input
          ref={setRef}
          className={ns.e('original')}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={displayDisabled}
          aria-checked={indeterminate ? 'mixed' : checked}
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
