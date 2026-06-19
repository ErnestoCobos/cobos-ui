import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Button } from '../Button';
import { Space } from '../Space';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    max: { control: 'number' },
    isDot: { control: 'boolean' },
    hidden: { control: 'boolean' },
    type: {
      control: 'inline-radio',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
    },
    showZero: { control: 'boolean' },
    color: { control: 'color' },
    offset: { control: false },
  },
  args: {
    value: 5,
    type: 'danger',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Badge {...args}>
      <Button>Inbox</Button>
    </Badge>
  ),
};

export const Overflow: Story = {
  name: 'Max and overflow',
  render: () => (
    <Space wrap style={{ gap: 24 }}>
      <Badge value={9}>
        <Button>Mentions</Button>
      </Badge>
      <Badge value={120} max={99}>
        <Button>Comments</Button>
      </Badge>
      <Badge value="new">
        <Button>Updates</Button>
      </Badge>
    </Space>
  ),
};

export const Dot: Story = {
  name: 'Dot indicator',
  render: () => (
    <Space wrap style={{ gap: 24 }}>
      <Badge isDot>
        <Button>Notifications</Button>
      </Badge>
      <Badge isDot type="warning">
        <Button>Settings</Button>
      </Badge>
    </Space>
  ),
};

export const Types: Story = {
  render: () => (
    <Space wrap style={{ gap: 24 }}>
      <Badge value={1} type="primary">
        <Button>Primary</Button>
      </Badge>
      <Badge value={2} type="success">
        <Button>Success</Button>
      </Badge>
      <Badge value={3} type="warning">
        <Button>Warning</Button>
      </Badge>
      <Badge value={4} type="danger">
        <Button>Danger</Button>
      </Badge>
      <Badge value={5} type="info">
        <Button>Info</Button>
      </Badge>
    </Space>
  ),
};
