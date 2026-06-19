import { Avatar, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { UserGlyph } from '../icons';

export default function AvatarDemo() {
  return (
    <DemoStack>
      <Example title="Image" description="Sourced from a remote URL.">
        <Space align="center">
          <Avatar src="https://i.pravatar.cc/120?img=12" />
          <Avatar src="https://i.pravatar.cc/120?img=32" />
          <Avatar src="https://i.pravatar.cc/120?img=5" />
        </Space>
      </Example>

      <Example title="Text and icon fallbacks">
        <Space align="center">
          <Avatar>EC</Avatar>
          <Avatar style={{ background: 'var(--ec-color-primary)' }}>AL</Avatar>
          <Avatar icon={UserGlyph} />
        </Space>
      </Example>

      <Example title="Shapes">
        <Space align="center">
          <Avatar shape="circle">C</Avatar>
          <Avatar shape="square">S</Avatar>
          <Avatar shape="square" src="https://i.pravatar.cc/120?img=20" />
        </Space>
      </Example>

      <Example title="Sizes">
        <Space align="center">
          <Avatar size="large">L</Avatar>
          <Avatar>M</Avatar>
          <Avatar size="small">S</Avatar>
          <Avatar size={64}>64</Avatar>
        </Space>
      </Example>
    </DemoStack>
  );
}
