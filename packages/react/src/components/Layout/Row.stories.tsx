import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Row } from './Row';
import { Col } from './Col';

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
  title: 'Components/Layout/Row',
  component: Row,
  tags: ['autodocs'],
  argTypes: {
    gutter: { control: 'number' },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'],
    },
    align: { control: 'inline-radio', options: ['top', 'middle', 'bottom'] },
    tag: { control: false },
  },
  args: {
    gutter: 16,
    justify: 'start',
  },
  render: (args) => (
    <Row {...args}>
      {[0, 1, 2, 3].map((i) => (
        <Col span={6} key={i}>
          <Block>span 6</Block>
        </Col>
      ))}
    </Row>
  ),
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Justify: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['start', 'center', 'space-between', 'space-around'] as const).map((j) => (
        <Row gutter={8} justify={j} key={j}>
          <Col span={4}>
            <Block dark>{j}</Block>
          </Col>
          <Col span={4}>
            <Block>{j}</Block>
          </Col>
          <Col span={4}>
            <Block dark>{j}</Block>
          </Col>
        </Row>
      ))}
    </div>
  ),
};
