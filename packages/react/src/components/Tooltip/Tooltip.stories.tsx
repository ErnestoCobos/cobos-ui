import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { Space } from '../Space';

const triggerButton = <Button>Hover me</Button>;

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
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'select', options: placements },
    trigger: { control: 'inline-radio', options: ['hover', 'click', 'focus'] },
    effect: { control: 'inline-radio', options: ['dark', 'light'] },
    showArrow: { control: 'boolean' },
    offset: { control: 'number' },
    disabled: { control: 'boolean' },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    content: 'Helpful hint',
    placement: 'top',
    trigger: 'hover',
    effect: 'dark',
    // Satisfies the required `children` prop; stories override it via `render`.
    children: triggerButton,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <Space wrap>
      <Tooltip content="Top" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </Space>
  ),
};

export const Effects: Story = {
  name: 'Dark and light',
  render: () => (
    <Space wrap>
      <Tooltip content="Dark surface" effect="dark">
        <Button>Dark</Button>
      </Tooltip>
      <Tooltip content="Light surface" effect="light">
        <Button>Light</Button>
      </Tooltip>
    </Space>
  ),
};

export const Triggers: Story = {
  render: () => (
    <Space wrap>
      <Tooltip content="Opens on hover" trigger="hover">
        <Button>Hover</Button>
      </Tooltip>
      <Tooltip content="Opens on click" trigger="click">
        <Button>Click</Button>
      </Tooltip>
      <Tooltip content="Opens on focus" trigger="focus">
        <Button>Focus</Button>
      </Tooltip>
    </Space>
  ),
};
