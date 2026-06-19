import { Space, Button, Tag } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function SpaceDemo() {
  return (
    <DemoStack>
      <Example title="Horizontal" description="Consistent gaps between inline items.">
        <Space>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </Space>
      </Example>

      <Example title="Sizes" description="Named sizes map to 8 / 12 / 16px.">
        <Space direction="vertical" align="start">
          <Space size="small">
            <Tag>small</Tag>
            <Tag>small</Tag>
            <Tag>small</Tag>
          </Space>
          <Space size="default">
            <Tag>default</Tag>
            <Tag>default</Tag>
            <Tag>default</Tag>
          </Space>
          <Space size="large">
            <Tag>large</Tag>
            <Tag>large</Tag>
            <Tag>large</Tag>
          </Space>
        </Space>
      </Example>

      <Example title="Vertical">
        <Space direction="vertical" align="start">
          <Button type="primary">First</Button>
          <Button type="primary">Second</Button>
          <Button type="primary">Third</Button>
        </Space>
      </Example>

      <Example title="Wrapping" description="Wrap onto multiple lines in tight spaces.">
        <div style={{ maxWidth: 320 }}>
          <Space wrap size={8}>
            {Array.from({ length: 12 }, (_, i) => (
              <Tag key={i} type="info" effect="plain">
                Item {i + 1}
              </Tag>
            ))}
          </Space>
        </div>
      </Example>
    </DemoStack>
  );
}
