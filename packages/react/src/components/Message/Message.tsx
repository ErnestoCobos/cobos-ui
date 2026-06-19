import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cls, useNamespace } from '../../utils';
import { CloseIcon, StatusIcon, type StatusType } from './StatusIcon';

export type MessageType = StatusType;

export interface MessageOptions {
  /** Body content. */
  message?: ReactNode;
  /** Visual variant. Default `'info'`. */
  type?: MessageType;
  /** Auto-dismiss delay in ms. `0` keeps the toast until closed. Default `3000`. */
  duration?: number;
  /** Show a close button. */
  showClose?: boolean;
  /** Center the text. */
  center?: boolean;
  /** Distance in px from the top of the viewport for the first toast. Default `16`. */
  offset?: number;
  /** Extra class on the toast element. */
  className?: string;
  /** Fired after the toast has closed. */
  onClose?: () => void;
}

/** Imperative handle returned by every `message()` call. */
export interface MessageHandle {
  close: () => void;
}

interface MessageItem extends MessageOptions {
  id: number;
}

let seed = 0;
let root: Root | null = null;
let container: HTMLElement | null = null;
let items: MessageItem[] = [];

const DEFAULT_OFFSET = 16;
/** Vertical gap between stacked toasts, in px. */
const GAP = 16;

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

function ensureRoot(): Root | null {
  if (!isBrowser()) return null;
  if (!root) {
    container = document.createElement('div');
    container.className = 'ec-message-container';
    document.body.appendChild(container);
    root = createRoot(container);
  }
  return root;
}

function flush(): void {
  root?.render(<MessageList items={items} onRemove={remove} />);
}

function remove(id: number): void {
  const item = items.find((entry) => entry.id === id);
  items = items.filter((entry) => entry.id !== id);
  flush();
  item?.onClose?.();
}

interface MessageToastProps {
  item: MessageItem;
  /** Cumulative top offset (px) for this toast within the stack. */
  top: number;
  onRemove: (id: number) => void;
}

function MessageToast({ item, top, onRemove }: MessageToastProps) {
  const ns = useNamespace('message');
  const { type = 'info', duration = 3000, showClose, center, message } = item;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Trigger the enter transition on the next frame after mount.
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
    ns.m(type),
    ns.is('center', center),
    ns.is('closable', showClose),
    visible && ns.is('visible'),
    item.className,
  );

  const style: CSSProperties = { top: `${top}px` };

  return (
    <div ref={ref} className={classes} style={style} role="alert" aria-live="polite">
      <span className={ns.e('icon')}>
        <StatusIcon type={type} />
      </span>
      <span className={ns.e('content')}>{message}</span>
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

function MessageList({
  items: list,
  onRemove,
}: {
  items: MessageItem[];
  onRemove: (id: number) => void;
}) {
  let offset = 0;
  return (
    <>
      {list.map((item, index) => {
        const base = item.offset ?? DEFAULT_OFFSET;
        // First toast sits at its own offset; later toasts stack below the
        // previous ones with a fixed gap.
        const top = index === 0 ? base : offset + GAP;
        offset = top + 40; // approximate toast height for the next iteration
        return <MessageToast key={item.id} item={item} top={top} onRemove={onRemove} />;
      })}
    </>
  );
}

function normalize(options: MessageOptions | string): MessageOptions {
  return typeof options === 'string' ? { message: options } : options;
}

function open(options: MessageOptions | string): MessageHandle {
  const opts = normalize(options);
  const id = ++seed;

  if (!ensureRoot()) {
    // SSR / non-browser: return an inert handle.
    return { close: () => {} };
  }

  items = [...items, { ...opts, id }];
  flush();

  return { close: () => remove(id) };
}

type MessageFn = (options: MessageOptions | string) => MessageHandle;

interface MessageApi extends MessageFn {
  success: MessageFn;
  warning: MessageFn;
  info: MessageFn;
  error: MessageFn;
  /** Close every open message. */
  closeAll: () => void;
}

function withType(type: MessageType): MessageFn {
  return (options) => open({ ...normalize(options), type });
}

const message = open as MessageApi;
message.success = withType('success');
message.warning = withType('warning');
message.info = withType('info');
message.error = withType('error');
message.closeAll = () => {
  for (const item of [...items]) remove(item.id);
};

export { message };
/** Alias for the callable `message` API. */
export const Message = message;
