import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from './BarChart';

const data = [
  { label: 'Q1', value: 120 },
  { label: 'Q2', value: 200 },
  { label: 'Q3', value: 150 },
  { label: 'Q4', value: 80 },
];

describe('BarChart', () => {
  it('renders an svg with the chart classes and an aria-label', () => {
    const { container } = render(<BarChart data={data} />);
    const svg = container.querySelector('svg.ec-chart-bar');
    expect(svg).toBeTruthy();
    expect(svg?.classList.contains('ec-chart')).toBe(true);
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
  });

  it('renders one bar per datum for a single series', () => {
    const { container } = render(<BarChart data={data} />);
    expect(container.querySelectorAll('.ec-chart-bar__bar').length).toBe(data.length);
  });

  it('renders categories x series bars for grouped data', () => {
    const { container } = render(
      <BarChart
        categories={['A', 'B', 'C']}
        series={[
          { name: 's1', data: [1, 2, 3] },
          { name: 's2', data: [3, 2, 1] },
        ]}
      />,
    );
    // 3 categories x 2 series = 6 bars.
    expect(container.querySelectorAll('.ec-chart-bar__bar').length).toBe(6);
  });

  it('renders stacked bars with the stacked modifier', () => {
    const { container } = render(
      <BarChart
        categories={['A', 'B']}
        series={[
          { name: 's1', data: [1, 2] },
          { name: 's2', data: [3, 4] },
        ]}
        stacked
      />,
    );
    expect(container.querySelector('svg')?.classList.contains('ec-chart-bar--stacked')).toBe(
      true,
    );
    expect(container.querySelectorAll('.ec-chart-bar__bar').length).toBe(4);
  });

  it('applies the horizontal modifier', () => {
    const { container } = render(<BarChart data={data} horizontal />);
    expect(
      container.querySelector('svg')?.classList.contains('ec-chart-bar--horizontal'),
    ).toBe(true);
    expect(container.querySelectorAll('.ec-chart-bar__bar').length).toBe(data.length);
  });

  it('renders category labels', () => {
    const { container } = render(<BarChart data={data} />);
    const labels = Array.from(container.querySelectorAll('.ec-chart-bar__label')).map(
      (n) => n.textContent,
    );
    expect(labels).toEqual(expect.arrayContaining(['Q1', 'Q4']));
  });

  it('renders the empty state when there is no data', () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.ec-chart__empty')).toBeTruthy();
  });
});
