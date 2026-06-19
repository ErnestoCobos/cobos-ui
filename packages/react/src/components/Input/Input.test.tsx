import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('works uncontrolled with defaultValue', async () => {
    render(<Input defaultValue="hi" />);
    const input = screen.getByDisplayValue('hi');
    await userEvent.type(input, 'a');
    expect(input).toHaveValue('hia');
  });

  it('works controlled: value wins and onChange fires', async () => {
    const onChange = vi.fn();
    function Wrapper() {
      const [value, setValue] = useState('a');
      return (
        <Input
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Wrapper />);
    const input = screen.getByDisplayValue('a');
    await userEvent.type(input, 'b');
    expect(onChange).toHaveBeenLastCalledWith('ab');
    expect(input).toHaveValue('ab');
  });

  it('controlled value cannot be changed without onChange updating it', async () => {
    render(<Input value="fixed" onChange={() => {}} />);
    const input = screen.getByDisplayValue('fixed');
    await userEvent.type(input, 'x');
    expect(input).toHaveValue('fixed');
  });

  it('clears the value and calls onClear', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<Input defaultValue="text" clearable onChange={onChange} onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('toggles password visibility', async () => {
    render(<Input type="password" showPassword defaultValue="secret" />);
    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('does not change when disabled', async () => {
    const onChange = vi.fn();
    render(<Input disabled defaultValue="x" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'y');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies the size modifier class', () => {
    const { container } = render(<Input size="large" />);
    expect(container.querySelector('.ec-input')).toHaveClass('ec-input--large');
  });

  it('renders a textarea for type="textarea"', () => {
    render(<Input type="textarea" rows={4} placeholder="Bio" />);
    const textarea = screen.getByPlaceholderText('Bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('shows a word limit counter', () => {
    render(<Input defaultValue="ab" maxLength={10} showWordLimit />);
    expect(screen.getByText('2 / 10')).toBeInTheDocument();
  });

  it('renders prepend and append addons', () => {
    render(<Input prepend="https://" append=".com" />);
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
  });

  it('exposes the clear control as a real, focusable button', () => {
    render(<Input defaultValue="text" clearable />);
    const clear = screen.getByRole('button', { name: 'Clear' });
    expect(clear.tagName).toBe('BUTTON');
    expect(clear).toHaveAttribute('type', 'button');
  });

  it('clears the value via keyboard activation', async () => {
    const onClear = vi.fn();
    render(<Input defaultValue="text" clearable onClear={onClear} />);
    const clear = screen.getByRole('button', { name: 'Clear' });
    clear.focus();
    expect(clear).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('toggles password visibility via keyboard activation', async () => {
    render(<Input type="password" showPassword defaultValue="secret" />);
    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    toggle.focus();
    await userEvent.keyboard(' ');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('prevents the input from blurring when a suffix control is pressed', () => {
    render(<Input defaultValue="text" clearable />);
    const clear = screen.getByRole('button', { name: 'Clear' });
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    clear.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('forwards native and ARIA attributes to the inner input', () => {
    render(
      <Input
        aria-label="Email"
        aria-invalid
        inputMode="email"
        autoFocus
        defaultValue="a"
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('inputmode', 'email');
  });

  it('forwards native attributes to the inner textarea', () => {
    render(<Input type="textarea" aria-label="Bio" defaultValue="hi" />);
    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});
