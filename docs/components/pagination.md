# Pagination

Pager with sizes, jumper, total and background variants.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/pagination

## Import

```ts
import { Pagination } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useState } from 'react';
import { Pagination } from '@cobos/react';

export function Example() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      total={240}
      currentPage={page}
      onCurrentChange={setPage}
      layout="total, sizes, prev, pager, next, jumper"
      background
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `total` | `number` | `0` | Total number of items. |
| `pageSize` | `number` | — | Items per page (controlled). |
| `defaultPageSize` | `number` | `10` | Initial items per page (uncontrolled). |
| `currentPage` | `number` | — | Current page (controlled), 1-based. |
| `defaultCurrentPage` | `number` | `1` | Initial current page (uncontrolled), 1-based. |
| `pageSizes` | `number[]` | `[10, 20, 30, 40, 50, 100]` | Options offered by the page-size selector. |
| `pageCount` | `number` | derived from `total`/`pageSize` | Explicit page count; overrides the value derived from `total`/`pageSize`. |
| `layout` | `string` | `'prev, pager, next'` | Comma-separated, ordered list of layout pieces to render (`prev`, `pager`, `next`, `total`, `sizes`, `jumper`). |
| `background` | `boolean` | `false` | Use the rounded background button style. |
| `small` | `boolean` | `false` | Render the compact variant. |
| `disabled` | `boolean` | `false` | Disable the whole control. |
| `hideOnSinglePage` | `boolean` | `false` | Hide the pagination entirely when there is only one page. |
| `onCurrentChange` | `(page: number) => void` | — | Fired when the active page changes. |
| `onSizeChange` | `(size: number) => void` | — | Fired when the page size changes. |

Forwards native `<div>` attributes (except `onChange`).

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onCurrentChange(page)` | The active page changes (page click, prev/next, jumper). |
| `onSizeChange(size)` | The page-size selector value changes. |

## Accessibility

- The root is a `role="navigation"` region labelled "Pagination".
- Prev/next are native `<button>`s with `aria-label`s and are disabled at the bounds.
- Each page number is an interactive item with `aria-label="Page N"`, `aria-current="page"` for the active page, and supports Enter/Space activation.
- The page-size `<select>` and jumper `<input>` carry `aria-label`s.
