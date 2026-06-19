# Popover

Rich popover panel built on Floating UI, with an optional title, fixed width, placements and an arrow.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/popover

## Import

```ts
import { Popover } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Popover, Button } from '@cobos/react';

export function Example() {
  return (
    <Popover
      title="Title"
      content="This is the popover content."
      placement="bottom"
      width={240}
    >
      <Button>Open popover</Button>
    </Popover>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — (required) | Popover body content. |
| `title` | `ReactNode` | — | Optional bold heading shown above the content. |
| `trigger` | `'hover' \| 'click' \| 'focus'` | `'click'` | How the popover opens. |
| `placement` | `Placement` | `'bottom'` | Placement of the popover relative to the trigger (Floating UI placement). |
| `width` | `number \| string` | — | Fixed width of the popover surface. |
| `showArrow` | `boolean` | `true` | Show the arrow pointing at the trigger. |
| `offset` | `number` | `8` | Gap between the trigger and the popover, in px. |
| `disabled` | `boolean` | `false` | Disable the popover; the trigger renders without one. |
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

- Floating UI applies `role="dialog"` to the floating surface via `useRole`.
- The single child element is cloned as the reference and receives the ARIA wiring and interaction handlers for the chosen `trigger`.
- The popover dismisses on outside press and Escape (`useDismiss`).
- A non-element child is rendered as-is without a popover.
