import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Space } from '../Space';
import { Button } from '../Button';
import { SearchGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'textarea', 'email', 'url', 'tel', 'number', 'search'],
    },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    showPassword: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    maxLength: { control: 'number' },
    showWordLimit: { control: 'boolean' },
    placeholder: { control: 'text' },
    prefixIcon: { control: false },
    suffixIcon: { control: false },
    prepend: { control: false },
    append: { control: false },
  },
  args: {
    placeholder: 'Your name',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Input {...args} value={value} onChange={setValue} style={{ maxWidth: 280 }} />;
  },
};

export const ClearableAndPassword: Story = {
  name: 'Clearable and password',
  render: () => {
    const [clearable, setClearable] = useState('Clear me');
    const [password, setPassword] = useState('secret-value');
    return (
      <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 280 }} fill>
        <Input value={clearable} onChange={setClearable} clearable placeholder="Clearable" />
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          showPassword
          placeholder="Password"
        />
      </Space>
    );
  },
};

export const PrefixAndWordLimit: Story = {
  name: 'Prefix icon and word limit',
  render: () => {
    const [search, setSearch] = useState('');
    const [limited, setLimited] = useState('');
    return (
      <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 280 }} fill>
        <Input
          value={search}
          onChange={setSearch}
          prefixIcon={SearchGlyph}
          placeholder="Search components"
          clearable
        />
        <Input
          value={limited}
          onChange={setLimited}
          maxLength={20}
          showWordLimit
          placeholder="Max 20 chars"
        />
      </Space>
    );
  },
};

export const PrependAndAppend: Story = {
  name: 'Prepend and append',
  render: () => (
    <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 360 }} fill>
      <Input prepend="https://" append=".com" placeholder="your-site" />
      <Input
        placeholder="0.00"
        prepend="$"
        append={
          <Button text bg style={{ height: '100%' }}>
            USD
          </Button>
        }
      />
    </Space>
  ),
};

export const SizesAndTextarea: Story = {
  name: 'Sizes and textarea',
  render: () => {
    const [bio, setBio] = useState('Cobos UI is a token-first React design system.');
    return (
      <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 360 }} fill>
        <Input size="large" placeholder="Large" />
        <Input placeholder="Default" />
        <Input size="small" placeholder="Small" />
        <Input
          type="textarea"
          rows={3}
          value={bio}
          onChange={setBio}
          placeholder="Tell us about yourself"
        />
      </Space>
    );
  },
};
