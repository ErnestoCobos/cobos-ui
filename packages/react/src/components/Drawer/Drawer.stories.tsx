import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { Button } from '../Button';
import { Text } from '../Text';
import { Space } from '../Space';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    direction: { control: 'inline-radio', options: ['rtl', 'ltr', 'ttb', 'btt'] },
    size: { control: 'text' },
    modal: { control: 'boolean' },
    closeOnClickModal: { control: 'boolean' },
    closeOnPressEscape: { control: 'boolean' },
    showClose: { control: 'boolean' },
    withHeader: { control: 'boolean' },
    lockScroll: { control: 'boolean' },
    keepMounted: { control: 'boolean' },
    open: { control: false },
    footer: { control: false },
    onClose: { control: false },
    onOpenChange: { control: false },
  },
  args: {
    // Each story drives `open` from local state via its own `render`; this
    // default just satisfies the required prop for the meta type.
    open: false,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open drawer
        </Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Settings" size={320}>
          <Text>
            Drawers slide in from an edge of the screen and are well suited for forms, filters and
            detail panels.
          </Text>
        </Drawer>
      </>
    );
  },
};

export const Directions: Story = {
  render: () => {
    const [direction, setDirection] = useState<'rtl' | 'ltr' | 'ttb' | 'btt' | null>(null);
    return (
      <>
        <Space wrap>
          <Button onClick={() => setDirection('ltr')}>From left</Button>
          <Button onClick={() => setDirection('rtl')}>From right</Button>
          <Button onClick={() => setDirection('ttb')}>From top</Button>
          <Button onClick={() => setDirection('btt')}>From bottom</Button>
        </Space>
        <Drawer
          open={direction !== null}
          onClose={() => setDirection(null)}
          title="Navigation"
          direction={direction ?? 'rtl'}
          size="40%"
        >
          <Text>This drawer slides in from the {direction} edge.</Text>
        </Drawer>
      </>
    );
  },
};

export const WithFooter: Story = {
  name: 'With a footer',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit profile</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Edit profile"
          size={360}
          footer={
            <Space>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Save changes
              </Button>
            </Space>
          }
        >
          <Text>Update your display name, avatar and contact details here.</Text>
        </Drawer>
      </>
    );
  },
};
