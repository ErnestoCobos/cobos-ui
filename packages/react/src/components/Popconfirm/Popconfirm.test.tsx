import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Popconfirm } from './Popconfirm';

describe('Popconfirm', () => {
  it('opens on click and shows the title plus default action labels', async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm title="Delete this item?">
        <Button>Delete</Button>
      </Popconfirm>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('Delete this item?');
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('fires onConfirm and closes when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="Sure?" onConfirm={onConfirm}>
        <Button>Act</Button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: 'Act' }));
    await user.click(await screen.findByRole('button', { name: 'Yes' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fires onCancel and closes when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <Popconfirm title="Sure?" onCancel={onCancel}>
        <Button>Act</Button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: 'Act' }));
    await user.click(await screen.findByRole('button', { name: 'No' }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('uses custom button labels and confirm button type', async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm
        title="Remove?"
        confirmButtonText="Remove"
        cancelButtonText="Keep"
        confirmButtonType="danger"
      >
        <Button>Act</Button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: 'Act' }));
    expect(await screen.findByRole('button', { name: 'Keep' })).toBeInTheDocument();
    const confirm = screen.getByRole('button', { name: 'Remove' });
    expect(confirm).toHaveClass('ec-button--danger');
  });

  it('renders the default warning icon and hides it when hideIcon is set', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Popconfirm title="Sure?">
        <Button>Act</Button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: 'Act' }));
    let dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('.ec-popconfirm__icon')).not.toBeNull();

    // Close, then re-render with hideIcon and reopen.
    await user.keyboard('{Escape}');
    rerender(
      <Popconfirm title="Sure?" hideIcon>
        <Button>Act</Button>
      </Popconfirm>,
    );
    await user.click(screen.getByRole('button', { name: 'Act' }));
    dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('.ec-popconfirm__icon')).toBeNull();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Popconfirm disabled title="Sure?">
        <Button>Act</Button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: 'Act' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
