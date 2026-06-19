import { useState } from 'react';
import { Table, Tag, Text } from '@cobos/react';
import type { TableColumn } from '@cobos/react';
import { Example, DemoStack } from './_demo';

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

export default function TableDemo() {
  const [selected, setSelected] = useState<Member[]>([]);

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

  return (
    <DemoStack>
      <Example
        title="Sortable, selectable table"
        description="Click a sortable header to sort; use the checkboxes to select rows."
      >
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
      </Example>

      <Example title="Compact, fixed-height scroll" description="A sticky header with a scrolling body.">
        <Table
          data={DATA}
          columns={columns.filter((c) => c.type !== 'selection')}
          rowKey="id"
          size="small"
          height={160}
        />
      </Example>
    </DemoStack>
  );
}
