# Radio

Radio button with group and bordered styles.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/radio

## Import

```ts
import { Radio, RadioGroup } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Radio, RadioGroup } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState<string | number>('a');
  return (
    <RadioGroup value={value} onChange={setValue}>
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" border />
      <Radio value="c" label="Option C" disabled />
    </RadioGroup>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Value identifying the radio. Required inside a RadioGroup. |
| `checked` | `boolean` | — | Controlled checked state (standalone). |
| `defaultChecked` | `boolean` | `false` | Default checked state when uncontrolled (standalone). |
| `onChange` | `(value: string \| number \| undefined) => void` | — | Fired with this radio's value when it becomes checked. |
| `label` | `ReactNode` | — | Content; also rendered when no children are provided. |
| `disabled` | `boolean` | inherited from group / `ConfigProvider`, else `false` | Disable the radio. |
| `border` | `boolean` | `false` | Wrap the radio in a bordered box. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from group / `ConfigProvider`, else `'default'` | Size. Falls back to the nearest RadioGroup / ConfigProvider. |
| `name` | `string` | — | Native input `name`. |
| `children` | `ReactNode` | — | Label content (takes precedence over `label`). |

Forwards all native `<input>` attributes except `value`, `defaultValue`, `onChange`, `type`, `size`, and `children`.

### RadioGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Controlled selected value. |
| `defaultValue` | `string \| number` | — | Default selected value when uncontrolled. |
| `onChange` | `(value: string \| number) => void` | — | Fired when the selection changes. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable every radio in the group. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size shared by descendant radios. |

`RadioGroup` generates a shared `name` so the radios form a single native group, forwards native `<div>` attributes (except `onChange` and `defaultValue`), and applies `role="radiogroup"`.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `Radio onChange(value)` | A standalone radio becomes checked. |
| `RadioGroup onChange(value)` | The group's selection changes (no-op when re-selecting the current value). |

## Accessibility

- Renders a native `<input type="radio">` inside a `<label>`.
- Inside a group, all radios share a generated `name`, so native arrow-key navigation between options works.
- `RadioGroup` applies `role="radiogroup"`.
