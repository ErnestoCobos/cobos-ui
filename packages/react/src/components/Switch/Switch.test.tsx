import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with role switch, unchecked by default', () => {
    render(<Switch />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles uncontrolled with defaultValue', async () => {
    const onChange = vi.fn();
    render(<Switch defaultValue onChange={onChange} />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('works controlled: value wins', async () => {
    const onChange = vi.fn();
    function Wrapper() {
      const [value, setValue] = useState(false);
      return (
        <Switch
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Wrapper />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('does not change a controlled value without state update', async () => {
    render(<Switch value={false} onChange={() => {}} />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with the keyboard (Enter / Space)', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange} />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not toggle when loading', async () => {
    const onChange = vi.fn();
    render(<Switch loading onChange={onChange} />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveClass('is-loading');
    await userEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders active and inactive texts', () => {
    render(<Switch activeText="On" inactiveText="Off" />);
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('applies the size modifier class', () => {
    render(<Switch size="large" />);
    expect(screen.getByRole('switch')).toHaveClass('ec-switch--large');
  });

  it('forwards an accessible name via aria-label', () => {
    render(<Switch aria-label="Dark mode" />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('spreads remaining standard attributes onto the root', () => {
    render(<Switch data-testid="sw" aria-labelledby="lbl" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('data-testid', 'sw');
    expect(sw).toHaveAttribute('aria-labelledby', 'lbl');
  });
});
