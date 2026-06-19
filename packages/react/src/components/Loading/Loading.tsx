import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cls, useNamespace } from '../../utils';
import { Portal } from '../Overlay';
import { Icon, LoadingIcon } from '../Icon';

export interface LoadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Whether the mask is shown. Default `true`. */
  visible?: boolean;
  /** Loading text rendered under the spinner. */
  text?: string;
  /** Cover the whole viewport instead of the positioned parent. */
  fullscreen?: boolean;
  /** Custom mask background (e.g. `rgba(0,0,0,0.7)`). */
  background?: string;
  /** Custom spinner element. Defaults to the rotating LoadingIcon. */
  spinner?: ReactNode;
  /** Content the mask overlays. Required for non-fullscreen masks to position over. */
  children?: ReactNode;
}

interface MaskProps {
  text?: string;
  fullscreen?: boolean;
  background?: string;
  spinner?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** The mask + spinner surface, shared by the component and the imperative service. */
function LoadingMask({ text, fullscreen, background, spinner, className, style }: MaskProps) {
  const ns = useNamespace('loading');
  const maskStyle: CSSProperties = {
    ...(background ? { [ns.cssVar('mask-bg')]: background } : {}),
    ...style,
  };
  return (
    <div
      className={cls(ns.e('mask'), ns.is('fullscreen', fullscreen), className)}
      style={maskStyle}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className={ns.e('spinner')}>
        {spinner ?? (
          <Icon className={ns.e('icon')} spin>
            <LoadingIcon />
          </Icon>
        )}
        {text && <p className={ns.e('text')}>{text}</p>}
      </div>
    </div>
  );
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(function Loading(props, ref) {
  const {
    visible = true,
    text,
    fullscreen = false,
    background,
    spinner,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('loading');

  const mask = visible ? (
    <LoadingMask
      text={text}
      fullscreen={fullscreen}
      background={background}
      spinner={spinner}
    />
  ) : null;

  if (fullscreen) {
    // Fullscreen masks teleport to the body so they cover the viewport
    // regardless of where the component is mounted.
    return <Portal>{mask}</Portal>;
  }

  // Relative masks are absolutely positioned over a positioned parent wrapper.
  return (
    <div
      ref={ref}
      className={cls(ns.b(), ns.is('parent'), className)}
      style={style}
      {...rest}
    >
      {children}
      {mask}
    </div>
  );
});

export interface LoadingServiceOptions {
  /** Loading text rendered under the spinner. */
  text?: string;
  /** Cover the whole viewport. Default `true` for the service. */
  fullscreen?: boolean;
  /** Custom mask background. */
  background?: string;
  /** Custom spinner element. */
  spinner?: ReactNode;
  /** Element (or selector) to mask. Implies a non-fullscreen mask. */
  target?: Element | string;
}

/** Imperative handle returned by `loading.service`. */
export interface LoadingInstance {
  close: () => void;
}

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

function resolveTarget(target?: Element | string): Element | null {
  if (!target) return null;
  if (typeof target === 'string') return document.querySelector(target);
  return target;
}

function ServiceMask({
  options,
  closed,
}: {
  options: LoadingServiceOptions;
  closed: boolean;
}) {
  // Mirror the enter/leave fade so closing animates out before unmount.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const ns = useNamespace('loading');
  return (
    <LoadingMask
      text={options.text}
      fullscreen={options.fullscreen}
      background={options.background}
      spinner={options.spinner}
      className={cls(visible && !closed ? ns.is('visible') : '')}
    />
  );
}

function service(options: LoadingServiceOptions = {}): LoadingInstance {
  if (!isBrowser()) {
    return { close: () => {} };
  }

  const targetEl = resolveTarget(options.target);
  const fullscreen = options.fullscreen ?? !targetEl;

  const host = document.createElement('div');
  host.className = 'ec-loading-service';

  if (targetEl && !fullscreen) {
    // Ensure the target establishes a positioning context for the absolute mask.
    const el = targetEl as HTMLElement;
    const computed = window.getComputedStyle(el).position;
    if (computed === 'static' || computed === '') {
      el.classList.add('ec-loading-parent');
    }
    el.appendChild(host);
  } else {
    document.body.appendChild(host);
  }

  const root: Root = createRoot(host);
  let closed = false;

  const render = () => {
    root.render(<ServiceMask options={{ ...options, fullscreen }} closed={closed} />);
  };
  render();

  return {
    close: () => {
      if (closed) return;
      closed = true;
      root.unmount();
      host.remove();
      if (targetEl) (targetEl as HTMLElement).classList.remove('ec-loading-parent');
    },
  };
}

interface LoadingComponent
  extends React.ForwardRefExoticComponent<
    LoadingProps & React.RefAttributes<HTMLDivElement>
  > {
  service: (options?: LoadingServiceOptions) => LoadingInstance;
}

(Loading as LoadingComponent).service = service;

/** Imperative loading API: `loading.service({ ... }).close()`. */
export const loading: { service: (options?: LoadingServiceOptions) => LoadingInstance } = {
  service,
};
