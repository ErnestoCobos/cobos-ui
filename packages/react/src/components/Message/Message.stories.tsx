import type { Meta, StoryObj } from '@storybook/react-vite';
import { message } from './Message';
import { Button } from '../Button';
import { Space } from '../Space';

/**
 * `message` is an imperative toast API rather than a declarative component, so
 * there is no element to control through args. Each story renders a trigger
 * that calls `message.success(...)`, `message.error(...)`, and friends. The
 * toast mounts itself near the top of the viewport and auto-dismisses.
 */
const meta = {
  title: 'Components/Message',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Imperative toast notifications. Call `message(...)` or the typed helpers ' +
          '`message.success`, `message.warning`, `message.info` and `message.error` to ' +
          'show a short, auto-dismissing message. Each call returns a handle with a ' +
          '`close()` method, and `message.closeAll()` clears the stack.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Button type="success" onClick={() => message.success('Changes saved')}>
        Success
      </Button>
      <Button type="warning" onClick={() => message.warning('Storage almost full')}>
        Warning
      </Button>
      <Button type="info" onClick={() => message.info('A new version is available')}>
        Info
      </Button>
      <Button type="danger" onClick={() => message.error('Something went wrong')}>
        Error
      </Button>
    </Space>
  ),
};

export const Closable: Story = {
  name: 'Closable and persistent',
  render: () => (
    <Space wrap>
      <Button
        onClick={() =>
          message.info({ message: 'Click the cross to dismiss me', showClose: true })
        }
      >
        Closable
      </Button>
      <Button
        onClick={() =>
          message.warning({
            message: 'I stay until closed',
            duration: 0,
            showClose: true,
          })
        }
      >
        Persistent
      </Button>
    </Space>
  ),
};

export const Stacked: Story = {
  name: 'Stacked messages',
  render: () => (
    <Space wrap>
      <Button
        type="primary"
        onClick={() => {
          message.success('First message');
          message.info('Second message');
          message.warning('Third message');
        }}
      >
        Show three
      </Button>
      <Button onClick={() => message.closeAll()}>Close all</Button>
    </Space>
  ),
};
