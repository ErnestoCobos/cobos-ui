import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sparkline } from './Sparkline';

const data = [3, 7, 4, 9, 6, 11, 8];

describe('Sparkline', () => {
  it('renders an svg with an aria-label and title', () => {
    const { container } = render(<Sparkline data={data} />);
    const svg = container.querySelector('svg.ec-chart-sparkline');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
    expect(svg?.querySelector('title')?.textContent).toBeTruthy();
  });

  it('renders a single line path', () => {
    const { container } = render(<Sparkline data={data} />);
    expect(container.querySelectorAll('.ec-chart-sparkline__path').length).toBe(1);
    const d = container.querySelector('.ec-chart-sparkline__path')?.getAttribute('d') ?? '';
    expect(d.startsWith('M')).toBe(true);
  });

  it('renders an area fill when area is enabled', () => {
    const { container } = render(<Sparkline data={data} area />);
    expect(container.querySelectorAll('.ec-chart-sparkline__area').length).toBe(1);
    expect(container.querySelector('linearGradient')).toBeTruthy();
  });

  it('renders the empty state when there is no data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('svg')).toBeNull();
    const empty = container.querySelector('.ec-chart-sparkline-empty');
    expect(empty).toBeTruthy();
    expect(empty?.getAttribute('role')).toBe('img');
  });
});
