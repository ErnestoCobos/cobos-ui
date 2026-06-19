import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading, loading } from './Loading';
import { Button } from '../Button';
import { Text } from '../Text';
import { Space } from '../Space';

/**
 * `Loading` ships both as a declarative mask component and as an imperative
 * service. The component overlays its children (or the viewport when
 * `fullscreen`); `loading.service(...)` returns a handle whose `close()`
 * tears the mask down, which is the natural fit for async work.
 */
const meta = {
  title: 'Components/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    text: { control: 'text' },
    fullscreen: { control: 'boolean' },
    background: { control: 'text' },
    spinner: { control: false },
  },
  args: {
    visible: true,
    text: 'Loading...',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A loading mask. Use the `<Loading>` component to cover a region (or the whole ' +
          'viewport with `fullscreen`), or call the imperative `loading.service({ ... })` ' +
          'which returns a handle with `close()` to dismiss the mask once work finishes.',
      },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverArea: Story = {
  name: 'Over a content area',
  render: (args) => (
    <Loading {...args} style={{ width: 320 }}>
      <div style={{ padding: 24 }}>
        <Text>This panel is masked while its data loads.</Text>
      </div>
    </Loading>
  ),
};

export const CustomText: Story = {
  name: 'Custom text and background',
  render: () => (
    <Loading
      text="Fetching your data"
      background="rgba(0, 0, 0, 0.7)"
      style={{ width: 320 }}
    >
      <div style={{ padding: 24, minHeight: 120 }}>
        <Text>Content underneath the dimmed mask.</Text>
      </div>
    </Loading>
  ),
};

export const ImperativeService: Story = {
  name: 'Imperative service',
  render: () => {
    const targetRef = useRef<HTMLDivElement>(null);

    const showFullscreen = () => {
      const instance = loading.service({ text: 'Loading the whole page...' });
      window.setTimeout(() => instance.close(), 1500);
    };

    const showOnTarget = () => {
      if (!targetRef.current) return;
      const instance = loading.service({
        target: targetRef.current,
        text: 'Loading area...',
      });
      window.setTimeout(() => instance.close(), 1500);
    };

    return (
      <Space direction="vertical" alignment="start">
        <Space wrap>
          <Button type="primary" onClick={showFullscreen}>
            Fullscreen (1.5s)
          </Button>
          <Button onClick={showOnTarget}>Mask the box (1.5s)</Button>
        </Space>
        <div
          ref={targetRef}
          style={{
            width: 280,
            minHeight: 120,
            border: '1px solid var(--ec-border-color)',
            borderRadius: 8,
            padding: 24,
          }}
        >
          <Text>This box gets masked by the service.</Text>
        </div>
      </Space>
    );
  },
};
