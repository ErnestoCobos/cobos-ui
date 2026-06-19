# InputNumber

Numeric input with steppers, min/max, step and precision.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/input-number

## Import

```ts
import { InputNumber } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { InputNumber } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState<number | null>(1);
  return (
    <InputNumber
      value={value ?? undefined}
      onChange={setValue}
      min={0}
      max={10}
      step={1}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Controlled value. |
| `defaultValue` | `number` | `null` | Initial value for the uncontrolled mode. |
| `onChange` | `(value: number \| null) => void` | — | Fired with the next value, or `null` when the field is empty. |
| `min` | `number` | `-Infinity` | Minimum allowed value. |
| `max` | `number` | `Infinity` | Maximum allowed value. |
| `step` | `number` | `1` | Increment / decrement step. |
| `stepStrictly` | `boolean` | `false` | Only allow values that are multiples of `step`. |
| `precision` | `number` | — | Number of decimal places to keep. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the control. |
| `controls` | `boolean` | `true` | Show the increase / decrease buttons. |
| `controlsPosition` | `'right' \| ''` | `''` | Place both controls on the right, stacked. |
| `placeholder` | `string` | — | Placeholder text. |
| `name` | `string` | — | Native `name` attribute. |
| `id` | `string` | — | Native `id` attribute. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |

Values are clamped to `[min, max]` (and snapped to `step` when `stepStrictly`) on blur and when stepping.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | The value changes via typing or the stepper buttons; emits `null` when the field is cleared. |

## Accessibility

- The native `<input>` is given `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` reflecting the current value and bounds.
- The increase/decrease controls expose `role="button"` with `aria-label` ("Increase" / "Decrease") and are disabled at the respective bounds.
