import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from './AreaChart';
import '../../styles.css';

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

const signups = weeks.map((x, i) => ({
  x,
  y: [340, 420, 390, 510, 580, 640, 720, 860][i],
}));

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A `LineChart` with the gradient `area` fill enabled by default. Accepts every ' +
          'LineChart prop, including `smooth` and multiple `series`.',
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
    data: { control: false },
    series: { control: false },
    colors: { control: false },
  },
  args: {
    data: signups,
    height: 260,
    smooth: true,
    showGrid: true,
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Angular: Story = {
  name: 'Straight segments',
  args: { smooth: false },
};

export const Stacked: Story = {
  name: 'Two series',
  args: {
    data: undefined,
    series: [
      {
        name: 'Organic',
        data: weeks.map((x, i) => ({ x, y: [220, 260, 250, 320, 360, 410, 460, 540][i] })),
      },
      {
        name: 'Paid',
        data: weeks.map((x, i) => ({ x, y: [120, 160, 140, 190, 220, 230, 260, 320][i] })),
      },
    ],
  },
};
