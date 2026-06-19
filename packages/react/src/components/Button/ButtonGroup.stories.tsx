import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'info', 'danger'],
    },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
  },
  args: {
    type: 'primary',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Previous</Button>
      <Button>Current</Button>
      <Button>Next</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ButtonGroup size="large" type="primary">
        <Button>Large</Button>
        <Button>Large</Button>
      </ButtonGroup>
      <ButtonGroup type="primary">
        <Button>Default</Button>
        <Button>Default</Button>
      </ButtonGroup>
      <ButtonGroup size="small" type="primary">
        <Button>Small</Button>
        <Button>Small</Button>
      </ButtonGroup>
    </div>
  ),
};
