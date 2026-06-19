import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segmented, type SegmentedValue } from './Segmented';

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  argTypes: {
    options: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
  },
  args: {
    options: ['Daily', 'Weekly', 'Monthly'],
    defaultValue: 'Daily',
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Segmented {...args} />,
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<SegmentedValue>('list');
    return (
      <Segmented
        value={value}
        onChange={setValue}
        options={[
          { label: 'List', value: 'list' },
          { label: 'Board', value: 'board' },
          { label: 'Calendar', value: 'calendar' },
        ]}
      />
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Segmented size="large" options={['Large', 'Option', 'Set']} />
      <Segmented size="default" options={['Default', 'Option', 'Set']} />
      <Segmented size="small" options={['Small', 'Option', 'Set']} />
    </div>
  ),
};

export const BlockAndDisabled: Story = {
  name: 'Block and disabled states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 360 }}>
      <Segmented block options={['Overview', 'Activity', 'Settings']} />
      <Segmented
        defaultValue="enabled"
        options={[
          { label: 'Enabled', value: 'enabled' },
          { label: 'Disabled', value: 'disabled', disabled: true },
          { label: 'Available', value: 'available' },
        ]}
      />
      <Segmented disabled options={['All', 'segments', 'off']} />
    </div>
  ),
};
