# Tabs

Tabbed navigation with line, card and border-card types and 4 positions.

**Category:** Navigation · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/tabs

## Import

```ts
import { Tabs, TabPane } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Tabs, TabPane } from '@cobos/react';

export function Example() {
  const [active, setActive] = useState('first');
  return (
    <Tabs value={active} onChange={setActive} type="card">
      <TabPane name="first" label="First">First content</TabPane>
      <TabPane name="second" label="Second">Second content</TabPane>
      <TabPane name="third" label="Third" lazy>Loaded on demand</TabPane>
    </Tabs>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Active tab name (controlled). |
| `defaultValue` | `string` | first pane's `name` | Initial active tab name (uncontrolled). |
| `onChange` | `(name: string) => void` | — | Fired when the active tab changes. |
| `type` | `'line' \| 'card' \| 'border-card'` | `'line'` | Visual style of the tabs. |
| `tabPosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Position of the tab header relative to the content. |
| `closable` | `boolean` | `false` | Show a close button on every tab. |
| `addable` | `boolean` | `false` | Show an "add tab" button. |
| `editable` | `boolean` | `false` | Shorthand to enable both `addable` and `closable`. |
| `stretch` | `boolean` | `false` | Stretch tabs to fill the available width. |
| `onTabClick` | `(name: string) => void` | — | Fired when a tab header is clicked (even if already active). |
| `onTabRemove` | `(name: string) => void` | — | Fired when a tab's close button is clicked. |
| `onTabAdd` | `() => void` | — | Fired when the add button is clicked. |
| `children` | `ReactNode` | — | `TabPane` elements. |

Forwards native `<div>` attributes (except `onChange`).

### TabPane Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — (required) | Unique identifier for the pane, matched against the active value. |
| `label` | `ReactNode` | falls back to `name` | Tab header label. |
| `disabled` | `boolean` | `false` | Disable selecting this pane. |
| `closable` | `boolean` | `false` | Allow this specific pane to be closed (overrides the parent `closable`). |
| `lazy` | `boolean` | `false` | Only render the pane content once it has been activated. |
| `children` | `ReactNode` | — | Pane content. |

Forwards native `<div>` attributes (except `id`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(name)` | The active tab changes to a new, enabled pane. |
| `onTabClick(name)` | A tab header is clicked, including the already-active one. |
| `onTabRemove(name)` | A tab's close button is clicked. (Removal of the pane itself is up to the consumer.) |
| `onTabAdd()` | The add button is clicked. |

## Accessibility

- The header is a `role="tablist"`; each tab is a `role="tab"` with `aria-selected`, `aria-controls`, `aria-disabled`, and a managed `tabIndex`.
- Panels are `role="tabpanel"` with `aria-labelledby` pointing back to their tab and `hidden` when inactive.
- Tabs activate on click and on Enter/Space when focused.
