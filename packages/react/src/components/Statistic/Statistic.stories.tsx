import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic } from './Statistic';
import { Space } from '../Space';

const meta = {
  title: 'Components/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    title: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    precision: { control: 'number' },
    groupSeparator: { control: 'text' },
    decimalSeparator: { control: 'text' },
    valueStyle: { control: false },
    formatter: { control: false },
  },
  args: {
    title: 'Active users',
    value: 268500,
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Statistic {...args} />,
};

export const Group: Story = {
  name: 'A row of statistics',
  render: () => (
    <Space wrap style={{ gap: 48 }}>
      <Statistic title="Active users" value={268500} />
      <Statistic title="Account balance" value={1128.42} precision={2} prefix="$" />
      <Statistic title="Conversion rate" value={68.4} precision={1} suffix="%" />
    </Space>
  ),
};

export const Precision: Story = {
  name: 'Precision and separators',
  render: () => (
    <Space wrap style={{ gap: 48 }}>
      <Statistic title="Revenue" value={1234567.891} precision={2} prefix="$" />
      <Statistic
        title="European format"
        value={1234567.89}
        precision={2}
        groupSeparator="."
        decimalSeparator=","
        suffix="€"
      />
    </Space>
  ),
};

export const ColoredValue: Story = {
  name: 'Colored value',
  render: () => (
    <Space wrap style={{ gap: 48 }}>
      <Statistic
        title="Net profit"
        value={32.18}
        precision={2}
        prefix="+"
        suffix="%"
        valueStyle={{ color: 'var(--ec-color-success)' }}
      />
      <Statistic
        title="Churn"
        value={-4.7}
        precision={1}
        suffix="%"
        valueStyle={{ color: 'var(--ec-color-danger)' }}
      />
    </Space>
  ),
};
