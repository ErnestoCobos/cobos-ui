import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

describe('Radio', () => {
  it('renders its label', () => {
    render(<Radio label="Apple" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders children over the label prop', () => {
    render(<Radio label="Apple">Banana</Radio>);
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('works uncontrolled via defaultChecked', () => {
    render(<Radio defaultChecked label="A" />);
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true);
  });

  it('checks itself and fires onChange when clicked (standalone)', async () => {
    const onChange = vi.fn();
    render(<Radio value="a" onChange={onChange} label="A" />);
    const input = screen.getByRole('radio') as HTMLInputElement;
    await userEvent.click(input);
    expect(input.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('works controlled via checked', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Radio value="a" checked={false} onChange={onChange} label="A" />);
    const input = screen.getByRole('radio') as HTMLInputElement;
    await userEvent.click(input);
    expect(onChange).toHaveBeenCalledWith('a');
    expect(input.checked).toBe(false);
    rerender(<Radio value="a" checked onChange={onChange} label="A" />);
    expect(input.checked).toBe(true);
  });

  it('does not fire when disabled', async () => {
    const onChange = vi.fn();
    render(<Radio value="a" disabled onChange={onChange} label="A" />);
    const input = screen.getByRole('radio');
    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies the size modifier class', () => {
    render(<Radio size="small" label="A" />);
    expect(screen.getByRole('radio').closest('label')).toHaveClass('ec-radio--small');
  });
});

describe('RadioGroup', () => {
  it('checks the radio matching the group value (controlled)', () => {
    render(
      <RadioGroup value="b">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
  });

  it('selects on click and reports the value (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
    await userEvent.click(b);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(b.checked).toBe(true);
    expect(a.checked).toBe(false);
  });

  it('shares a single name across the group', () => {
    render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(a.name).toBeTruthy();
    expect(a.name).toBe(b.name);
  });

  it('disables every radio when the group is disabled', () => {
    render(
      <RadioGroup disabled value="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    for (const input of screen.getAllByRole('radio')) {
      expect(input).toBeDisabled();
    }
  });
});
