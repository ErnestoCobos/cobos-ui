import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { SearchGlyph, StarGlyph, UserGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    color: { control: 'color' },
    spin: { control: 'boolean' },
    children: { control: false },
  },
  args: {
    size: 32,
    children: SearchGlyph,
    'aria-label': 'Search',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon size={16}>{StarGlyph}</Icon>
      <Icon size={24}>{StarGlyph}</Icon>
      <Icon size={32}>{StarGlyph}</Icon>
      <Icon size={48}>{StarGlyph}</Icon>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon size={32} color="#7c3aed">
        {UserGlyph}
      </Icon>
      <Icon size={32} color="#0ea5e9">
        {UserGlyph}
      </Icon>
      <Icon size={32} color="#10b981">
        {UserGlyph}
      </Icon>
    </div>
  ),
};

export const Spinning: Story = {
  render: () => (
    <Icon size={32} spin>
      {StarGlyph}
    </Icon>
  ),
};
