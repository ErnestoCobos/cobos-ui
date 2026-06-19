import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabPane } from './TabPane';
import { Tabs } from './Tabs';
import { Text } from '../Text';

const meta = {
  title: 'Components/TabPane',
  component: TabPane,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    closable: { control: 'boolean' },
    lazy: { control: 'boolean' },
  },
  args: {
    // Required prop; the story renders panes inside Tabs via `render`.
    name: 'one',
  },
} satisfies Meta<typeof TabPane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InsideTabs: Story = {
  name: 'Inside Tabs',
  render: () => (
    <Tabs defaultValue="one">
      <TabPane name="one" label="First">
        <div style={{ padding: '12px 4px' }}>
          <Text>First pane content.</Text>
        </div>
      </TabPane>
      <TabPane name="two" label="Second">
        <div style={{ padding: '12px 4px' }}>
          <Text>Second pane content.</Text>
        </div>
      </TabPane>
      <TabPane name="three" label="Disabled" disabled>
        <div style={{ padding: '12px 4px' }}>Disabled pane.</div>
      </TabPane>
    </Tabs>
  ),
};
