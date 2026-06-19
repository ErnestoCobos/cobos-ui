import type { Meta, StoryObj } from '@storybook/react-vite';
import { Space } from './Space';
import { Button } from '../Button';
import { Tag } from '../Tag';

const meta = {
  title: 'Components/Space',
  component: Space,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    alignment: { control: 'inline-radio', options: ['start', 'end', 'center', 'baseline'] },
    wrap: { control: 'boolean' },
    fill: { control: 'boolean' },
    align: { table: { disable: true } },
  },
  args: {
    direction: 'horizontal',
    size: 'small',
  },
  render: (args) => (
    <Space {...args}>
      <Button type="primary">One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Space>
  ),
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { direction: 'vertical', alignment: 'start' },
};

export const Sizes: Story = {
  render: () => (
    <Space direction="vertical" alignment="start" size="large">
      <Space size="small">
        <Tag>small</Tag>
        <Tag>small</Tag>
        <Tag>small</Tag>
      </Space>
      <Space size="default">
        <Tag>default</Tag>
        <Tag>default</Tag>
        <Tag>default</Tag>
      </Space>
      <Space size="large">
        <Tag>large</Tag>
        <Tag>large</Tag>
        <Tag>large</Tag>
      </Space>
    </Space>
  ),
};

export const Wrap: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <Space wrap>
        {Array.from({ length: 8 }, (_, i) => (
          <Tag key={i}>Tag {i + 1}</Tag>
        ))}
      </Space>
    </div>
  ),
};
