import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, Button, Space, Text } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { EditGlyph, DeleteGlyph, PlusGlyph } from '../icons';

export default function DropdownDemo() {
  const [last, setLast] = useState('—');

  const menu = (
    <DropdownMenu>
      <DropdownItem command="new" icon={PlusGlyph}>
        New item
      </DropdownItem>
      <DropdownItem command="edit" icon={EditGlyph}>
        Edit
      </DropdownItem>
      <DropdownItem command="duplicate">Duplicate</DropdownItem>
      <DropdownItem command="delete" icon={DeleteGlyph} divided>
        Delete
      </DropdownItem>
    </DropdownMenu>
  );

  return (
    <DemoStack>
      <Example title="Hover trigger" description="Commands flow through onCommand.">
        <Space align="center">
          <Dropdown menu={menu} onCommand={(c) => setLast(String(c))}>
            <Button type="primary">Actions</Button>
          </Dropdown>
          <Text type="info" size="small">
            last command: {last}
          </Text>
        </Space>
      </Example>

      <Example title="Click trigger">
        <Dropdown trigger="click" menu={menu} onCommand={(c) => setLast(String(c))}>
          <Button>Open on click</Button>
        </Dropdown>
      </Example>
    </DemoStack>
  );
}
