# Statistic

Display a numeric statistic with a title, prefix/suffix, precision and group/decimal separators.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/statistic

## Import

```ts
import { Statistic } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Statistic } from '@cobos/react';

export function Example() {
  return (
    <Statistic
      title="Active users"
      value={268500}
      precision={0}
      suffix="people"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | — (required) | The value to display. Numeric values are formatted; strings are shown as-is. |
| `title` | `ReactNode` | — | Title shown above the value. |
| `prefix` | `ReactNode` | — | Content rendered before the value. |
| `suffix` | `ReactNode` | — | Content rendered after the value. |
| `precision` | `number` | — | Number of decimal places to keep (numeric values only). |
| `groupSeparator` | `string` | `','` | Thousands group separator. |
| `decimalSeparator` | `string` | `'.'` | Decimal separator. |
| `valueStyle` | `CSSProperties` | — | Inline style applied to the value element. |
| `formatter` | `(value: number \| string) => ReactNode` | — | Custom formatter. When provided it overrides the built-in number formatting. |
| `children` | `ReactNode` | — | Extra content rendered after the value (e.g. an action or footer). |

Forwards native `<div>` attributes (except `prefix` and `title`).

## Events / Callbacks

The Statistic does not define custom callbacks.

## Accessibility

- Renders a plain `<div>` container with title, value and optional prefix/suffix spans.
- The value text is the formatted number (or the result of `formatter`); supply a `title` to label it.
