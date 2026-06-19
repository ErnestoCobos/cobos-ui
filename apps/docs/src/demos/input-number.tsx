import { useState } from 'react';
import { InputNumber, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function InputNumberDemo() {
  const [count, setCount] = useState<number | null>(3);
  const [bounded, setBounded] = useState<number | null>(5);
  const [price, setPrice] = useState<number | null>(19.99);

  return (
    <DemoStack>
      <Example title="Basic" description="Stepper with controlled value.">
        <Space align="center">
          <InputNumber value={count ?? undefined} onChange={setCount} aria-label="Count" />
          <Text type="info" size="small">
            value: {count ?? 'null'}
          </Text>
        </Space>
      </Example>

      <Example title="Min, max and step" description="Bounded between 0 and 10, step 2.">
        <InputNumber
          value={bounded ?? undefined}
          onChange={setBounded}
          min={0}
          max={10}
          step={2}
          aria-label="Bounded value between 0 and 10"
        />
      </Example>

      <Example title="Precision" description="Fixed to two decimal places.">
        <InputNumber
          value={price ?? undefined}
          onChange={setPrice}
          precision={2}
          step={0.5}
          min={0}
          aria-label="Price"
        />
      </Example>

      <Example title="Controls on the right and sizes">
        <Space direction="vertical" align="start">
          <InputNumber defaultValue={1} controlsPosition="right" aria-label="Number with right controls" />
          <Space align="center">
            <InputNumber size="large" defaultValue={1} aria-label="Large number input" />
            <InputNumber defaultValue={1} aria-label="Default number input" />
            <InputNumber size="small" defaultValue={1} aria-label="Small number input" />
          </Space>
        </Space>
      </Example>
    </DemoStack>
  );
}
