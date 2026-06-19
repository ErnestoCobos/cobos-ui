import type { Meta, StoryObj } from '@storybook/react-vite';
import { Empty } from './Empty';
import { Button } from '../Button';

const meta = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
  argTypes: {
    description: { control: 'text' },
    image: { control: 'text' },
    imageSize: { control: 'number' },
  },
  args: {
    description: 'No data',
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Empty {...args} />,
};

export const CustomDescription: Story = {
  name: 'Custom description',
  render: () => <Empty description="No results match your filters" />,
};

export const WithActions: Story = {
  name: 'With an action',
  render: () => (
    <Empty description="Your project has no members yet">
      <Button type="primary">Invite teammates</Button>
    </Empty>
  ),
};

export const SmallImage: Story = {
  name: 'Smaller illustration',
  render: () => <Empty description="Nothing here" imageSize={80} />,
};
