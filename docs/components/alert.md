# Alert

Inline alert banner with semantic types, light/dark effects, an optional icon and a close affordance.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/alert

## Import

```ts
import { Alert } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Alert } from '@cobos/react';

export function Example() {
  return (
    <Alert
      title="Success"
      type="success"
      description="Your changes have been saved."
      showIcon
      onClose={() => console.log('closed')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Title text. |
| `type` | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` | Visual variant. |
| `description` | `ReactNode` | — | Descriptive content beneath the title. Falls back to `children`. |
| `closable` | `boolean` | `true` | Show the close affordance. |
| `closeText` | `string` | — | Custom text for the close affordance (replaces the close icon). |
| `center` | `boolean` | `false` | Center the title text. |
| `effect` | `'light' \| 'dark'` | `'light'` | Theme intensity. |
| `showIcon` | `boolean` | `false` | Show the leading type icon. |
| `onClose` | `(e: MouseEvent) => void` | — | Fired when the alert is closed. |
| `children` | `ReactNode` | — | Descriptive content used when `description` is not set. |

Forwards native `<div>` attributes (except `title`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onClose(e)` | The close button is clicked. The alert unmounts itself afterwards. |

## Accessibility

- Renders a container with `role="alert"`.
- The close button is a real `<button>` with `aria-label="Close"` (whether it shows the icon or `closeText`).
- The type icon is decorative (`aria-hidden`).
- Closing is internal: once closed, the alert returns `null` and is removed from the DOM.
