# Divider

Horizontal or vertical separator with optional label.

**Category:** Others · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/divider

## Import

```ts
import { Divider } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Divider } from '@cobos/react';

export function Example() {
  return (
    <>
      <p>Above</p>
      <Divider contentPosition="left">Section</Divider>
      <p>Below</p>
      <span>Inline A</span>
      <Divider direction="vertical" />
      <span>Inline B</span>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider orientation. |
| `contentPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Position of the text label (horizontal direction only). |
| `borderStyle` | `CSSProperties['borderStyle']` | `'solid'` | Border line style. |
| `children` | `ReactNode` | — | Optional label (rendered only in horizontal direction). |

The component forwards all native `<div>` attributes.

## Events / Callbacks

None specific to Divider. Native handlers are forwarded to the host `<div>`.

## Accessibility

Renders with `role="separator"`, so assistive technology announces it as a thematic break.
