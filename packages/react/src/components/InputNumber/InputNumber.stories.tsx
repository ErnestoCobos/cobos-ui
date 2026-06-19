import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputNumber } from './InputNumber';
import { Space } from '../Space';

const meta = {
  title: 'Components/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    controls: { control: 'boolean' },
    controlsPosition: { control: 'inline-radio', options: ['', 'right'] },
    stepStrictly: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    min: 0,
    max: 10,
    step: 1,
  },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | null>(2);
    return <InputNumber {...args} value={value ?? undefined} onChange={setValue} />;
  },
};

export const Precision: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(3.14);
    return (
      <InputNumber
        value={value ?? undefined}
        onChange={setValue}
        precision={2}
        step={0.1}
        min={0}
        max={100}
      />
    );
  },
};

export const Variants: Story = {
  render: () => (
    <Space direction="vertical" align="start">
      <InputNumber defaultValue={5} controlsPosition="right" />
      <InputNumber defaultValue={5} controls={false} />
      <InputNumber defaultValue={5} disabled />
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space direction="vertical" align="start">
      <InputNumber defaultValue={1} size="large" />
      <InputNumber defaultValue={1} />
      <InputNumber defaultValue={1} size="small" />
    </Space>
  ),
};
