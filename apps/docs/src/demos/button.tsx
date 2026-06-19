import { Button, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { SearchGlyph } from '../icons';

export default function ButtonDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="Semantic variants for every intent.">
        <Space wrap>
          <Button>Default</Button>
          <Button type="primary">Primary</Button>
          <Button type="success">Success</Button>
          <Button type="info">Info</Button>
          <Button type="warning">Warning</Button>
          <Button type="danger">Danger</Button>
        </Space>
      </Example>

      <Example title="Plain, round and circle" description="Outlined, pill and icon-only shapes.">
        <Space wrap>
          <Button type="primary" plain>
            Plain
          </Button>
          <Button type="success" round>
            Round
          </Button>
          <Button type="primary" icon={SearchGlyph} circle aria-label="Search" />
          <Button type="primary" icon={SearchGlyph}>
            Search
          </Button>
        </Space>
      </Example>

      <Example title="Text and link" description="Lightweight, chromeless actions.">
        <Space wrap>
          <Button text>Text</Button>
          <Button text bg>
            Text with background
          </Button>
          <Button link type="primary">
            Link
          </Button>
        </Space>
      </Example>

      <Example title="Sizes">
        <Space wrap align="center">
          <Button size="large" type="primary">
            Large
          </Button>
          <Button type="primary">Default</Button>
          <Button size="small" type="primary">
            Small
          </Button>
        </Space>
      </Example>

      <Example title="Loading and disabled">
        <Space wrap>
          <Button type="primary" loading>
            Loading
          </Button>
          <Button type="primary" disabled>
            Disabled
          </Button>
        </Space>
      </Example>
    </DemoStack>
  );
}
