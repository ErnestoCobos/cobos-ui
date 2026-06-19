import { Popover, Button, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function PopoverDemo() {
  return (
    <DemoStack>
      <Example title="With a title" description="A titled panel with rich content, opened on click.">
        <Popover
          title="Deployment ready"
          width={260}
          content={
            <Text size="small">
              Build #482 passed all checks and is queued for the production rollout.
            </Text>
          }
        >
          <Button type="primary">View status</Button>
        </Popover>
      </Example>

      <Example title="Triggers" description="Open on hover, on click or on focus.">
        <Space wrap>
          <Popover trigger="hover" content="Opened on hover" width={180}>
            <Button>Hover</Button>
          </Popover>
          <Popover trigger="click" content="Toggled on click" width={180}>
            <Button>Click</Button>
          </Popover>
          <Popover trigger="focus" content="Opened on focus" width={180}>
            <Button>Focus</Button>
          </Popover>
        </Space>
      </Example>

      <Example title="Placements" description="Anchor the panel above or below the trigger.">
        <Space wrap>
          <Popover placement="top" content="Above the trigger" width={180}>
            <Button>Top</Button>
          </Popover>
          <Popover placement="bottom" content="Below the trigger" width={180}>
            <Button>Bottom</Button>
          </Popover>
          <Popover placement="right" content="Beside the trigger" width={180}>
            <Button>Right</Button>
          </Popover>
        </Space>
      </Example>
    </DemoStack>
  );
}
