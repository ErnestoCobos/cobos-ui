# Layout

24-column responsive flexbox grid with Row and Col.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/layout

## Import

```ts
import { Row, Col } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Row, Col } from '@cobos/react';

export function Example() {
  return (
    <Row gutter={20} justify="space-between" align="middle">
      <Col span={12} md={8}>Left</Col>
      <Col span={12} md={16}>Right</Col>
    </Row>
  );
}
```

`Row` shares its `gutter` with descendant `Col`s through context, so columns are spaced automatically.

## Props

### Row Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gutter` | `number` | `0` | Grid spacing between columns, in pixels. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Horizontal alignment of columns. |
| `align` | `'top' \| 'middle' \| 'bottom'` | — | Vertical alignment of columns. |
| `tag` | `keyof JSX.IntrinsicElements` | `'div'` | Custom element tag for the root node. |
| `children` | `ReactNode` | — | `Col` elements. |

`Row` forwards all native HTML element attributes.

### Col Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `span` | `number` | `24` | Column span (1-24). |
| `offset` | `number` | — | Number of columns to offset from the left. |
| `push` | `number` | — | Number of columns to move to the right. |
| `pull` | `number` | — | Number of columns to move to the left. |
| `xs` | `number \| { span?: number; offset?: number }` | — | Layout for `<768px` viewports. |
| `sm` | `number \| { span?: number; offset?: number }` | — | Layout for `≥768px` viewports. |
| `md` | `number \| { span?: number; offset?: number }` | — | Layout for `≥992px` viewports. |
| `lg` | `number \| { span?: number; offset?: number }` | — | Layout for `≥1200px` viewports. |
| `xl` | `number \| { span?: number; offset?: number }` | — | Layout for `≥1920px` viewports. |
| `tag` | `keyof JSX.IntrinsicElements` | `'div'` | Custom element tag for the root node. |
| `children` | `ReactNode` | — | Column content. |

A responsive breakpoint prop accepts either a number (treated as `span`) or an object with `span` and/or `offset`. `Col` forwards all native HTML element attributes.

## Events / Callbacks

None specific to Layout. Native handlers are forwarded to the host elements.

## Accessibility

Layout is purely structural and applies no special roles. Use the `tag` prop to render semantic elements (e.g. `<section>`, `<nav>`) where appropriate.
