# Progress

Linear, circular and dashboard progress indicators with status colors, custom colors and text.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/progress

## Import

```ts
import { Progress } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Progress } from '@cobos/react';

export function Example() {
  return (
    <>
      <Progress percentage={60} />
      <Progress percentage={100} status="success" />
      <Progress type="circle" percentage={75} />
      <Progress type="dashboard" percentage={40} status="warning" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `percentage` | `number` | — (required) | Completion percentage, 0–100. Values are clamped to that range. |
| `type` | `'line' \| 'circle' \| 'dashboard'` | `'line'` | Visual variant. |
| `strokeWidth` | `number` | `6` (line) / `8` (circle, dashboard) | Stroke thickness in pixels. |
| `status` | `'success' \| 'warning' \| 'exception'` | — | Status, which maps to a color. |
| `color` | `string \| string[] \| ((percentage: number) => string)` | — | Custom color: a string, a list (picked by threshold), or a function of the percentage. |
| `showText` | `boolean` | `true` | Show the progress text. |
| `textInside` | `boolean` | `false` | Render the text inside the bar (line type only). |
| `strokeLinecap` | `'round' \| 'butt' \| 'square'` | `'round'` | Shape of the stroke end. |
| `width` | `number` | `126` | Circle diameter in pixels (circle / dashboard). |
| `indeterminate` | `boolean` | `false` | Animate as an indeterminate bar (line type only). |
| `duration` | `number` | `3` | Animation duration in seconds for the indeterminate animation. |
| `format` | `(percentage: number) => ReactNode` | `${value}%` | Custom text formatter. |
| `children` | `ReactNode` | — | Extra content rendered after the indicator. |

Forwards native `<div>` attributes (except `color`).

## Events / Callbacks

The Progress does not define custom callbacks.

## Accessibility

- Renders with `role="progressbar"` and `aria-valuenow` / `aria-valuemin` (`0`) / `aria-valuemax` (`100`) reflecting the clamped percentage.
- The progress text (or the result of `format`) is shown beside or inside the bar, or inside the circle, when `showText` is set.
