import type { Meta, StoryObj } from '@storybook/react-vite';
import { notification } from './Notification';
import { Button } from '../Button';
import { Space } from '../Space';

/**
 * `notification` is an imperative API rather than a declarative component, so
 * there is no element to control through args. Each story renders a trigger
 * that calls `notification(...)` or one of the typed helpers. Cards mount
 * themselves in a corner of the viewport and auto-dismiss.
 */
const meta = {
  title: 'Components/Notification',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Imperative notification cards. Call `notification(...)` or the typed helpers ' +
          '`notification.success`, `notification.warning`, `notification.info` and ' +
          '`notification.error` to show a card with an optional title and message. Cards ' +
          'stack in a configurable corner and each call returns a handle with `close()`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Button
        type="success"
        onClick={() =>
          notification.success({ title: 'Deployed', message: 'Release v2.4 is live.' })
        }
      >
        Success
      </Button>
      <Button
        type="warning"
        onClick={() =>
          notification.warning({ title: 'Quota', message: 'You have used 90% of your plan.' })
        }
      >
        Warning
      </Button>
      <Button
        type="info"
        onClick={() =>
          notification.info({ title: 'Heads up', message: 'Maintenance window at 02:00 UTC.' })
        }
      >
        Info
      </Button>
      <Button
        type="danger"
        onClick={() =>
          notification.error({ title: 'Build failed', message: 'See the logs for details.' })
        }
      >
        Error
      </Button>
    </Space>
  ),
};

export const Positions: Story = {
  render: () => (
    <Space wrap>
      <Button
        onClick={() =>
          notification({ title: 'Top right', message: 'Default corner.', position: 'top-right' })
        }
      >
        Top right
      </Button>
      <Button
        onClick={() =>
          notification({ title: 'Top left', message: 'Stacks here.', position: 'top-left' })
        }
      >
        Top left
      </Button>
      <Button
        onClick={() =>
          notification({
            title: 'Bottom right',
            message: 'Stacks here.',
            position: 'bottom-right',
          })
        }
      >
        Bottom right
      </Button>
      <Button
        onClick={() =>
          notification({
            title: 'Bottom left',
            message: 'Stacks here.',
            position: 'bottom-left',
          })
        }
      >
        Bottom left
      </Button>
    </Space>
  ),
};

export const Persistent: Story = {
  name: 'Persistent card',
  render: () => (
    <Space wrap>
      <Button
        type="primary"
        onClick={() =>
          notification({
            title: 'Action required',
            message: 'This card stays until you close it.',
            duration: 0,
          })
        }
      >
        Show persistent
      </Button>
      <Button onClick={() => notification.closeAll()}>Close all</Button>
    </Space>
  ),
};
