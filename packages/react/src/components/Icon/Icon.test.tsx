import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders its children inside an i element', () => {
    const { container } = render(<Icon>x</Icon>);
    const icon = container.querySelector('i.ec-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('x');
  });

  it('is aria-hidden by default', () => {
    const { container } = render(<Icon>x</Icon>);
    expect(container.querySelector('i.ec-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to role="img" and is not aria-hidden when aria-label is provided', () => {
    render(<Icon aria-label="Star">x</Icon>);
    const icon = screen.getByRole('img', { name: 'Star' });
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('defaults to role="img" when aria-labelledby is provided', () => {
    render(
      <>
        <span id="lbl">Star</span>
        <Icon aria-labelledby="lbl">x</Icon>
      </>,
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('does not override an explicitly supplied role', () => {
    render(<Icon aria-label="Star" role="presentation">x</Icon>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('becomes focusable and keyboard-operable when used as an interactive control', async () => {
    const onClick = vi.fn();
    render(
      <Icon role="button" aria-label="Clear" onClick={onClick}>
        x
      </Icon>,
    );
    const icon = screen.getByRole('button', { name: 'Clear' });
    expect(icon).toHaveAttribute('tabindex', '0');

    icon.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);

    await userEvent.click(icon);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('treats an onClick handler alone as interactive', () => {
    const onClick = vi.fn();
    const { container } = render(<Icon onClick={onClick}>x</Icon>);
    const icon = container.querySelector('i.ec-icon')!;
    expect(icon).toHaveAttribute('tabindex', '0');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('respects an explicitly supplied tabIndex', () => {
    const { container } = render(
      <Icon role="button" aria-label="Clear" tabIndex={-1} onClick={() => {}}>
        x
      </Icon>,
    );
    expect(container.querySelector('i.ec-icon')).toHaveAttribute('tabindex', '-1');
  });
});
