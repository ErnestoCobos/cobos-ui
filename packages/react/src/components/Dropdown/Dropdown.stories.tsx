import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { DropdownMenu } from './DropdownMenu';
import { DropdownItem } from './DropdownItem';
import { Button } from '../Button';
import { Space } from '../Space';
import { Text } from '../Text';
import { EditGlyph, DeleteGlyph, PlusGlyph } from '../../stories/icons';

const menu = (
  <DropdownMenu>
    <DropdownItem command="new" icon={PlusGlyph}>
      New item
    </DropdownItem>
    <DropdownItem command="edit" icon={EditGlyph}>
      Edit
    </DropdownItem>
    <DropdownItem command="duplicate">Duplicate</DropdownItem>
    <DropdownItem command="delete" icon={DeleteGlyph} divided>
      Delete
    </DropdownItem>
  </DropdownMenu>
);

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: 'inline-radio', options: ['hover', 'click'] },
    placement: { control: 'text' },
    disabled: { control: 'boolean' },
    hideOnClick: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    menu: { control: false },
    children: { control: false },
  },
  args: {
    // Required props; each story supplies its own via `render`.
    menu,
    children: <Button type="primary">Actions</Button>,
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverTrigger: Story = {
  name: 'Hover trigger',
  render: () => {
    const [last, setLast] = useState('—');
    return (
      <Space align="center">
        <Dropdown menu={menu} onCommand={(c) => setLast(String(c))}>
          <Button type="primary">Actions</Button>
        </Dropdown>
        <Text type="info" size="small">
          last command: {last}
        </Text>
      </Space>
    );
  },
};

export const ClickTrigger: Story = {
  name: 'Click trigger',
  render: () => {
    const [last, setLast] = useState('—');
    return (
      <Space align="center">
        <Dropdown trigger="click" menu={menu} onCommand={(c) => setLast(String(c))}>
          <Button>Open on click</Button>
        </Dropdown>
        <Text type="info" size="small">
          last command: {last}
        </Text>
      </Space>
    );
  },
};
