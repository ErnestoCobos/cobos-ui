import { Progress, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function ProgressDemo() {
  return (
    <DemoStack>
      <Example title="Line" description="A horizontal bar with the percentage beside it.">
        <Space direction="vertical" fill size="large">
          <Progress percentage={30} />
          <Progress percentage={70} />
          <Progress percentage={100} status="success" />
        </Space>
      </Example>

      <Example title="Statuses" description="Color the bar by outcome.">
        <Space direction="vertical" fill size="large">
          <Progress percentage={100} status="success" />
          <Progress percentage={80} status="warning" />
          <Progress percentage={50} status="exception" />
        </Space>
      </Example>

      <Example title="Text inside the bar" description="Render the percentage within a thicker bar.">
        <Progress percentage={62} strokeWidth={20} textInside />
      </Example>

      <Example title="Circle and dashboard" description="Compact circular variants.">
        <Space wrap size="large" align="center">
          <Progress type="circle" percentage={75} />
          <Progress type="circle" percentage={100} status="success" />
          <Progress type="dashboard" percentage={48} />
        </Space>
      </Example>
    </DemoStack>
  );
}
