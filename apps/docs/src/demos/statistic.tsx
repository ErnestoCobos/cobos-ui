import { Statistic, Card, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function StatisticDemo() {
  return (
    <DemoStack>
      <Example title="Revenue figures" description="Currency values with a prefix and grouped thousands.">
        <Space wrap size="large">
          <Card style={{ width: 200 }}>
            <Statistic title="MRR" value={48250} prefix="$" precision={0} />
          </Card>
          <Card style={{ width: 200 }}>
            <Statistic title="ARR" value={579000} prefix="$" precision={0} />
          </Card>
        </Space>
      </Example>

      <Example title="Suffix and precision" description="Append a unit and control decimal places.">
        <Space wrap size="large">
          <Card style={{ width: 200 }}>
            <Statistic title="Net revenue retention" value={112.4} suffix="%" precision={1} />
          </Card>
          <Card style={{ width: 200 }}>
            <Statistic
              title="Average response"
              value={1.85}
              suffix="s"
              precision={2}
              valueStyle={{ color: 'var(--ec-color-success)' }}
            />
          </Card>
        </Space>
      </Example>

      <Example title="Plain counts" description="Whole numbers with a custom group separator.">
        <Space wrap size="large">
          <Card style={{ width: 200 }}>
            <Statistic title="Active users" value={1284567} groupSeparator="," />
          </Card>
          <Card style={{ width: 200 }}>
            <Statistic title="Open tickets" value={42} />
          </Card>
        </Space>
      </Example>
    </DemoStack>
  );
}
