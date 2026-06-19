import { useEffect, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cls, useNamespace } from '../../utils';
import { CloseIcon, StatusIcon, type StatusType } from '../Message/StatusIcon';

export type NotificationType = StatusType;

export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface NotificationOptions {
  /** Bold heading. */
  title?: ReactNode;
  /** Body content. */
  message?: ReactNode;
  /** Visual variant; drives the leading icon. Omit for no icon. */
  type?: NotificationType;
  /** Auto-dismiss delay in ms. `0` keeps the card until closed. Default `4500`. */
  duration?: number;
  /** Corner to stack the card in. Default `'top-right'`. */
  position?: NotificationPosition;
  /** Show a close button. Default `true`. */
  showClose?: boolean;
  /** Extra class on the card element. */
  className?: string;
  /** Fired after the card has closed. */
  onClose?: () => void;
}

/** Imperative handle returned by every `notification()` call. */
export interface NotificationHandle {
  close: () => void;
}

interface NotificationItem extends NotificationOptions {
  id: number;
}

let seed = 0;
let root: Root | null = null;
let container: HTMLElement | null = null;
let items: NotificationItem[] = [];

const DEFAULT_POSITION: NotificationPosition = 'top-right';

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

function ensureRoot(): Root | null {
  if (!isBrowser()) return null;
  if (!root) {
    container = document.createElement('div');
    container.className = 'ec-notification-container';
    document.body.appendChild(container);
    root = createRoot(container);
  }
  return root;
}

function flush(): void {
  root?.render(<NotificationList items={items} onRemove={remove} />);
}

function remove(id: number): void {
  const item = items.find((entry) => entry.id === id);
  items = items.filter((entry) => entry.id !== id);
  flush();
  item?.onClose?.();
}

interface NotificationCardProps {
  item: NotificationItem;
  onRemove: (id: number) => void;
}

function NotificationCard({ item, onRemove }: NotificationCardProps) {
  const ns = useNamespace('notification');
  const {
    title,
    message,
    type,
    duration = 4500,
    position = DEFAULT_POSITION,
    showClose = true,
  } = item;
  const [visible, setVisible] = useState(false);
  const isLeft = position.endsWith('left');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = window.setTimeout(() => onRemove(item.id), duration);
    return () => window.clearTimeout(timer);
  }, [duration, item.id, onRemove]);

  const classes = cls(
    ns.b(),
    type && ns.m(type),
    ns.is('left', isLeft),
    ns.is('with-icon', Boolean(type)),
    visible && ns.is('visible'),
    item.className,
  );

  return (
    <div className={classes} role="alert" aria-live="polite">
      {type && (
        <span className={ns.e('icon')}>
          <StatusIcon type={type} />
        </span>
      )}
      <div className={ns.e('group')}>
        {title != null && <div className={ns.e('title')}>{title}</div>}
        {message != null && <div className={ns.e('content')}>{message}</div>}
      </div>
      {showClose && (
        <button
          type="button"
          className={ns.e('closebtn')}
          aria-label="Close"
          onClick={() => onRemove(item.id)}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

function NotificationList({
  items: list,
  onRemove,
}: {
  items: NotificationItem[];
  onRemove: (id: number) => void;
}) {
  const ns = useNamespace('notification');
  const positions: NotificationPosition[] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
  ];
  return (
    <>
      {positions.map((position) => {
        const group = list.filter(
          (item) => (item.position ?? DEFAULT_POSITION) === position,
        );
        if (group.length === 0) return null;
        return (
          <div key={position} className={cls(ns.e('wrapper'), ns.em('wrapper', position))}>
            {group.map((item) => (
              <NotificationCard key={item.id} item={item} onRemove={onRemove} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function normalize(options: NotificationOptions | string): NotificationOptions {
  return typeof options === 'string' ? { message: options } : options;
}

function open(options: NotificationOptions | string): NotificationHandle {
  const opts = normalize(options);
  const id = ++seed;

  if (!ensureRoot()) {
    return { close: () => {} };
  }

  items = [...items, { ...opts, id }];
  flush();

  return { close: () => remove(id) };
}

type NotificationFn = (options: NotificationOptions | string) => NotificationHandle;

interface NotificationApi extends NotificationFn {
  success: NotificationFn;
  warning: NotificationFn;
  info: NotificationFn;
  error: NotificationFn;
  /** Close every open notification. */
  closeAll: () => void;
}

function withType(type: NotificationType): NotificationFn {
  return (options) => open({ ...normalize(options), type });
}

const notification = open as NotificationApi;
notification.success = withType('success');
notification.warning = withType('warning');
notification.info = withType('info');
notification.error = withType('error');
notification.closeAll = () => {
  for (const item of [...items]) remove(item.id);
};

export { notification };
/** Alias for the callable `notification` API. */
export const Notification = notification;
