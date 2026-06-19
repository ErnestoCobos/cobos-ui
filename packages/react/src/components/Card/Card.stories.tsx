import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { Text } from '../Text';
import { Space } from '../Space';
import { Row } from '../Layout/Row';
import { Col } from '../Layout/Col';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    shadow: { control: 'inline-radio', options: ['always', 'hover', 'never'] },
    header: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <Text>
        Cards group related content and actions. They sit on the page background with a subtle
        border and radius from the design tokens.
      </Text>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  name: 'With header and footer',
  render: () => (
    <Card
      style={{ maxWidth: 360 }}
      header={
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text size="large" tag="strong">
            Project Atlas
          </Text>
          <Tag type="success" size="small">
            Active
          </Tag>
        </Space>
      }
      footer={
        <Space>
          <Button type="primary" size="small">
            Open
          </Button>
          <Button size="small">Details</Button>
        </Space>
      }
    >
      <Text type="info">A token-first migration of the component surface to React.</Text>
    </Card>
  ),
};

export const ShadowModes: Story = {
  name: 'Shadow modes',
  render: () => (
    <Row gutter={16}>
      {(['always', 'hover', 'never'] as const).map((shadow) => (
        <Col xs={24} sm={8} key={shadow}>
          <Card shadow={shadow}>
            <Text tag="strong">{shadow}</Text>
            <br />
            <Text type="info" size="small">
              shadow=&quot;{shadow}&quot;
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  ),
};
