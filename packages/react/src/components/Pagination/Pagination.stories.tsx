import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { Space } from '../Space';
import { Text } from '../Text';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number' },
    pageSize: { control: 'number' },
    layout: { control: 'text' },
    background: { control: 'boolean' },
    small: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hideOnSinglePage: { control: 'boolean' },
  },
  args: {
    total: 100,
    layout: 'prev, pager, next',
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithTotal: Story = {
  name: 'With total',
  args: { total: 420, pageSize: 20, layout: 'total, prev, pager, next' },
};

export const Background: Story = {
  args: { total: 250, background: true, layout: 'prev, pager, next' },
};

export const FullControls: Story = {
  name: 'Full controls',
  render: () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    return (
      <Space direction="vertical" align="start">
        <Pagination
          total={368}
          currentPage={page}
          pageSize={size}
          pageSizes={[10, 20, 50, 100]}
          background
          layout="total, sizes, prev, pager, next, jumper"
          onCurrentChange={setPage}
          onSizeChange={(s) => {
            setSize(s);
            setPage(1);
          }}
        />
        <Text type="info" size="small">
          page {page}, {size} per page
        </Text>
      </Space>
    );
  },
};
