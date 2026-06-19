import { Badge, Button, Avatar, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { UserGlyph } from '../icons';

export default function BadgeDemo() {
  return (
    <DemoStack>
      <Example title="Count" description="Overlay a count on the corner of an element.">
        <Space wrap size="large">
          <Badge value={5}>
            <Button>Inbox</Button>
          </Badge>
          <Badge value={120} max={99}>
            <Button>Comments</Button>
          </Badge>
          <Badge value="new" type="success">
            <Button>Releases</Button>
          </Badge>
        </Space>
      </Example>

      <Example title="Dot" description="A small dot signals unread activity without a number.">
        <Space wrap size="large">
          <Badge isDot>
            <Button>Notifications</Button>
          </Badge>
          <Badge isDot type="danger">
            <Avatar icon={UserGlyph} />
          </Badge>
        </Space>
      </Example>

      <Example title="Types" description="Color variants for different intents.">
        <Space wrap size="large">
          <Badge value={1} type="primary">
            <Button>Primary</Button>
          </Badge>
          <Badge value={2} type="success">
            <Button>Success</Button>
          </Badge>
          <Badge value={3} type="warning">
            <Button>Warning</Button>
          </Badge>
          <Badge value={4} type="danger">
            <Button>Danger</Button>
          </Badge>
          <Badge value={5} type="info">
            <Button>Info</Button>
          </Badge>
        </Space>
      </Example>
    </DemoStack>
  );
}
