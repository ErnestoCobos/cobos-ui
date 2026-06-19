import { useState } from 'react';
import { Tabs, TabPane, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

function Pane({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '12px 4px' }}>{children}</div>;
}

export default function TabsDemo() {
  const [active, setActive] = useState('overview');

  return (
    <DemoStack>
      <Example title="Line (default)">
        <Tabs value={active} onChange={setActive}>
          <TabPane name="overview" label="Overview">
            <Pane>
              <Text>The overview tab summarizes the project at a glance.</Text>
            </Pane>
          </TabPane>
          <TabPane name="activity" label="Activity">
            <Pane>
              <Text>Recent commits, reviews and releases live here.</Text>
            </Pane>
          </TabPane>
          <TabPane name="settings" label="Settings">
            <Pane>
              <Text>Configuration and access controls.</Text>
            </Pane>
          </TabPane>
          <TabPane name="archived" label="Archived" disabled>
            <Pane>Disabled</Pane>
          </TabPane>
        </Tabs>
      </Example>

      <Example title="Card type">
        <Tabs type="card" defaultValue="a">
          <TabPane name="a" label="Drafts">
            <Pane>3 drafts waiting for review.</Pane>
          </TabPane>
          <TabPane name="b" label="Published">
            <Pane>128 published articles.</Pane>
          </TabPane>
          <TabPane name="c" label="Trash">
            <Pane>Items here are deleted after 30 days.</Pane>
          </TabPane>
        </Tabs>
      </Example>

      <Example title="Border card, left position">
        <Tabs type="border-card" tabPosition="left" defaultValue="profile">
          <TabPane name="profile" label="Profile">
            <Pane>Profile details.</Pane>
          </TabPane>
          <TabPane name="security" label="Security">
            <Pane>Password and 2FA.</Pane>
          </TabPane>
          <TabPane name="billing" label="Billing">
            <Pane>Plans and invoices.</Pane>
          </TabPane>
        </Tabs>
      </Example>
    </DemoStack>
  );
}
