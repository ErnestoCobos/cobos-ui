import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Target container. Defaults to `document.body`. */
  container?: Element | (() => Element | null) | null;
  /** Render inline instead of teleporting. */
  disabled?: boolean;
}

/** Teleport content to a DOM container (SSR-safe: renders nothing until mounted). */
export function Portal({ children, container, disabled = false }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (disabled) return <>{children}</>;
  if (!mounted || typeof document === 'undefined') return null;

  const target = (typeof container === 'function' ? container() : container) ?? document.body;
  return createPortal(children, target);
}
