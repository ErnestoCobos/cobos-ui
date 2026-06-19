import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders its children', () => {
    render(<Link href="https://example.com">Home</Link>);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('applies the type modifier class', () => {
    render(<Link type="primary">P</Link>);
    expect(screen.getByText('P').closest('a')).toHaveClass('ec-link--primary');
  });

  it('adds the underline state by default', () => {
    render(<Link href="#">U</Link>);
    expect(screen.getByRole('link')).toHaveClass('is-underline');
  });

  it('omits the underline state when underline is false', () => {
    render(
      <Link href="#" underline={false}>
        N
      </Link>,
    );
    expect(screen.getByRole('link')).not.toHaveClass('is-underline');
  });

  it('removes href and adds the disabled state when disabled', () => {
    render(
      <Link href="https://example.com" disabled>
        D
      </Link>,
    );
    const link = screen.getByText('D').closest('a')!;
    expect(link).toHaveClass('is-disabled');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('fires onClick when enabled', async () => {
    const onClick = vi.fn();
    render(
      <Link href="#" onClick={onClick}>
        Go
      </Link>,
    );
    await userEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Link href="https://example.com" disabled onClick={onClick}>
        D
      </Link>,
    );
    await userEvent.click(screen.getByText('D').closest('a')!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
