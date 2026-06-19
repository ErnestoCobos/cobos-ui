import { notification, Button, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function NotificationDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="A titled card that slides into a corner of the screen.">
        <Space wrap>
          <Button
            type="success"
            onClick={() =>
              notification.success({
                title: 'Deployment finished',
                message: 'Build #482 is live in production.',
              })
            }
          >
            Success
          </Button>
          <Button
            type="info"
            onClick={() =>
              notification.info({
                title: 'New comment',
                message: 'Grace Hopper mentioned you in “Q3 roadmap”.',
              })
            }
          >
            Info
          </Button>
          <Button
            type="warning"
            onClick={() =>
              notification.warning({
                title: 'Quota warning',
                message: 'You have used 90% of your monthly API calls.',
              })
            }
          >
            Warning
          </Button>
          <Button
            type="danger"
            onClick={() =>
              notification.error({
                title: 'Job failed',
                message: 'The nightly backup did not complete.',
              })
            }
          >
            Error
          </Button>
        </Space>
      </Example>

      <Example title="Positions" description="Stack notifications in any corner.">
        <Space wrap>
          <Button
            onClick={() =>
              notification({ title: 'Top left', message: 'Anchored top-left', position: 'top-left' })
            }
          >
            Top left
          </Button>
          <Button
            onClick={() =>
              notification({
                title: 'Bottom right',
                message: 'Anchored bottom-right',
                position: 'bottom-right',
              })
            }
          >
            Bottom right
          </Button>
        </Space>
      </Example>

      <Example title="Persistent" description="A duration of 0 keeps the card until closed.">
        <Button
          type="primary"
          onClick={() =>
            notification({
              title: 'Action required',
              message: 'Review the pending invitation before it expires.',
              duration: 0,
            })
          }
        >
          Stay open
        </Button>
      </Example>
    </DemoStack>
  );
}
