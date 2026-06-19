import {
  type CSSProperties,
  type FocusEvent,
  forwardRef,
  type KeyboardEvent,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';

export interface InputNumberProps {
  /** Controlled value. */
  value?: number;
  /** Initial value for the uncontrolled mode. */
  defaultValue?: number;
  /** Fired with the next value, or `null` when the field is empty. */
  onChange?: (value: number | null) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Increment / decrement step. */
  step?: number;
  /** Only allow values that are multiples of `step`. */
  stepStrictly?: boolean;
  /** Number of decimal places to keep. */
  precision?: number;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Disable the control. */
  disabled?: boolean;
  /** Make the field read-only: non-editable while still focusable, stepping disabled. */
  readonly?: boolean;
  /** Show the increase / decrease buttons. */
  controls?: boolean;
  /** Place both controls on the right, stacked. */
  controlsPosition?: 'right' | '';
  /** Placeholder text. */
  placeholder?: string;
  /** Native `name` attribute. */
  name?: string;
  /** Native `id` attribute. */
  id?: string;
  /** Accessible name for the field. */
  'aria-label'?: string;
  /** Fired on focus. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Fired on blur, after the value has been clamped. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M128 480h768a32 32 0 1 1 0 64H128a32 32 0 0 1 0-64z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
      />
    </svg>
  );
}

function toPrecision(value: number, precision?: number): number {
  if (precision === undefined) return value;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  props,
  ref,
) {
  const {
    value,
    defaultValue,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    stepStrictly = false,
    precision,
    size: sizeProp,
    disabled: disabledProp,
    readonly = false,
    controls = true,
    controlsPosition = '',
    placeholder,
    name,
    id,
    'aria-label': ariaLabel,
    onFocus,
    onBlur,
    className,
    style,
  } = props;

  const ns = useNamespace('input-number');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  const isControlled = value !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue ?? null);
  const current = isControlled ? value : inner;

  const clamp = (raw: number): number => {
    let next = raw;
    if (stepStrictly) next = Math.round(next / step) * step;
    next = toPrecision(next, precision);
    if (next < min) next = min;
    if (next > max) next = max;
    return next;
  };

  const update = (next: number | null) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const handleStep = (direction: 1 | -1) => {
    if (disabled || readonly) return;
    const base = current ?? 0;
    update(clamp(base + direction * step));
  };

  const handleInput = (raw: string) => {
    if (raw === '') {
      update(null);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    update(parsed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readonly) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      handleStep(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      handleStep(-1);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (current !== null && current !== undefined) {
      const clamped = clamp(current);
      if (clamped !== current) update(clamped);
    }
    onBlur?.(event);
  };

  const decreaseDisabled =
    disabled || readonly || (current !== null && current !== undefined && current <= min);
  const increaseDisabled =
    disabled || readonly || (current !== null && current !== undefined && current >= max);

  const displayValue =
    current === null || current === undefined
      ? ''
      : precision !== undefined
        ? current.toFixed(precision)
        : String(current);

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('disabled', disabled),
    ns.is('without-controls', !controls),
    controls && controlsPosition === 'right' && ns.is('controls-right'),
    className,
  );

  const decreaseButton = (
    <span
      role="button"
      aria-label="Decrease"
      aria-disabled={decreaseDisabled || undefined}
      tabIndex={-1}
      className={cls(ns.e('decrease'), decreaseDisabled && ns.is('disabled'))}
      onClick={() => {
        if (!decreaseDisabled) handleStep(-1);
      }}
    >
      <MinusIcon />
    </span>
  );

  const increaseButton = (
    <span
      role="button"
      aria-label="Increase"
      aria-disabled={increaseDisabled || undefined}
      tabIndex={-1}
      className={cls(ns.e('increase'), increaseDisabled && ns.is('disabled'))}
      onClick={() => {
        if (!increaseDisabled) handleStep(1);
      }}
    >
      <PlusIcon />
    </span>
  );

  return (
    <div className={classes} style={style}>
      {controls && controlsPosition !== 'right' && decreaseButton}
      <div className={ns.e('wrapper')}>
        <input
          ref={ref}
          className={ns.e('inner')}
          type="text"
          role="spinbutton"
          inputMode="decimal"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          name={name}
          id={id}
          aria-label={ariaLabel}
          aria-valuenow={current ?? undefined}
          aria-valuemin={min === -Infinity ? undefined : min}
          aria-valuemax={max === Infinity ? undefined : max}
          aria-disabled={disabled || undefined}
          onChange={(event) => handleInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={handleBlur}
        />
      </div>
      {controls && controlsPosition !== 'right' && increaseButton}
      {controls && controlsPosition === 'right' && (
        <span className={ns.e('controls')}>
          {increaseButton}
          {decreaseButton}
        </span>
      )}
    </div>
  );
});
