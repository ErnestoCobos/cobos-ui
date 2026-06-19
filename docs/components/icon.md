# Icon

Wrapper that renders an SVG glyph with size, color and spin support.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/icon

## Import

```ts
import { Icon } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Icon } from '@cobos/react';

export function Example() {
  return (
    <Icon size={20} color="#409eff" aria-label="Search">
      <svg viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896z" />
      </svg>
    </Icon>
  );
}
```

Pass `spin` to continuously rotate the glyph (useful for loading indicators).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | — | Icon size in px (number) or any CSS length. |
| `color` | `string` | `currentColor` | Icon color. |
| `spin` | `boolean` | `false` | Continuously rotate the icon. |
| `children` | `ReactNode` | — | The SVG glyph to render. |

The component forwards all native `<i>` (HTML element) attributes.

## Events / Callbacks

None specific to Icon. Native handlers (e.g. `onClick`) are forwarded to the host `<i>` element.

## Accessibility

- The icon is decorative by default and is rendered with `aria-hidden="true"`.
- Provide an `aria-label` to expose the icon to assistive technology; when present, `aria-hidden` is omitted.
