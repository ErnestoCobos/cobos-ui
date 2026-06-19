import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popconfirm } from './Popconfirm';
import { Button } from '../Button';
import { Space } from '../Space';
import { message } from '../Message';

const triggerButton = <Button type="danger">Delete</Button>;

const placements = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'right',
] as const;

const meta = {
  title: 'Components/Popconfirm',
  component: Popconfirm,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    confirmButtonText: { control: 'text' },
    cancelButtonText: { control: 'text' },
    confirmButtonType: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'info', 'danger'],
    },
    placement: { control: 'select', options: placements },
    width: { control: 'text' },
    offset: { control: 'number' },
    hideIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
    icon: { control: false },
    onConfirm: { control: false },
    onCancel: { control: false },
    children: { control: false },
  },
  args: {
    title: 'Delete this item?',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    placement: 'top',
    // Satisfies the required `children` prop; stories override it via `render`.
    children: triggerButton,
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popconfirm {...args}>
      <Button type="danger">Delete</Button>
    </Popconfirm>
  ),
};

export const WithCallbacks: Story = {
  name: 'Confirm and cancel callbacks',
  render: () => (
    <Popconfirm
      title="Remove this file from the project?"
      confirmButtonText="Remove"
      confirmButtonType="danger"
      cancelButtonText="Keep"
      onConfirm={() => message.success('File removed')}
      onCancel={() => message.info('Cancelled')}
    >
      <Button type="danger" plain>
        Remove file
      </Button>
    </Popconfirm>
  ),
};

export const Placements: Story = {
  render: () => (
    <Space wrap>
      <Popconfirm title="Confirm above?" placement="top">
        <Button>Top</Button>
      </Popconfirm>
      <Popconfirm title="Confirm below?" placement="bottom">
        <Button>Bottom</Button>
      </Popconfirm>
      <Popconfirm title="Confirm to the right?" placement="right">
        <Button>Right</Button>
      </Popconfirm>
    </Space>
  ),
};

export const WithoutIcon: Story = {
  name: 'Without the warning icon',
  render: () => (
    <Popconfirm title="Publish these changes now?" hideIcon confirmButtonText="Publish">
      <Button type="primary">Publish</Button>
    </Popconfirm>
  ),
};
