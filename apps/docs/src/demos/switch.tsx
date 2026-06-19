import { useState } from 'react';
import { Switch, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { CheckGlyph, CloseGlyph } from '../icons';

export default function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [notify, setNotify] = useState(false);

  return (
    <DemoStack>
      <Example title="Basic">
        <Space align="center">
          <Switch value={on} onChange={setOn} />
          <Text type="info" size="small">
            {on ? 'On' : 'Off'}
          </Text>
        </Space>
      </Example>

      <Example title="With text" description="Describe each state.">
        <Space align="center">
          <Switch value={notify} onChange={setNotify} activeText="On" inactiveText="Off" />
          <Switch defaultValue inlinePrompt activeText="Y" inactiveText="N" />
        </Space>
      </Example>

      <Example title="With icons">
        <Switch defaultValue activeIcon={CheckGlyph} inactiveIcon={CloseGlyph} />
      </Example>

      <Example title="Sizes, loading and disabled">
        <Space align="center" wrap>
          <Switch defaultValue size="large" />
          <Switch defaultValue />
          <Switch defaultValue size="small" />
          <Switch defaultValue loading />
          <Switch disabled />
          <Switch disabled defaultValue />
        </Space>
      </Example>
    </DemoStack>
  );
}
