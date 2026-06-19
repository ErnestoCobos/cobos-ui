# Card

Content container with header, body, footer and shadow modes.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/card

## Import

```ts
import { Card } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Card, Button } from '@cobos/react';

export function Example() {
  return (
    <Card header="Card title" footer={<Button text>More</Button>} shadow="hover">
      Card body content.
    </Card>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `ReactNode` | — | Header content. Renders the header section when set. |
| `footer` | `ReactNode` | — | Footer content. Renders the footer section when set. |
| `bodyStyle` | `CSSProperties` | — | Inline styles applied to the body section. |
| `bodyClass` | `string` | — | Extra class applied to the body section. |
| `shadow` | `'always' \| 'hover' \| 'never'` | `'always'` | When the drop shadow is shown. |
| `children` | `ReactNode` | — | Body content. |

The component forwards all native `<div>` attributes.

## Events / Callbacks

None specific to Card. Native handlers are forwarded to the host `<div>`.

## Accessibility

Card is a structural container with no special roles. The `header` and `footer` regions are plain `<div>`s; render semantic headings inside them where appropriate.
