import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('is hidden until the trigger is hovered', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful hint">
        <Button>Hover me</Button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful hint');
  });

  it('dismisses when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Bye">
        <Button>Trigger</Button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on click when trigger="click"', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip trigger="click" content="Clicked">
        <Button>Tap</Button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tap' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Clicked');
  });

  it('opens on focus when trigger="focus"', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip trigger="focus" content="Focused">
        <Button>Focusable</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Focused');
  });

  it('defaults to the dark effect surface class', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Dark">
        <Button>T</Button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'T' }));
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveClass('ec-tooltip');
    expect(tip).toHaveClass('ec-tooltip--dark');
  });

  it('applies the light effect modifier when requested', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip effect="light" content="Light">
        <Button>T</Button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'T' }));
    expect(await screen.findByRole('tooltip')).toHaveClass('ec-tooltip--light');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip disabled content="Nope">
        <Button>T</Button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'T' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('honours the controlled open prop and fires onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip open={false} onOpenChange={onOpenChange} content="Controlled">
        <Button>T</Button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button', { name: 'T' }));
    // Hover open has a short delay before the change propagates.
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
    // Still closed because the parent controls `open`.
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(
      <Tooltip open onOpenChange={onOpenChange} content="Controlled">
        <Button>T</Button>
      </Tooltip>,
    );
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Controlled');
  });
});
