import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';
import { Space } from '../Space';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    truncated: { control: 'boolean' },
    lineClamp: { control: 'number' },
    tag: { control: false },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <Space direction="vertical" align="start">
      <Text>Default</Text>
      <Text type="primary">Primary</Text>
      <Text type="success">Success</Text>
      <Text type="warning">Warning</Text>
      <Text type="danger">Danger</Text>
      <Text type="info">Info</Text>
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space direction="vertical" align="start">
      <Text size="large">Large text</Text>
      <Text>Default text</Text>
      <Text size="small">Small text</Text>
    </Space>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Text truncated>
        This is a very long single line of text that will be truncated with an ellipsis.
      </Text>
    </div>
  ),
};

export const LineClamp: Story = {
  name: 'Line clamp',
  render: () => (
    <div style={{ width: 240 }}>
      <Text lineClamp={2}>
        This paragraph is clamped to two lines. Any content beyond the second line is hidden
        behind an ellipsis so the layout stays compact and predictable.
      </Text>
    </div>
  ),
};
