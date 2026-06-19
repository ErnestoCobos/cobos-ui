import {
  cloneElement,
  forwardRef,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react';
import { useNamespace } from '../../utils';
import { type Placement, Popper } from '../Overlay';
import { Button, type ButtonType } from '../Button';

/** Default warning icon, colored via `currentColor`. */
function WarningIcon() {
  return (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0-576a48 48 0 0 1 48 48v224a48 48 0 0 1-96 0V368a48 48 0 0 1 48-48zm0 432a48 48 0 1 1 0-96 48 48 0 0 1 0 96z" />
    </svg>
  );
}

export interface PopconfirmProps {
  /** Confirmation prompt shown next to the icon. */
  title: ReactNode;
  /** Confirm button label. */
  confirmButtonText?: string;
  /** Cancel button label. */
  cancelButtonText?: string;
  /** Button type used for the confirm action. */
  confirmButtonType?: ButtonType;
  /** Leading icon; defaults to a warning mark colored with `--ec-color-warning`. */
  icon?: ReactNode;
  /** Hide the leading icon entirely. */
  hideIcon?: boolean;
  /** Placement of the confirm box relative to the trigger. */
  placement?: Placement;
  /** Fixed width of the confirm box. */
  width?: number | string;
  /** Gap between the trigger and the confirm box, in px. */
  offset?: number;
  /** Disable the confirm box; the trigger renders without one. */
  disabled?: boolean;
  /** Fired when the confirm button is clicked. */
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Fired when the cancel button is clicked. */
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Trigger element. */
  children: ReactElement;
}

export const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>(function Popconfirm(
  props,
  ref,
) {
  const {
    title,
    confirmButtonText = 'Yes',
    cancelButtonText = 'No',
    confirmButtonType = 'primary',
    icon,
    hideIcon = false,
    placement = 'top',
    width,
    offset = 8,
    disabled = false,
    onConfirm,
    onCancel,
    children,
  } = props;

  const ns = useNamespace('popconfirm');
  const [open, setOpen] = useState(false);

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const reference = ref ? cloneElement(children, { ref } as Record<string, unknown>) : children;

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onConfirm?.(event);
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onCancel?.(event);
  };

  return (
    <Popper
      reference={reference}
      trigger="click"
      placement={placement}
      offset={offset}
      role="dialog"
      showArrow
      disabled={disabled}
      popperClass={ns.b()}
      popperStyle={width != null ? { width } : undefined}
      open={open}
      onOpenChange={setOpen}
    >
      <div className={ns.e('main')}>
        {!hideIcon && (
          <span className={ns.e('icon')} aria-hidden="true">
            {icon ?? <WarningIcon />}
          </span>
        )}
        <span className={ns.e('title')}>{title}</span>
      </div>
      <div className={ns.e('action')}>
        <Button size="small" text bg onClick={handleCancel}>
          {cancelButtonText}
        </Button>
        <Button size="small" type={confirmButtonType} onClick={handleConfirm}>
          {confirmButtonText}
        </Button>
      </div>
    </Popper>
  );
});
