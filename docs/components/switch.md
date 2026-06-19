# Switch

On/off toggle with text, icons and loading.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/switch

## Import

```ts
import { Switch } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Switch } from '@cobos/react';

export function Example() {
  const [on, setOn] = useState(false);
  return (
    <Switch
      value={on}
      onChange={setOn}
      activeText="On"
      inactiveText="Off"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `boolean` | — | Controlled checked state. |
| `defaultValue` | `boolean` | `false` | Initial checked state for the uncontrolled mode. |
| `onChange` | `(value: boolean) => void` | — | Fired with the next checked state. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the control. |
| `loading` | `boolean` | `false` | Show a loading spinner and block interaction. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `activeText` | `string` | — | Text shown when on. |
| `inactiveText` | `string` | — | Text shown when off. |
| `inlinePrompt` | `boolean` | `false` | Render the texts inside the rail instead of beside it. |
| `width` | `number \| string` | — | Custom rail width. |
| `activeIcon` | `ReactNode` | — | Icon shown on the knob when on. |
| `inactiveIcon` | `ReactNode` | — | Icon shown on the knob when off. |
| `name` | `string` | — | Native `name` attribute, mirrored onto a hidden input. |
| `id` | `string` | — | Native `id` attribute. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | The switch is toggled via click or keyboard (Enter/Space). |

## Accessibility

- The root element uses `role="switch"` with `aria-checked` reflecting the state and `aria-disabled` when disabled.
- It is focusable (`tabIndex={0}` when enabled) and toggles on Enter and Space.
