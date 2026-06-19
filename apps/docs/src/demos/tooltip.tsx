import { Tooltip, Button, Space } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function TooltipDemo() {
  return (
    <DemoStack>
      <Example title="Placements" description="Position the tooltip on any of the four sides.">
        <Space wrap>
          <Tooltip content="Deploys the current branch" placement="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip content="Opens in a new tab" placement="bottom">
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip content="Previous revision" placement="left">
            <Button>Left</Button>
          </Tooltip>
          <Tooltip content="Next revision" placement="right">
            <Button>Right</Button>
          </Tooltip>
        </Space>
      </Example>

      <Example title="Effects" description="A dark tooltip for emphasis, or a light one to match surfaces.">
        <Space wrap>
          <Tooltip content="Dark theme tooltip" effect="dark">
            <Button type="primary">Dark</Button>
          </Tooltip>
          <Tooltip content="Light theme tooltip" effect="light">
            <Button>Light</Button>
          </Tooltip>
        </Space>
      </Example>

      <Example title="Triggers" description="Open on hover, on click or on focus.">
        <Space wrap>
          <Tooltip content="Shown while hovering" trigger="hover">
            <Button>Hover</Button>
          </Tooltip>
          <Tooltip content="Toggled by clicking" trigger="click">
            <Button>Click</Button>
          </Tooltip>
          <Tooltip content="Shown while focused" trigger="focus">
            <Button>Focus</Button>
          </Tooltip>
        </Space>
      </Example>

      <Example title="Without arrow">
        <Tooltip content="No arrow, larger offset" showArrow={false} offset={12}>
          <Button>Hover me</Button>
        </Tooltip>
      </Example>
    </DemoStack>
  );
}
