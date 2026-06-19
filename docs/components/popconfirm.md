# Popconfirm

Inline confirmation popover with a prompt, warning icon and confirm/cancel buttons.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/popconfirm

## Import

```ts
import { Popconfirm } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Popconfirm, Button } from '@cobos/react';

export function Example() {
  return (
    <Popconfirm
      title="Are you sure you want to delete this?"
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      confirmButtonType="danger"
      onConfirm={() => console.log('confirmed')}
      onCancel={() => console.log('cancelled')}
    >
      <Button type="danger">Delete</Button>
    </Popconfirm>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — (required) | Confirmation prompt shown next to the icon. |
| `confirmButtonText` | `string` | `'Yes'` | Confirm button label. |
| `cancelButtonText` | `string` | `'No'` | Cancel button label. |
| `confirmButtonType` | `ButtonType` | `'primary'` | Button type used for the confirm action. |
| `icon` | `ReactNode` | warning mark | Leading icon; defaults to a warning mark colored with `--ec-color-warning`. |
| `hideIcon` | `boolean` | `false` | Hide the leading icon entirely. |
| `placement` | `Placement` | `'top'` | Placement of the confirm box relative to the trigger (Floating UI placement). |
| `width` | `number \| string` | — | Fixed width of the confirm box. |
| `offset` | `number` | `8` | Gap between the trigger and the confirm box, in px. |
| `disabled` | `boolean` | `false` | Disable the confirm box; the trigger renders without one. |
| `onConfirm` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Fired when the confirm button is clicked. |
| `onCancel` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Fired when the cancel button is clicked. |
| `children` | `ReactElement` | — (required) | Trigger element; it receives the floating ref and interaction handlers. |

`ButtonType` is `'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'`; `Placement` is re-exported from Floating UI. The confirm box is always click-triggered, and either action closes it.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onConfirm(event)` | The confirm button is clicked. The box closes first. |
| `onCancel(event)` | The cancel button is clicked. The box closes first. |

## Accessibility

- Floating UI applies `role="dialog"` to the floating surface via `useRole`.
- The single child element is cloned as the (click) trigger.
- The confirm box dismisses on outside press and Escape (`useDismiss`).
- The leading icon is marked `aria-hidden`; the confirm and cancel actions are real `Button` elements.
