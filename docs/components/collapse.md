# Collapse

Accordion collapse panels with controlled/uncontrolled open state and an accordion mode.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/collapse

## Import

```ts
import { Collapse, CollapseItem } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Collapse, CollapseItem, type CollapseValue } from '@cobos/react';

export function Example() {
  const [value, setValue] = useState<CollapseValue>(['1']);
  return (
    <Collapse value={value} onChange={setValue}>
      <CollapseItem name="1" title="Section one">
        Content of the first panel.
      </CollapseItem>
      <CollapseItem name="2" title="Section two">
        Content of the second panel.
      </CollapseItem>
      <CollapseItem name="3" title="Disabled" disabled>
        Cannot be toggled.
      </CollapseItem>
    </Collapse>
  );
}
```

In accordion mode only one item is open at a time:

```tsx
<Collapse accordion defaultValue="1">
  {/* CollapseItem elements */}
</Collapse>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `CollapseValue` | — | Open item name(s) (controlled). |
| `defaultValue` | `CollapseValue` | — | Initial open item name(s) (uncontrolled). |
| `onChange` | `(value: CollapseValue) => void` | — | Fired when the set of open items changes. |
| `accordion` | `boolean` | `false` | Allow only one item open at a time. |
| `children` | `ReactNode` | — | `CollapseItem` elements. |

Forwards native `<div>` attributes (except `onChange`, `value` and `defaultValue`). `CollapseName` is `string | number`; `CollapseValue` is `CollapseName | CollapseName[]`. In accordion mode `onChange` reports a single name (or `''` when nothing is open); otherwise it reports the array of open names.

### CollapseItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `CollapseName` | — (required) | Unique identifier, matched against the Collapse active names. |
| `title` | `ReactNode` | — | Header content. |
| `disabled` | `boolean` | `false` | Disable toggling this item. |
| `icon` | `ReactNode` | chevron | Custom icon replacing the default chevron. |
| `children` | `ReactNode` | — | Panel content. |

Forwards native `<div>` attributes (except `title`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onChange(value)` | An item is opened or closed. Reports the open name(s) per the `accordion` mode. |

## Accessibility

- Each item's header is a real `<button>` with `aria-expanded` and `aria-controls` pointing at the panel; disabled items set `disabled` and `aria-disabled`.
- The panel is a `role="region"` labelled by its header (`aria-labelledby`) and is hidden via the `hidden` attribute while collapsed.
- The chevron/custom icon is decorative (`aria-hidden`).
