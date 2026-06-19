import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LineChart } from './LineChart';

const single = [
  { x: 'Jan', y: 10 },
  { x: 'Feb', y: 40 },
  { x: 'Mar', y: 25 },
  { x: 'Apr', y: 60 },
];

describe('LineChart', () => {
  it('renders an svg with the chart classes and an aria-label', () => {
    const { container } = render(<LineChart data={single} />);
    const svg = container.querySelector('svg.ec-chart-line');
    expect(svg).toBeTruthy();
    expect(svg?.classList.contains('ec-chart')).toBe(true);
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
    expect(svg?.querySelector('title')?.textContent).toBeTruthy();
  });

  it('renders one line path for a single series', () => {
    const { container } = render(<LineChart data={single} />);
    expect(container.querySelectorAll('.ec-chart-line__path').length).toBe(1);
  });

  it('renders one path per series for multi-series data', () => {
    const { container } = render(
      <LineChart
        series={[
          { name: 'a', data: single },
          { name: 'b', data: single },
          { name: 'c', data: single },
        ]}
      />,
    );
    expect(container.querySelectorAll('.ec-chart-line__path').length).toBe(3);
  });

  it('renders an area fill and gradient when area is enabled', () => {
    const { container } = render(<LineChart data={single} area />);
    expect(container.querySelectorAll('.ec-chart-line__area').length).toBe(1);
    expect(container.querySelector('linearGradient')).toBeTruthy();
  });

  it('renders a dot per data point when showDots is enabled', () => {
    const { container } = render(<LineChart data={single} showDots />);
    expect(container.querySelectorAll('.ec-chart-line__dot').length).toBe(single.length);
  });

  it('renders gridlines and axis labels by default', () => {
    const { container } = render(<LineChart data={single} />);
    expect(container.querySelectorAll('.ec-chart-line__gridline').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.ec-chart-line__label').length).toBeGreaterThan(0);
  });

  it('produces a smooth (cubic) path when smooth is enabled', () => {
    const { container } = render(<LineChart data={single} smooth />);
    const d = container.querySelector('.ec-chart-line__path')?.getAttribute('d') ?? '';
    expect(d).toContain('C');
  });

  it('renders the empty state when there is no data', () => {
    const { container } = render(<LineChart data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
    const empty = container.querySelector('.ec-chart__empty');
    expect(empty).toBeTruthy();
    expect(empty?.getAttribute('role')).toBe('img');
  });
});
