# Empty

Empty-state placeholder with a default illustration, a description and optional actions.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/empty

## Import

```ts
import { Empty } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Empty, Button } from '@cobos/react';

export function Example() {
  return (
    <Empty description="No results found">
      <Button type="primary">Create one</Button>
    </Empty>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `description` | `ReactNode` | `'No Data'` | Description text shown below the illustration. |
| `image` | `string` | built-in illustration | Custom image source. Falls back to the built-in illustration. |
| `imageSize` | `number` | — | Width of the image, in pixels. |
| `children` | `ReactNode` | — | Extra content (actions, footer) rendered below the description. |

Forwards native `<div>` attributes (except `children` typing).

## Events / Callbacks

The Empty does not define custom callbacks.

## Accessibility

- Renders a `<div>` containing the illustration, description and optional bottom slot.
- The default illustration is decorative (`aria-hidden`); a custom `image` is rendered with an empty `alt`, so convey meaning through the `description`.
