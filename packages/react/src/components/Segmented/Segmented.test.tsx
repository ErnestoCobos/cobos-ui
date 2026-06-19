import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Segmented } from './Segmented';

const OPTIONS = ['Daily', 'Weekly', 'Monthly'];

describe('Segmented', () => {
  it('renders one radio per option inside a radiogroup', () => {
    render(<Segmented options={OPTIONS} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByText('Daily')).toBeInTheDocument();
  });

  it('selects the first option by default when uncontrolled', () => {
    render(<Segmented options={OPTIONS} />);
    const [first] = screen.getAllByRole('radio');
    expect(first).toBeChecked();
  });

  it('honours defaultValue (uncontrolled)', () => {
    render(<Segmented options={OPTIONS} defaultValue="Weekly" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('selects on click and fires onChange (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[2]);
    expect(onChange).toHaveBeenCalledWith('Monthly');
    expect(radios[2]).toBeChecked();
  });

  it('respects the controlled value', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Segmented options={OPTIONS} value="Daily" onChange={onChange} />,
    );
    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalledWith('Weekly');
    // Stays on Daily until the prop changes.
    expect(radios[0]).toBeChecked();
    rerender(<Segmented options={OPTIONS} value="Weekly" onChange={onChange} />);
    expect(radios[1]).toBeChecked();
  });

  it('supports object options with disabled segments', async () => {
    const onChange = vi.fn();
    render(
      <Segmented
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ]}
        onChange={onChange}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeDisabled();
    await userEvent.click(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves selection with arrow keys, skipping disabled options', async () => {
    const onChange = vi.fn();
    render(
      <Segmented
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ]}
        defaultValue="a"
        onChange={onChange}
      />,
    );
    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    // Skips the disabled B and lands on C.
    expect(onChange).toHaveBeenCalledWith('c');
    expect(radios[2]).toBeChecked();
  });

  it('does not fire when the whole control is disabled', async () => {
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} disabled onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies the size modifier class', () => {
    const { container } = render(<Segmented options={OPTIONS} size="large" />);
    expect(container.querySelector('.ec-segmented')).toHaveClass('ec-segmented--large');
  });

  it('applies the block modifier class', () => {
    const { container } = render(<Segmented options={OPTIONS} block />);
    expect(container.querySelector('.ec-segmented')).toHaveClass('is-block');
  });
});
