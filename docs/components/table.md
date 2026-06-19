# Table

Data table with sorting, selection, border, stripe and fixed header.

**Category:** Data · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/table

## Import

```ts
import { Table } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Table, type TableColumn } from '@cobos/react';

interface User {
  id: number;
  name: string;
  age: number;
}

const data: User[] = [
  { id: 1, name: 'Ada', age: 36 },
  { id: 2, name: 'Linus', age: 54 },
];

const columns: TableColumn<User>[] = [
  { type: 'selection' },
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'age', label: 'Age', align: 'right', sortable: true },
];

export function Example() {
  return (
    <Table
      data={data}
      columns={columns}
      rowKey="id"
      border
      stripe
      onSelectionChange={(rows) => console.log(rows)}
    />
  );
}
```

## Props

The Table is generic over the row type `T extends Record<string, any>`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | — (required) | Row data. |
| `columns` | `TableColumn<T>[]` | — (required) | Column definitions. |
| `rowKey` | `keyof T \| ((row: T) => string \| number)` | row index | Stable identity for a row. |
| `border` | `boolean` | `false` | Draw borders around every cell. |
| `stripe` | `boolean` | `false` | Zebra-stripe the rows. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size. Falls back to the nearest ConfigProvider. |
| `height` | `number \| string` | — | Fixed body height; enables a scrolling body with a sticky header. |
| `maxHeight` | `number \| string` | — | Maximum body height; enables a scrolling body with a sticky header. |
| `emptyText` | `ReactNode` | `'No Data'` | Content shown when `data` is empty. |
| `showHeader` | `boolean` | `true` | Render the header row. |
| `highlightCurrentRow` | `boolean` | `false` | Highlight the row that was last clicked. |
| `defaultSort` | `{ prop: string; order: 'ascending' \| 'descending' }` | — | Sort applied on first render. |
| `onRowClick` | `(row: T, index: number) => void` | — | Fired when a row is clicked. |
| `onSortChange` | `(state: { prop: string; order: 'ascending' \| 'descending' \| null }) => void` | — | Fired when the sort state changes. |
| `onSelectionChange` | `(rows: T[]) => void` | — | Fired when the selection changes. |

Forwards native `<div>` attributes (except `onSelect`).

### TableColumn shape

| Field | Type | Description |
| --- | --- | --- |
| `prop` | `keyof T \| string` | Field on the row object to read the cell value from. |
| `label` | `ReactNode` | Header label. |
| `width` | `number \| string` | Fixed column width. |
| `minWidth` | `number \| string` | Minimum column width. |
| `align` | `'left' \| 'center' \| 'right'` | Cell horizontal alignment. |
| `headerAlign` | `'left' \| 'center' \| 'right'` | Header cell horizontal alignment (defaults to `align`). |
| `sortable` | `boolean` | Enable click-to-sort on this column. |
| `fixed` | `'left' \| 'right' \| boolean` | Pin the column to a side (visual only). |
| `type` | `'default' \| 'selection' \| 'index'` | Special column behaviour. |
| `formatter` | `(row: T, value: any, index: number) => ReactNode` | Format the raw cell value. |
| `render` | `(row: T, index: number) => ReactNode` | Fully custom cell renderer. |
| `className` | `string` | Extra class applied to header and body cells. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onRowClick(row, index)` | A body row is clicked. |
| `onSortChange(state)` | A sortable header is clicked. Sorting cycles ascending → descending → none. |
| `onSelectionChange(rows)` | Row checkboxes (the `selection` column) change; emits the selected rows. |

## Accessibility

- Renders a real `<table>` with `<thead>`/`<tbody>` and column `<col>` sizing.
- Selection columns use native `<input type="checkbox">` with `aria-label`s ("Select all rows" / "Select row"); the header checkbox reflects the indeterminate state.
- Sortable headers are clickable; consider supplementing with keyboard activation for full keyboard support.
