import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';
import { DropdownMenu } from './DropdownMenu';

describe('Dropdown', () => {
  it('opens the menu when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="click"
        menu={
          <DropdownMenu>
            <DropdownItem command="a">Action A</DropdownItem>
            <DropdownItem command="b">Action B</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    expect(screen.queryByRole('menuitem', { name: 'Action A' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('menuitem', { name: 'Action A' })).toBeInTheDocument();
  });

  it('fires onCommand and closes when an item is clicked', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="copy">Copy</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }));

    expect(onCommand).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledWith('copy');
    expect(screen.queryByRole('menuitem', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('keeps the menu open when hideOnClick is false', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        hideOnClick={false}
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="copy">Copy</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }));

    expect(onCommand).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
  });

  it('does nothing when a disabled item is clicked', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="x" disabled>
              Disabled
            </DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const item = screen.getByRole('menuitem', { name: 'Disabled' });
    await user.click(item);

    expect(onCommand).not.toHaveBeenCalled();
    expect(item).toHaveClass('is-disabled');
    expect(item).toBeInTheDocument();
  });

  it('renders a separator for a divided item', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="click"
        menu={
          <DropdownMenu>
            <DropdownItem command="a">Action A</DropdownItem>
            <DropdownItem command="b" divided>
              Action B
            </DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('menuitem', { name: 'Action B' })).toHaveClass('is-divided');
  });

  it('activates an item with the Enter key', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="copy">Copy</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const item = screen.getByRole('menuitem', { name: 'Copy' });
    item.focus();
    await user.keyboard('{Enter}');

    expect(onCommand).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledWith('copy');
    expect(screen.queryByRole('menuitem', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('activates an item with the Space key', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        hideOnClick={false}
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="copy">Copy</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const item = screen.getByRole('menuitem', { name: 'Copy' });
    item.focus();
    await user.keyboard('[Space]');

    expect(onCommand).toHaveBeenCalledOnce();
    expect(onCommand).toHaveBeenCalledWith('copy');
  });

  it('does not activate a disabled item via the keyboard', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(
      <Dropdown
        trigger="click"
        onCommand={onCommand}
        menu={
          <DropdownMenu>
            <DropdownItem command="x" disabled>
              Disabled
            </DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const item = screen.getByRole('menuitem', { name: 'Disabled' });
    item.focus();
    await user.keyboard('{Enter}');

    expect(onCommand).not.toHaveBeenCalled();
  });

  it('moves focus between enabled items with the arrow keys (roving focus)', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="click"
        menu={
          <DropdownMenu>
            <DropdownItem command="a">Action A</DropdownItem>
            <DropdownItem command="b">Action B</DropdownItem>
            <DropdownItem command="c">Action C</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const a = screen.getByRole('menuitem', { name: 'Action A' });
    const b = screen.getByRole('menuitem', { name: 'Action B' });
    const c = screen.getByRole('menuitem', { name: 'Action C' });

    a.focus();
    await user.keyboard('{ArrowDown}');
    expect(b).toHaveFocus();

    await user.keyboard('{End}');
    expect(c).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(a).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(c).toHaveFocus();

    await user.keyboard('{Home}');
    expect(a).toHaveFocus();
  });

  it('exposes a roving tabindex with a single tab stop', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="click"
        menu={
          <DropdownMenu>
            <DropdownItem command="a">Action A</DropdownItem>
            <DropdownItem command="b">Action B</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const items = screen.getAllByRole('menuitem');
    const tabStops = items.filter((item) => item.tabIndex === 0);
    expect(tabStops).toHaveLength(1);
    expect(tabStops[0]).toBe(items[0]);
  });

  it('renders exactly one role="menu" container around the items', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger="click"
        menu={
          <DropdownMenu>
            <DropdownItem command="a">Action A</DropdownItem>
          </DropdownMenu>
        }
      >
        <Button>Menu</Button>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(screen.getByRole('menu').tagName).toBe('UL');
  });
});
