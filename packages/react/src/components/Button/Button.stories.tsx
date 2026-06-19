import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Space } from '../Space';
import { SearchGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'info', 'danger'],
    },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    plain: { control: 'boolean' },
    text: { control: 'boolean' },
    bg: { control: 'boolean' },
    link: { control: 'boolean' },
    dashed: { control: 'boolean' },
    round: { control: 'boolean' },
    circle: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    color: { control: 'color' },
    icon: { control: false },
    loadingIcon: { control: false },
  },
  args: {
    children: 'Button',
    type: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Button>Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="success">Success</Button>
      <Button type="info">Info</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button>
    </Space>
  ),
};

export const Shapes: Story = {
  name: 'Plain, round and circle',
  render: () => (
    <Space wrap>
      <Button type="primary" plain>
        Plain
      </Button>
      <Button type="success" round>
        Round
      </Button>
      <Button type="primary" icon={SearchGlyph} circle aria-label="Search" />
      <Button type="primary" icon={SearchGlyph}>
        Search
      </Button>
    </Space>
  ),
};

export const TextAndLink: Story = {
  name: 'Text and link',
  render: () => (
    <Space wrap>
      <Button text>Text</Button>
      <Button text bg>
        Text with background
      </Button>
      <Button link type="primary">
        Link
      </Button>
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space wrap align="center">
      <Button size="large" type="primary">
        Large
      </Button>
      <Button type="primary">Default</Button>
      <Button size="small" type="primary">
        Small
      </Button>
    </Space>
  ),
};

export const LoadingAndDisabled: Story = {
  name: 'Loading and disabled',
  render: () => (
    <Space wrap>
      <Button type="primary" loading>
        Loading
      </Button>
      <Button type="primary" disabled>
        Disabled
      </Button>
    </Space>
  ),
};

export const CustomColor: Story = {
  name: 'Custom color',
  render: () => (
    <Space wrap>
      <Button color="#7c3aed">Violet</Button>
      <Button color="#0ea5e9" plain>
        Sky plain
      </Button>
      <Button color="#10b981" round>
        Emerald
      </Button>
    </Space>
  ),
};
