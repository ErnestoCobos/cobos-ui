import { Text, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function TextDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="Semantic text colors.">
        <Space direction="vertical" align="start">
          <Text>Default text</Text>
          <Text type="primary">Primary text</Text>
          <Text type="success">Success text</Text>
          <Text type="warning">Warning text</Text>
          <Text type="danger">Danger text</Text>
          <Text type="info">Info text</Text>
        </Space>
      </Example>

      <Example title="Sizes">
        <Space align="baseline" size="large">
          <Text size="large">Large</Text>
          <Text>Default</Text>
          <Text size="small">Small</Text>
        </Space>
      </Example>

      <Example title="Truncation" description="Single-line ellipsis inside a fixed width.">
        <div style={{ width: 240 }}>
          <Text truncated>
            This is a long sentence that will be truncated with an ellipsis when it overflows the container.
          </Text>
        </div>
      </Example>

      <Example title="Line clamp" description="Clamp to a fixed number of lines.">
        <div style={{ width: 280 }}>
          <Text lineClamp={2}>
            Cobos UI is a token-first React design system. This paragraph is clamped to two lines, after which the
            remaining content is hidden behind an ellipsis to keep dense layouts tidy.
          </Text>
        </div>
      </Example>
    </DemoStack>
  );
}
