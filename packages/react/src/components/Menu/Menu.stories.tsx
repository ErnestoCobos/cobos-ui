import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { SubMenu } from './SubMenu';
import { MenuItemGroup } from './MenuItemGroup';
import { UserGlyph, StarGlyph, EditGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    collapse: { control: 'boolean' },
    uniqueOpened: { control: 'boolean' },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Menu mode="horizontal" defaultActive="1">
      <MenuItem index="1" icon={StarGlyph}>
        Home
      </MenuItem>
      <MenuItem index="2">Catalog</MenuItem>
      <SubMenu index="3" title="Resources">
        <MenuItem index="3-1">Docs</MenuItem>
        <MenuItem index="3-2">Tokens</MenuItem>
        <MenuItem index="3-3">Changelog</MenuItem>
      </SubMenu>
      <MenuItem index="4" disabled>
        Pricing
      </MenuItem>
    </Menu>
  ),
};

export const Vertical: Story = {
  name: 'Vertical with groups and submenus',
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <Menu defaultActive="2-1" defaultOpeneds={['2']}>
        <MenuItemGroup title="Workspace">
          <MenuItem index="1" icon={UserGlyph}>
            Team
          </MenuItem>
        </MenuItemGroup>
        <SubMenu index="2" title="Projects" icon={EditGlyph}>
          <MenuItem index="2-1">Atlas</MenuItem>
          <MenuItem index="2-2">Beacon</MenuItem>
          <MenuItem index="2-3">Comet</MenuItem>
        </SubMenu>
        <MenuItem index="3" icon={StarGlyph}>
          Starred
        </MenuItem>
      </Menu>
    </div>
  ),
};
