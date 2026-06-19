import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="https://example.com/a.png" alt="user" />);
    const img = screen.getByRole('img', { name: 'user' });
    expect(img).toHaveAttribute('src', 'https://example.com/a.png');
  });

  it('applies the shape modifier class', () => {
    const { container } = render(<Avatar shape="square">A</Avatar>);
    expect(container.querySelector('.ec-avatar')).toHaveClass('ec-avatar--square');
  });

  it('applies the size modifier class for token sizes', () => {
    const { container } = render(<Avatar size="large">A</Avatar>);
    expect(container.querySelector('.ec-avatar')).toHaveClass('ec-avatar--large');
  });

  it('uses inline dimensions for numeric sizes', () => {
    const { container } = render(<Avatar size={64}>A</Avatar>);
    const el = container.querySelector('.ec-avatar') as HTMLElement;
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
    expect(el).not.toHaveClass('ec-avatar--large');
  });

  it('falls back to children when the image fails to load', () => {
    render(<Avatar src="https://example.com/broken.png">FB</Avatar>);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('FB')).toBeInTheDocument();
  });

  it('keeps the image when onError returns false', () => {
    const onError = vi.fn(() => false);
    render(
      <Avatar src="https://example.com/broken.png" onError={onError}>
        FB
      </Avatar>,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders children when no src is given', () => {
    render(<Avatar>JD</Avatar>);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('adds the icon modifier class when an icon is rendered', () => {
    const { container } = render(<Avatar icon={<span data-testid="ic" />} />);
    expect(container.querySelector('.ec-avatar')).toHaveClass('ec-avatar--icon');
    expect(screen.getByTestId('ic')).toBeInTheDocument();
  });

  it('omits the icon modifier class when no icon is provided', () => {
    const { container } = render(<Avatar>A</Avatar>);
    expect(container.querySelector('.ec-avatar')).not.toHaveClass('ec-avatar--icon');
  });
});
