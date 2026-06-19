import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { notification, Notification } from './Notification';

// react-dom/client updates are flushed inside act(); opt the test runtime in.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const notificationCss = readFileSync(
  resolve(process.cwd(), 'src/components/Notification/notification.css'),
  'utf8',
);

afterEach(async () => {
  await act(async () => {
    notification.closeAll();
  });
  await act(async () => {
    await Promise.resolve();
  });
});

function cards(): HTMLElement[] {
  return Array.from(document.querySelectorAll('.ec-notification')) as HTMLElement[];
}

describe('notification', () => {
  it('mounts a card from a string', async () => {
    await act(async () => {
      notification('Heads up');
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(cards()[0]).toHaveTextContent('Heads up');
  });

  it('exposes Notification as an alias', () => {
    expect(Notification).toBe(notification);
  });

  it('renders the title and message', async () => {
    await act(async () => {
      notification({ title: 'Title', message: 'Body' });
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(document.querySelector('.ec-notification__title')).toHaveTextContent('Title');
    expect(document.querySelector('.ec-notification__content')).toHaveTextContent('Body');
  });

  it('uses role="alert" for assistive tech', async () => {
    await act(async () => {
      notification('A');
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(cards()[0]).toHaveAttribute('role', 'alert');
    expect(cards()[0]).toHaveAttribute('aria-live');
  });

  it.each(['success', 'warning', 'info', 'error'] as const)(
    'notification.%s applies the matching type class and renders an icon',
    async (type) => {
      await act(async () => {
        notification[type]({ message: 'Typed' });
      });
      await waitFor(() => expect(cards()).toHaveLength(1));
      expect(cards()[0]).toHaveClass(`ec-notification--${type}`);
      expect(document.querySelector('.ec-notification__icon')).toBeInTheDocument();
    },
  );

  it('defaults to the top-right corner', async () => {
    await act(async () => {
      notification('Corner');
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(document.querySelector('.ec-notification__wrapper--top-right')).toBeInTheDocument();
  });

  it('honors a custom position', async () => {
    await act(async () => {
      notification({ message: 'BL', position: 'bottom-left' });
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(
      document.querySelector('.ec-notification__wrapper--bottom-left'),
    ).toBeInTheDocument();
    expect(cards()[0]).toHaveClass('is-left');
  });

  it('shows a close button by default and closes on click', async () => {
    await act(async () => {
      notification({ message: 'Close me', duration: 0 });
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    const button = document.querySelector('.ec-notification__closebtn') as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => expect(cards()).toHaveLength(0));
  });

  it('omits the close button when showClose is false', async () => {
    await act(async () => {
      notification({ message: 'No close', duration: 0, showClose: false });
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    expect(document.querySelector('.ec-notification__closebtn')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the duration and fires onClose', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    try {
      act(() => {
        notification({ message: 'Bye', duration: 1000, onClose });
      });
      await act(async () => {
        await Promise.resolve();
      });
      expect(cards()).toHaveLength(1);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(cards()).toHaveLength(0);
      expect(onClose).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes via the returned handle', async () => {
    let handle: { close: () => void };
    await act(async () => {
      handle = notification({ message: 'Handle', duration: 0 });
    });
    await waitFor(() => expect(cards()).toHaveLength(1));
    await act(async () => {
      handle.close();
    });
    await waitFor(() => expect(cards()).toHaveLength(0));
  });
});

describe('notification styles', () => {
  it.each(['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const)(
    'positions the %s wrapper',
    (position) => {
      expect(notificationCss).toContain(`.ec-notification__wrapper--${position}`);
    },
  );

  it('uses the popper stacking index', () => {
    expect(notificationCss).toContain('z-index: var(--ec-index-popper)');
  });
});
