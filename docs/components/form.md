# Form

Form layout and validation with rules and imperative methods.

**Category:** Form · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/form

## Import

```ts
import { Form, FormItem } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { useRef, useState } from 'react';
import { Form, FormItem, Input, Button, type FormInstance } from '@cobos/react';

export function Example() {
  const formRef = useRef<FormInstance>(null);
  const [model, setModel] = useState({ name: '', email: '' });

  const rules = {
    name: [{ required: true, message: 'Name is required' }],
    email: [{ required: true, type: 'email' as const }],
  };

  const submit = async () => {
    if (await formRef.current?.validate()) {
      console.log('valid', model);
    }
  };

  return (
    <Form ref={formRef} model={model} rules={rules} labelWidth={100}>
      <FormItem label="Name" prop="name">
        <Input value={model.name} onChange={(name) => setModel({ ...model, name })} />
      </FormItem>
      <FormItem label="Email" prop="email">
        <Input value={model.email} onChange={(email) => setModel({ ...model, email })} />
      </FormItem>
      <Button type="primary" onClick={submit}>Submit</Button>
    </Form>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | The values object the consumer keeps; fields read `model[prop]`. |
| `rules` | `Record<string, FormRule \| FormRule[]>` | — | Rules keyed by `prop`. |
| `labelWidth` | `string \| number` | — | Shared label column width. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | Label alignment. |
| `labelSuffix` | `string` | — | Suffix appended to string labels (e.g. `:`). |
| `inline` | `boolean` | `false` | Lay items out in a single row. |
| `size` | `'large' \| 'default' \| 'small'` | inherited from `ConfigProvider`, else `'default'` | Size shared by descendant form items. |
| `disabled` | `boolean` | inherited from `ConfigProvider`, else `false` | Disable every descendant control. |
| `hideRequiredAsterisk` | `boolean` | `false` | Hide the required asterisk on labels. |
| `requireAsteriskPosition` | `'left' \| 'right'` | `'left'` | Side the required asterisk sits on. |
| `showMessage` | `boolean` | `true` | Whether to render validation messages. |
| `scrollToError` | `boolean` | `false` | Scroll to the first errored field after a failed validate. |
| `onSubmit` | `(event: FormEvent<HTMLFormElement>) => void` | — | Fired on native form submit. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |
| `children` | `ReactNode` | — | `FormItem`s and controls. |

### FormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Label content rendered before the control. |
| `prop` | `string` | — | Key in the form `model` this item is bound to. |
| `required` | `boolean` | — | Force the required asterisk regardless of rules. |
| `rules` | `FormRule \| FormRule[]` | falls back to `form.rules[prop]` | Validation rules for this item. |
| `error` | `string` | — | Manual error message override; takes precedence over validation. |
| `showMessage` | `boolean` | falls back to the Form, else `true` | Whether to show the validation message. |
| `labelWidth` | `string \| number` | falls back to the Form's `labelWidth` | Label column width; overrides the Form's `labelWidth`. |
| `for` | `string` | — | Native `for` attribute applied to the label. |
| `size` | `'large' \| 'default' \| 'small'` | falls back to the Form, then `ConfigProvider` | Size. |
| `className` | `string` | — | Extra class on the root element. |
| `style` | `CSSProperties` | — | Extra style on the root element. |
| `children` | `ReactNode` | — | The control bound to this item. |

### FormRule shape

| Field | Type | Description |
| --- | --- | --- |
| `required` | `boolean` | The value must not be empty. |
| `message` | `string` | Message shown when the rule fails; otherwise a sensible default is used. |
| `min` | `number` | Minimum string length / array length / numeric value. |
| `max` | `number` | Maximum string length / array length / numeric value. |
| `len` | `number` | Exact string length / array length / numeric value. |
| `pattern` | `RegExp` | Regular expression the (string) value must match. |
| `type` | `'string' \| 'number' \| 'email' \| 'url' \| 'array'` | Built-in type check. |
| `validator` | `(value) => string \| null \| void \| Promise<...>` | Custom validator; return (or resolve) a message string to fail, or null/void to pass. |
| `trigger` | `'blur' \| 'change'` | When this rule should run during interaction-driven validation. |

### Imperative API (`FormInstance`, via `ref`)

| Method | Signature | Description |
| --- | --- | --- |
| `validate` | `() => Promise<boolean>` | Validate every registered field; resolves `true` when all pass. |
| `validateField` | `(prop: string) => Promise<boolean>` | Validate a single field by its `prop`. |
| `resetFields` | `() => void` | Reset every field's validation state. |
| `clearValidate` | `(props?: string \| string[]) => void` | Clear validation messages for the given prop(s), or all when omitted. |
| `scrollToField` | `(prop: string) => void` | Scroll the given field into view. |

## Events / Callbacks

| Callback | Fires when |
| --- | --- |
| `onSubmit(event)` | The underlying `<form>` is submitted. |

Validation is driven imperatively through the `FormInstance` methods on the ref.

## Accessibility

- Renders a native `<form>` element.
- Each `FormItem` renders a `<label>` (with an optional `for`/`htmlFor`), and required items are marked with an asterisk.
- Validation messages render in the item's content area when `showMessage` is enabled.
