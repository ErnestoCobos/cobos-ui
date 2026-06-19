# Loading

Loading mask with a spinner and optional text, available as a declarative component or an imperative service.

**Category:** Feedback · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/loading

## Import

```ts
import { Loading, loading } from '@cobos/react';
import '@cobos/react/styles.css';
```

`Loading` is the React component; `loading` (and `Loading.service`) is the imperative API.

## Usage

As a component, the mask overlays its children:

```tsx
import { Loading } from '@cobos/react';

export function Example({ busy }: { busy: boolean }) {
  return (
    <Loading visible={busy} text="Loading…">
      <div style={{ height: 200 }}>Content to mask</div>
    </Loading>
  );
}
```

A fullscreen mask portals to the body:

```tsx
import { Loading } from '@cobos/react';

export function Fullscreen({ busy }: { busy: boolean }) {
  return busy ? <Loading fullscreen text="Please wait" /> : null;
}
```

Imperatively, open a mask and close it later:

```tsx
import { loading } from '@cobos/react';

const instance = loading.service({ text: 'Saving…', target: '#panel' });
// later
instance.close();
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Whether the mask is shown. |
| `text` | `string` | — | Loading text rendered under the spinner. |
| `fullscreen` | `boolean` | `false` | Cover the whole viewport instead of the positioned parent. |
| `background` | `string` | — | Custom mask background (e.g. `rgba(0,0,0,0.7)`). |
| `spinner` | `ReactNode` | rotating loading icon | Custom spinner element. |
| `children` | `ReactNode` | — | Content the mask overlays. Required for non-fullscreen masks to position over. |

Forwards native `<div>` attributes (except `children`, which is the masked content). Fullscreen masks are portaled to `document.body`; non-fullscreen masks wrap `children` in a positioned container.

## Imperative API

`loading.service` (also reachable as `Loading.service`) opens a mask and returns a `LoadingInstance`.

| Member | Signature | Description |
| --- | --- | --- |
| `loading.service(options?)` | `(options?: LoadingServiceOptions) => LoadingInstance` | Open a loading mask. |

### LoadingServiceOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Loading text rendered under the spinner. |
| `fullscreen` | `boolean` | `true` when no `target`, else `false` | Cover the whole viewport. |
| `background` | `string` | — | Custom mask background. |
| `spinner` | `ReactNode` | rotating loading icon | Custom spinner element. |
| `target` | `Element \| string` | — | Element (or selector) to mask. Implies a non-fullscreen mask. |

### LoadingInstance

| Member | Type | Description |
| --- | --- | --- |
| `close` | `() => void` | Remove the mask. Safe to call more than once. |

## Events / Callbacks

The Loading component and service expose no event callbacks; visibility is controlled via the `visible` prop or the service handle's `close()`.

## Accessibility

- The mask renders with `role="status"`, `aria-busy="true"` and `aria-live="polite"`.
- The default spinner is the rotating loading icon; a custom `spinner` replaces it.
- The service targets an element by reference or selector; when that element is statically positioned it temporarily receives a positioning class so the absolute mask aligns. In a non-browser (SSR) environment the service returns an inert handle.
