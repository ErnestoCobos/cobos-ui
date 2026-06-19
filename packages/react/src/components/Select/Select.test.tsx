import { useRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';
import { Option } from './Option';

function Basic(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <Option value="apple">Apple</Option>
      <Option value="banana">Banana</Option>
      <Option value="cherry" disabled>
        Cherry
      </Option>
    </Select>
  );
}

describe('Select', () => {
  it('renders the placeholder when there is no value', () => {
    render(<Basic placeholder="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('defaults the placeholder to "Select"', () => {
    render(<Basic />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('opens the dropdown on click', async () => {
    render(<Basic />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('selects an option, fires onChange, and closes', async () => {
    const onChange = vi.fn();
    render(<Basic onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('does not select a disabled option', async () => {
    const onChange = vi.fn();
    render(<Basic onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Cherry'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('adds and removes tags in multiple mode', async () => {
    function Wrapper() {
      const [value, setValue] = useState<(string | number)[]>([]);
      return (
        <Select
          multiple
          value={value}
          onChange={(next) => setValue(next as (string | number)[])}
        >
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
        </Select>
      );
    }
    render(<Wrapper />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Apple'));
    await userEvent.click(screen.getByText('Banana'));
    // Stays open in multiple mode.
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    // Both tags rendered in the trigger.
    expect(screen.getByLabelText('Remove Apple')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Banana')).toBeInTheDocument();
    // Remove the Apple tag.
    await userEvent.click(screen.getByLabelText('Remove Apple'));
    expect(screen.queryByLabelText('Remove Apple')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Remove Banana')).toBeInTheDocument();
  });

  it('clears the value when clearable', async () => {
    const onClear = vi.fn();
    function Wrapper() {
      const [value, setValue] = useState<string | number>('apple');
      return (
        <Select
          clearable
          value={value}
          onClear={onClear}
          onChange={(next) => setValue(next as string)}
        >
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
        </Select>
      );
    }
    render(<Wrapper />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    // Clear button appears on hover.
    await userEvent.hover(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(<Basic disabled />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(combobox);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('filters options by query when filterable', async () => {
    render(<Basic filterable />);
    await userEvent.click(screen.getByRole('combobox'));
    // The filter input is focused on open; type into it.
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'ban' } });
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    render(<Basic />);
    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies the size modifier class', () => {
    render(<Basic size="large" />);
    expect(screen.getByRole('combobox')).toHaveClass('ec-select--large');
  });

  it('renders exactly one listbox when open', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('combobox'));
    // Both the floating shell and the option list must not both be listboxes.
    expect(screen.getAllByRole('listbox')).toHaveLength(1);
  });

  it('forwards the ref to the combobox element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Select ref={ref}>
        <Option value="apple">Apple</Option>
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('uses a function ref pointing at the combobox', () => {
    function Wrapper() {
      const ref = useRef<HTMLDivElement | null>(null);
      return (
        <>
          <Select ref={ref}>
            <Option value="apple">Apple</Option>
          </Select>
          <button type="button" onClick={() => ref.current?.setAttribute('data-touched', 'yes')}>
            touch
          </button>
        </>
      );
    }
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'touch' }));
    expect(screen.getByRole('combobox')).toHaveAttribute('data-touched', 'yes');
  });

  it('exposes the keyboard highlight via aria-activedescendant and option ids', async () => {
    render(<Basic />);
    const combobox = screen.getByRole('combobox');
    combobox.focus();
    // ArrowDown opens and highlights the first enabled option.
    await userEvent.keyboard('{ArrowDown}');
    const apple = screen.getByRole('option', { name: 'Apple' });
    expect(apple).toHaveAttribute('id');
    expect(combobox).toHaveAttribute('aria-activedescendant', apple.id);
    // Moving down updates the active descendant to the next option's id.
    await userEvent.keyboard('{ArrowDown}');
    const banana = screen.getByRole('option', { name: 'Banana' });
    expect(combobox).toHaveAttribute('aria-activedescendant', banana.id);
    expect(combobox).toHaveAttribute('aria-controls');
  });

  it('opens with ArrowUp and highlights the last enabled option', async () => {
    render(<Basic />);
    const combobox = screen.getByRole('combobox');
    combobox.focus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    // Cherry is disabled, so Banana is the last enabled option.
    const banana = screen.getByRole('option', { name: 'Banana' });
    expect(combobox).toHaveAttribute('aria-activedescendant', banana.id);
  });

  it('advertises multi-select on the listbox in multiple mode', async () => {
    render(<Basic multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('does not advertise multi-select in single mode', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-multiselectable');
  });
});
