import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('applies the type modifier class', () => {
    render(<Button type="primary">P</Button>);
    expect(screen.getByRole('button')).toHaveClass('ec-button--primary');
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows a spinner when loading', () => {
    render(<Button loading>Load</Button>);
    expect(screen.getByRole('button')).toHaveClass('is-loading');
  });

  it('keeps a consistent (white) text color across states for a solid custom-color button', () => {
    render(<Button color="#ff0000">Custom</Button>);
    const style = screen.getByRole('button').getAttribute('style') ?? '';
    expect(style).toContain('--ec-button-text-color: #ffffff');
    expect(style).toContain('--ec-button-hover-text-color: #ffffff');
    expect(style).toContain('--ec-button-active-text-color: #ffffff');
    // The custom color still drives the background.
    expect(style).toContain('--ec-button-bg-color: #ff0000');
  });

  it('sets the active text color for a plain custom-color button', () => {
    render(
      <Button plain color="#ff0000">
        Custom
      </Button>,
    );
    const style = screen.getByRole('button').getAttribute('style') ?? '';
    expect(style).toContain('--ec-button-active-text-color: #ffffff');
  });

  it('keeps the background transparent for a text button with a custom color', () => {
    render(
      <Button text color="#409eff">
        Text
      </Button>,
    );
    const style = screen.getByRole('button').getAttribute('style') ?? '';
    // Background/border vars must not be emitted so .is-text transparency wins.
    expect(style).not.toContain('--ec-button-bg-color');
    expect(style).not.toContain('--ec-button-border-color');
    // The custom color drives the text color instead.
    expect(style).toContain('--ec-button-text-color: #409eff');
  });

  it('keeps the background transparent for a link button with a custom color', () => {
    render(
      <Button link color="#409eff">
        Link
      </Button>,
    );
    const style = screen.getByRole('button').getAttribute('style') ?? '';
    expect(style).not.toContain('--ec-button-bg-color');
    expect(style).not.toContain('--ec-button-border-color');
    expect(style).toContain('--ec-button-text-color: #409eff');
  });
});
