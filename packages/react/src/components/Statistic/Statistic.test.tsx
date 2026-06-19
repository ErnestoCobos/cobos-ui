import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Statistic } from './Statistic';

describe('Statistic', () => {
  it('renders the base class', () => {
    const { container } = render(<Statistic value={42} />);
    expect(container.querySelector('.ec-statistic')).toBeInTheDocument();
  });

  it('renders the title in the head element', () => {
    const { container } = render(<Statistic title="Active Users" value={100} />);
    const head = container.querySelector('.ec-statistic__head');
    expect(head).toBeInTheDocument();
    expect(head).toHaveTextContent('Active Users');
  });

  it('does not render a head element when no title is provided', () => {
    const { container } = render(<Statistic value={100} />);
    expect(container.querySelector('.ec-statistic__head')).not.toBeInTheDocument();
  });

  it('applies group separators to large numbers', () => {
    const { container } = render(<Statistic value={1234567} />);
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('1,234,567');
  });

  it('applies precision via toFixed', () => {
    const { container } = render(<Statistic value={3.14159} precision={2} />);
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('3.14');
  });

  it('combines precision and group separators', () => {
    const { container } = render(<Statistic value={1234567.891} precision={2} />);
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('1,234,567.89');
  });

  it('respects custom group and decimal separators', () => {
    const { container } = render(
      <Statistic value={1234567.5} precision={1} groupSeparator="." decimalSeparator="," />,
    );
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('1.234.567,5');
  });

  it('formats negative numbers correctly', () => {
    const { container } = render(<Statistic value={-1234.5} precision={1} />);
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('-1,234.5');
  });

  it('renders string values as-is', () => {
    const { container } = render(<Statistic value="Pending" />);
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('Pending');
  });

  it('renders prefix and suffix', () => {
    const { container } = render(<Statistic value={99} prefix="$" suffix="USD" />);
    expect(container.querySelector('.ec-statistic__prefix')).toHaveTextContent('$');
    expect(container.querySelector('.ec-statistic__suffix')).toHaveTextContent('USD');
  });

  it('uses a custom formatter when provided', () => {
    const { container } = render(
      <Statistic value={1234} formatter={(v) => `#${v}`} />,
    );
    expect(container.querySelector('.ec-statistic__number')).toHaveTextContent('#1234');
  });

  it('applies valueStyle to the number element', () => {
    const { container } = render(<Statistic value={1} valueStyle={{ color: 'rgb(255, 0, 0)' }} />);
    const number = container.querySelector('.ec-statistic__number') as HTMLElement;
    expect(number.style.color).toBe('rgb(255, 0, 0)');
  });

  it('forwards the ref to the root element', () => {
    let node: HTMLDivElement | null = null;
    render(
      <Statistic
        ref={(el) => {
          node = el;
        }}
        value={1}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it('exposes the value to assistive output', () => {
    render(<Statistic title="Score" value={88} />);
    expect(screen.getByText('88')).toBeInTheDocument();
  });
});
