# Badge

Count or dot badge overlaid on an element, with a max cap, color types and offset.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/badge

## Import

```ts
import { Badge } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Badge, Button } from '@cobos/react';

export function Example() {
  return (
    <Badge value={12} max={99} type="danger">
      <Button>Messages</Button>
    </Badge>
  );
}
```

A standalone dot, or an inline badge without children:

```tsx
import { Badge } from '@cobos/react';

export function Dot() {
  return (
    <Badge isDot type="success">
      <span>Status</span>
    </Badge>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | — | Displayed value. |
| `max` | `number` | `99` | Maximum value; numbers above it render as `{max}+`. |
| `isDot` | `boolean` | `false` | Render a small dot instead of the value. |
| `hidden` | `boolean` | `false` | Hide the badge. |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` | Color variant. |
| `showZero` | `boolean` | `false` | Show the badge even when the value is zero. |
| `color` | `string` | — | Custom background color, overriding the type color. |
| `offset` | `[number, number]` | — | Offset of the badge, as `[x, y]` in pixels. |
| `children` | `ReactNode` | — | Element the badge is overlaid on. When omitted the badge renders inline. |

Forwards native `<div>` attributes. The badge is hidden automatically when the value is empty, or zero unless `isDot` or `showZero` is set.

## Events / Callbacks

The Badge does not define custom callbacks.

## Accessibility

- Renders the badge value in a `<sup>` element overlaid on (or inline after) the children.
- The badge has no implicit ARIA role; pair the value with an accessible label on the host element where context is needed.
