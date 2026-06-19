import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Space } from '../Space';
import { UserGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['large', 'default', 'small'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    fit: { control: 'select', options: ['fill', 'contain', 'cover', 'none', 'scale-down'] },
    src: { control: 'text' },
    icon: { control: false },
  },
  args: {
    children: 'EC',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Image: Story = {
  render: () => (
    <Space align="center">
      <Avatar src="https://i.pravatar.cc/120?img=12" />
      <Avatar src="https://i.pravatar.cc/120?img=32" />
      <Avatar src="https://i.pravatar.cc/120?img=5" />
    </Space>
  ),
};

export const Fallbacks: Story = {
  name: 'Text and icon fallbacks',
  render: () => (
    <Space align="center">
      <Avatar>EC</Avatar>
      <Avatar style={{ background: 'var(--ec-color-primary)' }}>AL</Avatar>
      <Avatar icon={UserGlyph} />
    </Space>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Space align="center">
      <Avatar shape="circle">C</Avatar>
      <Avatar shape="square">S</Avatar>
      <Avatar shape="square" src="https://i.pravatar.cc/120?img=20" />
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space align="center">
      <Avatar size="large">L</Avatar>
      <Avatar>M</Avatar>
      <Avatar size="small">S</Avatar>
      <Avatar size={64}>64</Avatar>
    </Space>
  ),
};
