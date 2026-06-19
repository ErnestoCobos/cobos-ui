import { Icon, Space, Button } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { SearchGlyph, EditGlyph, DeleteGlyph, StarGlyph, UserGlyph } from '../icons';

export default function IconDemo() {
  return (
    <DemoStack>
      <Example title="Inline glyphs" description="Any SVG can be wrapped to inherit size and color.">
        <Space size="large" align="center">
          <Icon>{SearchGlyph}</Icon>
          <Icon>{EditGlyph}</Icon>
          <Icon>{DeleteGlyph}</Icon>
          <Icon>{StarGlyph}</Icon>
          <Icon>{UserGlyph}</Icon>
        </Space>
      </Example>

      <Example title="Sizes" description="Set an explicit pixel size.">
        <Space align="center" size="large">
          <Icon size={16}>{StarGlyph}</Icon>
          <Icon size={24}>{StarGlyph}</Icon>
          <Icon size={32}>{StarGlyph}</Icon>
          <Icon size={48}>{StarGlyph}</Icon>
        </Space>
      </Example>

      <Example title="Colors" description="Color falls back to currentColor.">
        <Space align="center" size="large">
          <Icon size={28} color="var(--ec-color-primary)">
            {StarGlyph}
          </Icon>
          <Icon size={28} color="var(--ec-color-success)">
            {StarGlyph}
          </Icon>
          <Icon size={28} color="var(--ec-color-warning)">
            {StarGlyph}
          </Icon>
          <Icon size={28} color="var(--ec-color-danger)">
            {StarGlyph}
          </Icon>
        </Space>
      </Example>

      <Example title="Spinning and in buttons" description="Animate with spin, or drop into a Button.">
        <Space align="center" size="large">
          <Icon size={28} spin color="var(--ec-color-primary)">
            {SearchGlyph}
          </Icon>
          <Button type="primary" icon={EditGlyph}>
            Edit
          </Button>
          <Button type="danger" plain icon={DeleteGlyph}>
            Delete
          </Button>
        </Space>
      </Example>
    </DemoStack>
  );
}
