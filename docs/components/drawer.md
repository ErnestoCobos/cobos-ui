# Drawer

Slide-in panel anchored to any edge, with focus trap, scroll lock and dismissal.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/drawer

## Import

```ts
import { Drawer } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Drawer, Button } from '@cobos/react';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Settings"
        direction="rtl"
        size="40%"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        Drawer content goes here.
      </Drawer>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — (required) | Controlled visibility. |
| `onClose` | `() => void` | — | Called when the drawer requests to close (escape, overlay click, close button). |
| `onOpenChange` | `(open: boolean) => void` | — | Called whenever the open state should change. |
| `title` | `ReactNode` | — | Title shown in the header. |
| `direction` | `'rtl' \| 'ltr' \| 'ttb' \| 'btt'` | `'rtl'` | Edge the panel slides in from (`'rtl'` slides in from the right). |
| `size` | `number \| string` | `'30%'` | Panel size. Drives the width for `rtl`/`ltr` and the height for `ttb`/`btt`. |
| `modal` | `boolean` | `true` | Show the backdrop. |
| `closeOnClickModal` | `boolean` | `true` | Close when clicking the overlay. |
| `closeOnPressEscape` | `boolean` | `true` | Close when pressing Escape. |
| `showClose` | `boolean` | `true` | Show the close button. |
| `withHeader` | `boolean` | `true` | Render the header region. |
| `footer` | `ReactNode` | — | Footer content. |
| `lockScroll` | `boolean` | `true` | Lock body scroll while open. |
| `keepMounted` | `boolean` | `false` | Keep the drawer mounted while closed. |
| `children` | `ReactNode` | — | Drawer body content. |

Forwards native `<div>` attributes (except `title`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onOpenChange(open)` | The open state should change for any reason. Fires with `true` on open, `false` on close. |
| `onClose()` | The drawer requests to close (Escape, overlay click, or the close button). Fires after `onOpenChange(false)`. |

## Accessibility

- Built on Floating UI: the panel uses `role="dialog"` with `aria-modal` when `modal`.
- An accessible name is derived from a consumer-supplied `aria-label`/`aria-labelledby`, otherwise from the rendered title id when a header with a `title` is present.
- Focus is trapped within the panel while open (`FloatingFocusManager`) and the close button has `aria-label="Close"`.
- Body scroll is locked while open when `lockScroll` is enabled; Escape and overlay clicks dismiss it unless disabled. When `modal` is `false`, no hit-testing overlay is rendered so the page behind stays interactive.
