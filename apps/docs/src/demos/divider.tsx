import { Divider, Text, Link } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function DividerDemo() {
  return (
    <DemoStack>
      <Example title="Horizontal" description="Separate stacked blocks of content.">
        <div>
          <Text>
            Cobos UI ports the full Element Plus surface to React, one wave at a time.
          </Text>
          <Divider />
          <Text>Every component is driven by design tokens and supports dark mode out of the box.</Text>
        </div>
      </Example>

      <Example title="With text" description="Label position: left, center or right.">
        <div>
          <Divider contentPosition="left">Left</Divider>
          <Divider>Center</Divider>
          <Divider contentPosition="right">Right</Divider>
        </div>
      </Example>

      <Example title="Dashed">
        <Divider borderStyle="dashed">Dashed</Divider>
      </Example>

      <Example title="Vertical" description="Inline separators between items.">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="#" type="primary">
            Docs
          </Link>
          <Divider direction="vertical" />
          <Link href="#" type="primary">
            Catalog
          </Link>
          <Divider direction="vertical" />
          <Link href="#" type="primary">
            GitHub
          </Link>
        </div>
      </Example>
    </DemoStack>
  );
}
