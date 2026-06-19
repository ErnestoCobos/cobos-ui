# Checkbox

Checkbox with group, indeterminate, min/max and bordered styles.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/checkbox

## Import

```ts
import { Checkbox, CheckboxGroup } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '@cobos/react';

export function Example() {
  const [checked, setChecked] = useState(false);
  const [values, setValues] = useState<(string | number)[]>(['a']);

  return (
    <>
      <Checkbox checked={checked} onChange={setChecked} label="Accept terms" />

      <CheckboxGroup value={values} onChange={setValues} min={1} max={2}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
        <Checkbox value="c" label="C" border />
      </CheckboxGroup>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled checked state (standalone). |
| `defaultChecked` | `boolean` | `false` | Default checked state when uncontrolled (standalone). |
| `onChange` | `(checked: boolean) => void` | — | Fired with the next checked state. |
| `value` | `string \| number` | — | Value used to identify the checkbox inside a CheckboxGroup. |
| `label` | `ReactNode` | — | Content; also rendered when no children are provided. |
| `disabled` | `boolean` | inherited from group / `ConfigProvider`, else `false` | Disable the checkbox. |
| `indeterminate` | `boolean` | `false` | Render the indeterminate (partial) state. |
| `border` | `boolean` | `false` | Wrap the checkbox in a bordered box. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from group / `ConfigProvider`, else `'default'` | Size. Falls back to the nearest CheckboxGroup / ConfigProvider. |
| `name` | `string` | — | Native input `name`. |
| `children` | `ReactNode` | — | Label content (takes precedence over `label`). |

Forwards all native `<input>` attributes except `value`, `defaultValue`, `onChange`, `type`, `size`, and `children`.

### CheckboxGroup Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `(string \| number)[]` | — | Controlled checked values. |
| `defaultValue` | `(string \| number)[]` | `[]` | Default checked values when uncontrolled. |
| `onChange` | `(value: (string \| number)[]) => void` | — | Fired when the checked values change. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable every checkbox in the group. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size shared by descendant checkboxes. |
| `min` | `number` | — | Minimum number of checked items. |
| `max` | `number` | — | Maximum number of checked items. |

Forwards native `<div>` attributes (except `onChange` and `defaultValue`) and applies `role="group"`.

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `Checkbox onChange(checked)` | A standalone checkbox is toggled. |
| `CheckboxGroup onChange(value)` | The set of checked values changes; toggles that would violate `min`/`max` are blocked. |

## Accessibility

- Renders a native `<input type="checkbox">` inside a `<label>`, so the label is clickable and the control is keyboard-operable.
- The indeterminate state is exposed via `aria-checked="mixed"`.
- `CheckboxGroup` applies `role="group"` to associate its checkboxes.
