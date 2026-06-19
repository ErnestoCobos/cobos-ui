# Tooltip

Hover, click or focus tooltip built on Floating UI, with placements, dark/light themes and an arrow.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/tooltip

## Import

```ts
import { Tooltip } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Tooltip, Button } from '@cobos/react';

export function Example() {
  return (
    <Tooltip content="More information" placement="top">
      <Button>Hover me</Button>
    </Tooltip>
  );
}
```

The tooltip can open on click or focus and use a light theme:

```tsx
import { Tooltip, Button } from '@cobos/react';

export function ClickExample() {
  return (
    <Tooltip content="Click-triggered tooltip" trigger="click" effect="light">
      <Button>Click me</Button>
    </Tooltip>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — (required) | Tooltip content. When empty/`null` the tooltip is disabled. |
| `placement` | `Placement` | `'top'` | Placement of the tooltip relative to the trigger (Floating UI placement, e.g. `'top'`, `'bottom-start'`, `'right'`). |
| `trigger` | `'hover' \| 'click' \| 'focus'` | `'hover'` | How the tooltip opens. |
| `disabled` | `boolean` | `false` | Disable the tooltip; the trigger renders without one. |
| `effect` | `'dark' \| 'light'` | `'dark'` | Visual theme of the tooltip surface. |
| `showArrow` | `boolean` | `true` | Show the arrow pointing at the trigger. |
| `offset` | `number` | `8` | Gap between the trigger and the tooltip, in px. |
| `open` | `boolean` | — | Controlled open state. |
| `defaultOpen` | `boolean` | — | Initial open state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Fired when the open state changes. |
| `children` | `ReactElement` | — (required) | Trigger element; it receives the floating ref and interaction handlers. |

`Placement` is re-exported from Floating UI.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onOpenChange(open)` | The open state changes for any reason (trigger interaction, dismissal). |

## Accessibility

- Floating UI applies `role="tooltip"` to the floating surface via `useRole`.
- The single child element is cloned as the reference and receives the appropriate ARIA wiring and interaction handlers for the chosen `trigger`.
- The tooltip dismisses on outside press and Escape (`useDismiss`).
- A non-element child is rendered as-is without a tooltip.
