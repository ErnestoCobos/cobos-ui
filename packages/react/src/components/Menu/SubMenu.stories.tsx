import type { Meta, StoryObj } from '@storybook/react-vite';
import { SubMenu } from './SubMenu';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { EditGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/SubMenu',
  component: SubMenu,
  tags: ['autodocs'],
  argTypes: {
    index: { control: 'text' },
    title: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: { control: false },
  },
  args: {
    // Required prop; the story renders sub-menus inside a Menu via `render`.
    index: '1',
  },
} satisfies Meta<typeof SubMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideMenu: Story = {
  name: 'Inside a Menu',
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <Menu defaultOpeneds={['1']}>
        <SubMenu index="1" title="Projects" icon={EditGlyph}>
          <MenuItem index="1-1">Atlas</MenuItem>
          <MenuItem index="1-2">Beacon</MenuItem>
        </SubMenu>
        <SubMenu index="2" title="Settings">
          <MenuItem index="2-1">General</MenuItem>
          <MenuItem index="2-2">Security</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  ),
};
