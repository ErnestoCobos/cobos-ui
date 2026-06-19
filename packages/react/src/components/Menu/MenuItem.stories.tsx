import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuItem } from './MenuItem';
import { Menu } from './Menu';
import { StarGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    index: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: { control: false },
  },
  args: {
    // Required prop; the story renders items inside a Menu via `render`.
    index: '1',
  },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideMenu: Story = {
  name: 'Inside a Menu',
  render: () => (
    <Menu mode="horizontal" defaultActive="1">
      <MenuItem index="1" icon={StarGlyph}>
        Active
      </MenuItem>
      <MenuItem index="2">Default</MenuItem>
      <MenuItem index="3" disabled>
        Disabled
      </MenuItem>
    </Menu>
  ),
};
