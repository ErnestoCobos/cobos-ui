import { ConfigProvider, Button, Input, Select, Option, Space, Tag } from '@cobos/react';
import { Example, DemoStack } from './_demo';

function ControlRow({ context }: { context: string }) {
  return (
    <Space wrap align="center">
      <Button type="primary">Action</Button>
      <Input placeholder="Type here" aria-label={`Text input (${context})`} style={{ width: 160 }} />
      <Select placeholder="Pick one" aria-label={`Select (${context})`} style={{ width: 140 }}>
        <Option value="a">Alpha</Option>
        <Option value="b">Beta</Option>
        <Option value="c">Gamma</Option>
      </Select>
      <Tag type="primary">Tag</Tag>
    </Space>
  );
}

export default function ConfigProviderDemo() {
  return (
    <DemoStack>
      <Example title="Large size context" description="ConfigProvider sets the size of every descendant control.">
        <ConfigProvider size="large">
          <ControlRow context="large context" />
        </ConfigProvider>
      </Example>

      <Example title="Default size context">
        <ConfigProvider size="default">
          <ControlRow context="default context" />
        </ConfigProvider>
      </Example>

      <Example title="Small size context">
        <ConfigProvider size="small">
          <ControlRow context="small context" />
        </ConfigProvider>
      </Example>

      <Example title="Globally disabled" description="Disable an entire subtree of form controls.">
        <ConfigProvider disabled>
          <ControlRow context="disabled context" />
        </ConfigProvider>
      </Example>
    </DemoStack>
  );
}
