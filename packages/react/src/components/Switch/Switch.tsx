import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { Icon, LoadingIcon } from '../Icon';

export interface SwitchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled checked state. */
  value?: boolean;
  /** Initial checked state for the uncontrolled mode. */
  defaultValue?: boolean;
  /** Fired with the next checked state. */
  onChange?: (value: boolean) => void;
  /** Disable the control. */
  disabled?: boolean;
  /** Show a loading spinner and block interaction. */
  loading?: boolean;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Text shown when on. */
  activeText?: string;
  /** Text shown when off. */
  inactiveText?: string;
  /** Render the texts inside the rail instead of beside it. */
  inlinePrompt?: boolean;
  /** Custom rail width. */
  width?: number | string;
  /** Icon shown on the knob when on. */
  activeIcon?: ReactNode;
  /** Icon shown on the knob when off. */
  inactiveIcon?: ReactNode;
  /** Native `name` attribute, mirrored onto a hidden input. */
  name?: string;
  /** Native `id` attribute. */
  id?: string;
  /** Accessible name for the `switch` role. */
  'aria-label'?: string;
  /** ID of the element labelling the `switch` role. */
  'aria-labelledby'?: string;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
}

export const Switch = forwardRef<HTMLDivElement, SwitchProps>(function Switch(props, ref) {
  const {
    value,
    defaultValue,
    onChange,
    disabled: disabledProp,
    loading = false,
    size: sizeProp,
    activeText,
    inactiveText,
    inlinePrompt = false,
    width,
    activeIcon,
    inactiveIcon,
    name,
    id,
    className,
    style,
    ...rest
  } = props;

  const ns = useNamespace('switch');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp) || loading;

  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? false);
  const checked = isControlled ? value : inner;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('checked', checked),
    ns.is('disabled', disabled),
    ns.is('loading', loading),
    className,
  );

  const coreStyle: CSSProperties =
    width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {};

  const renderText = (text: string | undefined, active: boolean) =>
    text !== undefined && (
      <span className={cls(ns.e('label'), ns.em('label', active ? 'right' : 'left'), ns.is('active', checked === active))}>
        {text}
      </span>
    );

  return (
    <div
      ref={ref}
      {...rest}
      role="switch"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      id={id}
      className={classes}
      style={style}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      {name !== undefined && <input type="hidden" name={name} value={checked ? 'true' : 'false'} />}
      {!inlinePrompt && renderText(inactiveText, false)}
      <span className={ns.e('core')} style={coreStyle}>
        {inlinePrompt && (
          <span className={ns.e('inner')}>
            {checked
              ? activeText !== undefined && (
                  <span className={cls(ns.e('inner-text'), ns.is('active'))}>{activeText}</span>
                )
              : inactiveText !== undefined && (
                  <span className={ns.e('inner-text')}>{inactiveText}</span>
                )}
          </span>
        )}
        <span className={ns.e('action')}>
          {loading ? (
            <Icon className={ns.e('loading')} spin>
              <LoadingIcon />
            </Icon>
          ) : checked ? (
            activeIcon && <Icon className={ns.e('icon')}>{activeIcon}</Icon>
          ) : (
            inactiveIcon && <Icon className={ns.e('icon')}>{inactiveIcon}</Icon>
          )}
        </span>
      </span>
      {!inlinePrompt && renderText(activeText, true)}
    </div>
  );
});
