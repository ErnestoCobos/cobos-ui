# Dropdown

Dropdown menu triggered by hover or click.

**Category:** Navigation · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/dropdown

## Import

```ts
import { Dropdown, DropdownMenu, DropdownItem } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Dropdown, DropdownMenu, DropdownItem, Button } from '@cobos/react';

export function Example() {
  return (
    <Dropdown
      trigger="click"
      onCommand={(command) => console.log(command)}
      menu={
        <DropdownMenu>
          <DropdownItem command="edit">Edit</DropdownItem>
          <DropdownItem command="duplicate">Duplicate</DropdownItem>
          <DropdownItem command="delete" divided>Delete</DropdownItem>
        </DropdownMenu>
      }
    >
      <Button>Actions</Button>
    </Dropdown>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | — (required) | Trigger element (e.g. a Button) that toggles the menu. |
| `menu` | `ReactNode` | — | Menu content, usually a `DropdownMenu` of `DropdownItem`. |
| `trigger` | `'hover' \| 'click'` | `'hover'` | How the menu opens. |
| `placement` | `Placement` | `'bottom-end'` | Placement of the menu relative to the trigger. |
| `disabled` | `boolean` | `false` | Disable the dropdown entirely. |
| `hideOnClick` | `boolean` | `true` | Close the menu when an item is clicked. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size, applied to descendant items. |
| `onCommand` | `(command: unknown) => void` | — | Fired with the clicked item's `command`. |
| `onVisibleChange` | `(visible: boolean) => void` | — | Fired when the menu opens or closes. |

Forwards native `<div>` attributes (except `children`). `Placement` is the standard placement string (e.g. `bottom-start`, `top`, `right-end`).

### DropdownMenu Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | `DropdownItem` elements. |

Forwards native `<ul>` attributes and applies `role="menu"`.

### DropdownItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `command` | `unknown` | — | Payload passed to the parent `onCommand` handler when clicked. |
| `disabled` | `boolean` | `false` | Disable the item. |
| `divided` | `boolean` | `false` | Render a separator above the item. |
| `icon` | `ReactNode` | — | Leading icon. |
| `children` | `ReactNode` | — | Item label. |

Forwards native `<li>` attributes (except `onClick`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onCommand(command)` | A `DropdownItem` is clicked; receives that item's `command`. |
| `onVisibleChange(visible)` | The menu opens or closes. |

When `hideOnClick` is enabled, clicking an item also closes the menu.

## Accessibility

- The menu container is a `role="menu"`; each item is a `role="menuitem"` with a managed `tabIndex` and `aria-disabled` when disabled.
- Disabled items prevent the command from firing.
