# Notification

Imperative corner notification card with a title, body, semantic icon and configurable corner.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/notification

## Import

```ts
import { notification } from '@cobos/react';
import '@cobos/react/styles.css';
```

`Notification` is exported as an alias of the callable `notification` API.

## Usage

```tsx
import { notification, Button } from '@cobos/react';

export function Example() {
  return (
    <>
      <Button
        onClick={() =>
          notification({ title: 'Heads up', message: 'Something happened.' })
        }
      >
        Notify
      </Button>
      <Button
        onClick={() =>
          notification.success({
            title: 'Done',
            message: 'Your export is ready.',
            position: 'bottom-right',
          })
        }
      >
        Success
      </Button>
    </>
  );
}
```

Each call returns a handle so it can be closed programmatically:

```tsx
const handle = notification({ title: 'Working…', duration: 0 });
// later
handle.close();
```

## Imperative API

`notification` is callable directly and also exposes type-specific shortcuts and `closeAll`. Every call accepts either a string (used as the message body) or a `NotificationOptions` object, and returns a `NotificationHandle`.

| Member | Signature | Description |
| --- | --- | --- |
| `notification(options)` | `(options: NotificationOptions \| string) => NotificationHandle` | Show a notification. |
| `notification.success(options)` | `(options: NotificationOptions \| string) => NotificationHandle` | Show a `success` notification. |
| `notification.warning(options)` | `(options: NotificationOptions \| string) => NotificationHandle` | Show a `warning` notification. |
| `notification.info(options)` | `(options: NotificationOptions \| string) => NotificationHandle` | Show an `info` notification. |
| `notification.error(options)` | `(options: NotificationOptions \| string) => NotificationHandle` | Show an `error` notification. |
| `notification.closeAll()` | `() => void` | Close every open notification. |

### NotificationOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Bold heading. |
| `message` | `ReactNode` | — | Body content. |
| `type` | `'success' \| 'warning' \| 'info' \| 'error'` | — | Visual variant; drives the leading icon. Omit for no icon. |
| `duration` | `number` | `4500` | Auto-dismiss delay in ms. `0` keeps the card until closed. |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Corner to stack the card in. |
| `showClose` | `boolean` | `true` | Show a close button. |
| `className` | `string` | — | Extra class on the card element. |
| `onClose` | `() => void` | — | Fired after the card has closed. |

### NotificationHandle

| Member | Type | Description |
| --- | --- | --- |
| `close` | `() => void` | Close this notification. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onClose()` | The card has closed (auto-dismiss, close button, or `closeAll`). |

## Accessibility

- Each card renders with `role="alert"` and `aria-live="polite"`.
- The optional close button is a real `<button>` with `aria-label="Close"`; the type icon is decorative.
- Cards mount into a shared container appended to `document.body`, grouped into per-corner wrappers; in a non-browser (SSR) environment calls return an inert handle and render nothing.
