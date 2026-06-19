import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress (line)', () => {
  it('renders the base and line modifier classes', () => {
    const { container } = render(<Progress percentage={40} />);
    const root = container.querySelector('.ec-progress')!;
    expect(root).toHaveClass('ec-progress--line');
  });

  it('exposes the progressbar role with aria values', () => {
    const { getByRole } = render(<Progress percentage={40} />);
    const bar = getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets the filled bar width to the percentage', () => {
    const { container } = render(<Progress percentage={75} />);
    const inner = container.querySelector('.ec-progress__inner') as HTMLElement;
    expect(inner.style.width).toBe('75%');
  });

  it('clamps percentages above 100 and below 0', () => {
    const { getByRole, rerender } = render(<Progress percentage={150} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<Progress percentage={-20} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows trailing text by default', () => {
    const { container } = render(<Progress percentage={50} />);
    expect(container.querySelector('.ec-progress__text')).toHaveTextContent('50%');
  });

  it('hides text when showText is false', () => {
    const { container } = render(<Progress percentage={50} showText={false} />);
    expect(container.querySelector('.ec-progress__text')).not.toBeInTheDocument();
  });

  it('renders text inside the bar when textInside is set', () => {
    const { container } = render(<Progress percentage={50} textInside />);
    expect(container.querySelector('.ec-progress')).toHaveClass('is-text-inside');
    expect(container.querySelector('.ec-progress__innerText')).toHaveTextContent('50%');
    expect(container.querySelector('.ec-progress__text')).not.toBeInTheDocument();
  });

  it('uses a custom format function for the text', () => {
    const { container } = render(
      <Progress percentage={3} format={(p) => `${p} of 100`} />,
    );
    expect(container.querySelector('.ec-progress__text')).toHaveTextContent('3 of 100');
  });

  it('applies the status class', () => {
    const { container } = render(<Progress percentage={100} status="success" />);
    expect(container.querySelector('.ec-progress')).toHaveClass('is-success');
  });

  it('maps exception status (color comes from CSS var)', () => {
    const { container } = render(<Progress percentage={50} status="exception" />);
    expect(container.querySelector('.ec-progress')).toHaveClass('is-exception');
  });

  it('applies a custom string color to the bar', () => {
    const { container } = render(<Progress percentage={50} color="rgb(255, 0, 0)" />);
    const inner = container.querySelector('.ec-progress__inner') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('picks a color from an array by threshold', () => {
    const colors = ['rgb(1, 1, 1)', 'rgb(2, 2, 2)'];
    const { container } = render(<Progress percentage={80} color={colors} />);
    const inner = container.querySelector('.ec-progress__inner') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('rgb(2, 2, 2)');
  });

  it('resolves a color from a function', () => {
    const { container } = render(
      <Progress percentage={50} color={(p) => (p > 40 ? 'rgb(0, 200, 0)' : 'rgb(200, 0, 0)')} />,
    );
    const inner = container.querySelector('.ec-progress__inner') as HTMLElement;
    expect(inner.style.backgroundColor).toBe('rgb(0, 200, 0)');
  });

  it('applies the configured stroke width as the track height', () => {
    const { container } = render(<Progress percentage={50} strokeWidth={12} />);
    const outer = container.querySelector('.ec-progress__outer') as HTMLElement;
    expect(outer.style.height).toBe('12px');
  });

  it('adds the indeterminate class and animation duration', () => {
    const { container } = render(<Progress percentage={50} indeterminate duration={2} />);
    expect(container.querySelector('.ec-progress')).toHaveClass('is-indeterminate');
    const inner = container.querySelector('.ec-progress__inner') as HTMLElement;
    expect(inner.style.animationDuration).toBe('2s');
  });
});

describe('Progress (circle / dashboard)', () => {
  it('renders the circle modifier and an svg with two paths', () => {
    const { container } = render(<Progress percentage={60} type="circle" />);
    expect(container.querySelector('.ec-progress')).toHaveClass('ec-progress--circle');
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.ec-progress__circle-track')).toBeInTheDocument();
    expect(container.querySelector('.ec-progress__circle-path')).toBeInTheDocument();
  });

  it('uses the default width of 126px for the circle', () => {
    const { container } = render(<Progress percentage={60} type="circle" />);
    const circle = container.querySelector('.ec-progress__circle') as HTMLElement;
    expect(circle.style.width).toBe('126px');
    expect(circle.style.height).toBe('126px');
  });

  it('respects a custom width', () => {
    const { container } = render(<Progress percentage={60} type="circle" width={200} />);
    const circle = container.querySelector('.ec-progress__circle') as HTMLElement;
    expect(circle.style.width).toBe('200px');
  });

  it('sets stroke-dasharray on the progress path proportional to percentage', () => {
    const { container } = render(<Progress percentage={50} type="circle" />);
    const path = container.querySelector('.ec-progress__circle-path') as SVGPathElement;
    expect(path.style.strokeDasharray).toBeTruthy();
  });

  it('applies a custom stroke color to the circle path', () => {
    const { container } = render(
      <Progress percentage={50} type="circle" color="rgb(10, 20, 30)" />,
    );
    const path = container.querySelector('.ec-progress__circle-path') as SVGPathElement;
    expect(path.style.stroke).toBe('rgb(10, 20, 30)');
  });

  it('renders centered text for the circle', () => {
    const { container } = render(<Progress percentage={60} type="circle" />);
    expect(container.querySelector('.ec-progress__text')).toHaveTextContent('60%');
  });

  it('honors strokeLinecap on the progress path', () => {
    const { container } = render(
      <Progress percentage={60} type="circle" strokeLinecap="butt" />,
    );
    const path = container.querySelector('.ec-progress__circle-path') as SVGPathElement;
    expect(path.getAttribute('stroke-linecap')).toBe('butt');
  });

  it('renders the dashboard variant', () => {
    const { container } = render(<Progress percentage={40} type="dashboard" />);
    expect(container.querySelector('.ec-progress')).toHaveClass('ec-progress--dashboard');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('exposes the progressbar role for the circle', () => {
    const { getByRole } = render(<Progress percentage={60} type="circle" />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
  });
});
