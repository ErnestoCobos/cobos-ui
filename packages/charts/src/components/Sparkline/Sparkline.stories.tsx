import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';
import '../../styles.css';

const trend = [3, 7, 4, 9, 6, 11, 8, 13, 12, 16];

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A tiny inline line/area chart with no axes or grid — for stat cards and dense ' +
          'tables. The default color follows `--ec-color-primary`.',
      },
    },
  },
  argTypes: {
    width: { control: { type: 'range', min: 60, max: 320, step: 10 } },
    height: { control: { type: 'range', min: 16, max: 96, step: 4 } },
    area: { control: 'boolean' },
    smooth: { control: 'boolean' },
    strokeWidth: { control: { type: 'range', min: 1, max: 4, step: 0.5 } },
    color: { control: 'text' },
    data: { control: false },
  },
  args: {
    data: trend,
    width: 160,
    height: 40,
    area: false,
    smooth: false,
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const SmoothArea: Story = {
  name: 'Smooth area',
  args: { smooth: true, area: true },
};

export const Success: Story = {
  name: 'Custom color',
  args: { color: 'var(--ec-color-success)', area: true, smooth: true },
};
