import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';
import { Button } from '../Button';
import { Space } from '../Space';

const TYPES = ['primary', 'success', 'info', 'warning', 'danger'] as const;

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['primary', 'success', 'info', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['large', 'default', 'small'] },
    effect: { control: 'inline-radio', options: ['dark', 'light', 'plain'] },
    round: { control: 'boolean' },
    closable: { control: 'boolean' },
    hit: { control: 'boolean' },
    color: { control: 'color' },
  },
  args: {
    children: 'Tag',
    type: 'primary',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <Space wrap>
      <Tag>Default</Tag>
      {TYPES.map((t) => (
        <Tag key={t} type={t}>
          {t}
        </Tag>
      ))}
    </Space>
  ),
};

export const Effects: Story = {
  render: () => (
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
  ),
};

export const SizesAndRound: Story = {
  name: 'Sizes and round',
  render: () => (
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
  ),
};

export const Closable: Story = {
  render: () => {
    const initial = ['Design', 'Tokens', 'React', 'Dark mode'];
    const [tags, setTags] = useState(initial);
    return (
      <Space wrap align="center">
        {tags.map((tag) => (
          <Tag
            key={tag}
            type="primary"
            effect="light"
            closable
            onClose={() => setTags(tags.filter((t) => t !== tag))}
          >
            {tag}
          </Tag>
        ))}
        {tags.length === 0 ? (
          <Button size="small" onClick={() => setTags(initial)}>
            Restore
          </Button>
        ) : null}
      </Space>
    );
  },
};
