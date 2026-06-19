import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownItem } from './DropdownItem';
import { DropdownMenu } from './DropdownMenu';
import { Dropdown } from './Dropdown';
import { Button } from '../Button';
import { EditGlyph, DeleteGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/DropdownItem',
  component: DropdownItem,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    divided: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof DropdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideDropdown: Story = {
  name: 'Inside a Dropdown',
  render: () => (
    <Dropdown
      trigger="click"
      menu={
        <DropdownMenu>
          <DropdownItem command="edit" icon={EditGlyph}>
            Edit
          </DropdownItem>
          <DropdownItem command="disabled" disabled>
            Disabled
          </DropdownItem>
          <DropdownItem command="delete" icon={DeleteGlyph} divided>
            Delete
          </DropdownItem>
        </DropdownMenu>
      }
    >
      <Button type="primary">Open menu</Button>
    </Dropdown>
  ),
};
