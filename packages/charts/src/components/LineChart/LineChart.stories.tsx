import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';
import '../../styles.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const single = months.map((x, i) => ({
  x,
  y: [120, 200, 150, 320, 280, 410, 380, 520][i],
}));

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dependency-free, theme-aware SVG line chart. Colors come from the ' +
          '`--ec-*` design tokens, so it follows the active brand and light/dark mode automatically.',
      },
    },
  },
  argTypes: {
    height: { control: { type: 'range', min: 120, max: 480, step: 20 } },
    smooth: { control: 'boolean' },
    area: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showXAxis: { control: 'boolean' },
    showYAxis: { control: 'boolean' },
    showDots: { control: 'boolean' },
    strokeWidth: { control: { type: 'range', min: 1, max: 6, step: 0.5 } },
    yTicks: { control: { type: 'range', min: 2, max: 8, step: 1 } },
    data: { control: false },
    series: { control: false },
    colors: { control: false },
  },
  args: {
    data: single,
    height: 260,
    smooth: false,
    area: false,
    showGrid: true,
    showDots: false,
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const SmoothWithDots: Story = {
  name: 'Smooth + dots',
  args: { smooth: true, showDots: true },
};

export const MultiSeries: Story = {
  name: 'Multiple series',
  args: {
    data: undefined,
    smooth: true,
    series: [
      {
        name: 'Revenue',
        data: months.map((x, i) => ({ x, y: [12, 19, 15, 27, 24, 33, 31, 42][i] })),
      },
      {
        name: 'Costs',
        data: months.map((x, i) => ({ x, y: [8, 11, 10, 14, 13, 17, 16, 19][i] })),
      },
    ],
  },
};
