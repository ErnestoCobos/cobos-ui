import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';

export type SegmentedValue = string | number;

export interface SegmentedOption {
  /** Content shown on the segment. */
  label: ReactNode;
  /** Value reported on selection. */
  value: SegmentedValue;
  /** Disable this single segment. */
  disabled?: boolean;
}

export type SegmentedOptions = (SegmentedValue | SegmentedOption)[];

export interface SegmentedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Available segments. Plain strings/numbers are used as both label and value. */
  options: SegmentedOptions;
  /** Controlled selected value. */
  value?: SegmentedValue;
  /** Default selected value when uncontrolled. */
  defaultValue?: SegmentedValue;
  /** Fired when the selection changes. */
  onChange?: (value: SegmentedValue) => void;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Stretch to fill the available width, distributing segments evenly. */
  block?: boolean;
}

function normalize(option: SegmentedValue | SegmentedOption): SegmentedOption {
  if (typeof option === 'object') return option;
  return { label: option, value: option };
}

export const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(props, ref) {
  const {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    size: sizeProp,
    disabled: disabledProp,
    block = false,
    className,
    ...rest
  } = props;

  const ns = useNamespace('segmented');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  const items = options.map(normalize);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<SegmentedValue | undefined>(
    defaultValue ?? items[0]?.value,
  );
  const value = isControlled ? valueProp : internalValue;

  const select = (next: SegmentedValue) => {
    if (next === value) return;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const key = event.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'ArrowDown' && key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
    const count = items.length;
    // Walk to the next enabled segment, wrapping around.
    for (let i = 1; i <= count; i += 1) {
      const candidate = (index + step * i + count * count) % count;
      const item = items[candidate];
      if (item && !item.disabled) {
        select(item.value);
        break;
      }
    }
  };

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('block', block),
    ns.is('disabled', disabled),
    className,
  );

  return (
    <div ref={ref} className={classes} role="radiogroup" aria-disabled={disabled || undefined} {...rest}>
      <div className={ns.e('group')}>
        {items.map((item, index) => {
          const checked = item.value === value;
          const itemDisabled = disabled || item.disabled;
          return (
            <label
              key={item.value}
              className={cls(
                ns.e('item'),
                ns.is('selected', checked),
                ns.is('disabled', itemDisabled),
              )}
            >
              <input
                className={ns.e('item-input')}
                type="radio"
                role="radio"
                aria-checked={checked}
                checked={checked}
                disabled={itemDisabled}
                tabIndex={checked ? 0 : -1}
                onChange={() => select(item.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
              <span className={ns.e('item-label')}>{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
});
