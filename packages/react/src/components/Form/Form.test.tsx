import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Form, type FormInstance, type FormRule } from './Form';
import { FormItem } from './FormItem';
import { Input } from '../Input/Input';

describe('Form', () => {
  it('renders a label and marks required items with an asterisk', () => {
    const model = { name: '' };
    render(
      <Form model={model}>
        <FormItem label="Name" prop="name" required>
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );
    const label = screen.getByText('Name');
    expect(label).toBeInTheDocument();
    expect(label.closest('.ec-form-item')).toHaveClass('is-required');
  });

  it('fails required validation, shows a message, and resolves false', async () => {
    const ref = createRef<FormInstance>();
    const model = { name: '' };
    render(
      <Form ref={ref} model={model}>
        <FormItem label="Name" prop="name" rules={{ required: true, message: 'Name is required' }}>
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );

    let valid = true;
    await act(async () => {
      valid = await ref.current!.validate();
    });
    expect(valid).toBe(false);
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('passes validation for a valid model and resolves true', async () => {
    const ref = createRef<FormInstance>();
    const model = { name: 'Ernesto' };
    const rules: Record<string, FormRule> = { name: { required: true, message: 'Required' } };
    render(
      <Form ref={ref} model={model} rules={rules}>
        <FormItem label="Name" prop="name">
          <Input value="Ernesto" onChange={() => {}} />
        </FormItem>
      </Form>,
    );

    let valid = false;
    await act(async () => {
      valid = await ref.current!.validate();
    });
    expect(valid).toBe(true);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('clearValidate removes a previously shown error', async () => {
    const ref = createRef<FormInstance>();
    const model = { name: '' };
    render(
      <Form ref={ref} model={model}>
        <FormItem label="Name" prop="name" rules={{ required: true, message: 'Name is required' }}>
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );

    await act(async () => {
      await ref.current!.validate();
    });
    expect(await screen.findByText('Name is required')).toBeInTheDocument();

    act(() => {
      ref.current!.clearValidate();
    });
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('validates against the live model values', async () => {
    const ref = createRef<FormInstance>();
    function Wrapper() {
      const [model] = useState({ email: 'not-an-email' });
      return (
        <Form ref={ref} model={model}>
          <FormItem
            label="Email"
            prop="email"
            rules={{ type: 'email', message: 'Invalid email' }}
          >
            <Input value={String(model.email)} onChange={() => {}} />
          </FormItem>
        </Form>
      );
    }
    render(<Wrapper />);

    let valid = true;
    await act(async () => {
      valid = await ref.current!.validate();
    });
    expect(valid).toBe(false);
    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('validateField validates only the targeted field', async () => {
    const ref = createRef<FormInstance>();
    const model = { name: 'ok', age: '' };
    render(
      <Form ref={ref} model={model}>
        <FormItem label="Name" prop="name" rules={{ required: true }}>
          <Input value="ok" onChange={() => {}} />
        </FormItem>
        <FormItem label="Age" prop="age" rules={{ required: true, message: 'Age required' }}>
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );

    let nameValid = false;
    let ageValid = true;
    await act(async () => {
      nameValid = await ref.current!.validateField('name');
      ageValid = await ref.current!.validateField('age');
    });
    expect(nameValid).toBe(true);
    expect(ageValid).toBe(false);
    expect(await screen.findByText('Age required')).toBeInTheDocument();
  });

  it('disables descendant controls when the Form is disabled', () => {
    render(
      <Form disabled>
        <FormItem label="Name" prop="name">
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not disable descendant controls when the Form is not disabled', () => {
    render(
      <Form>
        <FormItem label="Name" prop="name">
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('renders data-form-prop on the FormItem root so scrollToField can locate it', () => {
    render(
      <Form>
        <FormItem label="Name" prop="name">
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );
    expect(document.querySelector('[data-form-prop="name"]')).toBeInTheDocument();
  });

  it('associates the label with the bound control', () => {
    render(
      <Form>
        <FormItem label="Name" prop="name">
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Name');
    expect(input.id).not.toBe('');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('exposes validation errors to assistive technology', async () => {
    const ref = createRef<FormInstance>();
    const model = { name: '' };
    render(
      <Form ref={ref} model={model}>
        <FormItem label="Name" prop="name" rules={{ required: true, message: 'Name is required' }}>
          <Input value="" onChange={() => {}} />
        </FormItem>
      </Form>,
    );

    await act(async () => {
      await ref.current!.validate();
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Name is required');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('honours an interaction trigger validation on blur', async () => {
    const ref = createRef<FormInstance>();
    function Wrapper() {
      const [model, setModel] = useState<{ name: string }>({ name: '' });
      return (
        <Form ref={ref} model={model}>
          <FormItem
            label="Name"
            prop="name"
            rules={{ required: true, message: 'Name is required', trigger: 'blur' }}
          >
            <Input
              value={model.name}
              onChange={(next) => setModel({ name: next })}
              onBlur={() => ref.current!.validateField('name')}
            />
          </FormItem>
        </Form>
      );
    }
    render(<Wrapper />);

    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.tab();
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });
});
