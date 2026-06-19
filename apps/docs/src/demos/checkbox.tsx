import { useState } from 'react';
import { Checkbox, CheckboxGroup, Space, Text } from '@cobos/react';
import type { CheckboxValueType } from '@cobos/react';
import { Example, DemoStack } from './_demo';

const CITIES = ['Mexico City', 'Tokyo', 'Berlin', 'Lisbon'];

export default function CheckboxDemo() {
  const [single, setSingle] = useState(true);
  const [group, setGroup] = useState<CheckboxValueType[]>(['Tokyo']);

  const all = group.length === CITIES.length;
  const indeterminate = group.length > 0 && !all;

  return (
    <DemoStack>
      <Example title="Standalone">
        <Space>
          <Checkbox checked={single} onChange={setSingle}>
            Subscribe to updates
          </Checkbox>
        </Space>
      </Example>

      <Example title="Group with select-all" description="Indeterminate master checkbox.">
        <Space direction="vertical" align="start">
          <Checkbox
            indeterminate={indeterminate}
            checked={all}
            onChange={(checked) => setGroup(checked ? [...CITIES] : [])}
          >
            Select all
          </Checkbox>
          <CheckboxGroup value={group} onChange={setGroup}>
            {CITIES.map((city) => (
              <Checkbox key={city} value={city} label={city} />
            ))}
          </CheckboxGroup>
          <Text type="info" size="small">
            {group.length} selected
          </Text>
        </Space>
      </Example>

      <Example title="Bordered and disabled">
        <Space wrap>
          <Checkbox border defaultChecked label="Bordered" />
          <Checkbox border label="Bordered" />
          <Checkbox disabled label="Disabled" />
          <Checkbox disabled defaultChecked label="Disabled checked" />
        </Space>
      </Example>
    </DemoStack>
  );
}
