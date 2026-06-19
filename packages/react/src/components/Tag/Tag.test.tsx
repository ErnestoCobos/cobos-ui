import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders its children', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('applies the default type and effect classes', () => {
    const { container } = render(<Tag>T</Tag>);
    const tag = container.querySelector('.ec-tag')!;
    expect(tag).toHaveClass('ec-tag--primary');
    expect(tag).toHaveClass('ec-tag--light');
  });

  it('applies type, size and effect modifier classes', () => {
    const { container } = render(
      <Tag type="success" size="large" effect="dark">
        T
      </Tag>,
    );
    const tag = container.querySelector('.ec-tag')!;
    expect(tag).toHaveClass('ec-tag--success');
    expect(tag).toHaveClass('ec-tag--large');
    expect(tag).toHaveClass('ec-tag--dark');
  });

  it('renders a close button when closable and fires onClose', async () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        C
      </Tag>,
    );
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('applies a custom background color', () => {
    const { container } = render(<Tag color="rgb(255, 0, 0)">C</Tag>);
    const tag = container.querySelector('.ec-tag') as HTMLElement;
    expect(tag.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('adds the round and hit state classes', () => {
    const { container } = render(
      <Tag round hit>
        R
      </Tag>,
    );
    const tag = container.querySelector('.ec-tag')!;
    expect(tag).toHaveClass('is-round');
    expect(tag).toHaveClass('is-hit');
  });

  it('adds the disable-transitions state class when disableTransitions is set', () => {
    const { container } = render(
      <Tag disableTransitions closable>
        T
      </Tag>,
    );
    expect(container.querySelector('.ec-tag')).toHaveClass('is-disable-transitions');
  });

  it('does not add the disable-transitions state class by default', () => {
    const { container } = render(<Tag>T</Tag>);
    expect(container.querySelector('.ec-tag')).not.toHaveClass('is-disable-transitions');
  });
});

describe('Tag light-effect contrast (WCAG 2.1 AA)', () => {
  // Brand base colors, faithful to the design tokens.
  const BASE = {
    primary: '#409eff',
    success: '#67c23a',
    info: '#909399',
    warning: '#e6a23c',
    danger: '#f56c6c',
  } as const;

  // Light-effect text tokens defined in tag.css. Computed as
  // mix(black, base, 0.4) so they clear 4.5:1 against the light-9 background.
  const LIGHT_TEXT = {
    primary: '#265f99',
    success: '#3e7423',
    info: '#56585c',
    warning: '#8a6124',
    danger: '#934141',
  } as const;

  type Rgb = [number, number, number];

  function hexToRgb(hex: string): Rgb {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Mirror the token pipeline's mix(): weight is the fraction of c1.
  function mix(c1: string, c2: string, weight: number): Rgb {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    return [
      a[0] * weight + b[0] * (1 - weight),
      a[1] * weight + b[1] * (1 - weight),
      a[2] * weight + b[2] * (1 - weight),
    ];
  }

  function relativeLuminance([r, g, b]: Rgb): number {
    const channel = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }

  function contrastRatio(a: Rgb, b: Rgb): number {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  // light-9 background = mix(white, base, 0.9), as derived in the token ramp.
  function light9(type: keyof typeof BASE): Rgb {
    return mix('#ffffff', BASE[type], 0.9);
  }

  const AA_NORMAL = 4.5;

  it.each(['success', 'warning'] as const)(
    'light-effect %s text meets >= 4.5:1 contrast on its light-9 background',
    (type) => {
      const ratio = contrastRatio(hexToRgb(LIGHT_TEXT[type]), light9(type));
      expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
    },
  );

  it('every light-effect type text meets >= 4.5:1 contrast on its light-9 background', () => {
    for (const type of Object.keys(BASE) as (keyof typeof BASE)[]) {
      const ratio = contrastRatio(hexToRgb(LIGHT_TEXT[type]), light9(type));
      expect(ratio, `${type} light-effect contrast`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });
});
