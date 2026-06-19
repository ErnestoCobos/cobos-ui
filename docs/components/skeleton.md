# Skeleton

Loading placeholder that renders shimmer rows until content is ready, with a throttle to avoid flashes.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/skeleton

## Import

```ts
import { Skeleton, SkeletonItem } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Skeleton } from '@cobos/react';

export function Example({ loading }: { loading: boolean }) {
  return (
    <Skeleton loading={loading} rows={4} animated>
      <article>The real content, shown once loading is false.</article>
    </Skeleton>
  );
}
```

Compose a custom placeholder from `SkeletonItem` shapes:

```tsx
import { SkeletonItem } from '@cobos/react';

export function Avatar() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <SkeletonItem variant="circle" style={{ width: 40, height: 40 }} />
      <SkeletonItem variant="text" style={{ width: 160 }} />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | Whether to show the placeholder. When `false`, `children` are rendered. |
| `rows` | `number` | `3` | Number of text rows in the default template. |
| `animated` | `boolean` | `false` | Enable the shimmer animation. |
| `count` | `number` | `1` | Repeat the placeholder template this many times. |
| `throttle` | `number` | — | Delay (ms) before the placeholder appears, avoiding flashes on fast loads. |
| `children` | `ReactNode` | — | Real content, shown once `loading` is false. |

Forwards native `<div>` attributes (except `children` typing).

### SkeletonItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'p' \| 'text' \| 'h1' \| 'h3' \| 'caption' \| 'button' \| 'image' \| 'circle' \| 'rect'` | `'text'` | Shape of the placeholder. |

Forwards native `<div>` attributes.

## Events / Callbacks

The Skeleton does not define custom callbacks.

## Accessibility

- While the placeholder is shown, the container sets `aria-busy="true"` and `aria-live="polite"`.
- The default template renders a heading-sized item plus `rows` text rows (the last row shortened); set `count` to repeat the whole template.
- Skeleton items are decorative shapes with no text content.
