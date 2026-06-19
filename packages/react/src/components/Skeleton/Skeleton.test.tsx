import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Skeleton } from './Skeleton';
import { SkeletonItem } from './SkeletonItem';

describe('Skeleton', () => {
  it('renders the placeholder template while loading', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.ec-skeleton')).toBeInTheDocument();
    expect(container.querySelector('.ec-skeleton__template')).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders the requested number of text rows plus a title', () => {
    const { container } = render(<Skeleton rows={4} />);
    // 4 text rows + 1 title item.
    expect(container.querySelectorAll('.ec-skeleton__item')).toHaveLength(5);
    expect(container.querySelectorAll('.ec-skeleton--text')).toHaveLength(4);
  });

  it('defaults to 3 rows', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelectorAll('.ec-skeleton--text')).toHaveLength(3);
  });

  it('renders children when not loading', () => {
    render(
      <Skeleton loading={false}>
        <p>Real content</p>
      </Skeleton>,
    );
    expect(screen.getByText('Real content')).toBeInTheDocument();
  });

  it('repeats the template `count` times', () => {
    const { container } = render(<Skeleton count={3} />);
    expect(container.querySelectorAll('.ec-skeleton__template')).toHaveLength(3);
  });

  it('adds the is-animated class when animated', () => {
    const { container } = render(<Skeleton animated />);
    expect(container.querySelector('.ec-skeleton')).toHaveClass('is-animated');
  });

  it('delays the placeholder when throttled', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<Skeleton throttle={400} />);
      // Not shown immediately.
      expect(container.querySelector('.ec-skeleton__template')).not.toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(container.querySelector('.ec-skeleton__template')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('SkeletonItem', () => {
  it('defaults to the text variant', () => {
    const { container } = render(<SkeletonItem />);
    expect(container.querySelector('.ec-skeleton__item')).toHaveClass('ec-skeleton--text');
  });

  it('applies the requested variant', () => {
    const { container } = render(<SkeletonItem variant="circle" />);
    expect(container.querySelector('.ec-skeleton__item')).toHaveClass('ec-skeleton--circle');
  });
});
