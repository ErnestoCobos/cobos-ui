# Link

Text hyperlink with semantic types, underline and disabled states.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/link

## Import

```ts
import { Link } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Link } from '@cobos/react';

export function Example() {
  return (
    <Link type="primary" href="https://ui.cobos.io" target="_blank">
      Documentation
    </Link>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Visual variant. |
| `underline` | `boolean` | `true` | Show an underline on hover. |
| `disabled` | `boolean` | `false` | Disable the link (removes `href` and blocks interaction). |
| `href` | `string` | — | Destination URL. Ignored when disabled. |
| `target` | `string` | — | Where to open the linked document. |
| `icon` | `ReactNode` | — | Leading icon. |
| `children` | `ReactNode` | — | Link text. |

The component forwards all native `<a>` (anchor) attributes.

## Events / Callbacks

None specific to Link. Native handlers (e.g. `onClick`) are forwarded to the `<a>` element. When `disabled`, the `href` and `target` are removed so navigation cannot occur.

## Accessibility

- Renders a native `<a>` element.
- When `disabled`, `href`/`target` are dropped and `aria-disabled` is set so assistive technology announces the disabled state.
