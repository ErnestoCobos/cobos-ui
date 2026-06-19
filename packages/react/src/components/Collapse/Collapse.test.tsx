import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapse, type CollapseValue } from './Collapse';
import { CollapseItem } from './CollapseItem';

function Basic(props: { defaultValue?: CollapseValue; accordion?: boolean }) {
  return (
    <Collapse defaultValue={props.defaultValue} accordion={props.accordion}>
      <CollapseItem name="1" title="Title 1">
        Content 1
      </CollapseItem>
      <CollapseItem name="2" title="Title 2">
        Content 2
      </CollapseItem>
      <CollapseItem name="3" title="Title 3" disabled>
        Content 3
      </CollapseItem>
    </Collapse>
  );
}

describe('Collapse', () => {
  it('renders a header button per item', () => {
    render(<Basic />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders headers as real buttons', () => {
    render(<Basic />);
    const header = screen.getByRole('button', { name: 'Title 1' });
    expect(header.tagName).toBe('BUTTON');
    expect(header).toHaveAttribute('type', 'button');
  });

  it('starts collapsed and toggles open on click', async () => {
    render(<Basic />);
    const header = screen.getByRole('button', { name: 'Title 1' });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles closed on a second click', async () => {
    render(<Basic />);
    const header = screen.getByRole('button', { name: 'Title 1' });
    await userEvent.click(header);
    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens items listed in defaultValue (uncontrolled)', () => {
    render(<Basic defaultValue={['2']} />);
    expect(screen.getByRole('button', { name: 'Title 2' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Title 1' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('wires header and panel together for a11y', () => {
    render(<Basic defaultValue={['1']} />);
    const header = screen.getByRole('button', { name: 'Title 1' });
    const region = screen.getByRole('region');
    expect(header).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveAttribute('aria-labelledby', header.id);
  });

  it('keeps multiple items open by default', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: 'Title 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Title 2' }));
    expect(screen.getByRole('button', { name: 'Title 1' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Title 2' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('keeps only one item open in accordion mode', async () => {
    render(<Basic accordion />);
    await userEvent.click(screen.getByRole('button', { name: 'Title 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Title 2' }));
    expect(screen.getByRole('button', { name: 'Title 1' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Title 2' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('does not toggle a disabled item', async () => {
    render(<Basic />);
    const header = screen.getByRole('button', { name: 'Title 3' });
    expect(header).toBeDisabled();
    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('fires onChange with the open names (non-accordion)', async () => {
    const onChange = vi.fn();
    render(
      <Collapse onChange={onChange}>
        <CollapseItem name="a" title="A">
          A body
        </CollapseItem>
        <CollapseItem name="b" title="B">
          B body
        </CollapseItem>
      </Collapse>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(onChange).toHaveBeenLastCalledWith(['a']);
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('fires onChange with a single name in accordion mode', async () => {
    const onChange = vi.fn();
    render(
      <Collapse accordion onChange={onChange}>
        <CollapseItem name="a" title="A">
          A body
        </CollapseItem>
        <CollapseItem name="b" title="B">
          B body
        </CollapseItem>
      </Collapse>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState<CollapseValue>([]);
      return (
        <Collapse value={value} onChange={setValue}>
          <CollapseItem name="a" title="A">
            A body
          </CollapseItem>
          <CollapseItem name="b" title="B">
            B body
          </CollapseItem>
        </Collapse>
      );
    }
    render(<Controlled />);
    const a = screen.getByRole('button', { name: 'A' });
    await userEvent.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not update internal state when controlled', async () => {
    const onChange = vi.fn();
    render(
      <Collapse value={[]} onChange={onChange}>
        <CollapseItem name="a" title="A">
          A body
        </CollapseItem>
      </Collapse>,
    );
    const a = screen.getByRole('button', { name: 'A' });
    await userEvent.click(a);
    expect(onChange).toHaveBeenCalledWith(['a']);
    // Parent did not push a new value, so it stays closed.
    expect(a).toHaveAttribute('aria-expanded', 'false');
  });

  it('accepts a single name (not wrapped in an array)', () => {
    render(
      <Collapse value="a">
        <CollapseItem name="a" title="A">
          A body
        </CollapseItem>
      </Collapse>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies the accordion modifier state class', () => {
    const { container } = render(<Basic accordion />);
    expect(container.querySelector('.ec-collapse')).toHaveClass('is-accordion');
  });

  it('renders a custom icon when provided', () => {
    render(
      <Collapse>
        <CollapseItem name="a" title="A" icon={<span data-testid="custom">v</span>}>
          A body
        </CollapseItem>
      </Collapse>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });
});
