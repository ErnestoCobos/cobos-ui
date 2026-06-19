import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu } from './DropdownMenu';
import { DropdownItem } from './DropdownItem';
import { Dropdown } from './Dropdown';
import { Button } from '../Button';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideDropdown: Story = {
  name: 'Inside a Dropdown',
  render: () => (
    <Dropdown
      trigger="click"
      menu={
        <DropdownMenu>
          <DropdownItem command="a">First</DropdownItem>
          <DropdownItem command="b">Second</DropdownItem>
          <DropdownItem command="c">Third</DropdownItem>
        </DropdownMenu>
      }
    >
      <Button type="primary">Open menu</Button>
    </Dropdown>
  ),
};
