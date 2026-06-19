import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { TabPane } from './TabPane';
import { Text } from '../Text';

function Pane({ children }: { children: ReactNode }) {
  return <div style={{ padding: '12px 4px' }}>{children}</div>;
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'card', 'border-card'] },
    tabPosition: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    closable: { control: 'boolean' },
    addable: { control: 'boolean' },
    editable: { control: 'boolean' },
    stretch: { control: 'boolean' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  name: 'Line (default)',
  render: () => {
    const [active, setActive] = useState('overview');
    return (
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
    );
  },
};

export const Card: Story = {
  name: 'Card type',
  render: () => (
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
  ),
};

export const BorderCardLeft: Story = {
  name: 'Border card, left position',
  render: () => (
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
  ),
};
