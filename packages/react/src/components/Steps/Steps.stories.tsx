import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps } from './Steps';
import { Step } from './Step';

const meta = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    active: { control: { type: 'number', min: 0, max: 3, step: 1 } },
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    alignCenter: { control: 'boolean' },
    simple: { control: 'boolean' },
    space: { control: 'text' },
    finishStatus: {
      control: 'inline-radio',
      options: ['wait', 'process', 'finish', 'error', 'success'],
    },
    processStatus: {
      control: 'inline-radio',
      options: ['wait', 'process', 'finish', 'error', 'success'],
    },
    children: { control: false },
  },
  args: {
    active: 1,
    direction: 'horizontal',
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Steps {...args}>
      <Step title="Account" description="Create your account" />
      <Step title="Profile" description="Add your details" />
      <Step title="Confirm" description="Review and submit" />
    </Steps>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Steps active={2} direction="vertical" style={{ height: 280 }}>
      <Step title="Order placed" description="We received your order." />
      <Step title="Packed" description="Your items are packed." />
      <Step title="Shipped" description="On the way to you." />
      <Step title="Delivered" description="Arrives in 2 days." />
    </Steps>
  ),
};

export const WithError: Story = {
  name: 'Error status',
  render: () => (
    <Steps active={1}>
      <Step title="Submitted" description="Form submitted." />
      <Step title="Validation" description="A field is invalid." status="error" />
      <Step title="Complete" description="Awaiting validation." />
    </Steps>
  ),
};

export const Simple: Story = {
  name: 'Simple bar',
  render: () => (
    <Steps active={1} simple>
      <Step title="Cart" />
      <Step title="Payment" />
      <Step title="Done" />
    </Steps>
  ),
};
