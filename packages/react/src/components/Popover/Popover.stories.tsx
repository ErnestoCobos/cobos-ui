import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button } from '../Button';
import { Text } from '../Text';
import { Space } from '../Space';

const triggerButton = <Button type="primary">Open popover</Button>;

const placements = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'right',
] as const;

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    title: { control: 'text' },
    trigger: { control: 'inline-radio', options: ['hover', 'click', 'focus'] },
    placement: { control: 'select', options: placements },
    width: { control: 'text' },
    showArrow: { control: 'boolean' },
    offset: { control: 'number' },
    disabled: { control: 'boolean' },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    title: 'Project details',
    content: 'Shipped on June 18, 2026. Owned by the platform team.',
    trigger: 'click',
    placement: 'bottom',
    width: 240,
    // Satisfies the required `children` prop; stories override it via `render`.
    children: triggerButton,
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover {...args}>
      <Button type="primary">Open popover</Button>
    </Popover>
  ),
};

export const WithTitle: Story = {
  name: 'With a title',
  render: () => (
    <Popover
      title="Keyboard shortcuts"
      content="Press Cmd+K to open the command palette."
      width={260}
    >
      <Button>Show shortcuts</Button>
    </Popover>
  ),
};

export const RichContent: Story = {
  name: 'Rich content',
  render: () => (
    <Popover
      title="Invite teammates"
      width={280}
      content={
        <Space direction="vertical">
          <Text>Share a link or send an invitation by email.</Text>
          <Space>
            <Button size="small">Copy link</Button>
            <Button size="small" type="primary">
              Send invite
            </Button>
          </Space>
        </Space>
      }
    >
      <Button type="primary">Invite</Button>
    </Popover>
  ),
};

export const HoverTrigger: Story = {
  name: 'Hover trigger',
  render: () => (
    <Popover trigger="hover" content="Opens while the trigger is hovered." placement="right">
      <Button>Hover me</Button>
    </Popover>
  ),
};
