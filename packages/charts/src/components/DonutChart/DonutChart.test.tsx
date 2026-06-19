import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutChart, PieChart } from './DonutChart';

const data = [
  { label: 'Chrome', value: 60 },
  { label: 'Safari', value: 25 },
  { label: 'Firefox', value: 15 },
];

describe('DonutChart', () => {
  it('renders an svg with an aria-label and title', () => {
    const { container } = render(<DonutChart data={data} />);
    const svg = container.querySelector('svg.ec-chart-donut__svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-label')).toMatch(/donut/i);
    expect(svg?.querySelector('title')?.textContent).toBeTruthy();
  });

  it('renders one arc path per slice', () => {
    const { container } = render(<DonutChart data={data} />);
    expect(container.querySelectorAll('.ec-chart-donut__slice').length).toBe(data.length);
  });

  it('ignores zero and negative values', () => {
    const { container } = render(
      <DonutChart
        data={[
          { label: 'a', value: 10 },
          { label: 'b', value: 0 },
          { label: 'c', value: -5 },
        ]}
      />,
    );
    expect(container.querySelectorAll('.ec-chart-donut__slice').length).toBe(1);
  });

  it('renders the center label in donut mode', () => {
    const { container } = render(<DonutChart data={data} centerLabel="100" />);
    expect(container.querySelector('.ec-chart-donut__center')?.textContent).toBe('100');
  });

  it('renders a legend when showLegend is enabled', () => {
    const { container } = render(<DonutChart data={data} showLegend />);
    expect(container.querySelectorAll('.ec-chart-donut__legend-item').length).toBe(data.length);
  });

  it('renders the empty state when there is no data', () => {
    const { container } = render(<DonutChart data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.ec-chart__empty')).toBeTruthy();
  });

  it('PieChart renders a pie (aria-label) with one slice per datum', () => {
    const { container } = render(<PieChart data={data} />);
    const svg = container.querySelector('svg.ec-chart-donut__svg');
    expect(svg?.getAttribute('aria-label')).toMatch(/pie/i);
    expect(container.querySelectorAll('.ec-chart-donut__slice').length).toBe(data.length);
  });
});
