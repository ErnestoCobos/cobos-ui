import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { Space } from '../Space';
import { EditGlyph } from '../../stories/icons';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    underline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    icon: { control: false },
  },
  args: {
    children: 'Cobos UI',
    type: 'primary',
    href: '#',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Link href="#">Default</Link>
      <Link href="#" type="primary">
        Primary
      </Link>
      <Link href="#" type="success">
        Success
      </Link>
      <Link href="#" type="warning">
        Warning
      </Link>
      <Link href="#" type="danger">
        Danger
      </Link>
      <Link href="#" type="info">
        Info
      </Link>
    </Space>
  ),
};

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <Space wrap>
      <Link href="#" type="primary" icon={EditGlyph}>
        Edit
      </Link>
      <Link href="#" type="primary" underline={false}>
        No underline
      </Link>
      <Link href="#" disabled>
        Disabled
      </Link>
    </Space>
  ),
};
