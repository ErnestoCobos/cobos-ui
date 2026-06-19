import { useState } from 'react';
import { Segmented, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function SegmentedDemo() {
  const [range, setRange] = useState<string | number>('weekly');
  const [view, setView] = useState<string | number>('list');

  return (
    <DemoStack>
      <Example title="Controlled options" description="A single-select control over a small option set.">
        <Space direction="vertical">
          <Segmented
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
            value={range}
            onChange={setRange}
            aria-label="Report range"
          />
          <Text type="info" size="small">
            range: {String(range)}
          </Text>
        </Space>
      </Example>

      <Example title="Plain string options" description="Strings act as both label and value.">
        <Segmented
          options={['List', 'Board', 'Calendar']}
          value={view}
          onChange={setView}
          aria-label="View mode"
        />
      </Example>

      <Example title="Sizes" description="Three sizes match the rest of the form controls.">
        <Space direction="vertical">
          <Segmented options={['One', 'Two', 'Three']} size="large" defaultValue="One" />
          <Segmented options={['One', 'Two', 'Three']} defaultValue="One" />
          <Segmented options={['One', 'Two', 'Three']} size="small" defaultValue="One" />
        </Space>
      </Example>

      <Example title="Disabled and block" description="Disable a segment or stretch to fill the width.">
        <Space direction="vertical" fill>
          <Segmented
            options={[
              { label: 'Free', value: 'free' },
              { label: 'Pro', value: 'pro' },
              { label: 'Enterprise', value: 'enterprise', disabled: true },
            ]}
            defaultValue="free"
            aria-label="Plan"
          />
          <Segmented options={['Overview', 'Activity', 'Settings']} block defaultValue="Overview" />
        </Space>
      </Example>
    </DemoStack>
  );
}
