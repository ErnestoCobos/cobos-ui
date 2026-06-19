import { useState } from 'react';
import { Steps, Step, Button, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function StepsDemo() {
  const [active, setActive] = useState(1);
  const total = 4;

  return (
    <DemoStack>
      <Example
        title="Horizontal"
        description="A four-step flow; advance and step back to move the active marker."
      >
        <Space direction="vertical" fill size="large">
          <Steps active={active}>
            <Step title="Account" description="Create your login" />
            <Step title="Profile" description="Add your details" />
            <Step title="Billing" description="Choose a plan" />
            <Step title="Done" description="Start building" />
          </Steps>
          <Space>
            <Button onClick={() => setActive((v) => Math.max(0, v - 1))} disabled={active === 0}>
              Back
            </Button>
            <Button
              type="primary"
              onClick={() => setActive((v) => Math.min(total - 1, v + 1))}
              disabled={active === total - 1}
            >
              Next
            </Button>
          </Space>
        </Space>
      </Example>

      <Example title="Vertical" description="The same flow stacked vertically.">
        <Steps active={2} direction="vertical">
          <Step title="Submitted" description="Order placed" />
          <Step title="Packed" description="Items prepared" />
          <Step title="Shipped" description="In transit" />
          <Step title="Delivered" description="At your door" />
        </Steps>
      </Example>

      <Example title="With an error" description="Mark a step as failed with an explicit status.">
        <Steps active={2}>
          <Step title="Validate" />
          <Step title="Build" />
          <Step title="Deploy" status="error" description="Failed" />
          <Step title="Verify" />
        </Steps>
      </Example>
    </DemoStack>
  );
}
