import {
  type CSSProperties,
  type FocusEvent,
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { Icon } from '../Icon';

export type InputType =
  | 'text'
  | 'password'
  | 'textarea'
  | 'email'
  | 'url'
  | 'tel'
  | 'number'
  | 'search';

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'size'
    | 'type'
    | 'prefix'
    | 'onFocus'
    | 'onBlur'
    | 'onKeyDown'
  > {
  /** Controlled value. */
  value?: string;
  /** Initial value for the uncontrolled mode. */
  defaultValue?: string;
  /** Fired with the next value on every change. */
  onChange?: (value: string) => void;
  /** Input type. `textarea` renders a `<textarea>`. */
  type?: InputType;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Disable the control. */
  disabled?: boolean;
  /** Show a clear button when the field has a value. */
  clearable?: boolean;
  /** Toggleable password visibility (only for `type="password"`). */
  showPassword?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Make the field read-only. */
  readOnly?: boolean;
  /** Maximum number of characters. */
  maxLength?: number;
  /** Show a character counter (requires `maxLength`). */
  showWordLimit?: boolean;
  /** Content rendered before the input, inside the wrapper. */
  prefixIcon?: ReactNode;
  /** Content rendered after the input, inside the wrapper. */
  suffixIcon?: ReactNode;
  /** Content rendered before the wrapper, as a group addon. */
  prepend?: ReactNode;
  /** Content rendered after the wrapper, as a group addon. */
  append?: ReactNode;
  /** Number of visible rows for `type="textarea"`. */
  rows?: number;
  /** Native `name` attribute. */
  name?: string;
  /** Native `id` attribute. */
  id?: string;
  /** Native `autocomplete` attribute. */
  autoComplete?: string;
  /** Fired on focus. */
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Fired on blur. */
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Fired on key down. */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Fired when the clear button is pressed. */
  onClear?: () => void;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160 160 0 1 0 0 320 160 160 0 0 0 0-320z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M876.8 156.8a32 32 0 0 1 0 45.248l-67.2 67.2C903.872 339.776 970.24 442.88 1004.8 512 952.128 591.872 793.28 800 512 800c-78.4 0-148.736-16.192-210.688-41.6l-78.464 78.4a32 32 0 1 1-45.248-45.248l45.248-45.248L876.8 156.8a32 32 0 0 1 45.248 0zM512 224c-225.28 0-384.128 208.064-436.8 288 31.616 47.872 95.36 130.624 191.872 192.128l79.616-79.616A224 224 0 0 1 624.512 320.512L688 257.024A468.48 468.48 0 0 0 512 224zm224 288c0-22.336-3.264-43.904-9.344-64.256L431.744 742.656A224 224 0 0 0 736 512z"
      />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  props,
  ref,
) {
  const {
    value,
    defaultValue,
    onChange,
    type = 'text',
    size: sizeProp,
    disabled: disabledProp,
    clearable = false,
    showPassword = false,
    placeholder,
    readOnly = false,
    maxLength,
    showWordLimit = false,
    prefixIcon,
    suffixIcon,
    prepend,
    append,
    rows = 2,
    name,
    id,
    autoComplete,
    onFocus,
    onBlur,
    onKeyDown,
    onClear,
    className,
    style,
    ...rest
  } = props;

  const ns = useNamespace('input');
  const textareaNs = useNamespace('textarea');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = isControlled ? value : inner;

  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const update = (next: string) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const handleClear = () => {
    update('');
    onClear?.();
  };

  // Keep focus on the field when activating a suffix control with the pointer.
  const preventBlur = (event: MouseEvent) => {
    event.preventDefault();
  };

  const wordCount = (
    <span className={ns.e('count')}>
      {current.length}
      {maxLength !== undefined ? ` / ${maxLength}` : ''}
    </span>
  );

  if (type === 'textarea') {
    const classes = cls(
      textareaNs.b(),
      size !== 'default' && textareaNs.m(size),
      textareaNs.is('disabled', disabled),
      textareaNs.is('exceed', maxLength !== undefined && current.length > maxLength),
      className,
    );
    return (
      <div className={classes} style={style}>
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={textareaNs.e('inner')}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={rows}
          name={name}
          id={id}
          autoComplete={autoComplete}
          onChange={(event) => update(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={onKeyDown}
        />
        {showWordLimit && maxLength !== undefined && wordCount}
      </div>
    );
  }

  const showClear = clearable && !disabled && !readOnly && current.length > 0;
  const showPasswordToggle = showPassword && type === 'password' && !disabled && !readOnly;
  const inputType = type === 'password' && passwordVisible ? 'text' : type;
  const hasSuffix = showClear || showPasswordToggle || suffixIcon || (showWordLimit && maxLength !== undefined);

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('disabled', disabled),
    ns.is('focus', focused),
    prepend !== undefined && prepend !== null && ns.is('prepend'),
    append !== undefined && append !== null && ns.is('append'),
    className,
  );

  return (
    <div className={classes} style={style}>
      {prepend !== undefined && prepend !== null && (
        <div className={ns.b('group__prepend')}>{prepend}</div>
      )}
      <div className={ns.e('wrapper')}>
        {prefixIcon && (
          <span className={ns.e('prefix')}>
            <Icon className={ns.e('icon')}>{prefixIcon}</Icon>
          </span>
        )}
        <input
          {...rest}
          ref={ref as React.Ref<HTMLInputElement>}
          className={ns.e('inner')}
          type={inputType}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          name={name}
          id={id}
          autoComplete={autoComplete}
          onChange={(event) => update(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onKeyDown={onKeyDown}
        />
        {hasSuffix && (
          <span className={ns.e('suffix')}>
            {showClear && (
              <button
                type="button"
                className={cls(ns.e('icon'), ns.e('clear'))}
                aria-label="Clear"
                onMouseDown={preventBlur}
                onClick={handleClear}
              >
                <Icon>
                  <ClearIcon />
                </Icon>
              </button>
            )}
            {showPasswordToggle && (
              <button
                type="button"
                className={cls(ns.e('icon'), ns.e('password'))}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                onMouseDown={preventBlur}
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                <Icon>{passwordVisible ? <EyeIcon /> : <EyeOffIcon />}</Icon>
              </button>
            )}
            {showWordLimit && maxLength !== undefined && wordCount}
            {suffixIcon && <Icon className={ns.e('icon')}>{suffixIcon}</Icon>}
          </span>
        )}
      </div>
      {append !== undefined && append !== null && (
        <div className={ns.b('group__append')}>{append}</div>
      )}
    </div>
  );
});
