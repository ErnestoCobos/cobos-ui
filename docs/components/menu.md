# Menu

Vertical/horizontal menu with submenus, groups and collapse.

**Category:** Navigation · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/menu

## Import

```ts
import { Menu, MenuItem, SubMenu, MenuItemGroup } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Menu, MenuItem, SubMenu, MenuItemGroup } from '@cobos/react';

export function Example() {
  const [active, setActive] = useState('1');
  return (
    <Menu mode="vertical" value={active} onChange={setActive} defaultOpeneds={['group']}>
      <MenuItem index="1">Dashboard</MenuItem>
      <SubMenu index="group" title="Settings">
        <MenuItemGroup title="Account">
          <MenuItem index="2">Profile</MenuItem>
          <MenuItem index="3">Security</MenuItem>
        </MenuItemGroup>
      </SubMenu>
    </Menu>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout mode. |
| `value` | `string` | — | Active item index (controlled). |
| `defaultActive` | `string` | `''` | Initial active item index (uncontrolled). |
| `onChange` | `(index: string) => void` | — | Fired when the active index changes. |
| `collapse` | `boolean` | `false` | Collapse to icons only. Vertical mode only. |
| `defaultOpeneds` | `string[]` | `[]` | Sub-menu indices opened by default. |
| `uniqueOpened` | `boolean` | `false` | Keep only one sub-menu open at a time. |
| `onSelect` | `(index: string) => void` | — | Fired when an item is selected. |
| `onOpen` | `(index: string) => void` | — | Fired when a sub-menu expands. |
| `onClose` | `(index: string) => void` | — | Fired when a sub-menu collapses. |
| `children` | `ReactNode` | — | `MenuItem`, `SubMenu`, and `MenuItemGroup` elements. |

Forwards native `<ul>` attributes (except `onChange` and `onSelect`).

### MenuItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `string` | — (required) | Unique identifier used to mark the item active. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `icon` | `ReactNode` | — | Leading icon. |
| `children` | `ReactNode` | — | Item label. |

Forwards native `<li>` attributes (except `onClick`).

### SubMenu Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `string` | — (required) | Unique identifier for the sub-menu. |
| `title` | `ReactNode` | — | Title rendered in the sub-menu trigger. |
| `icon` | `ReactNode` | — | Leading icon. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `children` | `ReactNode` | — | Nested `MenuItem`s. |

In horizontal mode the children render in a hover-triggered popup; in vertical mode they expand/collapse inline. Forwards native `<li>` attributes (except `title`).

### MenuItemGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group label. |
| `children` | `ReactNode` | — | Grouped `MenuItem`s. |

Forwards native `<li>` attributes (except `title`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onSelect(index)` | Any item is selected (fires even when re-selecting the current item). |
| `onChange(index)` | The active index changes to a new value. |
| `onOpen(index)` | A sub-menu expands. |
| `onClose(index)` | A sub-menu collapses. |

## Accessibility

- The root `<ul>` is a `role="menu"`; items are `role="menuitem"` with managed `tabIndex` and `aria-disabled`.
- Sub-menu triggers carry `aria-haspopup="menu"`; in vertical mode they also set `aria-expanded` and `aria-controls`.
- Items and sub-menu triggers activate on click and on Enter/Space.
- `MenuItemGroup` uses `role="presentation"` for the wrapper and `role="group"` for the list.
