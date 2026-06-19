import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';
import '../../styles.css';

const revenue = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 55 },
  { label: 'Mar', value: 48 },
  { label: 'Apr', value: 71 },
  { label: 'May', value: 66 },
  { label: 'Jun', value: 84 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A theme-aware bar chart with rounded leading corners. Supports vertical and ' +
          'horizontal layouts, plus grouped and stacked multi-series data.',
      },
    },
  },
  argTypes: {
    height: { control: { type: 'range', min: 120, max: 480, step: 20 } },
    horizontal: { control: 'boolean' },
    stacked: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    radius: { control: { type: 'range', min: 0, max: 16, step: 1 } },
    categoryGap: { control: { type: 'range', min: 0, max: 0.8, step: 0.05 } },
    barGap: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 } },
    data: { control: false },
    series: { control: false },
    categories: { control: false },
    colors: { control: false },
  },
  args: {
    data: revenue,
    height: 280,
    showGrid: true,
    radius: 6,
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Horizontal: Story = {
  args: { horizontal: true },
};

export const Grouped: Story = {
  name: 'Grouped series',
  args: {
    data: undefined,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      { name: 'New', data: [10, 14, 9, 17, 13] },
      { name: 'Returning', data: [6, 8, 12, 9, 15] },
    ],
  },
};

export const Stacked: Story = {
  args: {
    data: undefined,
    stacked: true,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      { name: 'New', data: [10, 14, 9, 17, 13] },
      { name: 'Returning', data: [6, 8, 12, 9, 15] },
    ],
  },
};
