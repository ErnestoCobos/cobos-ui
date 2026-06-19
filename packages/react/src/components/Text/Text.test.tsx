import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders its children inside a span by default', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('ec-text');
  });

  it('renders the requested tag', () => {
    render(<Text tag="p">Para</Text>);
    expect(screen.getByText('Para').tagName).toBe('P');
  });

  it('applies the type and size modifier classes', () => {
    render(
      <Text type="success" size="large">
        S
      </Text>,
    );
    const el = screen.getByText('S');
    expect(el).toHaveClass('ec-text--success');
    expect(el).toHaveClass('ec-text--large');
  });

  it('adds the truncated state', () => {
    render(<Text truncated>T</Text>);
    expect(screen.getByText('T')).toHaveClass('is-truncated');
  });

  it('applies the line-clamp variable when lineClamp is set', () => {
    render(<Text lineClamp={3}>Clamp</Text>);
    const el = screen.getByText('Clamp');
    expect(el).toHaveClass('is-line-clamp');
    expect(el.style.getPropertyValue('--ec-text-line-clamp')).toBe('3');
  });
});
