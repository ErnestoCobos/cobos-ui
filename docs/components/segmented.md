# Segmented

Segmented control: a single-choice toggle group with keyboard navigation and a block layout.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/segmented

## Import

```ts
import { Segmented } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Segmented } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState('list');
  return (
    <Segmented
      options={[
        { label: 'List', value: 'list' },
        { label: 'Board', value: 'board' },
        { label: 'Calendar', value: 'calendar', disabled: true },
      ]}
      value={value}
      onChange={(next) => setValue(String(next))}
    />
  );
}
```

Plain strings or numbers can be used as both label and value:

```tsx
<Segmented options={['Daily', 'Weekly', 'Monthly']} defaultValue="Weekly" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SegmentedOptions` | — (required) | Available segments. Plain strings/numbers are used as both label and value. |
| `value` | `SegmentedValue` | — | Controlled selected value. |
| `defaultValue` | `SegmentedValue` | first option's value | Default selected value when uncontrolled. |
| `onChange` | `(value: SegmentedValue) => void` | — | Fired when the selection changes. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the whole control. |
| `block` | `boolean` | `false` | Stretch to fill the available width, distributing segments evenly. |

Forwards native `<div>` attributes (except `onChange` and `defaultValue`).

`SegmentedValue` is `string | number`. `SegmentedOptions` is `(SegmentedValue | SegmentedOption)[]`.

### SegmentedOption shape

| Field | Type | Description |
| --- | --- | --- |
| `label` | `ReactNode` | Content shown on the segment. |
| `value` | `SegmentedValue` | Value reported on selection. |
| `disabled` | `boolean` | Disable this single segment. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | The selection changes to a different segment. |

## Accessibility

- The container has `role="radiogroup"` (with `aria-disabled` when disabled); each segment is a native radio `<input>` with `role="radio"` and `aria-checked` inside a `<label>`.
- Arrow keys (Left/Right/Up/Down) move the selection to the next enabled segment, wrapping around; the selected segment is the only one in the tab order (`tabIndex={0}`).
