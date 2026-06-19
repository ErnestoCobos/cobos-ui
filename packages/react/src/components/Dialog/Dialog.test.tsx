import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders its content when open', () => {
    render(
      <Dialog open title="Hello">
        <p>Body content</p>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('is not in the DOM when closed', () => {
    render(
      <Dialog open={false} title="Hello">
        <p>Body content</p>
      </Dialog>,
    );
    expect(document.querySelector('.ec-dialog')).toBeNull();
    expect(screen.queryByText('Body content')).not.toBeInTheDocument();
  });

  it('stays mounted when closed if keepMounted is set', () => {
    render(
      <Dialog open={false} keepMounted title="Hello">
        <p>Body content</p>
      </Dialog>,
    );
    expect(document.querySelector('.ec-dialog')).not.toBeNull();
  });

  it('renders the title and footer', () => {
    render(
      <Dialog open title="My Title" footer={<button type="button">OK</button>}>
        Body
      </Dialog>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(document.querySelector('.ec-dialog__title')).not.toBeNull();
    expect(document.querySelector('.ec-dialog__footer')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('points aria-labelledby at the title', () => {
    render(
      <Dialog open title="Labelled">
        Body
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent('Labelled');
  });

  it('calls onClose when pressing Escape (closeOnPressEscape)', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Hello">
        Body
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on Escape when closeOnPressEscape is false', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} closeOnPressEscape={false} title="Hello">
        Body
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the overlay (closeOnClickModal)', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Hello">
        Body
      </Dialog>,
    );
    const overlay = document.querySelector('.ec-overlay') as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on overlay click when closeOnClickModal is false', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} closeOnClickModal={false} title="Hello">
        Body
      </Dialog>,
    );
    const overlay = document.querySelector('.ec-overlay') as HTMLElement;
    await userEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the close button', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Hello">
        Body
      </Dialog>,
    );
    const close = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });

  it('hides the close button when showClose is false', () => {
    render(
      <Dialog open showClose={false} title="Hello">
        Body
      </Dialog>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) on dismiss', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Hello">
        Body
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies state classes for fullscreen / center / align-center', () => {
    render(
      <Dialog open fullscreen center title="Hello">
        Body
      </Dialog>,
    );
    const dialog = document.querySelector('.ec-dialog')!;
    expect(dialog).toHaveClass('is-fullscreen');
    expect(dialog).toHaveClass('is-center');
  });

  it('renders custom header in place of the title', () => {
    render(
      <Dialog open header={<div className="custom-header">Custom</div>} title="Ignored">
        Body
      </Dialog>,
    );
    expect(document.querySelector('.custom-header')).not.toBeNull();
    expect(document.querySelector('.ec-dialog__title')).toBeNull();
  });

  it('exposes an accessible name when a custom header is provided', () => {
    render(
      <Dialog open header={<span>Custom heading</span>}>
        Body
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toHaveTextContent('Custom heading');
  });

  it('lets a consumer-supplied aria-label win over the internal label', () => {
    render(
      <Dialog open title="Internal" aria-label="External label">
        Body
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'External label');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('generates a stable title id (no Math.random)', () => {
    render(
      <Dialog open title="Stable">
        Body
      </Dialog>,
    );
    const labelId = screen.getByRole('dialog').getAttribute('aria-labelledby');
    expect(labelId).toMatch(/^ec-dialog-title-/);
  });

  describe('non-modal mode (modal={false})', () => {
    it('does not render the masking overlay layer', () => {
      render(
        <Dialog open modal={false} title="Hello">
          Body
        </Dialog>,
      );
      // No dark masking layer that would intercept clicks to the page behind.
      expect(document.querySelector('.ec-dialog__mask')).toBeNull();
      // The dialog itself still renders.
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('marks the wrapper non-modal so it does not block the page behind', () => {
      render(
        <Dialog open modal={false} title="Hello">
          Body
        </Dialog>,
      );
      const wrapper = document.querySelector('.ec-dialog__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass('is-non-modal');
    });

    it('does not set aria-modal in non-modal mode', () => {
      render(
        <Dialog open modal={false} title="Hello">
          Body
        </Dialog>,
      );
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    });

    it('does not close on outside press when there is no mask', async () => {
      const onClose = vi.fn();
      render(
        <>
          <button type="button">outside</button>
          <Dialog open modal={false} onClose={onClose} title="Hello">
            Body
          </Dialog>
        </>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'outside' }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('still closes on Escape in non-modal mode', async () => {
      const onClose = vi.fn();
      render(
        <Dialog open modal={false} onClose={onClose} title="Hello">
          Body
        </Dialog>,
      );
      await userEvent.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('beforeClose', () => {
    it('vetoes the close until done() is called', async () => {
      const onClose = vi.fn();
      const onOpenChange = vi.fn();
      const beforeClose = vi.fn();
      render(
        <Dialog
          open
          onClose={onClose}
          onOpenChange={onOpenChange}
          beforeClose={beforeClose}
          title="Hello"
        >
          Body
        </Dialog>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(beforeClose).toHaveBeenCalledTimes(1);
      // Close is suppressed while beforeClose has not invoked done().
      expect(onClose).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();

      // Now invoke the captured done callback to proceed.
      const done = beforeClose.mock.calls[0][0] as () => void;
      done();
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('intercepts Escape-driven close requests too', async () => {
      const onClose = vi.fn();
      const beforeClose = vi.fn();
      render(
        <Dialog open onClose={onClose} beforeClose={beforeClose} title="Hello">
          Body
        </Dialog>,
      );
      await userEvent.keyboard('{Escape}');
      expect(beforeClose).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
