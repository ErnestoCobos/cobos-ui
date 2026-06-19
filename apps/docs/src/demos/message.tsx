import { message, Button, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function MessageDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="A lightweight toast that auto-dismisses after a few seconds.">
        <Space wrap>
          <Button type="success" onClick={() => message.success('Changes saved')}>
            Success
          </Button>
          <Button type="info" onClick={() => message.info('Sync in progress')}>
            Info
          </Button>
          <Button type="warning" onClick={() => message.warning('Storage almost full')}>
            Warning
          </Button>
          <Button type="danger" onClick={() => message.error('Failed to publish')}>
            Error
          </Button>
        </Space>
      </Example>

      <Example title="Closable and centered" description="Keep the toast until dismissed.">
        <Space wrap>
          <Button
            onClick={() =>
              message({ message: 'Tap the cross to dismiss', showClose: true, duration: 0 })
            }
          >
            Closable
          </Button>
          <Button onClick={() => message({ message: 'Centered toast', center: true })}>
            Centered
          </Button>
        </Space>
      </Example>

      <Example title="Stacked" description="Multiple toasts stack from the top.">
        <Button
          type="primary"
          onClick={() => {
            message.info('Queued export');
            message.success('Export complete');
          }}
        >
          Show two
        </Button>
      </Example>
    </DemoStack>
  );
}
