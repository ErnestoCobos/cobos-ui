import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type AlertType = 'success' | 'warning' | 'info' | 'error';

export type AlertEffect = 'light' | 'dark';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title text. */
  title?: ReactNode;
  /** Visual variant. Default `'info'`. */
  type?: AlertType;
  /** Descriptive content beneath the title. Falls back to `children`. */
  description?: ReactNode;
  /** Show the close affordance. Default `true`. */
  closable?: boolean;
  /** Custom text for the close affordance (replaces the close icon). */
  closeText?: string;
  /** Center the title text. */
  center?: boolean;
  /** Theme intensity. Default `'light'`. */
  effect?: AlertEffect;
  /** Show the leading type icon. Default `false`. */
  showIcon?: boolean;
  /** Fired when the alert is closed. */
  onClose?: (e: MouseEvent) => void;
  children?: ReactNode;
}

const ICON_PATHS: Record<AlertType, string> = {
  // success: filled circle with a check
  success:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 4.8-4.8 1.4 1.4-6.2 6.2z',
  // warning: triangle with an exclamation mark
  warning:
    'M12 2 1 21h22L12 2zm1 14h-2v2h2v-2zm0-7h-2v5h2V9z',
  // info: filled circle with a lowercase i
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  // error: filled circle with a cross
  error:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
};

function TypeIcon({ type, className }: { type: AlertType; className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d={ICON_PATHS[type]} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M13.41 12l5.3-5.29a1 1 0 1 0-1.42-1.42L12 10.59l-5.29-5.3a1 1 0 0 0-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L12 13.41l5.29 5.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
      />
    </svg>
  );
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const {
    title,
    type = 'info',
    description,
    closable = true,
    closeText,
    center = false,
    effect = 'light',
    showIcon = false,
    onClose,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('alert');
  const [visible, setVisible] = useState(true);

  const handleClose = (e: MouseEvent) => {
    setVisible(false);
    onClose?.(e);
  };

  if (!visible) return null;

  const classes = cls(
    ns.b(),
    ns.m(type),
    ns.m(effect),
    ns.is('center', center),
    ns.is('with-description', description != null || children != null),
    className,
  );

  const body = description ?? children;

  return (
    <div ref={ref} className={classes} role="alert" {...rest}>
      {showIcon && <TypeIcon type={type} className={ns.e('icon')} />}
      <div className={ns.e('content')}>
        {title != null && <span className={ns.e('title')}>{title}</span>}
        {body != null && <p className={ns.e('description')}>{body}</p>}
      </div>
      {closable &&
        (closeText ? (
          <button
            type="button"
            className={cls(ns.e('close-btn'), ns.is('customed'))}
            aria-label="Close"
            onClick={handleClose}
          >
            {closeText}
          </button>
        ) : (
          <button
            type="button"
            className={ns.e('close-btn')}
            aria-label="Close"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        ))}
    </div>
  );
});
