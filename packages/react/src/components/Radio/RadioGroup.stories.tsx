import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, type RadioValueType } from './RadioGroup';
import { Radio } from './Radio';
import { Space } from '../Space';
import { Text } from '../Text';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    value: { control: false },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [plan, setPlan] = useState<RadioValueType>('pro');
    return (
      <Space direction="vertical" align="start">
        <RadioGroup {...args} value={plan} onChange={setPlan}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
          <Radio value="team" label="Team" />
          <Radio value="enterprise" label="Enterprise" disabled />
        </RadioGroup>
        <Text type="info" size="small">
          Plan: {String(plan)}
        </Text>
      </Space>
    );
  },
};

export const Bordered: Story = {
  render: () => {
    const [shipping, setShipping] = useState<RadioValueType>('standard');
    return (
      <RadioGroup value={shipping} onChange={setShipping}>
        <Radio value="standard" label="Standard" border />
        <Radio value="express" label="Express" border />
        <Radio value="overnight" label="Overnight" border />
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  name: 'Disabled group',
  render: () => (
    <RadioGroup defaultValue="b" disabled>
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  ),
};
