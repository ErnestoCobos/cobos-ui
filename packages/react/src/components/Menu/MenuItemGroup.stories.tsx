import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuItemGroup } from './MenuItemGroup';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';

const meta = {
  title: 'Components/MenuItemGroup',
  component: MenuItemGroup,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof MenuItemGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideMenu: Story = {
  name: 'Inside a Menu',
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <Menu defaultActive="1-1">
        <MenuItemGroup title="Workspace">
          <MenuItem index="1-1">Team</MenuItem>
          <MenuItem index="1-2">Members</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup title="Account">
          <MenuItem index="2-1">Profile</MenuItem>
          <MenuItem index="2-2">Billing</MenuItem>
        </MenuItemGroup>
      </Menu>
    </div>
  ),
};
