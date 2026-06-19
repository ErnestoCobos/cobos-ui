import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Space } from '../Space';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    type: { control: 'inline-radio', options: ['success', 'warning', 'info', 'error'] },
    description: { control: 'text' },
    effect: { control: 'inline-radio', options: ['light', 'dark'] },
    closable: { control: 'boolean' },
    closeText: { control: 'text' },
    center: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    onClose: { control: false },
  },
  args: {
    title: 'Heads up',
    type: 'info',
    closable: true,
    showIcon: true,
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Alert {...args} />,
};

export const Types: Story = {
  render: () => (
    <Space direction="vertical" alignment="start" style={{ width: 360 }}>
      <Alert title="Operation succeeded" type="success" showIcon />
      <Alert title="Check your input" type="warning" showIcon />
      <Alert title="For your information" type="info" showIcon />
      <Alert title="Something failed" type="error" showIcon />
    </Space>
  ),
};

export const WithDescription: Story = {
  name: 'With a description',
  render: () => (
    <Space direction="vertical" alignment="start" style={{ width: 360 }}>
      <Alert
        title="Update available"
        type="info"
        showIcon
        description="A new version of the app is ready. Reload to apply the latest changes."
      />
      <Alert
        title="Payment failed"
        type="error"
        showIcon
        description="We could not charge your card. Update your billing details to continue."
      />
    </Space>
  ),
};

export const DarkEffect: Story = {
  name: 'Dark effect',
  render: () => (
    <Space direction="vertical" alignment="start" style={{ width: 360 }}>
      <Alert title="Success" type="success" effect="dark" showIcon />
      <Alert title="Warning" type="warning" effect="dark" showIcon />
      <Alert title="Error" type="error" effect="dark" showIcon />
    </Space>
  ),
};
