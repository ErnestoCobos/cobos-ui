import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { SkeletonItem } from './SkeletonItem';
import { Text } from '../Text';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    rows: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    animated: { control: 'boolean' },
    count: { control: { type: 'number', min: 1, max: 5, step: 1 } },
    throttle: { control: 'number' },
  },
  args: {
    loading: true,
    rows: 3,
    animated: true,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Skeleton {...args} />
    </div>
  ),
};

export const Animated: Story = {
  name: 'Animated rows',
  render: () => (
    <div style={{ width: 320 }}>
      <Skeleton rows={4} animated />
    </div>
  ),
};

export const WithContent: Story = {
  name: 'Toggling real content',
  render: () => (
    <div style={{ width: 320 }}>
      <Skeleton loading={false}>
        <Text>The real content appears once `loading` becomes false.</Text>
      </Skeleton>
    </div>
  ),
};

export const CustomLayout: Story = {
  name: 'Custom layout with items',
  render: () => (
    <div style={{ display: 'flex', gap: 16, width: 320, alignItems: 'center' }}>
      <SkeletonItem variant="circle" style={{ width: 48, height: 48, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonItem variant="h3" style={{ width: '60%' }} />
        <SkeletonItem variant="text" />
        <SkeletonItem variant="text" style={{ width: '80%' }} />
      </div>
    </div>
  ),
};
