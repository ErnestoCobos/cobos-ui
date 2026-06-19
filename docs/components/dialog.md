# Dialog

Modal dialog with focus trap, scroll lock and dismissal.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/dialog

## Import

```ts
import { Dialog } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Dialog, Button } from '@cobos/react';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setOpen(false)}>OK</Button>
          </>
        }
      >
        Are you sure?
      </Dialog>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — (required) | Controlled visibility. |
| `onClose` | `() => void` | — | Called when the dialog requests to close (escape, overlay click, close button). |
| `onOpenChange` | `(open: boolean) => void` | — | Called whenever the open state should change. |
| `title` | `ReactNode` | — | Title shown in the header. Ignored when `header` is provided. |
| `header` | `ReactNode` | — | Custom header content; overrides the title area. |
| `footer` | `ReactNode` | — | Footer content. |
| `width` | `string \| number` | `'50%'` | Dialog width. |
| `fullscreen` | `boolean` | `false` | Take up the whole viewport. |
| `top` | `string` | `'15vh'` | Distance from the top of the viewport. Ignored when `alignCenter`/`fullscreen`. |
| `alignCenter` | `boolean` | `false` | Vertically center the dialog. |
| `modal` | `boolean` | `true` | Show the backdrop. |
| `closeOnClickModal` | `boolean` | `true` | Close when clicking the overlay. |
| `closeOnPressEscape` | `boolean` | `true` | Close when pressing Escape. |
| `showClose` | `boolean` | `true` | Show the close button. |
| `center` | `boolean` | `false` | Center the header and footer text. |
| `lockScroll` | `boolean` | `true` | Lock body scroll while open. |
| `appendTo` | `unknown` | — | Always portal to `document.body` (kept for API parity). |
| `keepMounted` | `boolean` | `false` | Keep the dialog mounted while closed. |
| `destroyOnClose` | `boolean` | `false` | Destroy the body content every time the dialog closes. |
| `children` | `ReactNode` | — | Dialog body content. |

Forwards native `<div>` attributes (except `title`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onOpenChange(open)` | The open state should change for any reason. |
| `onClose()` | The dialog requests to close (Escape, overlay click, or the close button). Fires after `onOpenChange(false)`. |

## Accessibility

- Built on Floating UI: the dialog uses `role="dialog"` with `aria-modal` when `modal`, and `aria-labelledby` pointing to the generated title id when a `title` (and no custom `header`) is provided.
- Focus is trapped within the dialog while open (`FloatingFocusManager`) and the close button has `aria-label="Close"`.
- Body scroll is locked while open when `lockScroll` is enabled; Escape and overlay clicks dismiss it unless disabled.
