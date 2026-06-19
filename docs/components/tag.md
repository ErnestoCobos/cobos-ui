# Tag

Label tag with types, effects, sizes and closable.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/tag

## Import

```ts
import { Tag } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Tag } from '@cobos/react';

export function Example() {
  return (
    <>
      <Tag type="success" effect="dark">Active</Tag>
      <Tag type="danger" closable onClose={() => console.log('removed')}>
        Removable
      </Tag>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'primary'` | Visual variant. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Size. |
| `effect` | `'dark' \| 'light' \| 'plain'` | `'light'` | Theme intensity. |
| `round` | `boolean` | `false` | Rounded corners. |
| `closable` | `boolean` | `false` | Show a close button. |
| `hit` | `boolean` | `false` | Highlight the border. |
| `color` | `string` | — | Custom background color. |
| `disableTransitions` | `boolean` | `false` | Disable the appearance transition. |
| `onClose` | `(e: MouseEvent) => void` | — | Fired when the close button is clicked. |
| `onClick` | `(e: MouseEvent) => void` | — | Fired when the tag body is clicked. |
| `children` | `ReactNode` | — | Tag label. |

Forwards native `<span>` attributes except `onClick` (which is handled explicitly).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onClick(e)` | The tag body is clicked. |
| `onClose(e)` | The close button is clicked. Click propagation is stopped so it does not also trigger `onClick`. |

## Accessibility

- The close button is a real `<button>` with `aria-label="Close"`.
- When the tag is interactive (via `onClick`), consider adding a role and keyboard handling appropriate to its use.
