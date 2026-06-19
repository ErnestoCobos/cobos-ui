import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormItem } from './FormItem';
import { Form } from './Form';
import { Input } from '../Input';

const meta = {
  title: 'Components/FormItem',
  component: FormItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    prop: { control: 'text' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    labelWidth: { control: 'text' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    rules: { control: false },
  },
  args: {
    label: 'Username',
  },
  render: (args) => (
    <Form model={{}} style={{ maxWidth: 360 }}>
      <FormItem {...args}>
        <Input placeholder="Enter a value" />
      </FormItem>
    </Form>
  ),
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = {
  args: { label: 'Email', required: true },
};

export const WithError: Story = {
  name: 'With error message',
  args: { label: 'Email', error: 'This field is required' },
};
