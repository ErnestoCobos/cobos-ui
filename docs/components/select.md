# Select

Dropdown selector with multiple, filterable and clearable modes.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/select

## Import

```ts
import { Select, Option } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Select, Option } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState<string | number>('');
  return (
    <Select value={value} onChange={(v) => setValue(v as string)} clearable filterable>
      <Option value="apple" label="Apple" />
      <Option value="banana" label="Banana" />
      <Option value="cherry" label="Cherry" disabled />
    </Select>
  );
}
```

Set `multiple` to allow selecting several values, rendered as removable tags. In that mode `value`/`onChange` work with an array.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `SelectValue \| SelectValue[]` | — | Controlled value. Array when `multiple`. (`SelectValue` = `string \| number`.) |
| `defaultValue` | `SelectValue \| SelectValue[]` | — | Initial value for the uncontrolled mode. |
| `onChange` | `(value: SelectValue \| SelectValue[]) => void` | — | Fired with the next value whenever the selection changes. |
| `multiple` | `boolean` | `false` | Allow selecting multiple values, rendered as removable tags. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the control. |
| `clearable` | `boolean` | `false` | Show a clear button when there is a value. |
| `filterable` | `boolean` | `false` | Allow typing to filter the options. |
| `placeholder` | `string` | `'Select'` | Placeholder shown when nothing is selected. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `loading` | `boolean` | `false` | Show a loading hint inside the dropdown. |
| `noDataText` | `string` | `'No data'` | Text shown when there are no options. |
| `noMatchText` | `string` | `'No matching data'` | Text shown when the query matches no options. |
| `name` | `string` | — | Native `name` attribute, mirrored to a hidden input. |
| `onVisibleChange` | `(visible: boolean) => void` | — | Fired when the dropdown opens or closes. |
| `onClear` | `() => void` | — | Fired when the clear button is pressed. |
| `onRemoveTag` | `(value: SelectValue) => void` | — | Fired when a tag is removed in multiple mode. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |
| `children` | `ReactNode` | — | `Option` elements. |

### Option Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `SelectValue` | — (required) | The value committed when this option is chosen. |
| `label` | `string` | derived from `children` | Display label. Defaults to the text of `children`. |
| `disabled` | `boolean` | `false` | Disable selecting this option. |
| `children` | `ReactNode` | — | Custom content; falls back to `label` or `value`. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | The selection changes (single value, or array in multiple mode). |
| `onVisibleChange(visible)` | The dropdown opens or closes. |
| `onClear()` | The clear button is pressed. |
| `onRemoveTag(value)` | A tag is removed in multiple mode. |

## Accessibility

- The trigger uses `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, and is focusable (`tabIndex={0}` when enabled).
- The dropdown is a `role="listbox"`; each option is a `role="option"` with `aria-selected` and, when disabled, `aria-disabled`.
- Keyboard support: Enter/Space opens the menu or commits the highlighted option, ArrowUp/ArrowDown move the highlight, and Escape closes the menu.
- Removable tags expose an accessible "Remove {label}" button.
