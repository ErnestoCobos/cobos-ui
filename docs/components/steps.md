# Steps

Step/wizard progress bar with horizontal or vertical layout, per-step status and a simple variant.

**Category:** Navigation · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/steps

## Import

```ts
import { Steps, Step } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Steps, Step } from '@cobos/react';

export function Example() {
  return (
    <Steps active={1}>
      <Step title="Account" description="Create your account" />
      <Step title="Profile" description="Add your details" />
      <Step title="Done" description="Review and finish" />
    </Steps>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `number` | `0` | Index of the current (active) step. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `alignCenter` | `boolean` | `false` | Center the icon and title under each other (horizontal only). |
| `simple` | `boolean` | `false` | Render a compact, simplified step bar. |
| `space` | `number \| string` | — | Fixed spacing between steps (px number or any CSS length). |
| `finishStatus` | `StepStatus` | `'finish'` | Status applied to steps before the active one. |
| `processStatus` | `StepStatus` | `'process'` | Status applied to the active step. |
| `children` | `ReactNode` | — | `Step` elements. |

Forwards native `<div>` attributes. `StepStatus` is `'wait' | 'process' | 'finish' | 'error' | 'success'`. Steps after the active one default to `'wait'`.

### Step Props

`Steps` injects the layout-derived state into each `Step`; consumers only supply the props below.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Step title. |
| `description` | `ReactNode` | — | Step description shown below the title (hidden in `simple` mode). |
| `icon` | `ReactNode` | number / check / cross | Custom icon rendered inside the step marker (overrides the number/check). |
| `status` | `StepStatus` | derived from `active` | Explicit status, overriding the value derived from `active`. |
| `children` | `ReactNode` | — | Extra content rendered in the step body. |

Forwards native `<div>` attributes (except `title`).

## Events / Callbacks

Neither `Steps` nor `Step` defines custom callbacks; the active step is driven by the `active` prop.

## Accessibility

- `Steps` renders with `role="list"` and each `Step` with `role="listitem"`.
- The active step is marked `aria-current="step"`.
- Step markers and connector lines are decorative (`aria-hidden`); finished/success steps show a check, error steps show a cross, others show their 1-based index.
