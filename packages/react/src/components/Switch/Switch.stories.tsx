import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';
import { Space } from '../Space';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    activeText: { control: 'text' },
    inactiveText: { control: 'text' },
    inlinePrompt: { control: 'boolean' },
    width: { control: 'number' },
    activeIcon: { control: false },
    inactiveIcon: { control: false },
  },
  args: {
    'aria-label': 'Toggle setting',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [on, setOn] = useState(true);
    return <Switch {...args} value={on} onChange={setOn} />;
  },
};

export const WithText: Story = {
  name: 'With text',
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <Switch
        value={on}
        onChange={setOn}
        activeText="On"
        inactiveText="Off"
        aria-label="Toggle setting"
      />
    );
  },
};

export const InlinePrompt: Story = {
  name: 'Inline prompt',
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <Switch
        value={on}
        onChange={setOn}
        inlinePrompt
        activeText="Y"
        inactiveText="N"
        aria-label="Toggle setting"
      />
    );
  },
};

export const States: Story = {
  render: () => (
    <Space>
      <Switch defaultValue aria-label="On" />
      <Switch aria-label="Off" />
      <Switch disabled defaultValue aria-label="Disabled on" />
      <Switch loading defaultValue aria-label="Loading" />
    </Space>
  ),
};
