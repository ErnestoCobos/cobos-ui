import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';
import { Space } from '../Space';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    percentage: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    type: { control: 'inline-radio', options: ['line', 'circle', 'dashboard'] },
    status: { control: 'inline-radio', options: [undefined, 'success', 'warning', 'exception'] },
    strokeWidth: { control: 'number' },
    showText: { control: 'boolean' },
    textInside: { control: 'boolean' },
    strokeLinecap: { control: 'inline-radio', options: ['round', 'butt', 'square'] },
    width: { control: 'number' },
    indeterminate: { control: 'boolean' },
    duration: { control: 'number' },
    color: { control: false },
    format: { control: false },
  },
  args: {
    percentage: 60,
    type: 'line',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

export const Line: Story = {
  name: 'Line with statuses',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: 320, gap: 16 }}>
      <Progress percentage={30} />
      <Progress percentage={70} status="warning" />
      <Progress percentage={100} status="success" />
      <Progress percentage={50} status="exception" />
      <Progress percentage={80} textInside />
    </div>
  ),
};

export const Circle: Story = {
  name: 'Circle and dashboard',
  render: () => (
    <Space wrap style={{ gap: 24 }}>
      <Progress type="circle" percentage={75} />
      <Progress type="circle" percentage={100} status="success" />
      <Progress type="dashboard" percentage={60} />
      <Progress type="dashboard" percentage={40} status="exception" />
    </Space>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress percentage={50} indeterminate showText={false} />
    </div>
  ),
};
