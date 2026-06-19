import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './Dialog';
import { Button } from '../Button';
import { Input } from '../Input';
import { Text } from '../Text';
import { Space } from '../Space';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    width: { control: 'text' },
    fullscreen: { control: 'boolean' },
    alignCenter: { control: 'boolean' },
    center: { control: 'boolean' },
    modal: { control: 'boolean' },
    closeOnClickModal: { control: 'boolean' },
    closeOnPressEscape: { control: 'boolean' },
    showClose: { control: 'boolean' },
    open: { control: false },
    header: { control: false },
    footer: { control: false },
  },
  args: {
    // Each story drives `open` from local state via its own `render`; this
    // default just satisfies the required prop for the meta type.
    open: false,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Release notes"
          width={420}
          footer={
            <Space>
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Got it
              </Button>
            </Space>
          }
        >
          <Text>
            Wave 1 ships 25 stable components, each driven by the shared design tokens and ready for
            dark mode.
          </Text>
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  name: 'With a form inside',
  render: () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    return (
      <>
        <Button onClick={() => setOpen(true)}>Rename project</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Rename project"
          width={420}
          footer={
            <Space>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </Space>
          }
        >
          <Input value={name} onChange={setName} placeholder="New project name" clearable />
        </Dialog>
      </>
    );
  },
};

export const Centered: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open centered</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete item?"
          alignCenter
          center
          width={380}
          footer={
            <Space>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </Space>
          }
        >
          <Text>This action cannot be undone.</Text>
        </Dialog>
      </>
    );
  },
};
