import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfigProvider } from './ConfigProvider';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Option } from '../components/Select/Option';
import { Space } from '../components/Space';
import { Tag } from '../components/Tag';

function ControlRow() {
  return (
    <Space wrap align="center">
      <Button type="primary">Action</Button>
      <Input placeholder="Type here" style={{ width: 160 }} />
      <Select placeholder="Pick one" style={{ width: 140 }}>
        <Option value="a">Alpha</Option>
        <Option value="b">Beta</Option>
        <Option value="c">Gamma</Option>
      </Select>
      <Tag type="primary">Tag</Tag>
    </Space>
  );
}

const meta = {
  title: 'Components/ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    disabled: { control: 'boolean' },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
  },
  args: {
    size: 'default',
  },
  render: (args) => (
    <ConfigProvider {...args}>
      <ControlRow />
    </ConfigProvider>
  ),
} satisfies Meta<typeof ConfigProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Space direction="vertical" align="start" size="large">
      <ConfigProvider size="large">
        <ControlRow />
      </ConfigProvider>
      <ConfigProvider size="default">
        <ControlRow />
      </ConfigProvider>
      <ConfigProvider size="small">
        <ControlRow />
      </ConfigProvider>
    </Space>
  ),
};

export const Disabled: Story = {
  name: 'Globally disabled',
  render: () => (
    <ConfigProvider disabled>
      <ControlRow />
    </ConfigProvider>
  ),
};
