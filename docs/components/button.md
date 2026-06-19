# Button

Commonly used button with types, sizes, plain/text/link variants, loading and icons.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/button

## Import

```ts
import { Button, ButtonGroup } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Button } from '@cobos/react';

export function Example() {
  return (
    <Button type="primary" onClick={() => console.log('clicked')}>
      Save
    </Button>
  );
}
```

Buttons can be grouped, sized, made plain/text/link, given an icon, or put in a loading state:

```tsx
import { Button, ButtonGroup } from '@cobos/react';

export function Toolbar() {
  return (
    <ButtonGroup type="primary" size="small">
      <Button>Left</Button>
      <Button>Center</Button>
      <Button loading>Right</Button>
    </ButtonGroup>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | `'default'` (inherits from `ButtonGroup`) | Visual variant. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ButtonGroup` / `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ButtonGroup / ConfigProvider. |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button `type` attribute. |
| `plain` | `boolean` | `false` | Outlined style. |
| `text` | `boolean` | `false` | Text-only style (no background or border). |
| `bg` | `boolean` | `false` | Keep a background on text buttons. |
| `link` | `boolean` | `false` | Link style. |
| `dashed` | `boolean` | `false` | Dashed border. |
| `round` | `boolean` | `false` | Rounded corners. |
| `circle` | `boolean` | `false` | Circular button (for icon-only). |
| `loading` | `boolean` | `false` | Show a loading spinner and disable interaction. |
| `loadingIcon` | `ReactNode` | — | Custom loading icon. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the button. |
| `icon` | `ReactNode` | — | Leading icon. |
| `color` | `string` | — | Custom base color; hover/active states are derived automatically. |
| `dark` | `boolean` | `false` | Treat `color` as a dark-mode color. |
| `children` | `ReactNode` | — | Button label. |

The component also forwards all native `<button>` attributes (except `type`, which is replaced by `nativeType`).

### ButtonGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'large' \| 'default' \| 'small'` | — | Size shared by descendant buttons. |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | — | Type shared by descendant buttons. |
| `children` | `ReactNode` | — | `Button` elements. |

`ButtonGroup` forwards all native `<div>` attributes and applies `role="group"`.

## Events / Callbacks

The Button does not define custom callbacks; it forwards native handlers such as `onClick`, `onFocus`, and `onBlur` to the underlying `<button>`. When `loading` or `disabled` is set, the button is disabled and native interaction is blocked.

## Accessibility

- Renders a real `<button>` element with the chosen `nativeType`.
- When disabled (via `disabled` or `loading`), it sets the native `disabled` attribute and `aria-disabled`.
- `ButtonGroup` wraps its children in a `role="group"` container.
- Icon-only buttons should be given an `aria-label` for screen readers.
