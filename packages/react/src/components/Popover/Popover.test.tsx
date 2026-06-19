import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Popover } from './Popover';

describe('Popover', () => {
  it('opens on click by default and shows its content', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Body text">
        <Button>Open</Button>
      </Popover>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('Body text');
    expect(dialog).toHaveClass('ec-popover');
  });

  it('renders the title above the content', async () => {
    const user = userEvent.setup();
    render(
      <Popover title="Heading" content="Body text">
        <Button>Open</Button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    const title = dialog.querySelector('.ec-popover__title');
    expect(title).toHaveTextContent('Heading');
  });

  it('omits the title element when no title is provided', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Body only">
        <Button>Open</Button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('.ec-popover__title')).toBeNull();
  });

  it('applies a fixed width when given', async () => {
    const user = userEvent.setup();
    render(
      <Popover width={240} content="Wide">
        <Button>Open</Button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveStyle({ width: '240px' });
  });

  it('opens on hover when trigger="hover"', async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger="hover" content="Hovered">
        <Button>Hover</Button>
      </Popover>,
    );

    await user.hover(screen.getByRole('button', { name: 'Hover' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Hovered');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Popover disabled content="Nope">
        <Button>Open</Button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled open with onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange} content="Controlled">
        <Button>Open</Button>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Popover open onOpenChange={onOpenChange} content="Controlled">
        <Button>Open</Button>
      </Popover>,
    );
    expect(await screen.findByRole('dialog')).toHaveTextContent('Controlled');
  });
});
