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
          <Switch value={on} onChange={setOn} aria-label="Toggle basic switch" />
          <Text type="info" size="small">
            {on ? 'On' : 'Off'}
          </Text>
        </Space>
      </Example>

      <Example title="With text" description="Describe each state.">
        <Space align="center">
          <Switch
            value={notify}
            onChange={setNotify}
            activeText="On"
            inactiveText="Off"
            aria-label="Notifications"
          />
          <Switch defaultValue inlinePrompt activeText="Y" inactiveText="N" aria-label="Inline prompt switch" />
        </Space>
      </Example>

      <Example title="With icons">
        <Switch
          defaultValue
          activeIcon={CheckGlyph}
          inactiveIcon={CloseGlyph}
          aria-label="Switch with icons"
        />
      </Example>

      <Example title="Sizes, loading and disabled">
        <Space align="center" wrap>
          <Switch defaultValue size="large" aria-label="Large switch" />
          <Switch defaultValue aria-label="Default switch" />
          <Switch defaultValue size="small" aria-label="Small switch" />
          <Switch defaultValue loading aria-label="Loading switch" />
          <Switch disabled aria-label="Disabled switch (off)" />
          <Switch disabled defaultValue aria-label="Disabled switch (on)" />
        </Space>
      </Example>
    </DemoStack>
  );
}
