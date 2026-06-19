import { Link, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { EditGlyph } from '../icons';

export default function LinkDemo() {
  return (
    <DemoStack>
      <Example title="Types" description="Semantic link colors.">
        <Space wrap size="large">
          <Link href="#" type="default">
            Default
          </Link>
          <Link href="#" type="primary">
            Primary
          </Link>
          <Link href="#" type="success">
            Success
          </Link>
          <Link href="#" type="warning">
            Warning
          </Link>
          <Link href="#" type="danger">
            Danger
          </Link>
          <Link href="#" type="info">
            Info
          </Link>
        </Space>
      </Example>

      <Example title="Underline and disabled">
        <Space wrap size="large">
          <Link href="#" type="primary" underline>
            Underline on hover
          </Link>
          <Link href="#" type="primary" disabled>
            Disabled
          </Link>
        </Space>
      </Example>

      <Example title="With icon and target" description="Open external references in a new tab.">
        <Space wrap size="large">
          <Link href="#" type="primary" icon={EditGlyph}>
            Edit profile
          </Link>
          <Link href="https://ui.cobos.io" type="primary" target="_blank" rel="noreferrer">
            ui.cobos.io
          </Link>
        </Space>
      </Example>
    </DemoStack>
  );
}
