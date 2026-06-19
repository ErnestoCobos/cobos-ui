# Message

Imperative toast message stacked at the top of the viewport, with semantic types and auto-dismiss.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/message

## Import

```ts
import { message } from '@cobos/react';
import '@cobos/react/styles.css';
```

`Message` is exported as an alias of the callable `message` API.

## Usage

```tsx
import { message, Button } from '@cobos/react';

export function Example() {
  return (
    <>
      <Button onClick={() => message('Saved')}>Default</Button>
      <Button onClick={() => message.success('Profile updated')}>Success</Button>
      <Button
        onClick={() =>
          message({
            message: 'Action could not be completed',
            type: 'error',
            duration: 0,
            showClose: true,
          })
        }
      >
        Persistent error
      </Button>
    </>
  );
}
```

Each call returns a handle so it can be closed programmatically:

```tsx
const handle = message({ message: 'Uploading…', duration: 0 });
// later
handle.close();
```

## Imperative API

`message` is callable directly and also exposes type-specific shortcuts and `closeAll`. Every call accepts either a string (used as the message body) or a `MessageOptions` object, and returns a `MessageHandle`.

| Member | Signature | Description |
| --- | --- | --- |
| `message(options)` | `(options: MessageOptions \| string) => MessageHandle` | Show a toast. |
| `message.success(options)` | `(options: MessageOptions \| string) => MessageHandle` | Show a `success` toast. |
| `message.warning(options)` | `(options: MessageOptions \| string) => MessageHandle` | Show a `warning` toast. |
| `message.info(options)` | `(options: MessageOptions \| string) => MessageHandle` | Show an `info` toast. |
| `message.error(options)` | `(options: MessageOptions \| string) => MessageHandle` | Show an `error` toast. |
| `message.closeAll()` | `() => void` | Close every open message. |

### MessageOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `ReactNode` | — | Body content. |
| `type` | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` | Visual variant. |
| `duration` | `number` | `3000` | Auto-dismiss delay in ms. `0` keeps the toast until closed. |
| `showClose` | `boolean` | `false` | Show a close button. |
| `center` | `boolean` | `false` | Center the text. |
| `offset` | `number` | `16` | Distance in px from the top of the viewport for the first toast. |
| `className` | `string` | — | Extra class on the toast element. |
| `onClose` | `() => void` | — | Fired after the toast has closed. |

### MessageHandle

| Member | Type | Description |
| --- | --- | --- |
| `close` | `() => void` | Close this toast. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onClose()` | The toast has closed (auto-dismiss, close button, or `closeAll`). |

## Accessibility

- Each toast renders with `role="alert"` and `aria-live="polite"`.
- The optional close button is a real `<button>` with `aria-label="Close"`.
- Toasts mount into a shared container appended to `document.body`; in a non-browser (SSR) environment calls return an inert handle and render nothing.
