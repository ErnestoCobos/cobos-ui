import { useState } from 'react';
import { Skeleton, Card, Button, Text, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <DemoStack>
      <Example
        title="Toggle loading"
        description="Show a placeholder while content loads, then reveal the real content."
      >
        <Space direction="vertical">
          <Button type="primary" onClick={() => setLoading((v) => !v)}>
            {loading ? 'Show content' : 'Show placeholder'}
          </Button>
          <Card style={{ width: 360 }}>
            <Skeleton loading={loading} rows={4} animated>
              <Text>
                The quarterly report summarises revenue, active users and churn, with a breakdown by
                plan and region.
              </Text>
            </Skeleton>
          </Card>
        </Space>
      </Example>

      <Example title="Row count" description="Control how many lines the placeholder renders.">
        <Card style={{ width: 360 }}>
          <Skeleton rows={6} animated />
        </Card>
      </Example>

      <Example title="Repeated template" description="Repeat the placeholder for list items.">
        <Card style={{ width: 360 }}>
          <Skeleton rows={2} count={3} animated />
        </Card>
      </Example>
    </DemoStack>
  );
}
