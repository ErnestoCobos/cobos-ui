/**
 * Minimal, illustrative usage examples synthesized for each component. These
 * are intentionally small and valid TSX; they complement the canonical `usage`
 * import snippet shipped in the registry detail documents.
 */
import type { RegistryIndexEntry } from './registry.js';

/** Hand-tuned examples for components whose markup benefits from extra context. */
const CURATED: Record<string, string> = {
  button: `<Button type="primary" onClick={() => console.log('clicked')}>\n  Click me\n</Button>`,
  icon: `<Icon size={20} color="var(--ec-color-primary)">\n  <svg viewBox="0 0 1024 1024"><path d="M512 64 ..." /></svg>\n</Icon>`,
  layout: `<Row gutter={16}>\n  <Col span={12}>Left</Col>\n  <Col span={12}>Right</Col>\n</Row>`,
  container: `<Container>\n  <Header>Header</Header>\n  <Main>Main content</Main>\n  <Footer>Footer</Footer>\n</Container>`,
  link: `<Link type="primary" href="https://ui.cobos.io">\n  Cobos UI\n</Link>`,
  text: `<Text type="primary" size="large">\n  Hello from Cobos UI\n</Text>`,
  space: `<Space size="large">\n  <Button>One</Button>\n  <Button>Two</Button>\n</Space>`,
  'config-provider': `<ConfigProvider size="large">\n  <Button>Large by context</Button>\n</ConfigProvider>`,
  input: `function Demo() {\n  const [value, setValue] = useState('');\n  return (\n    <Input\n      value={value}\n      placeholder="Type here"\n      clearable\n      onChange={setValue}\n    />\n  );\n}`,
  'input-number': `function Demo() {\n  const [value, setValue] = useState(1);\n  return <InputNumber value={value} min={0} max={10} onChange={setValue} />;\n}`,
  select: `function Demo() {\n  const [value, setValue] = useState('');\n  return (\n    <Select value={value} placeholder="Pick one" onChange={setValue}>\n      <Option value="a" label="Option A" />\n      <Option value="b" label="Option B" />\n    </Select>\n  );\n}`,
  checkbox: `function Demo() {\n  const [checked, setChecked] = useState(false);\n  return (\n    <Checkbox checked={checked} onChange={setChecked}>\n      Accept terms\n    </Checkbox>\n  );\n}`,
  radio: `function Demo() {\n  const [value, setValue] = useState('a');\n  return (\n    <RadioGroup value={value} onChange={setValue}>\n      <Radio value="a">A</Radio>\n      <Radio value="b">B</Radio>\n    </RadioGroup>\n  );\n}`,
  switch: `function Demo() {\n  const [on, setOn] = useState(false);\n  return <Switch value={on} onChange={setOn} />;\n}`,
  form: `function Demo() {\n  const [model, setModel] = useState({ name: '' });\n  return (\n    <Form model={model} labelWidth={80}>\n      <FormItem label="Name" prop="name">\n        <Input\n          value={model.name}\n          onChange={(value) => setModel({ name: value })}\n        />\n      </FormItem>\n    </Form>\n  );\n}`,
  avatar: `<Avatar src="https://example.com/avatar.png" size={40} />`,
  card: `<Card header="Card title" shadow="hover">\n  Card body content\n</Card>`,
  table: `<Table\n  data={[{ id: 1, name: 'Ada' }]}\n  columns={[\n    { prop: 'id', label: 'ID' },\n    { prop: 'name', label: 'Name' },\n  ]}\n/>`,
  tag: `<Tag type="success" closable onClose={() => {}}>\n  Active\n</Tag>`,
  pagination: `function Demo() {\n  const [page, setPage] = useState(1);\n  return <Pagination currentPage={page} pageSize={10} total={120} onCurrentChange={setPage} />;\n}`,
  tabs: `function Demo() {\n  const [active, setActive] = useState('first');\n  return (\n    <Tabs value={active} onChange={setActive}>\n      <TabPane name="first" label="First">First panel</TabPane>\n      <TabPane name="second" label="Second">Second panel</TabPane>\n    </Tabs>\n  );\n}`,
  menu: `function Demo() {\n  const [active, setActive] = useState('1');\n  return (\n    <Menu value={active} onSelect={setActive}>\n      <MenuItem index="1">Dashboard</MenuItem>\n      <MenuItem index="2">Settings</MenuItem>\n    </Menu>\n  );\n}`,
  dropdown: `<Dropdown\n  trigger="click"\n  menu={\n    <DropdownMenu>\n      <DropdownItem>Edit</DropdownItem>\n      <DropdownItem>Delete</DropdownItem>\n    </DropdownMenu>\n  }\n>\n  <Button>Actions</Button>\n</Dropdown>`,
  dialog: `function Demo() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Open</Button>\n      <Dialog open={open} title="Hello" onClose={() => setOpen(false)}>\n        Dialog body\n      </Dialog>\n    </>\n  );\n}`,
  divider: `<Divider>Section</Divider>`,
};

/**
 * Return a minimal illustrative TSX example for a component. Falls back to a
 * generic snippet derived from the export name when no curated example exists.
 */
export function buildExample(entry: RegistryIndexEntry): string {
  const curated = CURATED[entry.key];
  if (curated) return curated;
  const tag = entry.export ?? entry.name.replace(/[^A-Za-z0-9]/g, '');
  return `<${tag} />`;
}
