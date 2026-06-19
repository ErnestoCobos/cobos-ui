import { useState } from 'react';
import { Drawer, Button, Space, Text, Input } from '@cobos/react';
import type { DrawerDirection } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<DrawerDirection>('rtl');
  const [settings, setSettings] = useState(false);
  const [name, setName] = useState('Marketing site');

  const openFrom = (dir: DrawerDirection) => {
    setDirection(dir);
    setOpen(true);
  };

  return (
    <DemoStack>
      <Example title="Slide-in directions" description="Open the panel from any edge of the screen.">
        <Space wrap>
          <Button onClick={() => openFrom('rtl')}>From right</Button>
          <Button onClick={() => openFrom('ltr')}>From left</Button>
          <Button onClick={() => openFrom('ttb')}>From top</Button>
          <Button onClick={() => openFrom('btt')}>From bottom</Button>
        </Space>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Activity"
          direction={direction}
          size={320}
        >
          <Text>
            A slide-in panel for secondary content such as filters, details or activity feeds.
          </Text>
        </Drawer>
      </Example>

      <Example title="With a footer" description="Pair a form with confirm and cancel actions.">
        <Button type="primary" onClick={() => setSettings(true)}>
          Edit project
        </Button>
        <Drawer
          open={settings}
          onClose={() => setSettings(false)}
          title="Project settings"
          size={360}
          footer={
            <Space>
              <Button onClick={() => setSettings(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setSettings(false)}>
                Save
              </Button>
            </Space>
          }
        >
          <Input
            value={name}
            onChange={setName}
            placeholder="Project name"
            aria-label="Project name"
            clearable
          />
        </Drawer>
      </Example>
    </DemoStack>
  );
}
