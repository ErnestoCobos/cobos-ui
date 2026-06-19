# Avatar

Image, icon or text avatar in circle or square.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/avatar

## Import

```ts
import { Avatar } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Avatar } from '@cobos/react';

export function Example() {
  return (
    <>
      <Avatar src="https://example.com/me.png" alt="Me" />
      <Avatar shape="square" size={48}>EC</Avatar>
    </>
  );
}
```

If the image fails to load, the avatar falls back to the `icon` prop, then to `children`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'large' \| 'default' \| 'small' \| number` | `'default'` | Size token or explicit pixel size. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape of the avatar. |
| `src` | `string` | — | Image source. |
| `srcSet` | `string` | — | Image `srcset`. |
| `alt` | `string` | — | Image alternative text. |
| `fit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` | How the image fits its box. |
| `icon` | `ReactNode` | — | Fallback icon when no image is available. |
| `onError` | `(e: SyntheticEvent<HTMLImageElement>) => boolean \| void` | — | Fired when the image fails to load. Return `false` to keep showing it. |
| `children` | `ReactNode` | — | Text/content fallback. |

The component forwards all native `<span>` attributes.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onError(event)` | The image fails to load. Returning `false` prevents the fallback and keeps the image element. |

## Accessibility

- When showing an image, set `alt` to give it an accessible name.
- Icon/text avatars are decorative containers; add an `aria-label` when the avatar conveys meaning on its own.
