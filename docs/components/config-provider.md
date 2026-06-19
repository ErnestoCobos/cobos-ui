# ConfigProvider

Provides global size, disabled and direction context to descendants.

**Category:** Configuration · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/config-provider

## Import

```ts
import { ConfigProvider } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { ConfigProvider, Button, Input } from '@cobos/react';

export function App() {
  return (
    <ConfigProvider size="small" disabled={false} dir="ltr">
      <Input placeholder="Inherits size" />
      <Button>Inherits size</Button>
    </ConfigProvider>
  );
}
```

Descendant components read `size` and `disabled` from the nearest `ConfigProvider`, unless they set their own prop. The provider's `disabled` is OR-ed with each component's local `disabled`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Default size applied to descendant components. |
| `disabled` | `boolean` | `false` | Disable all descendant form controls. |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction. |
| `children` | `ReactNode` | — | Subtree that receives the configuration. |

### Related hooks

These hooks are exported alongside `ConfigProvider` for building custom components that respect the configuration context:

| Hook | Signature | Description |
| --- | --- | --- |
| `useConfig` | `() => { size, disabled, dir }` | Read the current configuration values. |
| `useSize` | `(size?: ComponentSize) => ComponentSize` | Resolve a size, falling back to the nearest provider, then `'default'`. |
| `useDisabled` | `(disabled?: boolean) => boolean` | Resolve a disabled flag, OR-ed with the nearest provider. |

## Events / Callbacks

None. `ConfigProvider` is a pure context provider.

## Accessibility

Sets a shared `dir` (text direction) for descendants and a shared disabled state for form controls, helping keep behaviour consistent across a subtree.
