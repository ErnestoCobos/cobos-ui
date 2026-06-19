import { useState } from 'react';
import { Radio, RadioGroup, Space, Text } from '@cobos/react';
import type { RadioValueType } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function RadioDemo() {
  const [plan, setPlan] = useState<RadioValueType>('pro');
  const [shipping, setShipping] = useState<RadioValueType>('standard');

  return (
    <DemoStack>
      <Example title="Group" description="A single choice from a set.">
        <Space direction="vertical" align="start">
          <RadioGroup value={plan} onChange={setPlan}>
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
            <Radio value="enterprise" label="Enterprise" disabled />
          </RadioGroup>
          <Text type="info" size="small">
            Plan: {String(plan)}
          </Text>
        </Space>
      </Example>

      <Example title="Bordered">
        <RadioGroup value={shipping} onChange={setShipping}>
          <Radio value="standard" label="Standard" border />
          <Radio value="express" label="Express" border />
          <Radio value="overnight" label="Overnight" border />
        </RadioGroup>
      </Example>

      <Example title="Disabled group">
        <RadioGroup defaultValue="b" disabled>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
          <Radio value="c" label="Option C" />
        </RadioGroup>
      </Example>
    </DemoStack>
  );
}
