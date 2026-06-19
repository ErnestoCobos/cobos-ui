import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Option, type SelectValue } from './Option';
import { Select } from './Select';

const meta = {
  title: 'Components/Option',
  component: Option,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: false },
    children: { control: false },
  },
  args: {
    // Required prop; the story renders options inside a Select via `render`.
    value: 'a',
  },
} satisfies Meta<typeof Option>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideSelect: Story = {
  name: 'Inside a Select',
  render: () => {
    const [value, setValue] = useState<SelectValue | SelectValue[]>('a');
    return (
      <Select value={value} onChange={setValue} style={{ width: 220 }} placeholder="Pick one">
        <Option value="a" label="Available">
          Available
        </Option>
        <Option value="b" label="Also available">
          Also available
        </Option>
        <Option value="c" label="Disabled" disabled>
          Disabled option
        </Option>
      </Select>
    );
  },
};
