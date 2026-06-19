import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useSize } from '../../config-provider';

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortOrder = 'ascending' | 'descending';
export type TableColumnType = 'default' | 'selection' | 'index';
export type TableColumnFixed = 'left' | 'right' | boolean;

export interface TableColumn<T extends Record<string, any> = any> {
  /** Field on the row object to read the cell value from. */
  prop?: keyof T | string;
  /** Header label. */
  label?: ReactNode;
  /** Fixed column width. */
  width?: number | string;
  /** Minimum column width. */
  minWidth?: number | string;
  /** Cell horizontal alignment. */
  align?: TableAlign;
  /** Header cell horizontal alignment (defaults to `align`). */
  headerAlign?: TableAlign;
  /** Enable click-to-sort on this column. */
  sortable?: boolean;
  /** Pin the column to a side (visual only). */
  fixed?: TableColumnFixed;
  /** Special column behaviour. */
  type?: TableColumnType;
  /** Format the raw cell value. */
  formatter?: (row: T, value: any, index: number) => ReactNode;
  /** Fully custom cell renderer. */
  render?: (row: T, index: number) => ReactNode;
  /** Extra class applied to header and body cells. */
  className?: string;
}

export interface TableSortState {
  prop: string;
  order: TableSortOrder | null;
}

export interface TableProps<T extends Record<string, any> = any>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Row data. */
  data: T[];
  /** Column definitions. */
  columns: TableColumn<T>[];
  /**
   * Stable identity for a row. Defaults to the row index.
   *
   * Provide a `rowKey` whenever `highlightCurrentRow` or selection columns are
   * used together with `sortable` columns (or any time `data` is reordered or
   * mutated). Without it, identity falls back to the row's positional index, so
   * the highlight and selection track the slot rather than the underlying row
   * and appear to "jump" after a re-sort.
   */
  rowKey?: keyof T | ((row: T) => string | number);
  /** Draw borders around every cell. */
  border?: boolean;
  /** Zebra-stripe the rows. */
  stripe?: boolean;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Fixed body height; enables a scrolling body with a sticky header. */
  height?: number | string;
  /** Maximum body height; enables a scrolling body with a sticky header. */
  maxHeight?: number | string;
  /** Content shown when `data` is empty. */
  emptyText?: ReactNode;
  /** Render the header row. */
  showHeader?: boolean;
  /** Highlight the row that was last clicked. */
  highlightCurrentRow?: boolean;
  /** Sort applied on first render. */
  defaultSort?: { prop: string; order: TableSortOrder };
  /** Fired when a row is clicked. */
  onRowClick?: (row: T, index: number) => void;
  /** Fired when the sort state changes. */
  onSortChange?: (state: TableSortState) => void;
  /** Fired when the selection changes. */
  onSelectionChange?: (rows: T[]) => void;
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function compareValues(a: any, b: any): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function CaretIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M512 320 192 704h640z" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 22h48a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4m0-4 8-12a4 4 0 0 1 3.2-1.6h25.6A4 4 0 0 1 56 6l8 12H44a4 4 0 0 0-4 4 8 8 0 0 1-16 0 4 4 0 0 0-4-4z"
        opacity="0.6"
      />
    </svg>
  );
}

function TableInner<T extends Record<string, any> = any>(
  props: TableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    data,
    columns,
    rowKey,
    border = false,
    stripe = false,
    size: sizeProp,
    height,
    maxHeight,
    emptyText = 'No Data',
    showHeader = true,
    highlightCurrentRow = false,
    defaultSort,
    onRowClick,
    onSortChange,
    onSelectionChange,
    className,
    style,
    ...rest
  } = props;

  const ns = useNamespace('table');
  const size = useSize(sizeProp);

  const [sort, setSort] = useState<TableSortState>(() =>
    defaultSort ? { prop: defaultSort.prop, order: defaultSort.order } : { prop: '', order: null },
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(() => new Set());
  const [currentKey, setCurrentKey] = useState<string | number | null>(null);

  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (rowKey !== undefined) return row[rowKey] as string | number;
    return index;
  };

  const sortedData = useMemo(() => {
    if (!sort.prop || !sort.order) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const result = compareValues(a[sort.prop], b[sort.prop]);
      return sort.order === 'ascending' ? result : -result;
    });
    return copy;
  }, [data, sort]);

  const emitSelection = (keys: Set<string | number>) => {
    if (!onSelectionChange) return;
    const rows = sortedData.filter((row, index) => keys.has(getRowKey(row, index)));
    onSelectionChange(rows);
  };

  const handleSort = (prop: string) => {
    let nextOrder: TableSortOrder | null;
    if (sort.prop !== prop) {
      nextOrder = 'ascending';
    } else if (sort.order === 'ascending') {
      nextOrder = 'descending';
    } else if (sort.order === 'descending') {
      nextOrder = null;
    } else {
      nextOrder = 'ascending';
    }
    const next: TableSortState = { prop: nextOrder ? prop : '', order: nextOrder };
    setSort(next);
    onSortChange?.({ prop, order: nextOrder });
  };

  const allKeys = sortedData.map((row, index) => getRowKey(row, index));
  const selectedCount = allKeys.filter((key) => selectedKeys.has(key)).length;
  const allSelected = allKeys.length > 0 && selectedCount === allKeys.length;
  const indeterminate = selectedCount > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    const next = new Set<string | number>();
    if (checked) {
      for (const key of allKeys) next.add(key);
    }
    setSelectedKeys(next);
    emitSelection(next);
  };

  const toggleRow = (key: string | number, checked: boolean) => {
    const next = new Set(selectedKeys);
    if (checked) next.add(key);
    else next.delete(key);
    setSelectedKeys(next);
    emitSelection(next);
  };

  const handleRowClick = (row: T, index: number) => {
    if (highlightCurrentRow) setCurrentKey(getRowKey(row, index));
    onRowClick?.(row, index);
  };

  const renderCellContent = (column: TableColumn<T>, row: T, index: number): ReactNode => {
    if (column.type === 'index') return index + 1;
    if (column.render) return column.render(row, index);
    const value = column.prop !== undefined ? row[column.prop as keyof T] : undefined;
    if (column.formatter) return column.formatter(row, value, index);
    return value as ReactNode;
  };

  const renderCheck = (checked: boolean, isIndeterminate: boolean) => (
    <span
      className={cls(
        ns.e('check'),
        ns.is('checked', checked),
        ns.is('indeterminate', isIndeterminate),
      )}
      aria-hidden="true"
    />
  );

  const scrollable = height !== undefined || maxHeight !== undefined;
  const bodyStyle: CSSProperties = {
    height: toCssSize(height),
    maxHeight: toCssSize(maxHeight),
  };

  const classes = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('border', border),
    ns.is('stripe', stripe),
    ns.is('scroll', scrollable),
    ns.is('empty', sortedData.length === 0),
    className,
  );

  const colgroup = (
    <colgroup>
      {columns.map((column, columnIndex) => (
        <col
          key={columnIndex}
          style={{
            width: toCssSize(column.width),
            minWidth: toCssSize(column.minWidth),
          }}
        />
      ))}
    </colgroup>
  );

  const header = showHeader ? (
    <thead className={ns.e('header')}>
      <tr>
        {columns.map((column, columnIndex) => {
          const headerAlign = column.headerAlign ?? column.align ?? 'left';
          const isSortable = Boolean(column.sortable);
          const canSort = isSortable && column.prop !== undefined;
          const isActiveSort = sort.prop === column.prop;
          const ascActive = isActiveSort && sort.order === 'ascending';
          const descActive = isActiveSort && sort.order === 'descending';
          const sortIcons = isSortable && (
            <span className={ns.e('sort-icons')} aria-hidden="true">
              <span
                className={cls(ns.e('sort-caret'), ns.m('ascending'), ns.is('active', ascActive))}
              >
                <CaretIcon />
              </span>
              <span
                className={cls(ns.e('sort-caret'), ns.m('descending'), ns.is('active', descActive))}
              >
                <CaretIcon />
              </span>
            </span>
          );
          return (
            <th
              key={columnIndex}
              scope="col"
              aria-sort={
                isSortable
                  ? ascActive
                    ? 'ascending'
                    : descActive
                      ? 'descending'
                      : 'none'
                  : undefined
              }
              className={cls(
                ns.e('cell'),
                ns.e('header-cell'),
                ns.em('cell', headerAlign),
                column.type === 'selection' && ns.em('cell', 'selection'),
                isSortable && ns.is('sortable'),
                column.className,
              )}
            >
              <span className={ns.e('cell-inner')}>
                {column.type === 'selection' ? (
                  <label className={ns.e('checkbox')}>
                    <input
                      type="checkbox"
                      className={ns.e('checkbox-input')}
                      checked={allSelected}
                      ref={(node) => {
                        if (node) node.indeterminate = indeterminate;
                      }}
                      onChange={(event) => toggleAll(event.target.checked)}
                      aria-label="Select all rows"
                    />
                    {renderCheck(allSelected, indeterminate)}
                  </label>
                ) : canSort ? (
                  <button
                    type="button"
                    className={ns.e('sort-button')}
                    onClick={() => handleSort(String(column.prop))}
                  >
                    <span className={ns.e('cell-text')}>{column.label}</span>
                    {sortIcons}
                  </button>
                ) : (
                  <>
                    <span className={ns.e('cell-text')}>{column.label}</span>
                    {sortIcons}
                  </>
                )}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  ) : null;

  const body = (
    <tbody className={ns.e('body')}>
      {sortedData.map((row, rowIndex) => {
        const key = getRowKey(row, rowIndex);
        const isSelected = selectedKeys.has(key);
        return (
          <tr
            key={key}
            className={cls(
              ns.e('row'),
              stripe && rowIndex % 2 === 1 && `${ns.e('row')}--striped`,
              highlightCurrentRow && currentKey === key && 'current-row',
              isSelected && ns.is('selected'),
            )}
            onClick={() => handleRowClick(row, rowIndex)}
          >
            {columns.map((column, columnIndex) => {
              const align = column.align ?? 'left';
              return (
                <td
                  key={columnIndex}
                  className={cls(
                    ns.e('cell'),
                    ns.em('cell', align),
                    column.type === 'selection' && ns.em('cell', 'selection'),
                    column.className,
                  )}
                >
                  <span className={ns.e('cell-inner')}>
                    {column.type === 'selection' ? (
                      <label
                        className={ns.e('checkbox')}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className={ns.e('checkbox-input')}
                          checked={isSelected}
                          onChange={(event) => toggleRow(key, event.target.checked)}
                          aria-label="Select row"
                        />
                        {renderCheck(isSelected, false)}
                      </label>
                    ) : (
                      renderCellContent(column, row, rowIndex)
                    )}
                  </span>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );

  const table = (
    <table className={ns.e('table')}>
      {colgroup}
      {header}
      {body}
    </table>
  );

  return (
    <div ref={ref} className={classes} style={style} {...rest}>
      {scrollable ? (
        <div className={ns.e('body-wrapper')} style={bodyStyle}>
          {table}
        </div>
      ) : (
        table
      )}
      {sortedData.length === 0 && (
        <div className={ns.e('empty')}>
          <span className={ns.e('empty-icon')}>
            <EmptyIcon />
          </span>
          <span className={ns.e('empty-text')}>{emptyText}</span>
        </div>
      )}
    </div>
  );
}

export const Table = forwardRef(TableInner) as <T extends Record<string, any> = any>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof TableInner>;
