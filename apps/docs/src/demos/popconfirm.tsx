import { useState } from 'react';
import { Popconfirm, Button, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function PopconfirmDemo() {
  const [status, setStatus] = useState('—');

  return (
    <DemoStack>
      <Example
        title="Confirm a destructive action"
        description="A click opens an inline confirmation before the action runs."
      >
        <Space align="center">
          <Popconfirm
            title="Delete this project? This cannot be undone."
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            confirmButtonType="danger"
            onConfirm={() => setStatus('deleted')}
            onCancel={() => setStatus('cancelled')}
          >
            <Button type="danger">Delete project</Button>
          </Popconfirm>
          <Text type="info" size="small">
            last action: {status}
          </Text>
        </Space>
      </Example>

      <Example title="Placements" description="Anchor the confirm box around the trigger.">
        <Space wrap>
          <Popconfirm title="Confirm above?" placement="top">
            <Button>Top</Button>
          </Popconfirm>
          <Popconfirm title="Confirm below?" placement="bottom">
            <Button>Bottom</Button>
          </Popconfirm>
          <Popconfirm title="Confirm to the right?" placement="right">
            <Button>Right</Button>
          </Popconfirm>
        </Space>
      </Example>

      <Example title="Without the warning icon">
        <Popconfirm title="Mark all notifications as read?" hideIcon width={240}>
          <Button type="primary">Mark all read</Button>
        </Popconfirm>
      </Example>
    </DemoStack>
  );
}
