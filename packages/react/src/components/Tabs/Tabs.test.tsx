import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';
import { TabPane } from './TabPane';

function Basic() {
  return (
    <Tabs>
      <TabPane name="first" label="First">
        First content
      </TabPane>
      <TabPane name="second" label="Second">
        Second content
      </TabPane>
      <TabPane name="third" label="Third" disabled>
        Third content
      </TabPane>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tab for each pane', () => {
    render(<Basic />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('activates the first pane by default', () => {
    render(<Basic />);
    const first = screen.getByRole('tab', { name: 'First' });
    expect(first).toHaveClass('is-active');
    expect(first).toHaveAttribute('aria-selected', 'true');
  });

  it('respects defaultValue (uncontrolled)', () => {
    render(
      <Tabs defaultValue="second">
        <TabPane name="first" label="First">
          A
        </TabPane>
        <TabPane name="second" label="Second">
          B
        </TabPane>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveClass('is-active');
  });

  it('switches the active pane on click', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveClass('is-active');
    expect(screen.getByRole('tab', { name: 'First' })).not.toHaveClass('is-active');
  });

  it('fires onChange and onTabClick', async () => {
    const onChange = vi.fn();
    const onTabClick = vi.fn();
    render(
      <Tabs onChange={onChange} onTabClick={onTabClick}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B">
          B
        </TabPane>
      </Tabs>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(onTabClick).toHaveBeenCalledWith('b');
  });

  it('does not switch to a disabled tab', async () => {
    const onChange = vi.fn();
    render(
      <Tabs onChange={onChange}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B" disabled>
          B
        </TabPane>
      </Tabs>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'A' })).toHaveClass('is-active');
  });

  it('does not update internal state when controlled', async () => {
    const onChange = vi.fn();
    render(
      <Tabs value="a" onChange={onChange}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B">
          B
        </TabPane>
      </Tabs>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'A' })).toHaveClass('is-active');
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <Tabs value={value} onChange={setValue}>
          <TabPane name="a" label="A">
            A
          </TabPane>
          <TabPane name="b" label="B">
            B
          </TabPane>
        </Tabs>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tab', { name: 'B' })).toHaveClass('is-active');
  });

  it('only shows the active panel content', () => {
    render(<Basic />);
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    const visible = panels.filter((p) => !p.hasAttribute('hidden'));
    expect(visible).toHaveLength(1);
    expect(visible[0]).toHaveTextContent('First content');
  });

  it('renders close buttons when editable and fires onTabRemove', async () => {
    const onTabRemove = vi.fn();
    render(
      <Tabs editable onTabRemove={onTabRemove}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B">
          B
        </TabPane>
      </Tabs>,
    );
    const closeButtons = screen.getAllByLabelText('Close tab');
    expect(closeButtons).toHaveLength(2);
    await userEvent.click(closeButtons[1]);
    expect(onTabRemove).toHaveBeenCalledWith('b');
  });

  it('renders an add button and fires onTabAdd', async () => {
    const onTabAdd = vi.fn();
    render(
      <Tabs addable onTabAdd={onTabAdd}>
        <TabPane name="a" label="A">
          A
        </TabPane>
      </Tabs>,
    );
    await userEvent.click(screen.getByLabelText('Add tab'));
    expect(onTabAdd).toHaveBeenCalledOnce();
  });

  it('applies the type and tabPosition modifier classes', () => {
    const { container } = render(
      <Tabs type="card" tabPosition="left">
        <TabPane name="a" label="A">
          A
        </TabPane>
      </Tabs>,
    );
    const root = container.querySelector('.ec-tabs');
    expect(root).toHaveClass('ec-tabs--card');
    expect(root).toHaveClass('ec-tabs--position-left');
  });

  it('does not mount lazy panes until activated', async () => {
    render(
      <Tabs>
        <TabPane name="a" label="A">
          Eager
        </TabPane>
        <TabPane name="b" label="B" lazy>
          Lazy content
        </TabPane>
      </Tabs>,
    );
    expect(screen.queryByText('Lazy content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('Lazy content')).toBeInTheDocument();
  });

  it('switches with keyboard activation', async () => {
    render(<Basic />);
    const second = screen.getByRole('tab', { name: 'Second' });
    second.focus();
    await userEvent.keyboard('{Enter}');
    expect(second).toHaveClass('is-active');
  });

  it('applies a roving tabindex (only the active tab is in the tab order)', () => {
    render(<Basic />);
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus and activates with ArrowRight / ArrowLeft', async () => {
    render(<Basic />);
    const first = screen.getByRole('tab', { name: 'First' });
    const second = screen.getByRole('tab', { name: 'Second' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(second).toHaveFocus();
    expect(second).toHaveClass('is-active');
    await userEvent.keyboard('{ArrowLeft}');
    expect(first).toHaveFocus();
    expect(first).toHaveClass('is-active');
  });

  it('skips disabled tabs and wraps with arrow keys', async () => {
    render(<Basic />);
    const first = screen.getByRole('tab', { name: 'First' });
    const second = screen.getByRole('tab', { name: 'Second' });
    second.focus();
    // Third is disabled, so ArrowRight from Second wraps to First.
    await userEvent.keyboard('{ArrowRight}');
    expect(first).toHaveFocus();
    expect(first).toHaveClass('is-active');
  });

  it('jumps to first / last enabled tab with Home and End', async () => {
    render(<Basic />);
    const first = screen.getByRole('tab', { name: 'First' });
    const second = screen.getByRole('tab', { name: 'Second' });
    second.focus();
    await userEvent.keyboard('{Home}');
    expect(first).toHaveFocus();
    // Third is disabled, so End lands on the last enabled tab (Second).
    await userEvent.keyboard('{End}');
    expect(second).toHaveFocus();
    expect(second).toHaveClass('is-active');
  });

  it('uses Up / Down arrows for vertical tab positions', async () => {
    render(
      <Tabs tabPosition="left">
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B">
          B
        </TabPane>
      </Tabs>,
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    const a = screen.getByRole('tab', { name: 'A' });
    const b = screen.getByRole('tab', { name: 'B' });
    a.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(b).toHaveFocus();
    expect(b).toHaveClass('is-active');
    await userEvent.keyboard('{ArrowUp}');
    expect(a).toHaveFocus();
  });

  it('exposes the close control as a real button', () => {
    render(
      <Tabs editable onTabRemove={vi.fn()}>
        <TabPane name="a" label="A">
          A
        </TabPane>
      </Tabs>,
    );
    const close = screen.getByLabelText('Close tab');
    expect(close.tagName).toBe('BUTTON');
    expect(close).toHaveAttribute('type', 'button');
  });

  it('closes a tab via keyboard without switching tabs', async () => {
    const onTabRemove = vi.fn();
    const onChange = vi.fn();
    render(
      <Tabs editable onTabRemove={onTabRemove} onChange={onChange}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B">
          B
        </TabPane>
      </Tabs>,
    );
    const closeButtons = screen.getAllByLabelText('Close tab');
    closeButtons[1].focus();
    await userEvent.keyboard('{Enter}');
    expect(onTabRemove).toHaveBeenCalledWith('b');
    // Activating the close control must not change the active tab.
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'A' })).toHaveClass('is-active');
  });

  it('does not fire onTabClick for a disabled tab', async () => {
    const onTabClick = vi.fn();
    render(
      <Tabs onTabClick={onTabClick}>
        <TabPane name="a" label="A">
          A
        </TabPane>
        <TabPane name="b" label="B" disabled>
          B
        </TabPane>
      </Tabs>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onTabClick).not.toHaveBeenCalled();
  });
});

describe('TabPane', () => {
  it('renders standalone as a tabpanel', () => {
    render(
      <TabPane name="solo" label="Solo">
        Solo body
      </TabPane>,
    );
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('data-name', 'solo');
    expect(panel).toHaveTextContent('Solo body');
  });
});
