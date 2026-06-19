import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, type FormInstance, type FormRule } from './Form';
import { FormItem } from './FormItem';
import { Input } from '../Input';
import { Select } from '../Select';
import { Option } from '../Select/Option';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { Space } from '../Space';
import { Tag } from '../Tag';

type SignUpModel = {
  name: string;
  email: string;
  role: string;
  newsletter: boolean;
} & Record<string, unknown>;

const rules: Record<string, FormRule | FormRule[]> = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'That does not look like a valid email', trigger: 'blur' },
  ],
  role: [{ required: true, message: 'Please pick a role', trigger: 'change' }],
};

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {
    labelWidth: { control: 'text' },
    labelPosition: { control: 'inline-radio', options: ['left', 'right', 'top'] },
    inline: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    disabled: { control: 'boolean' },
    hideRequiredAsterisk: { control: 'boolean' },
    model: { control: false },
    rules: { control: false },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Validated: Story = {
  name: 'Validated sign-up form',
  render: () => {
    const formRef = useRef<FormInstance>(null);
    const [model, setModel] = useState<SignUpModel>({
      name: '',
      email: '',
      role: '',
      newsletter: true,
    });
    const [submitted, setSubmitted] = useState<SignUpModel | null>(null);

    const update = <K extends keyof SignUpModel>(key: K, value: SignUpModel[K]) => {
      setModel((m) => ({ ...m, [key]: value }));
    };

    const onSubmit = async () => {
      const valid = await formRef.current?.validate();
      if (valid) setSubmitted(model);
    };

    const onReset = () => {
      setModel({ name: '', email: '', role: '', newsletter: true });
      setSubmitted(null);
      formRef.current?.resetFields();
    };

    return (
      <div style={{ maxWidth: 420 }}>
        <Form ref={formRef} model={model} rules={rules} labelWidth={110} labelPosition="right">
          <FormItem label="Name" prop="name">
            <Input value={model.name} onChange={(v) => update('name', v)} placeholder="Ada Lovelace" />
          </FormItem>
          <FormItem label="Email" prop="email">
            <Input value={model.email} onChange={(v) => update('email', v)} placeholder="ada@example.com" />
          </FormItem>
          <FormItem label="Role" prop="role">
            <Select
              value={model.role}
              onChange={(v) => update('role', v as string)}
              placeholder="Select a role"
              style={{ width: '100%' }}
            >
              <Option value="engineer">Engineer</Option>
              <Option value="designer">Designer</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </FormItem>
          <FormItem label="Newsletter" prop="newsletter">
            <Switch value={model.newsletter} onChange={(v) => update('newsletter', v)} />
          </FormItem>
          <FormItem label=" ">
            <Space>
              <Button type="primary" onClick={onSubmit}>
                Create account
              </Button>
              <Button onClick={onReset}>Reset</Button>
            </Space>
          </FormItem>
        </Form>

        {submitted ? (
          <Space wrap>
            <Tag type="success">Submitted</Tag>
            <Tag>{submitted.name}</Tag>
            <Tag>{submitted.email}</Tag>
            <Tag>{submitted.role}</Tag>
            <Tag type={submitted.newsletter ? 'primary' : 'info'}>
              newsletter: {submitted.newsletter ? 'yes' : 'no'}
            </Tag>
          </Space>
        ) : null}
      </div>
    );
  },
};

export const Inline: Story = {
  name: 'Inline form',
  render: () => (
    <Form inline model={{}}>
      <FormItem label="Search">
        <Input placeholder="Keyword" style={{ width: 160 }} />
      </FormItem>
      <FormItem label="Status">
        <Select placeholder="Any" style={{ width: 120 }}>
          <Option value="active">Active</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary">Filter</Button>
      </FormItem>
    </Form>
  ),
};
