import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';
import { mix } from '@cobos/tokens';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { Icon, LoadingIcon } from '../Icon';
import { ButtonGroupContext } from './ButtonGroup';

export type ButtonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

export type ButtonNativeType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual variant. */
  type?: ButtonType;
  /** Size. Falls back to the nearest ButtonGroup / ConfigProvider. */
  size?: ComponentSize;
  /** Native button `type` attribute. */
  nativeType?: ButtonNativeType;
  /** Outlined style. */
  plain?: boolean;
  /** Text-only style (no background or border). */
  text?: boolean;
  /** Keep a background on text buttons. */
  bg?: boolean;
  /** Link style. */
  link?: boolean;
  /** Dashed border. */
  dashed?: boolean;
  /** Rounded corners. */
  round?: boolean;
  /** Circular button (for icon-only). */
  circle?: boolean;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /** Custom loading icon. */
  loadingIcon?: ReactNode;
  /** Disable the button. */
  disabled?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Custom base color; hover/active states are derived automatically. */
  color?: string;
  /** Treat `color` as a dark-mode color. */
  dark?: boolean;
  children?: ReactNode;
}

function buildColorStyle(
  color: string,
  plain: boolean,
  dark: boolean,
  text: boolean,
  link: boolean,
): CSSProperties {
  const ns = 'ec-button';
  const blend = dark ? '#141414' : '#ffffff';
  const style: Record<string, string> = {};
  if (text || link) {
    // Text/link buttons keep a transparent background, so only drive the
    // text colors from the custom color and leave bg/border to the
    // is-text / is-link rules.
    style[`--${ns}-text-color`] = color;
    style[`--${ns}-hover-text-color`] = mix(blend, color, 0.3);
    style[`--${ns}-active-text-color`] = mix('#000000', color, 0.1);
  } else if (plain) {
    style[`--${ns}-bg-color`] = mix(blend, color, 0.9);
    style[`--${ns}-text-color`] = color;
    style[`--${ns}-border-color`] = mix(blend, color, 0.5);
    style[`--${ns}-hover-bg-color`] = color;
    style[`--${ns}-hover-text-color`] = blend;
    style[`--${ns}-hover-border-color`] = color;
    style[`--${ns}-active-bg-color`] = mix('#000000', color, 0.1);
    style[`--${ns}-active-text-color`] = blend;
    style[`--${ns}-active-border-color`] = mix('#000000', color, 0.1);
  } else {
    style[`--${ns}-bg-color`] = color;
    style[`--${ns}-text-color`] = '#ffffff';
    style[`--${ns}-border-color`] = color;
    style[`--${ns}-hover-bg-color`] = mix(blend, color, 0.3);
    style[`--${ns}-hover-text-color`] = '#ffffff';
    style[`--${ns}-hover-border-color`] = mix(blend, color, 0.3);
    style[`--${ns}-active-bg-color`] = mix('#000000', color, 0.1);
    style[`--${ns}-active-text-color`] = '#ffffff';
    style[`--${ns}-active-border-color`] = mix('#000000', color, 0.1);
  }
  return style as CSSProperties;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const group = useContext(ButtonGroupContext);
  const {
    type = group?.type ?? 'default',
    size: sizeProp,
    nativeType = 'button',
    plain = false,
    text = false,
    bg = false,
    link = false,
    dashed = false,
    round = false,
    circle = false,
    loading = false,
    loadingIcon,
    disabled: disabledProp,
    icon,
    color,
    dark = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('button');
  const size = useSize(sizeProp ?? group?.size);
  const disabled = useDisabled(disabledProp) || loading;

  const classes = cls(
    ns.b(),
    type && type !== 'default' && ns.m(type),
    size !== 'default' && ns.m(size),
    ns.is('plain', plain),
    ns.is('round', round),
    ns.is('circle', circle),
    ns.is('text', text),
    ns.is('link', link),
    ns.is('dashed', dashed),
    ns.is('has-bg', bg),
    ns.is('loading', loading),
    ns.is('disabled', disabled),
    className,
  );

  const colorStyle = color ? buildColorStyle(color, plain, dark, text, link) : undefined;

  return (
    <button
      ref={ref}
      type={nativeType}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      style={{ ...colorStyle, ...style }}
      {...rest}
    >
      {loading ? (
        <Icon className={ns.e('loading')} spin>
          {loadingIcon ?? <LoadingIcon />}
        </Icon>
      ) : (
        icon && <Icon className={ns.e('icon')}>{icon}</Icon>
      )}
      {children !== undefined && children !== null && <span>{children}</span>}
    </button>
  );
});
