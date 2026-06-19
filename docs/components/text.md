# Text

Typographic text with types, sizes, truncation and line clamping.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/text

## Import

```ts
import { Text } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Text } from '@cobos/react';

export function Example() {
  return (
    <>
      <Text type="primary" size="large">Heading</Text>
      <Text truncated>This very long line is truncated with an ellipsis…</Text>
      <Text lineClamp={2}>Clamp this paragraph to at most two lines…</Text>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | — | Visual variant. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Size. |
| `tag` | `ElementType` | `'span'` | Rendered host element. |
| `truncated` | `boolean` | `false` | Truncate to a single line with an ellipsis. |
| `lineClamp` | `number \| string` | — | Clamp to a number of lines with an ellipsis. |
| `children` | `ReactNode` | — | Text content. |

The component forwards all native HTML element attributes to the rendered host element. When `lineClamp` is set, it takes precedence over `truncated`.

## Events / Callbacks

None specific to Text. Native handlers are forwarded to the rendered element.

## Accessibility

Text is a thin typographic wrapper. Use the `tag` prop to render semantically appropriate elements (e.g. `p`, `h1`–`h6`, `label`). Truncation and clamping are purely visual; the full text remains in the DOM for assistive technology.
