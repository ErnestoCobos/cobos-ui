import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { Option, type SelectValue } from './Option';
import { Space } from '../Space';
import { Text } from '../Text';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    filterable: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    placeholder: { control: 'text' },
    value: { control: false },
    children: { control: false },
  },
  args: {
    placeholder: 'Framework',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => {
    const [single, setSingle] = useState<SelectValue | SelectValue[]>('react');
    return (
      <Space align="center">
        <Select {...args} value={single} onChange={setSingle} clearable style={{ width: 220 }}>
          {FRAMEWORKS.map((f) => (
            <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
              {f.label}
            </Option>
          ))}
        </Select>
        <Text type="info" size="small">
          value: {String(single) || '—'}
        </Text>
      </Space>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [multiple, setMultiple] = useState<SelectValue | SelectValue[]>(['react', 'vue']);
    return (
      <Select
        value={multiple}
        onChange={setMultiple}
        multiple
        clearable
        style={{ width: 320 }}
        placeholder="Frameworks"
      >
        {FRAMEWORKS.map((f) => (
          <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
            {f.label}
          </Option>
        ))}
      </Select>
    );
  },
};

export const Filterable: Story = {
  render: () => {
    const [filtered, setFiltered] = useState<SelectValue | SelectValue[]>('');
    return (
      <Select
        value={filtered}
        onChange={setFiltered}
        filterable
        clearable
        style={{ width: 220 }}
        placeholder="Search framework"
      >
        {FRAMEWORKS.map((f) => (
          <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
            {f.label}
          </Option>
        ))}
      </Select>
    );
  },
};
