import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders its content when open', () => {
    render(
      <Drawer open title="Hello">
        <p>Body content</p>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('is not in the DOM when closed', () => {
    render(
      <Drawer open={false} title="Hello">
        <p>Body content</p>
      </Drawer>,
    );
    expect(document.querySelector('.ec-drawer')).toBeNull();
    expect(screen.queryByText('Body content')).not.toBeInTheDocument();
  });

  it('stays mounted when closed if keepMounted is set', () => {
    render(
      <Drawer open={false} keepMounted title="Hello">
        <p>Body content</p>
      </Drawer>,
    );
    expect(document.querySelector('.ec-drawer')).not.toBeNull();
  });

  it('defaults to the rtl direction', () => {
    render(
      <Drawer open title="Hello">
        Body
      </Drawer>,
    );
    const panel = document.querySelector('.ec-drawer')!;
    expect(panel).toHaveClass('ec-drawer--rtl');
    expect(panel).toHaveAttribute('data-direction', 'rtl');
  });

  it('applies the requested direction modifier', () => {
    render(
      <Drawer open direction="btt" title="Hello">
        Body
      </Drawer>,
    );
    const panel = document.querySelector('.ec-drawer')!;
    expect(panel).toHaveClass('ec-drawer--btt');
    expect(panel).toHaveAttribute('data-direction', 'btt');
  });

  it('drives the size via the --ec-drawer-size custom property', () => {
    render(
      <Drawer open size={400} title="Hello">
        Body
      </Drawer>,
    );
    const panel = document.querySelector('.ec-drawer') as HTMLElement;
    expect(panel.style.getPropertyValue('--ec-drawer-size')).toBe('400px');
  });

  it('accepts a string size verbatim', () => {
    render(
      <Drawer open size="50%" title="Hello">
        Body
      </Drawer>,
    );
    const panel = document.querySelector('.ec-drawer') as HTMLElement;
    expect(panel.style.getPropertyValue('--ec-drawer-size')).toBe('50%');
  });

  it('renders the title and footer', () => {
    render(
      <Drawer open title="My Title" footer={<button type="button">OK</button>}>
        Body
      </Drawer>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(document.querySelector('.ec-drawer__title')).not.toBeNull();
    expect(document.querySelector('.ec-drawer__footer')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('points aria-labelledby at the title', () => {
    render(
      <Drawer open title="Labelled">
        Body
      </Drawer>,
    );
    const drawer = screen.getByRole('dialog');
    const labelId = drawer.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent('Labelled');
  });

  it('sets aria-modal when modal', () => {
    render(
      <Drawer open title="Hello">
        Body
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('does not render the header when withHeader is false', () => {
    render(
      <Drawer open withHeader={false} title="Hello">
        Body
      </Drawer>,
    );
    expect(document.querySelector('.ec-drawer__header')).toBeNull();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('calls onClose when pressing Escape (closeOnPressEscape)', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Hello">
        Body
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on Escape when closeOnPressEscape is false', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} closeOnPressEscape={false} title="Hello">
        Body
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the overlay (closeOnClickModal)', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Hello">
        Body
      </Drawer>,
    );
    const overlay = document.querySelector('.ec-overlay') as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on overlay click when closeOnClickModal is false', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} closeOnClickModal={false} title="Hello">
        Body
      </Drawer>,
    );
    const overlay = document.querySelector('.ec-overlay') as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the close button', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Hello">
        Body
      </Drawer>,
    );
    const close = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });

  it('hides the close button when showClose is false', () => {
    render(
      <Drawer open showClose={false} title="Hello">
        Body
      </Drawer>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) on dismiss', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Hello">
        Body
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('lets a consumer-supplied aria-label win over the internal label', () => {
    render(
      <Drawer open title="Internal" aria-label="External label">
        Body
      </Drawer>,
    );
    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveAttribute('aria-label', 'External label');
    expect(drawer).not.toHaveAttribute('aria-labelledby');
  });

  describe('non-modal mode (modal={false})', () => {
    it('does not render the masking overlay layer', () => {
      render(
        <Drawer open modal={false} title="Hello">
          Body
        </Drawer>,
      );
      expect(document.querySelector('.ec-drawer__mask')).toBeNull();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('marks the wrapper non-modal so it does not block the page behind', () => {
      render(
        <Drawer open modal={false} title="Hello">
          Body
        </Drawer>,
      );
      const wrapper = document.querySelector('.ec-drawer__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass('is-non-modal');
    });

    it('does not set aria-modal in non-modal mode', () => {
      render(
        <Drawer open modal={false} title="Hello">
          Body
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    });

    it('does not close on outside press when there is no mask', async () => {
      const onClose = vi.fn();
      render(
        <>
          <button type="button">outside</button>
          <Drawer open modal={false} onClose={onClose} title="Hello">
            Body
          </Drawer>
        </>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'outside' }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('still closes on Escape in non-modal mode', async () => {
      const onClose = vi.fn();
      render(
        <Drawer open modal={false} onClose={onClose} title="Hello">
          Body
        </Drawer>,
      );
      await userEvent.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });
});
