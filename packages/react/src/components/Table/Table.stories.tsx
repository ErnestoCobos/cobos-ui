import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';
import { Tag } from '../Tag';
import { Text } from '../Text';

interface Member {
  id: number;
  name: string;
  role: string;
  commits: number;
  status: 'active' | 'away';
}

const DATA: Member[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', commits: 312, status: 'active' },
  { id: 2, name: 'Grace Hopper', role: 'Architect', commits: 489, status: 'active' },
  { id: 3, name: 'Alan Turing', role: 'Researcher', commits: 207, status: 'away' },
  { id: 4, name: 'Katherine Johnson', role: 'Analyst', commits: 156, status: 'active' },
];

const columns: TableColumn<Member>[] = [
  { type: 'selection', width: 48 },
  { prop: 'name', label: 'Name', sortable: true, minWidth: 160 },
  { prop: 'role', label: 'Role', minWidth: 120 },
  { prop: 'commits', label: 'Commits', sortable: true, align: 'right', width: 120 },
  {
    prop: 'status',
    label: 'Status',
    width: 120,
    render: (row) => (
      <Tag type={row.status === 'active' ? 'success' : 'info'} effect="light" size="small">
        {row.status}
      </Tag>
    ),
  },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    border: { control: 'boolean' },
    stripe: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    showHeader: { control: 'boolean' },
    highlightCurrentRow: { control: 'boolean' },
  },
  args: {
    // Required props; each story supplies typed data/columns via `render`, so
    // these empty defaults exist only to satisfy the meta type.
    data: [],
    columns: [],
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SortableSelectable: Story = {
  name: 'Sortable, selectable',
  render: () => {
    const [selected, setSelected] = useState<Member[]>([]);
    return (
      <div>
        <Table
          data={DATA}
          columns={columns}
          rowKey="id"
          border
          stripe
          onSelectionChange={setSelected}
          defaultSort={{ prop: 'commits', order: 'descending' }}
        />
        <div style={{ marginTop: 12 }}>
          <Text type="info" size="small">
            {selected.length} row(s) selected
            {selected.length > 0 ? `: ${selected.map((m) => m.name).join(', ')}` : ''}
          </Text>
        </div>
      </div>
    );
  },
};

export const FixedHeight: Story = {
  name: 'Compact, fixed-height scroll',
  render: () => (
    <Table
      data={DATA}
      columns={columns.filter((c) => c.type !== 'selection')}
      rowKey="id"
      size="small"
      height={160}
    />
  ),
};

export const Plain: Story = {
  render: () => (
    <Table data={DATA} columns={columns.filter((c) => c.type !== 'selection')} rowKey="id" />
  ),
};
