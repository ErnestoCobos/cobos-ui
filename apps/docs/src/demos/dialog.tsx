import { useState } from 'react';
import { Dialog, Button, Text, Space, Input } from '@cobos/react';
import { Example, DemoStack } from './_demo';

export default function DialogDemo() {
  const [basic, setBasic] = useState(false);
  const [form, setForm] = useState(false);
  const [centered, setCentered] = useState(false);
  const [name, setName] = useState('');

  return (
    <DemoStack>
      <Example title="Basic" description="A modal with a title and footer actions.">
        <Button type="primary" onClick={() => setBasic(true)}>
          Open dialog
        </Button>
        <Dialog
          open={basic}
          onClose={() => setBasic(false)}
          title="Release notes"
          width={420}
          footer={
            <Space>
              <Button onClick={() => setBasic(false)}>Close</Button>
              <Button type="primary" onClick={() => setBasic(false)}>
                Got it
              </Button>
            </Space>
          }
        >
          <Text>
            Wave 1 ships 25 stable components, each driven by the shared design tokens and ready for dark mode.
          </Text>
        </Dialog>
      </Example>

      <Example title="With a form inside">
        <Button onClick={() => setForm(true)}>Rename project</Button>
        <Dialog
          open={form}
          onClose={() => setForm(false)}
          title="Rename project"
          width={420}
          footer={
            <Space>
              <Button onClick={() => setForm(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setForm(false)}>
                Save
              </Button>
            </Space>
          }
        >
          <Input value={name} onChange={setName} placeholder="New project name" clearable />
        </Dialog>
      </Example>

      <Example title="Centered">
        <Button onClick={() => setCentered(true)}>Open centered</Button>
        <Dialog
          open={centered}
          onClose={() => setCentered(false)}
          title="Delete item?"
          alignCenter
          center
          width={380}
          footer={
            <Space>
              <Button onClick={() => setCentered(false)}>Cancel</Button>
              <Button type="danger" onClick={() => setCentered(false)}>
                Delete
              </Button>
            </Space>
          }
        >
          <Text>This action cannot be undone.</Text>
        </Dialog>
      </Example>
    </DemoStack>
  );
}
