import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Col } from './Col';
import { Row } from './Row';

function Block({ children, dark }: { children: ReactNode; dark?: boolean }) {
  const style: CSSProperties = {
    borderRadius: 'var(--ec-border-radius-base)',
    background: dark ? 'var(--ec-color-primary-light-3)' : 'var(--ec-color-primary-light-7)',
    color: dark ? '#fff' : 'var(--ec-color-primary-dark-2)',
    textAlign: 'center',
    padding: '14px 0',
    fontSize: 13,
    fontWeight: 500,
  };
  return <div style={style}>{children}</div>;
}

const meta = {
  title: 'Components/Layout/Col',
  component: Col,
  tags: ['autodocs'],
  argTypes: {
    span: { control: { type: 'range', min: 1, max: 24, step: 1 } },
    offset: { control: { type: 'range', min: 0, max: 23, step: 1 } },
    push: { control: 'number' },
    pull: { control: 'number' },
    tag: { control: false },
  },
  args: {
    span: 12,
  },
  render: (args) => (
    <Row gutter={16}>
      <Col {...args}>
        <Block dark>this column</Block>
      </Col>
      <Col span={24 - (args.span ?? 12)}>
        <Block>span {24 - (args.span ?? 12)}</Block>
      </Col>
    </Row>
  ),
} satisfies Meta<typeof Col>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Offset: Story = {
  render: () => (
    <Row gutter={16}>
      <Col span={8}>
        <Block>span 8</Block>
      </Col>
      <Col span={8} offset={8}>
        <Block dark>span 8, offset 8</Block>
      </Col>
    </Row>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Row gutter={16}>
      <Col xs={24} md={16}>
        <Block dark>xs 24 / md 16</Block>
      </Col>
      <Col xs={24} md={8}>
        <Block>xs 24 / md 8</Block>
      </Col>
    </Row>
  ),
};
