import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, type TableColumn } from './Table';

interface Row {
  id: number;
  name: string;
  age: number;
}

const data: Row[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

const columns: TableColumn<Row>[] = [
  { prop: 'name', label: 'Name' },
  { prop: 'age', label: 'Age', sortable: true },
];

function bodyNames(): string[] {
  const rows = screen.getAllByRole('row').slice(1); // drop the header row
  return rows.map((row) => within(row).getAllByRole('cell')[0].textContent ?? '');
}

describe('Table', () => {
  it('renders a row per data item with cell values', () => {
    render(<Table data={data} columns={columns} rowKey="id" />);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
    // header row + 3 body rows
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('renders custom cell content via render', () => {
    const custom: TableColumn<Row>[] = [
      { prop: 'name', label: 'Name', render: (row) => <em>{row.name.toUpperCase()}</em> },
    ];
    render(<Table data={data} columns={custom} rowKey="id" />);
    expect(screen.getByText('CHARLIE')).toBeInTheDocument();
  });

  it('renders custom cell content via formatter', () => {
    const custom: TableColumn<Row>[] = [
      { prop: 'age', label: 'Age', formatter: (_row, value) => `${value}y` },
    ];
    render(<Table data={data} columns={custom} rowKey="id" />);
    expect(screen.getByText('30y')).toBeInTheDocument();
  });

  it('renders a 1-based index column', () => {
    const custom: TableColumn<Row>[] = [
      { type: 'index', label: '#' },
      { prop: 'name', label: 'Name' },
    ];
    render(<Table data={data} columns={custom} rowKey="id" />);
    const firstRow = screen.getAllByRole('row')[1];
    expect(within(firstRow).getAllByRole('cell')[0]).toHaveTextContent('1');
  });

  it('shows the empty state when there is no data', () => {
    render(<Table data={[]} columns={columns} emptyText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('cycles sorting ascending -> descending -> none and calls onSortChange', async () => {
    const onSortChange = vi.fn();
    render(<Table data={data} columns={columns} rowKey="id" onSortChange={onSortChange} />);
    const ageSort = screen.getByRole('button', { name: /Age/ });

    // initial order untouched
    expect(bodyNames()).toEqual(['Charlie', 'Alice', 'Bob']);

    await userEvent.click(ageSort); // ascending by age
    expect(bodyNames()).toEqual(['Alice', 'Charlie', 'Bob']);
    expect(onSortChange).toHaveBeenLastCalledWith({ prop: 'age', order: 'ascending' });

    await userEvent.click(ageSort); // descending by age
    expect(bodyNames()).toEqual(['Bob', 'Charlie', 'Alice']);
    expect(onSortChange).toHaveBeenLastCalledWith({ prop: 'age', order: 'descending' });

    await userEvent.click(ageSort); // back to original
    expect(bodyNames()).toEqual(['Charlie', 'Alice', 'Bob']);
    expect(onSortChange).toHaveBeenLastCalledWith({ prop: 'age', order: null });
  });

  it('sorts via keyboard: focus the sort button and press Enter/Space', async () => {
    const onSortChange = vi.fn();
    render(<Table data={data} columns={columns} rowKey="id" onSortChange={onSortChange} />);
    const ageSort = screen.getByRole('button', { name: /Age/ });

    // The sort affordance is a real, focusable button.
    await userEvent.tab();
    expect(ageSort).toHaveFocus();

    await userEvent.keyboard('{Enter}'); // ascending by age
    expect(bodyNames()).toEqual(['Alice', 'Charlie', 'Bob']);
    expect(onSortChange).toHaveBeenLastCalledWith({ prop: 'age', order: 'ascending' });

    await userEvent.keyboard(' '); // descending by age
    expect(bodyNames()).toEqual(['Bob', 'Charlie', 'Alice']);
    expect(onSortChange).toHaveBeenLastCalledWith({ prop: 'age', order: 'descending' });
  });

  it('exposes aria-sort on sortable headers reflecting the current order', async () => {
    render(<Table data={data} columns={columns} rowKey="id" />);
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    const ageHeader = screen.getByRole('columnheader', { name: /Age/ });

    // Non-sortable column has no aria-sort; sortable starts at 'none'.
    expect(nameHeader).not.toHaveAttribute('aria-sort');
    expect(ageHeader).toHaveAttribute('aria-sort', 'none');

    const ageSort = screen.getByRole('button', { name: /Age/ });
    await userEvent.click(ageSort);
    expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(ageSort);
    expect(ageHeader).toHaveAttribute('aria-sort', 'descending');

    await userEvent.click(ageSort);
    expect(ageHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('respects defaultSort on first render', () => {
    render(
      <Table
        data={data}
        columns={columns}
        rowKey="id"
        defaultSort={{ prop: 'age', order: 'descending' }}
      />,
    );
    expect(bodyNames()).toEqual(['Bob', 'Charlie', 'Alice']);
  });

  it('toggles individual selection and reports selected rows', async () => {
    const onSelectionChange = vi.fn();
    const selCols: TableColumn<Row>[] = [
      { type: 'selection' },
      { prop: 'name', label: 'Name' },
    ];
    render(
      <Table
        data={data}
        columns={selCols}
        rowKey="id"
        onSelectionChange={onSelectionChange}
      />,
    );
    const rowCheckboxes = screen.getAllByLabelText('Select row');
    await userEvent.click(rowCheckboxes[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([data[0]]);
  });

  it('toggles all selection via the header checkbox', async () => {
    const onSelectionChange = vi.fn();
    const selCols: TableColumn<Row>[] = [
      { type: 'selection' },
      { prop: 'name', label: 'Name' },
    ];
    render(
      <Table
        data={data}
        columns={selCols}
        rowKey="id"
        onSelectionChange={onSelectionChange}
      />,
    );
    const headerCheckbox = screen.getByLabelText('Select all rows');
    await userEvent.click(headerCheckbox);
    expect(onSelectionChange).toHaveBeenLastCalledWith(data);

    await userEvent.click(headerCheckbox);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('highlights the current row on click', async () => {
    const onRowClick = vi.fn();
    render(
      <Table
        data={data}
        columns={columns}
        rowKey="id"
        highlightCurrentRow
        onRowClick={onRowClick}
      />,
    );
    const firstRow = screen.getAllByRole('row')[1];
    await userEvent.click(firstRow);
    expect(firstRow).toHaveClass('current-row');
    expect(onRowClick).toHaveBeenCalledWith(data[0], 0);
  });

  it('merges className and forwards rest props', () => {
    render(
      <Table data={data} columns={columns} rowKey="id" className="custom" data-testid="tbl" />,
    );
    const root = screen.getByTestId('tbl');
    expect(root).toHaveClass('ec-table');
    expect(root).toHaveClass('custom');
  });
});
