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
