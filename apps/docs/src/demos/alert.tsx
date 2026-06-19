import { Alert, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function AlertDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="Four semantic variants for every intent.">
        <Space direction="vertical" fill>
          <Alert type="success" title="Payment received" showIcon closable={false} />
          <Alert type="info" title="A new version is available" showIcon closable={false} />
          <Alert type="warning" title="Your trial ends in 3 days" showIcon closable={false} />
          <Alert type="error" title="Card declined" showIcon closable={false} />
        </Space>
      </Example>

      <Example title="Light and dark effects" description="Two theme intensities per type.">
        <Space direction="vertical" fill>
          <Alert type="success" title="Light effect" effect="light" showIcon closable={false} />
          <Alert type="success" title="Dark effect" effect="dark" showIcon closable={false} />
        </Space>
      </Example>

      <Example title="With a description" description="A title plus a longer explanation.">
        <Alert
          type="info"
          title="Scheduled maintenance"
          description="The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC."
          showIcon
          closable={false}
        />
      </Example>

      <Example title="Closable" description="Dismiss the banner with the close affordance.">
        <Space direction="vertical" fill>
          <Alert type="warning" title="Click the cross to dismiss" showIcon />
          <Alert type="error" title="Dismiss with custom text" closeText="Got it" />
        </Space>
      </Example>
    </DemoStack>
  );
}
