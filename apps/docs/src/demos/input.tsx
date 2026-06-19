import { useState } from 'react';
import { Input, Space, Button } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { SearchGlyph } from '../icons';

export default function InputDemo() {
  const [basic, setBasic] = useState('');
  const [clearable, setClearable] = useState('Clear me');
  const [password, setPassword] = useState('secret-value');
  const [search, setSearch] = useState('');
  const [bio, setBio] = useState('Cobos UI is a token-first React design system.');

  return (
    <DemoStack>
      <Example title="Basic" description="Controlled text input.">
        <Input value={basic} onChange={setBasic} placeholder="Your name" style={{ maxWidth: 280 }} />
      </Example>

      <Example title="Clearable and password" description="Clear button and toggleable visibility.">
        <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 280 }} fill>
          <Input value={clearable} onChange={setClearable} clearable placeholder="Clearable" />
          <Input value={password} onChange={setPassword} type="password" showPassword placeholder="Password" />
        </Space>
      </Example>

      <Example title="Prefix icon and word limit">
        <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 280 }} fill>
          <Input value={search} onChange={setSearch} prefixIcon={SearchGlyph} placeholder="Search components" clearable />
          <Input value={basic} onChange={setBasic} maxLength={20} showWordLimit placeholder="Max 20 chars" />
        </Space>
      </Example>

      <Example title="Prepend and append" description="Group addons for units and protocols.">
        <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 360 }} fill>
          <Input prepend="https://" append=".com" placeholder="your-site" />
          <Input
            placeholder="0.00"
            prepend="$"
            append={
              <Button text bg style={{ height: '100%' }}>
                USD
              </Button>
            }
          />
        </Space>
      </Example>

      <Example title="Sizes and textarea">
        <Space direction="vertical" align="start" style={{ width: '100%', maxWidth: 360 }} fill>
          <Input size="large" placeholder="Large" />
          <Input placeholder="Default" />
          <Input size="small" placeholder="Small" />
          <Input type="textarea" rows={3} value={bio} onChange={setBio} placeholder="Tell us about yourself" />
        </Space>
      </Example>
    </DemoStack>
  );
}
