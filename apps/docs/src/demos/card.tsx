import { Card, Button, Tag, Text, Space, Row, Col } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function CardDemo() {
  return (
    <DemoStack>
      <Example title="Basic" description="A simple content container.">
        <Card style={{ maxWidth: 360 }}>
          <Text>
            Cards group related content and actions. They sit on the page background with a subtle border and radius
            from the design tokens.
          </Text>
        </Card>
      </Example>

      <Example title="With header and footer">
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
          <Text type="info">A token-first migration of the Element Plus component surface to React.</Text>
        </Card>
      </Example>

      <Example title="Shadow modes" description="always · hover · never.">
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
      </Example>
    </DemoStack>
  );
}
