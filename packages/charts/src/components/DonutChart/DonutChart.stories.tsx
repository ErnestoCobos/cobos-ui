import type { Meta, StoryObj } from '@storybook/react-vite';
import { DonutChart, PieChart } from './DonutChart';
import '../../styles.css';

const traffic = [
  { label: 'Direct', value: 48 },
  { label: 'Organic search', value: 27 },
  { label: 'Referral', value: 15 },
  { label: 'Social', value: 10 },
];

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A theme-aware donut chart. Slice colors come from the `--ec-*` palette, with ' +
          'optional center label and legend. `PieChart` is the same chart with no inner radius.',
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 120, max: 320, step: 10 } },
    thickness: { control: { type: 'range', min: 8, max: 80, step: 2 } },
    showLegend: { control: 'boolean' },
    gap: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 } },
    centerLabel: { control: 'text' },
    data: { control: false },
    colors: { control: false },
  },
  args: {
    data: traffic,
    size: 220,
    thickness: 34,
    showLegend: true,
    centerLabel: '100%',
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const SpacedNoLegend: Story = {
  name: 'Spaced slices',
  args: { showLegend: false, gap: 0.03, centerLabel: undefined },
};

export const Pie: Story = {
  name: 'Full pie',
  render: (args) => (
    <PieChart data={args.data} size={args.size} colors={args.colors} showLegend />
  ),
};
