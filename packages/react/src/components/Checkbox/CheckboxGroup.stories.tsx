import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroup, type CheckboxValueType } from './CheckboxGroup';
import { Checkbox } from './Checkbox';
import { Space } from '../Space';
import { Text } from '../Text';

const CITIES = ['Mexico City', 'Tokyo', 'Berlin', 'Lisbon'];

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: false },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [group, setGroup] = useState<CheckboxValueType[]>(['Tokyo']);
    return (
      <CheckboxGroup {...args} value={group} onChange={setGroup}>
        {CITIES.map((city) => (
          <Checkbox key={city} value={city} label={city} />
        ))}
      </CheckboxGroup>
    );
  },
};

export const WithSelectAll: Story = {
  name: 'With select-all',
  render: () => {
    const [group, setGroup] = useState<CheckboxValueType[]>(['Tokyo']);
    const all = group.length === CITIES.length;
    const indeterminate = group.length > 0 && !all;
    return (
      <Space direction="vertical" align="start">
        <Checkbox
          indeterminate={indeterminate}
          checked={all}
          onChange={(checked) => setGroup(checked ? [...CITIES] : [])}
        >
          Select all
        </Checkbox>
        <CheckboxGroup value={group} onChange={setGroup}>
          {CITIES.map((city) => (
            <Checkbox key={city} value={city} label={city} />
          ))}
        </CheckboxGroup>
        <Text type="info" size="small">
          {group.length} selected
        </Text>
      </Space>
    );
  },
};
