# Space

Set consistent spacing between inline or stacked children.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/space

## Import

```ts
import { Space } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Space, Button } from '@cobos/react';

export function Example() {
  return (
    <Space size="large" wrap>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Space>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `size` | `'small' \| 'default' \| 'large' \| number` | `'default'` | Spacing between items. Named sizes map to small=8, default=12, large=16 (pixels). |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline'` | — | Cross-axis alignment of items. |
| `wrap` | `boolean` | `false` | Whether items wrap onto multiple lines. |
| `fill` | `boolean` | `false` | Whether items stretch to fill the available space. |
| `children` | `ReactNode` | — | Items to space. |

The component forwards all native `<div>` attributes.

## Events / Callbacks

None specific to Space. Native handlers are forwarded to the host `<div>`.

## Accessibility

Space is a layout-only flex container and applies no special roles.
