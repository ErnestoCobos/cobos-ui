import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { message, Message } from './Message';

// react-dom/client updates are flushed inside act(); opt the test runtime in.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messageCss = readFileSync(
  resolve(process.cwd(), 'src/components/Message/message.css'),
  'utf8',
);

afterEach(async () => {
  await act(async () => {
    message.closeAll();
  });
  // Drain any pending close timers/renders.
  await act(async () => {
    await Promise.resolve();
  });
});

function toasts(): HTMLElement[] {
  return Array.from(document.querySelectorAll('.ec-message')) as HTMLElement[];
}

describe('message', () => {
  it('mounts a toast from a string and renders the text', async () => {
    await act(async () => {
      message('Saved');
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    expect(toasts()[0]).toHaveTextContent('Saved');
  });

  it('exposes Message as an alias of message', () => {
    expect(Message).toBe(message);
  });

  it('defaults to the info type', async () => {
    await act(async () => {
      message('Hi');
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    expect(toasts()[0]).toHaveClass('ec-message--info');
  });

  it('renders the role="alert" for assistive tech', async () => {
    await act(async () => {
      message('Alert');
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    expect(toasts()[0]).toHaveAttribute('role', 'alert');
    expect(toasts()[0]).toHaveAttribute('aria-live');
  });

  it.each(['success', 'warning', 'info', 'error'] as const)(
    'message.%s applies the matching type class',
    async (type) => {
      await act(async () => {
        message[type]('Typed');
      });
      await waitFor(() => expect(toasts()).toHaveLength(1));
      expect(toasts()[0]).toHaveClass(`ec-message--${type}`);
    },
  );

  it('accepts an options object', async () => {
    await act(async () => {
      message({ message: 'Done', type: 'success', center: true });
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    const toast = toasts()[0];
    expect(toast).toHaveClass('ec-message--success');
    expect(toast).toHaveClass('is-center');
    expect(toast).toHaveTextContent('Done');
  });

  it('stacks multiple toasts with incrementing offsets', async () => {
    await act(async () => {
      message('First');
      message('Second');
    });
    await waitFor(() => expect(toasts()).toHaveLength(2));
    const [first, second] = toasts();
    const firstTop = parseInt(first.style.top, 10);
    const secondTop = parseInt(second.style.top, 10);
    expect(secondTop).toBeGreaterThan(firstTop);
  });

  it('auto-dismisses after the duration and fires onClose', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    try {
      act(() => {
        message({ message: 'Bye', duration: 1000, onClose });
      });
      await act(async () => {
        await Promise.resolve();
      });
      expect(toasts()).toHaveLength(1);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(toasts()).toHaveLength(0);
      expect(onClose).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers();
    try {
      act(() => {
        message({ message: 'Sticky', duration: 0 });
      });
      await act(async () => {
        await Promise.resolve();
      });
      await act(async () => {
        vi.advanceTimersByTime(10000);
      });
      expect(toasts()).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes via the returned handle', async () => {
    let handle: { close: () => void };
    await act(async () => {
      handle = message({ message: 'Closable', duration: 0 });
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    await act(async () => {
      handle.close();
    });
    await waitFor(() => expect(toasts()).toHaveLength(0));
  });

  it('renders a close button when showClose is set and closes on click', async () => {
    await act(async () => {
      message({ message: 'X', duration: 0, showClose: true });
    });
    await waitFor(() => expect(toasts()).toHaveLength(1));
    const button = document.querySelector('.ec-message__closebtn') as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => expect(toasts()).toHaveLength(0));
  });
});

describe('message styles', () => {
  it.each(['success', 'warning', 'info', 'error'] as const)(
    'defines a background for the %s type',
    (type) => {
      expect(messageCss).toContain(`.ec-message--${type}`);
      expect(messageCss).toContain(`--ec-message-bg-color: var(--ec-color-`);
    },
  );

  it('uses the popper stacking index', () => {
    expect(messageCss).toContain('z-index: var(--ec-index-popper)');
  });
});
