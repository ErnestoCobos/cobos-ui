import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapse, type CollapseValue } from './Collapse';
import { CollapseItem } from './CollapseItem';
import { Text } from '../Text';

const meta = {
  title: 'Components/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
    accordion: { control: 'boolean' },
    children: { control: false },
  },
  args: {
    accordion: false,
  },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <Collapse {...args} defaultValue={['1']}>
        <CollapseItem name="1" title="What is Cobos UI?">
          <Text>A design system of accessible, token-driven React components.</Text>
        </CollapseItem>
        <CollapseItem name="2" title="Does it support dark mode?">
          <Text>Yes. Every component reads from the shared design tokens.</Text>
        </CollapseItem>
        <CollapseItem name="3" title="Is it tree-shakeable?">
          <Text>Components are exported individually for optimal bundling.</Text>
        </CollapseItem>
      </Collapse>
    </div>
  ),
};

export const Accordion: Story = {
  name: 'Accordion mode',
  render: () => (
    <div style={{ width: 420 }}>
      <Collapse accordion defaultValue="a">
        <CollapseItem name="a" title="Only one panel open at a time">
          <Text>Opening another panel closes this one.</Text>
        </CollapseItem>
        <CollapseItem name="b" title="Second panel">
          <Text>Accordion mode keeps the layout compact.</Text>
        </CollapseItem>
        <CollapseItem name="c" title="Third panel">
          <Text>Great for FAQs and settings.</Text>
        </CollapseItem>
      </Collapse>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<CollapseValue>(['general']);
    return (
      <div style={{ width: 420 }}>
        <Collapse value={value} onChange={setValue}>
          <CollapseItem name="general" title="General">
            <Text>General preferences and defaults.</Text>
          </CollapseItem>
          <CollapseItem name="privacy" title="Privacy">
            <Text>Control what data is shared.</Text>
          </CollapseItem>
          <CollapseItem name="advanced" title="Advanced (disabled)" disabled>
            <Text>Reserved for power users.</Text>
          </CollapseItem>
        </Collapse>
      </div>
    );
  },
};
