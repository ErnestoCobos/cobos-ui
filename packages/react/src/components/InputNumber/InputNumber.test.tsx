import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { InputNumber } from './InputNumber';

describe('InputNumber', () => {
  it('renders with a default value (uncontrolled)', () => {
    render(<InputNumber defaultValue={5} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('5');
  });

  it('increases and decreases by step', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} step={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('clamps to min and max', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={9} min={0} max={10} step={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('disables the increase button at max', () => {
    render(<InputNumber defaultValue={10} max={10} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveClass('is-disabled');
  });

  it('disables the decrease button at min', () => {
    render(<InputNumber defaultValue={0} min={0} />);
    expect(screen.getByRole('button', { name: 'Decrease' })).toHaveClass('is-disabled');
  });

  it('renders the inner control as a text input', () => {
    render(<InputNumber defaultValue={1} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'text');
  });

  it('respects precision on display, keeping trailing zeros', () => {
    render(<InputNumber defaultValue={1.5} precision={2} />);
    // A text input renders the formatted string verbatim, including trailing zeros.
    expect(screen.getByRole('spinbutton')).toHaveValue('1.50');
  });

  it('steps with ArrowUp / ArrowDown keys through clamp', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} step={2} max={4} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(3);
    await userEvent.keyboard('{ArrowUp}');
    // Clamped to max.
    expect(onChange).toHaveBeenLastCalledWith(4);
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('does not step when readonly', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} readonly onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('readonly');
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('exposes aria-disabled on disabled controls', () => {
    render(<InputNumber defaultValue={10} max={10} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('applies aria-label and forwards focus / blur', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<InputNumber defaultValue={1} aria-label="Quantity" onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('aria-label', 'Quantity');
    input.focus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    input.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('works controlled', async () => {
    const onChange = vi.fn();
    function Wrapper() {
      const [value, setValue] = useState(0);
      return (
        <InputNumber
          value={value}
          onChange={(next) => {
            onChange(next);
            if (next !== null) setValue(next);
          }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('spinbutton')).toHaveValue('1');
  });

  it('does not step when disabled', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits null when cleared', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} onChange={onChange} />);
    await userEvent.clear(screen.getByRole('spinbutton'));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('stacks controls on the right', () => {
    const { container } = render(<InputNumber controlsPosition="right" />);
    expect(container.querySelector('.ec-input-number')).toHaveClass('is-controls-right');
  });
});
