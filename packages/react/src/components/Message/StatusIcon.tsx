import type { ReactNode } from 'react';

export type StatusType = 'success' | 'warning' | 'info' | 'error';

/** Filled status glyphs, matching the Element Plus feedback icon shapes. */
const PATHS: Record<StatusType, string> = {
  success:
    'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z',
  warning:
    'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z',
  info: 'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm67.2 275.2a51.2 51.2 0 1 0-102.4 0 51.2 51.2 0 0 0 102.4 0zM512 416a38.4 38.4 0 0 0-38.4 38.4v224a38.4 38.4 0 0 0 76.8 0v-224A38.4 38.4 0 0 0 512 416z',
  error:
    'M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z',
};

/** Renders the filled status glyph for the given feedback type. */
export function StatusIcon({ type }: { type: StatusType }): ReactNode {
  return (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path fill="currentColor" d={PATHS[type]} />
    </svg>
  );
}

/** Shared close (X) glyph used by feedback components. */
export function CloseIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0-1.414-1.414L12 10.586Z"
      />
    </svg>
  );
}
