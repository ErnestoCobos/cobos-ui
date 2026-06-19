import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

const alertCss = readFileSync(resolve(process.cwd(), 'src/components/Alert/alert.css'), 'utf8');

describe('Alert', () => {
  it('renders the title with role="alert"', () => {
    render(<Alert title="Heads up" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Heads up');
  });

  it('applies the default type and effect classes', () => {
    const { container } = render(<Alert title="T" />);
    const alert = container.querySelector('.ec-alert')!;
    expect(alert).toHaveClass('ec-alert--info');
    expect(alert).toHaveClass('ec-alert--light');
  });

  it('applies the requested type and effect modifier classes', () => {
    const { container } = render(<Alert title="T" type="error" effect="dark" />);
    const alert = container.querySelector('.ec-alert')!;
    expect(alert).toHaveClass('ec-alert--error');
    expect(alert).toHaveClass('ec-alert--dark');
  });

  it('renders the description', () => {
    render(<Alert title="T" description="More detail here" />);
    expect(screen.getByText('More detail here')).toBeInTheDocument();
    expect(document.querySelector('.ec-alert__description')).not.toBeNull();
  });

  it('uses children as the description when description is absent', () => {
    render(<Alert title="T">Child body</Alert>);
    expect(screen.getByText('Child body')).toBeInTheDocument();
    expect(document.querySelector('.ec-alert__description')).not.toBeNull();
  });

  it('does not render the icon by default', () => {
    const { container } = render(<Alert title="T" />);
    expect(container.querySelector('.ec-alert__icon')).toBeNull();
  });

  it('renders the type icon when showIcon is set', () => {
    const { container } = render(<Alert title="T" type="success" showIcon />);
    expect(container.querySelector('.ec-alert__icon')).not.toBeNull();
  });

  it('renders a keyboard-accessible close button by default and fires onClose', async () => {
    const onClose = vi.fn();
    render(<Alert title="T" onClose={onClose} />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('removes itself from the DOM after closing', async () => {
    render(<Alert title="Dismiss me" />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides the close button when closable is false', () => {
    render(<Alert title="T" closable={false} />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('renders the custom close text', () => {
    render(<Alert title="T" closeText="Dismiss" />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveTextContent('Dismiss');
    expect(close).toHaveClass('is-customed');
  });

  it('adds the center state class', () => {
    const { container } = render(<Alert title="T" center />);
    expect(container.querySelector('.ec-alert')).toHaveClass('is-center');
  });

  it('can be closed with the keyboard (real button element)', async () => {
    const onClose = vi.fn();
    render(<Alert title="T" onClose={onClose} />);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    expect(close).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('Alert light-effect contrast (WCAG 2.1 AA)', () => {
  // Brand base colors, faithful to the design tokens. `error` shares the danger
  // base color (#f56c6c) in this token set.
  const BASE = {
    success: '#67c23a',
    info: '#909399',
    warning: '#e6a23c',
    error: '#f56c6c',
  } as const;

  // Light-9 backgrounds the light-effect text must clear AA against.
  const LIGHT_9 = {
    success: '#f0f9eb',
    info: '#f4f4f5',
    warning: '#fdf6ec',
    error: '#fef0f0',
  } as const;

  // Light-effect text tokens defined in alert.css. Computed as
  // mix(black, base, 0.4) so they clear 4.5:1 against the light-9 background.
  const LIGHT_TEXT = {
    success: '#3e7423',
    info: '#56585c',
    warning: '#8a6124',
    error: '#934141',
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
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  }

  (['success', 'info', 'warning', 'error'] as const).forEach((type) => {
    it(`${type} light text clears 4.5:1 against its light-9 background`, () => {
      const ratio = contrastRatio(hexToRgb(LIGHT_TEXT[type]), hexToRgb(LIGHT_9[type]));
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it(`${type} light text token equals mix(black, base, 0.4)`, () => {
      const [r, g, b] = mix('#000000', BASE[type], 0.4).map(Math.round);
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      expect(`#${toHex(r)}${toHex(g)}${toHex(b)}`).toBe(LIGHT_TEXT[type]);
    });
  });

  it('declares the light-effect text tokens in alert.css', () => {
    expect(alertCss).toContain('--ec-alert-light-text-success: #3e7423;');
    expect(alertCss).toContain('--ec-alert-light-text-info: #56585c;');
    expect(alertCss).toContain('--ec-alert-light-text-warning: #8a6124;');
    expect(alertCss).toContain('--ec-alert-light-text-error: #934141;');
  });
});
