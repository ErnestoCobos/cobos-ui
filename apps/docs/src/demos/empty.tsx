import { Empty, Button, Card } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { PlusGlyph } from '../icons';

export default function EmptyDemo() {
  return (
    <DemoStack>
      <Example title="Default" description="The built-in illustration with default text.">
        <Card style={{ width: 360 }}>
          <Empty />
        </Card>
      </Example>

      <Example title="Custom description" description="Tailor the message to the context.">
        <Card style={{ width: 360 }}>
          <Empty description="No projects yet" />
        </Card>
      </Example>

      <Example title="With an action" description="Pair the empty state with a call to action.">
        <Card style={{ width: 360 }}>
          <Empty description="You have no saved reports">
            <Button type="primary" icon={PlusGlyph}>
              Create report
            </Button>
          </Empty>
        </Card>
      </Example>

      <Example title="Smaller image">
        <Card style={{ width: 360 }}>
          <Empty description="No results found" imageSize={80} />
        </Card>
      </Example>
    </DemoStack>
  );
}
