import { Collapse, CollapseItem, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function CollapseDemo() {
  return (
    <DemoStack>
      <Example
        title="Accordion"
        description="Only one panel stays open at a time."
      >
        <Collapse accordion defaultValue="shipping">
          <CollapseItem name="shipping" title="How long does shipping take?">
            <Text>Standard delivery arrives within 3–5 business days across the country.</Text>
          </CollapseItem>
          <CollapseItem name="returns" title="What is the return policy?">
            <Text>Items can be returned within 30 days of delivery for a full refund.</Text>
          </CollapseItem>
          <CollapseItem name="support" title="How do I contact support?">
            <Text>Reach the team via the in-app chat or by email; we reply within one day.</Text>
          </CollapseItem>
        </Collapse>
      </Example>

      <Example title="Multiple open" description="Open several panels at once.">
        <Collapse defaultValue={['overview', 'usage']}>
          <CollapseItem name="overview" title="Overview">
            <Text>A concise summary of the component and where to use it.</Text>
          </CollapseItem>
          <CollapseItem name="usage" title="Usage">
            <Text>Import from the package and compose it with the surrounding layout.</Text>
          </CollapseItem>
          <CollapseItem name="api" title="API">
            <Text>Every prop is typed and documented for editor autocompletion.</Text>
          </CollapseItem>
        </Collapse>
      </Example>

      <Example title="Disabled panel" description="A panel can be locked from toggling.">
        <Collapse defaultValue="general">
          <CollapseItem name="general" title="General settings">
            <Text>Workspace name, locale and time zone.</Text>
          </CollapseItem>
          <CollapseItem name="advanced" title="Advanced (admin only)" disabled>
            <Text>Restricted configuration.</Text>
          </CollapseItem>
        </Collapse>
      </Example>
    </DemoStack>
  );
}
