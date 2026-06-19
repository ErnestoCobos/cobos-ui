import { useState } from 'react';
import { Tag, Space, Button } from '@cobos/react';
import { Example, DemoStack } from './_demo';

const TYPES = ['primary', 'success', 'info', 'warning', 'danger'] as const;

export default function TagDemo() {
  const [tags, setTags] = useState(['Design', 'Tokens', 'React', 'Dark mode']);

  return (
    <DemoStack>
      <Example title="Types">
        <Space wrap>
          <Tag>Default</Tag>
          {TYPES.map((t) => (
            <Tag key={t} type={t}>
              {t}
            </Tag>
          ))}
        </Space>
      </Example>

      <Example title="Effects" description="dark · light · plain.">
        <Space direction="vertical" align="start">
          {(['dark', 'light', 'plain'] as const).map((effect) => (
            <Space key={effect} wrap>
              {TYPES.map((t) => (
                <Tag key={t} type={t} effect={effect}>
                  {t}
                </Tag>
              ))}
            </Space>
          ))}
        </Space>
      </Example>

      <Example title="Sizes and round">
        <Space align="center" wrap>
          <Tag type="primary" size="large">
            Large
          </Tag>
          <Tag type="primary">Default</Tag>
          <Tag type="primary" size="small">
            Small
          </Tag>
          <Tag type="primary" round>
            Round
          </Tag>
        </Space>
      </Example>

      <Example title="Closable" description="Remove tags interactively.">
        <Space wrap align="center">
          {tags.map((tag) => (
            <Tag key={tag} type="primary" effect="light" closable onClose={() => setTags(tags.filter((t) => t !== tag))}>
              {tag}
            </Tag>
          ))}
          {tags.length === 0 ? (
            <Button size="small" onClick={() => setTags(['Design', 'Tokens', 'React', 'Dark mode'])}>
              Restore
            </Button>
          ) : null}
        </Space>
      </Example>
    </DemoStack>
  );
}
