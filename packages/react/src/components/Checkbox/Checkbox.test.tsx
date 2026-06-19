import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

describe('Checkbox', () => {
  it('renders its label', () => {
    render(<Checkbox label="Apple" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders children over the label prop', () => {
    render(<Checkbox label="Apple">Banana</Checkbox>);
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('works uncontrolled via defaultChecked', async () => {
    const onChange = vi.fn();
    render(<Checkbox defaultChecked onChange={onChange} label="A" />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(true);
    await userEvent.click(input);
    expect(input.checked).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('works controlled via checked/onChange', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox checked={false} onChange={onChange} label="A" />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);
    await userEvent.click(input);
    // Controlled: stays false until parent updates.
    expect(onChange).toHaveBeenCalledWith(true);
    expect(input.checked).toBe(false);
    rerender(<Checkbox checked onChange={onChange} label="A" />);
    expect(input.checked).toBe(true);
  });

  it('reflects the indeterminate state', () => {
    render(<Checkbox indeterminate label="A" />);
    expect(screen.getByRole('checkbox').closest('label')).toHaveClass('is-indeterminate');
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('sets the native indeterminate DOM property', () => {
    const { rerender } = render(<Checkbox indeterminate label="A" />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    rerender(<Checkbox indeterminate={false} label="A" />);
    expect(input.indeterminate).toBe(false);
  });

  it('does not fire when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} label="A" />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies the size modifier class', () => {
    render(<Checkbox size="large" label="A" />);
    expect(screen.getByRole('checkbox').closest('label')).toHaveClass('ec-checkbox--large');
  });
});

describe('CheckboxGroup', () => {
  it('checks items based on the group value (controlled)', () => {
    render(
      <CheckboxGroup value={['a']}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>,
    );
    const [a, b] = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
  });

  it('toggles values and reports the new array', async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup defaultValue={['a']} onChange={onChange}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>,
    );
    const [, b] = screen.getAllByRole('checkbox') as HTMLInputElement[];
    await userEvent.click(b);
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    expect(b.checked).toBe(true);
  });

  it("fires the checkbox's own onChange inside a group", async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup defaultValue={[]}>
        <Checkbox value="a" label="A" onChange={onChange} />
      </CheckboxGroup>,
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('disables every checkbox when the group is disabled', () => {
    render(
      <CheckboxGroup disabled value={[]}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>,
    );
    for (const input of screen.getAllByRole('checkbox')) {
      expect(input).toBeDisabled();
    }
  });

  it('respects max (cannot check beyond the limit)', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState<string[]>(['a']);
      return (
        <CheckboxGroup
          max={1}
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next as string[]);
          }}
        >
          <Checkbox value="a" label="A" />
          <Checkbox value="b" label="B" />
        </CheckboxGroup>
      );
    }
    render(<Controlled />);
    const [, b] = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(b).toBeDisabled();
    await userEvent.click(b);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects min (cannot uncheck below the limit)', async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup min={1} defaultValue={['a']} onChange={onChange}>
        <Checkbox value="a" label="A" />
        <Checkbox value="b" label="B" />
      </CheckboxGroup>,
    );
    const [a] = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(a).toBeDisabled();
    await userEvent.click(a);
    expect(onChange).not.toHaveBeenCalled();
  });
});
