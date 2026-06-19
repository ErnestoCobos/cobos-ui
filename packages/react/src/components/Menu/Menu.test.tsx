import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { SubMenu } from './SubMenu';
import { MenuItemGroup } from './MenuItemGroup';

function Basic(props: { onSelect?: (index: string) => void; onChange?: (index: string) => void }) {
  return (
    <Menu onSelect={props.onSelect} onChange={props.onChange}>
      <MenuItem index="1">Home</MenuItem>
      <MenuItem index="2">Profile</MenuItem>
      <MenuItem index="3" disabled>
        Disabled
      </MenuItem>
    </Menu>
  );
}

describe('Menu', () => {
  it('renders a menuitem for each item', () => {
    render(<Basic />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('activates an item on click and fires onSelect', async () => {
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);
    const profile = screen.getByText('Profile').closest('.ec-menu-item');
    await userEvent.click(screen.getByText('Profile'));
    expect(profile).toHaveClass('is-active');
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('fires onChange when the active index changes', async () => {
    const onChange = vi.fn();
    render(<Basic onChange={onChange} />);
    await userEvent.click(screen.getByText('Profile'));
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('respects defaultActive (uncontrolled)', () => {
    render(
      <Menu defaultActive="2">
        <MenuItem index="1">Home</MenuItem>
        <MenuItem index="2">Profile</MenuItem>
      </Menu>,
    );
    expect(screen.getByText('Profile').closest('.ec-menu-item')).toHaveClass('is-active');
  });

  it('does nothing when a disabled item is clicked', async () => {
    const onSelect = vi.fn();
    render(<Basic onSelect={onSelect} />);
    const disabled = screen.getByText('Disabled').closest('.ec-menu-item');
    await userEvent.click(screen.getByText('Disabled'));
    expect(disabled).not.toHaveClass('is-active');
    expect(disabled).toHaveClass('is-disabled');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('applies the mode modifier class', () => {
    const { container } = render(
      <Menu mode="horizontal">
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    const root = container.querySelector('.ec-menu');
    expect(root).toHaveClass('ec-menu--horizontal');
  });

  it('applies the collapse class in vertical mode', () => {
    const { container } = render(
      <Menu collapse>
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('.ec-menu')).toHaveClass('is-collapse');
  });
});

describe('SubMenu (vertical)', () => {
  function WithSubMenu(props: { onOpen?: (i: string) => void; onClose?: (i: string) => void }) {
    return (
      <Menu onOpen={props.onOpen} onClose={props.onClose}>
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
          <MenuItem index="1-2">Child two</MenuItem>
        </SubMenu>
      </Menu>
    );
  }

  it('expands and collapses inline on title click', async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const { container } = render(<WithSubMenu onOpen={onOpen} onClose={onClose} />);
    const sub = container.querySelector('.ec-sub-menu') as HTMLElement;
    const title = container.querySelector('.ec-sub-menu__title') as HTMLElement;

    expect(sub).not.toHaveClass('is-opened');

    await userEvent.click(title);
    expect(sub).toHaveClass('is-opened');
    expect(onOpen).toHaveBeenCalledWith('group');

    await userEvent.click(title);
    expect(sub).not.toHaveClass('is-opened');
    expect(onClose).toHaveBeenCalledWith('group');
  });

  it('respects defaultOpeneds', () => {
    const { container } = render(
      <Menu defaultOpeneds={['group']}>
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(container.querySelector('.ec-sub-menu')).toHaveClass('is-opened');
  });

  it('marks the sub-menu active when a descendant is active', () => {
    const { container } = render(
      <Menu defaultActive="1-2">
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
          <MenuItem index="1-2">Child two</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(container.querySelector('.ec-sub-menu')).toHaveClass('is-active');
  });

  it('does not toggle a disabled sub-menu', async () => {
    const { container } = render(
      <Menu>
        <SubMenu index="group" title="More" disabled>
          <MenuItem index="1-1">Child one</MenuItem>
        </SubMenu>
      </Menu>,
    );
    const sub = container.querySelector('.ec-sub-menu') as HTMLElement;
    await userEvent.click(container.querySelector('.ec-sub-menu__title') as HTMLElement);
    expect(sub).not.toHaveClass('is-opened');
  });
});

describe('SubMenu (horizontal)', () => {
  function HorizontalSubMenu() {
    return (
      <Menu mode="horizontal">
        <SubMenu index="more" title="More">
          <MenuItem index="m-1">Child one</MenuItem>
          <MenuItem index="m-2">Child two</MenuItem>
        </SubMenu>
      </Menu>
    );
  }

  it('sets aria-orientation to horizontal on the root menu', () => {
    const { container } = render(
      <Menu mode="horizontal">
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('.ec-menu')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets aria-orientation to vertical by default', () => {
    const { container } = render(
      <Menu>
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    expect(container.querySelector('.ec-menu')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('exposes aria-expanded on the horizontal trigger and toggles it', async () => {
    const { container } = render(<HorizontalSubMenu />);
    const trigger = container.querySelector('.ec-sub-menu__title') as HTMLElement;
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.type(trigger, '{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens a horizontal sub-menu via the keyboard (Enter)', async () => {
    render(<HorizontalSubMenu />);
    const trigger = screen.getByText('More').closest('.ec-sub-menu__title') as HTMLElement;

    expect(screen.queryByText('Child one')).not.toBeInTheDocument();

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Child one')).toBeInTheDocument();
  });

  it('opens a horizontal sub-menu via the keyboard (ArrowDown)', async () => {
    render(<HorizontalSubMenu />);
    const trigger = screen.getByText('More').closest('.ec-sub-menu__title') as HTMLElement;

    expect(screen.queryByText('Child one')).not.toBeInTheDocument();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByText('Child one')).toBeInTheDocument();
  });

  it('rotates the arrow (is-opened) when the horizontal popup is open', async () => {
    const { container } = render(<HorizontalSubMenu />);
    const trigger = container.querySelector('.ec-sub-menu__title') as HTMLElement;
    expect(container.querySelector('.ec-sub-menu__arrow-wrap')).not.toHaveClass('is-opened');

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(container.querySelector('.ec-sub-menu__arrow-wrap')).toHaveClass('is-opened');
  });

  it('closes the horizontal popup when an item inside it is selected', async () => {
    const onSelect = vi.fn();
    render(
      <Menu mode="horizontal" onSelect={onSelect}>
        <SubMenu index="more" title="More">
          <MenuItem index="m-1">Child one</MenuItem>
        </SubMenu>
      </Menu>,
    );
    const trigger = screen.getByText('More').closest('.ec-sub-menu__title') as HTMLElement;

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Child one')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Child one'));
    expect(onSelect).toHaveBeenCalledWith('m-1');
    expect(screen.queryByText('Child one')).not.toBeInTheDocument();
  });
});

describe('SubMenu (uniqueOpened)', () => {
  it('keeps only one top-level sub-menu open at a time', async () => {
    const { container } = render(
      <Menu uniqueOpened>
        <SubMenu index="a" title="A">
          <MenuItem index="a-1">A child</MenuItem>
        </SubMenu>
        <SubMenu index="b" title="B">
          <MenuItem index="b-1">B child</MenuItem>
        </SubMenu>
      </Menu>,
    );
    const [subA, subB] = Array.from(
      container.querySelectorAll('.ec-sub-menu'),
    ) as HTMLElement[];
    const titleA = subA.querySelector('.ec-sub-menu__title') as HTMLElement;
    const titleB = subB.querySelector('.ec-sub-menu__title') as HTMLElement;

    await userEvent.click(titleA);
    expect(subA).toHaveClass('is-opened');

    await userEvent.click(titleB);
    expect(subB).toHaveClass('is-opened');
    expect(subA).not.toHaveClass('is-opened');
  });

  it('preserves the ancestor chain when opening a nested sub-menu', async () => {
    const { container } = render(
      <Menu uniqueOpened>
        <SubMenu index="parent" title="Parent">
          <SubMenu index="child" title="Child">
            <MenuItem index="leaf">Leaf</MenuItem>
          </SubMenu>
        </SubMenu>
      </Menu>,
    );
    const titles = Array.from(
      container.querySelectorAll('.ec-sub-menu__title'),
    ) as HTMLElement[];
    const parentTitle = titles[0];

    await userEvent.click(parentTitle);
    const parentSub = container.querySelector('.ec-sub-menu') as HTMLElement;
    expect(parentSub).toHaveClass('is-opened');

    // The nested trigger is only reachable once the parent is open.
    const childTitle = Array.from(
      container.querySelectorAll('.ec-sub-menu__title'),
    ).find((el) => el.textContent?.includes('Child')) as HTMLElement;
    await userEvent.click(childTitle);

    const subs = Array.from(container.querySelectorAll('.ec-sub-menu')) as HTMLElement[];
    // Both ancestor (parent) and the newly opened child stay open.
    expect(subs.every((el) => el.classList.contains('is-opened'))).toBe(true);
    expect(screen.getByText('Leaf')).toBeInTheDocument();
  });
});

describe('MenuItemGroup', () => {
  it('renders a group label and its items', () => {
    render(
      <Menu>
        <MenuItemGroup title="Section">
          <MenuItem index="1">Home</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
