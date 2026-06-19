import { useState } from 'react';
import { Loading, loading, Button, Card, Text, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function LoadingDemo() {
  const [busy, setBusy] = useState(false);

  return (
    <DemoStack>
      <Example
        title="Mask a region"
        description="The component overlays a positioned parent while loading."
      >
        <Space direction="vertical">
          <Button type="primary" onClick={() => setBusy((v) => !v)}>
            {busy ? 'Stop loading' : 'Start loading'}
          </Button>
          <Loading visible={busy} text="Fetching metrics…">
            <Card header="Monthly report" style={{ width: 320 }}>
              <Text>Revenue, active users and churn for the current period.</Text>
            </Card>
          </Loading>
        </Space>
      </Example>

      <Example
        title="Fullscreen service"
        description="The imperative service masks the whole viewport; it closes itself after a moment."
      >
        <Button
          onClick={() => {
            const instance = loading.service({ text: 'Loading workspace…', fullscreen: true });
            window.setTimeout(() => instance.close(), 1500);
          }}
        >
          Show fullscreen mask
        </Button>
      </Example>
    </DemoStack>
  );
}
