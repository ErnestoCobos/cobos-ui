import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { Space } from '../Space';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    border: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    label: { control: 'text' },
    value: { control: false },
  },
  args: {
    children: 'Subscribe to updates',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox {...args} checked={checked} onChange={setChecked} />
    );
  },
};

export const Bordered: Story = {
  render: () => (
    <Space wrap>
      <Checkbox border defaultChecked label="Bordered" />
      <Checkbox border label="Bordered" />
    </Space>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Space wrap>
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled defaultChecked label="Disabled checked" />
    </Space>
  ),
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox indeterminate={!checked} checked={checked} onChange={setChecked}>
        Select all
      </Checkbox>
    );
  },
};
