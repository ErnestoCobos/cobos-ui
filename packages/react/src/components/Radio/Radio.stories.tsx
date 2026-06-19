import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';
import { Space } from '../Space';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    border: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    label: { control: 'text' },
    value: { control: false },
  },
  args: {
    children: 'Pro plan',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Radio {...args} checked={checked} onChange={() => setChecked((c) => !c)} />;
  },
};

export const Bordered: Story = {
  render: () => (
    <Space wrap>
      <Radio border defaultChecked label="Bordered" />
      <Radio border label="Bordered" />
    </Space>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Space wrap>
      <Radio disabled label="Disabled" />
      <Radio disabled defaultChecked label="Disabled checked" />
    </Space>
  ),
};
