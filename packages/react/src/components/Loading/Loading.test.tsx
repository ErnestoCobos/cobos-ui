import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Loading, loading } from './Loading';

// react-dom/client updates (the service) are flushed inside act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const loadingCss = readFileSync(
  resolve(process.cwd(), 'src/components/Loading/loading.css'),
  'utf8',
);

afterEach(() => {
  document
    .querySelectorAll('.ec-loading-service')
    .forEach((node) => node.remove());
});

function masks(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll('.ec-loading__mask')) as HTMLElement[];
}

describe('Loading component', () => {
  it('renders a mask with the spinning icon by default', () => {
    const { container } = render(<Loading>content</Loading>);
    expect(masks(container)).toHaveLength(1);
    expect(container.querySelector('.ec-loading__icon')).toBeInTheDocument();
  });

  it('hides the mask when visible is false', () => {
    const { container } = render(<Loading visible={false}>content</Loading>);
    expect(masks(container)).toHaveLength(0);
  });

  it('renders the loading text', () => {
    const { container } = render(<Loading text="Loading…">content</Loading>);
    expect(container.querySelector('.ec-loading__text')).toHaveTextContent('Loading…');
  });

  it('renders children behind the mask', () => {
    const { getByText } = render(<Loading>behind</Loading>);
    expect(getByText('behind')).toBeInTheDocument();
  });

  it('exposes a11y attributes on the mask', () => {
    const { container } = render(<Loading>content</Loading>);
    const mask = container.querySelector('.ec-loading__mask')!;
    expect(mask).toHaveAttribute('aria-busy', 'true');
    expect(mask).toHaveAttribute('aria-live');
  });

  it('applies a custom background via the mask CSS var', () => {
    const { container } = render(<Loading background="rgba(0, 0, 0, 0.7)">c</Loading>);
    const mask = container.querySelector('.ec-loading__mask') as HTMLElement;
    expect(mask.style.getPropertyValue('--ec-loading-mask-bg')).toBe('rgba(0, 0, 0, 0.7)');
  });

  it('renders a custom spinner', () => {
    const { container } = render(
      <Loading spinner={<span data-testid="custom-spinner">S</span>}>c</Loading>,
    );
    expect(container.querySelector('[data-testid="custom-spinner"]')).toBeInTheDocument();
    expect(container.querySelector('.ec-loading__icon')).not.toBeInTheDocument();
  });

  it('portals a fullscreen mask to the body', () => {
    render(<Loading fullscreen>c</Loading>);
    const mask = document.body.querySelector('.ec-loading__mask.is-fullscreen');
    expect(mask).toBeInTheDocument();
  });
});

describe('loading.service', () => {
  it('mounts a fullscreen mask on the body and removes it on close', async () => {
    let instance: { close: () => void };
    await act(async () => {
      instance = loading.service({ text: 'Saving…' });
    });
    await waitFor(() => expect(masks()).toHaveLength(1));
    expect(masks()[0]).toHaveClass('is-fullscreen');
    expect(masks()[0]).toHaveTextContent('Saving…');

    await act(async () => {
      instance.close();
    });
    await waitFor(() => expect(masks()).toHaveLength(0));
  });

  it('is idempotent on repeated close calls', async () => {
    let instance: { close: () => void };
    await act(async () => {
      instance = loading.service();
    });
    await waitFor(() => expect(masks()).toHaveLength(1));
    await act(async () => {
      instance.close();
      instance.close();
    });
    await waitFor(() => expect(masks()).toHaveLength(0));
  });

  it('masks a target element without fullscreen', async () => {
    const target = document.createElement('div');
    target.id = 'svc-target';
    document.body.appendChild(target);
    let instance: { close: () => void };
    try {
      await act(async () => {
        instance = loading.service({ target: '#svc-target' });
      });
      await waitFor(() => expect(masks(target)).toHaveLength(1));
      expect(masks(target)[0]).not.toHaveClass('is-fullscreen');
      expect(target).toHaveClass('ec-loading-parent');
      await act(async () => {
        instance.close();
      });
      await waitFor(() => expect(masks(target)).toHaveLength(0));
      expect(target).not.toHaveClass('ec-loading-parent');
    } finally {
      target.remove();
    }
  });

  it('exposes service on the Loading component too', () => {
    expect(typeof (Loading as unknown as { service: unknown }).service).toBe('function');
  });
});

describe('loading styles', () => {
  it('uses the mask color token with an rgba fallback', () => {
    expect(loadingCss).toContain('var(--ec-mask-color');
    expect(loadingCss).toContain('rgba(');
  });

  it('uses the primary color for the spinner', () => {
    expect(loadingCss).toContain('--ec-loading-spinner-color: var(--ec-color-primary)');
  });

  it('uses the popper stacking index and fixed fullscreen positioning', () => {
    expect(loadingCss).toContain('z-index: var(--ec-index-popper)');
    expect(loadingCss).toContain('.ec-loading__mask.is-fullscreen');
    expect(loadingCss).toContain('position: fixed');
  });
});
