import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ConfigProvider,
  useConfig,
  useDisabled,
  useSize,
  type ComponentSize,
} from './ConfigProvider';

/** Tiny consumer that reports the resolved config values it inherits. */
function Consumer() {
  const config = useConfig();
  const size = useSize();
  const disabled = useDisabled();
  return (
    <div
      data-testid="consumer"
      data-config-size={config.size}
      data-config-disabled={String(config.disabled)}
      data-config-dir={config.dir}
      data-size={size}
      data-disabled={String(disabled)}
    />
  );
}

describe('ConfigProvider', () => {
  it('inherits the parent disabled/dir when a nested provider only sets size', () => {
    render(
      <ConfigProvider disabled dir="rtl">
        <ConfigProvider size="large">
          <Consumer />
        </ConfigProvider>
      </ConfigProvider>,
    );

    const consumer = screen.getByTestId('consumer');
    // Explicitly set on the inner provider.
    expect(consumer).toHaveAttribute('data-config-size', 'large');
    expect(consumer).toHaveAttribute('data-size', 'large');
    // Inherited from the outer provider despite the inner one omitting them.
    expect(consumer).toHaveAttribute('data-config-disabled', 'true');
    expect(consumer).toHaveAttribute('data-disabled', 'true');
    expect(consumer).toHaveAttribute('data-config-dir', 'rtl');
  });

  it('composes disabled so an outer-disabled subtree stays disabled when inner omits it', () => {
    render(
      <ConfigProvider disabled>
        <ConfigProvider size="small">
          <Consumer />
        </ConfigProvider>
      </ConfigProvider>,
    );

    const consumer = screen.getByTestId('consumer');
    expect(consumer).toHaveAttribute('data-config-disabled', 'true');
    expect(consumer).toHaveAttribute('data-disabled', 'true');
    expect(consumer).toHaveAttribute('data-config-size', 'small');
  });

  it('keeps an outer-disabled subtree disabled even if an inner provider passes disabled={false}', () => {
    render(
      <ConfigProvider disabled>
        <ConfigProvider disabled={false}>
          <Consumer />
        </ConfigProvider>
      </ConfigProvider>,
    );

    const consumer = screen.getByTestId('consumer');
    // Disabling composes via OR: a child cannot re-enable a disabled subtree.
    expect(consumer).toHaveAttribute('data-config-disabled', 'true');
    expect(consumer).toHaveAttribute('data-disabled', 'true');
  });

  it('renders a wrapper element that carries the dir attribute', () => {
    const { container } = render(
      <ConfigProvider dir="rtl">
        <span>content</span>
      </ConfigProvider>,
    );

    const wrapper = container.querySelector('.ec-config-provider');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('inherits dir on the rendered wrapper of a nested provider that omits it', () => {
    const { container } = render(
      <ConfigProvider dir="rtl">
        <ConfigProvider size="large">
          <span>content</span>
        </ConfigProvider>
      </ConfigProvider>,
    );

    const wrappers = container.querySelectorAll('.ec-config-provider');
    // Both the outer and the inner wrapper should expose dir="rtl".
    expect(wrappers).toHaveLength(2);
    wrappers.forEach((wrapper) => {
      expect(wrapper).toHaveAttribute('dir', 'rtl');
    });
  });

  it('falls back to defaults with no provider', () => {
    render(<Consumer />);
    const consumer = screen.getByTestId('consumer');
    const expectedSize: ComponentSize = 'default';
    expect(consumer).toHaveAttribute('data-config-size', expectedSize);
    expect(consumer).toHaveAttribute('data-config-disabled', 'false');
    expect(consumer).toHaveAttribute('data-config-dir', 'ltr');
  });
});
