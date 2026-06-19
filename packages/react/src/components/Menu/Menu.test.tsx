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
    const trigger = container.querySelector('.ec-sub-menu') as HTMLElement;
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.type(trigger, '{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens a horizontal sub-menu via the keyboard (Enter)', async () => {
    render(<HorizontalSubMenu />);
    const trigger = screen.getByText('More').closest('.ec-sub-menu') as HTMLElement;

    expect(screen.queryByText('Child one')).not.toBeInTheDocument();

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Child one')).toBeInTheDocument();
  });

  it('opens a horizontal sub-menu via the keyboard (ArrowDown)', async () => {
    render(<HorizontalSubMenu />);
    const trigger = screen.getByText('More').closest('.ec-sub-menu') as HTMLElement;

    expect(screen.queryByText('Child one')).not.toBeInTheDocument();

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByText('Child one')).toBeInTheDocument();
  });

  it('rotates the arrow (is-opened) when the horizontal popup is open', async () => {
    const { container } = render(<HorizontalSubMenu />);
    const trigger = container.querySelector('.ec-sub-menu') as HTMLElement;
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
    const trigger = screen.getByText('More').closest('.ec-sub-menu') as HTMLElement;

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
    // The `.ec-sub-menu` `<div>` is the sub-menu trigger menuitem; clicking it
    // toggles the sub-menu, and the `is-opened` state class lives on it.
    const [subA, subB] = Array.from(
      container.querySelectorAll('.ec-sub-menu'),
    ) as HTMLElement[];

    await userEvent.click(subA);
    expect(subA).toHaveClass('is-opened');

    await userEvent.click(subB);
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
    // The `.ec-sub-menu` `<div>` is the trigger menuitem; the parent trigger is
    // the first one.
    const parentSub = container.querySelector('.ec-sub-menu') as HTMLElement;

    await userEvent.click(parentSub);
    expect(parentSub).toHaveClass('is-opened');

    // The nested trigger is only reachable once the parent is open. Select it
    // by its label so the enclosing parent trigger is not matched.
    const childTitle = screen.getByText('Child').closest('.ec-sub-menu__title') as HTMLElement;
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

describe('Menu ARIA role structure (WAI-ARIA menu pattern)', () => {
  it('uses role="menu" on the root in vertical mode', () => {
    const { container } = render(
      <Menu>
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    const root = container.querySelector('.ec-menu') as HTMLElement;
    expect(root).toHaveAttribute('role', 'menu');
  });

  it('uses role="menubar" on the root in horizontal mode', () => {
    const { container } = render(
      <Menu mode="horizontal">
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    const root = container.querySelector('.ec-menu') as HTMLElement;
    expect(root).toHaveAttribute('role', 'menubar');
  });

  it('exposes each item as a role="menuitem" on a <div> (no list markup)', () => {
    const { container } = render(
      <Menu>
        <MenuItem index="1">Home</MenuItem>
        <MenuItem index="2">Profile</MenuItem>
      </Menu>,
    );
    // Two leaf items are exposed as menuitems.
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    // The role lives on a `<div>`, so there is no list markup and no stray
    // listitem.
    const item = screen.getByText('Home').closest('.ec-menu-item') as HTMLElement;
    expect(item).toHaveAttribute('role', 'menuitem');
    expect(item.tagName).toBe('DIV');
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    // No `<ul>`/`<li>` is emitted anywhere in the menu tree.
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('li')).toBeNull();
  });

  it('marks the menuitem <div> as focusable', () => {
    render(
      <Menu>
        <MenuItem index="1">Home</MenuItem>
      </Menu>,
    );
    const menuitem = screen.getByRole('menuitem');
    expect(menuitem.tagName).toBe('DIV');
    expect(menuitem).toHaveAttribute('tabindex', '0');
  });

  it('gives a disabled item a focusable menuitem with aria-disabled', () => {
    render(
      <Menu>
        <MenuItem index="1" disabled>
          Disabled
        </MenuItem>
      </Menu>,
    );
    const menuitem = screen.getByRole('menuitem');
    expect(menuitem).toHaveAttribute('aria-disabled', 'true');
    expect(menuitem).toHaveAttribute('tabindex', '-1');
  });

  it('exposes the sub-menu trigger as a menuitem with aria-haspopup and aria-expanded (vertical)', () => {
    const { container } = render(
      <Menu defaultOpeneds={['group']}>
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
        </SubMenu>
      </Menu>,
    );
    // The trigger `<div>` is the sub-menu menuitem.
    const trigger = container.querySelector('.ec-sub-menu') as HTMLElement;
    expect(trigger.tagName).toBe('DIV');
    expect(trigger).toHaveAttribute('role', 'menuitem');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The sub-menu's inline content is itself a menu, owned by (nested inside)
    // the trigger menuitem.
    const content = container.querySelector('.ec-sub-menu__content') as HTMLElement;
    expect(content).toHaveAttribute('role', 'menu');
    expect(content.tagName).toBe('DIV');
    expect(trigger.contains(content)).toBe(true);
    // The title remains the menuitem's accessible-name source.
    expect(container.querySelector('.ec-sub-menu__title')).toHaveTextContent('More');
    // No `<ul>`/`<li>` anywhere.
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('li')).toBeNull();
  });

  it('exposes the horizontal sub-menu trigger as a menuitem with aria-haspopup', () => {
    const { container } = render(
      <Menu mode="horizontal">
        <SubMenu index="more" title="More">
          <MenuItem index="m-1">Child one</MenuItem>
        </SubMenu>
      </Menu>,
    );
    const trigger = container.querySelector('.ec-sub-menu') as HTMLElement;
    expect(trigger.tagName).toBe('DIV');
    expect(trigger).toHaveAttribute('role', 'menuitem');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('li')).toBeNull();
  });

  it('keeps every menuitem inside a menu/menubar subtree (no orphan menuitems)', async () => {
    render(
      <Menu defaultOpeneds={['group']}>
        <MenuItem index="1">Home</MenuItem>
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
          <MenuItem index="1-2">Child two</MenuItem>
        </SubMenu>
        <MenuItemGroup title="Section">
          <MenuItem index="2">Settings</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );

    const isMenuContainer = (el: Element) => {
      const role = el.getAttribute('role');
      return role === 'menu' || role === 'menubar';
    };

    for (const menuitem of screen.getAllByRole('menuitem')) {
      let ancestor: HTMLElement | null = menuitem.parentElement;
      let contained = false;
      while (ancestor) {
        if (isMenuContainer(ancestor)) {
          contained = true;
          break;
        }
        ancestor = ancestor.parentElement;
      }
      expect(contained).toBe(true);
    }
  });

  it('emits no <ul>/<li> and no presentational role="none", exposing no stray listitem', () => {
    const { container } = render(
      <Menu defaultOpeneds={['group']}>
        <MenuItem index="1">Home</MenuItem>
        <SubMenu index="group" title="More">
          <MenuItem index="1-1">Child one</MenuItem>
        </SubMenu>
        <MenuItemGroup title="Section">
          <MenuItem index="2">Settings</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    // The whole tree is built from `<div>`s: no `<ul>`/`<li>` is emitted, so the
    // axe `list`/`listitem`/`aria-required-parent` rules cannot fire.
    expect(container.querySelector('ul')).toBeNull();
    expect(container.querySelector('li')).toBeNull();
    for (const el of Array.from(container.querySelectorAll('*'))) {
      expect(el.tagName).not.toBe('UL');
      expect(el.tagName).not.toBe('LI');
    }
    // No element relies on a presentational role; the role lives on the real
    // element instead (axe `aria-required-children` forbids a `role="none"`
    // direct child of a `menu`/`menubar`).
    expect(container.querySelector('[role="none"]')).toBeNull();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    // Every menu/menubar contains only menuitem/group (and owned menu) children.
    for (const menu of Array.from(container.querySelectorAll('[role="menu"], [role="menubar"]'))) {
      for (const child of Array.from(menu.children)) {
        const role = child.getAttribute('role');
        expect(role === 'menuitem' || role === 'group').toBe(true);
      }
    }
  });

  it('names the group via aria-labelledby pointing at its presentational title', () => {
    const { container } = render(
      <Menu>
        <MenuItemGroup title="Section">
          <MenuItem index="1">Home</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    const group = screen.getByRole('group');
    const labelId = group.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    const label = container.querySelector(`#${labelId}`) as HTMLElement;
    expect(label).toHaveTextContent('Section');
  });
});
