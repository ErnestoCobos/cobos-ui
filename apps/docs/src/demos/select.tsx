import { useState } from 'react';
import { Select, Option, Space, Text } from '@cobos/react';
import type { SelectValue } from '@cobos/react';
import { Example, DemoStack } from './_demo';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular', disabled: true },
];

export default function SelectDemo() {
  const [single, setSingle] = useState<SelectValue | SelectValue[]>('react');
  const [multiple, setMultiple] = useState<SelectValue | SelectValue[]>(['react', 'vue']);
  const [filtered, setFiltered] = useState<SelectValue | SelectValue[]>('');

  return (
    <DemoStack>
      <Example title="Single" description="Pick one option.">
        <Space align="center">
          <Select value={single} onChange={setSingle} clearable style={{ width: 220 }} placeholder="Framework">
            {FRAMEWORKS.map((f) => (
              <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
                {f.label}
              </Option>
            ))}
          </Select>
          <Text type="info" size="small">
            value: {String(single) || '—'}
          </Text>
        </Space>
      </Example>

      <Example title="Multiple" description="Selections render as removable tags.">
        <Select value={multiple} onChange={setMultiple} multiple clearable style={{ width: 320 }} placeholder="Frameworks">
          {FRAMEWORKS.map((f) => (
            <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
              {f.label}
            </Option>
          ))}
        </Select>
      </Example>

      <Example title="Filterable" description="Type to narrow the list.">
        <Select
          value={filtered}
          onChange={setFiltered}
          filterable
          clearable
          style={{ width: 220 }}
          placeholder="Search framework"
        >
          {FRAMEWORKS.map((f) => (
            <Option key={f.value} value={f.value} label={f.label} disabled={f.disabled}>
              {f.label}
            </Option>
          ))}
        </Select>
      </Example>
    </DemoStack>
  );
}
