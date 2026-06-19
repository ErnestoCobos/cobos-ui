import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';
import { Text } from '../Text';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    contentPosition: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    borderStyle: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
  },
  args: {
    direction: 'horizontal',
    contentPosition: 'center',
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Text>Section one</Text>
      <Divider {...args} />
      <Text>Section two</Text>
    </div>
  ),
};

export const WithText: Story = {
  name: 'With text',
  render: () => (
    <div style={{ width: 360 }}>
      <Divider contentPosition="left">Left</Divider>
      <Divider>Center</Divider>
      <Divider contentPosition="right">Right</Divider>
    </div>
  ),
};

export const Dashed: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Text>Above</Text>
      <Divider borderStyle="dashed" />
      <Text>Below</Text>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Text>Home</Text>
      <Divider direction="vertical" />
      <Text>Docs</Text>
      <Divider direction="vertical" />
      <Text>About</Text>
    </div>
  ),
};
