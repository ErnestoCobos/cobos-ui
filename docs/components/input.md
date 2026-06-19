# Input

Text input with prefix/suffix, clearable, password, textarea and word limit.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/input

## Import

```ts
import { Input } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Input } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState('');
  return (
    <Input
      value={value}
      onChange={setValue}
      placeholder="Type here"
      clearable
    />
  );
}
```

Set `type="textarea"` to render a multi-line `<textarea>`, `type="password"` with `showPassword` for a visibility toggle, and `maxLength` with `showWordLimit` for a character counter.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled value. |
| `defaultValue` | `string` | `''` | Initial value for the uncontrolled mode. |
| `onChange` | `(value: string) => void` | — | Fired with the next value on every change. |
| `type` | `'text' \| 'password' \| 'textarea' \| 'email' \| 'url' \| 'tel' \| 'number' \| 'search'` | `'text'` | Input type. `textarea` renders a `<textarea>`. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable the control. |
| `clearable` | `boolean` | `false` | Show a clear button when the field has a value. |
| `showPassword` | `boolean` | `false` | Toggleable password visibility (only for `type="password"`). |
| `placeholder` | `string` | — | Placeholder text. |
| `readOnly` | `boolean` | `false` | Make the field read-only. |
| `maxLength` | `number` | — | Maximum number of characters. |
| `showWordLimit` | `boolean` | `false` | Show a character counter (requires `maxLength`). |
| `prefixIcon` | `ReactNode` | — | Content rendered before the input, inside the wrapper. |
| `suffixIcon` | `ReactNode` | — | Content rendered after the input, inside the wrapper. |
| `prepend` | `ReactNode` | — | Content rendered before the wrapper, as a group addon. |
| `append` | `ReactNode` | — | Content rendered after the wrapper, as a group addon. |
| `rows` | `number` | `2` | Number of visible rows for `type="textarea"`. |
| `name` | `string` | — | Native `name` attribute. |
| `id` | `string` | — | Native `id` attribute. |
| `autoComplete` | `string` | — | Native `autocomplete` attribute. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | The input value changes. |
| `onFocus(event)` | The field receives focus. |
| `onBlur(event)` | The field loses focus. |
| `onKeyDown(event)` | A key is pressed in the field. |
| `onClear()` | The clear button is pressed (in addition to `onChange('')`). |

## Accessibility

- Renders a native `<input>` (or `<textarea>`), so standard keyboard behaviour applies.
- The clear button and password-visibility toggle use `role="button"` with descriptive `aria-label`s ("Clear", "Show password" / "Hide password").
- Pair the input with a `<label>` (or a `FormItem`) for an accessible name.
