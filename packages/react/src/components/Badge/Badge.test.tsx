import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

const badgeCss = readFileSync(resolve(process.cwd(), 'src/components/Badge/badge.css'), 'utf8');

describe('Badge', () => {
  it('renders the value inside the content element', () => {
    const { container } = render(<Badge value={5}>child</Badge>);
    expect(container.querySelector('.ec-badge__content')).toHaveTextContent('5');
  });

  it('renders the wrapper and its children', () => {
    const { container } = render(<Badge value={1}>inbox</Badge>);
    expect(container.querySelector('.ec-badge')).toHaveTextContent('inbox');
  });

  it('caps numbers above max as "max+"', () => {
    const { container } = render(<Badge value={200}>c</Badge>);
    expect(container.querySelector('.ec-badge__content')).toHaveTextContent('99+');
  });

  it('respects a custom max', () => {
    const { container } = render(
      <Badge value={15} max={10}>
        c
      </Badge>,
    );
    expect(container.querySelector('.ec-badge__content')).toHaveTextContent('10+');
  });

  it('hides the badge when value is 0 by default', () => {
    const { container } = render(<Badge value={0}>c</Badge>);
    expect(container.querySelector('.ec-badge__content')).not.toBeInTheDocument();
  });

  it('shows zero when showZero is set', () => {
    const { container } = render(
      <Badge value={0} showZero>
        c
      </Badge>,
    );
    expect(container.querySelector('.ec-badge__content')).toHaveTextContent('0');
  });

  it('hides the badge when hidden is set', () => {
    const { container } = render(
      <Badge value={5} hidden>
        c
      </Badge>,
    );
    expect(container.querySelector('.ec-badge__content')).not.toBeInTheDocument();
  });

  it('renders a dot with the is-dot class and no value text', () => {
    const { container } = render(
      <Badge isDot value={5}>
        c
      </Badge>,
    );
    const dot = container.querySelector('.ec-badge__content');
    expect(dot).toHaveClass('is-dot');
    expect(dot).toHaveTextContent('');
  });

  it('defaults to the danger type', () => {
    const { container } = render(<Badge value={1}>c</Badge>);
    expect(container.querySelector('.ec-badge__content')).toHaveClass('ec-badge__content--danger');
  });

  it('applies the requested type class', () => {
    const { container } = render(
      <Badge value={1} type="success">
        c
      </Badge>,
    );
    expect(container.querySelector('.ec-badge__content')).toHaveClass('ec-badge__content--success');
  });

  it('marks the badge as fixed when there are children', () => {
    const { container } = render(<Badge value={1}>c</Badge>);
    expect(container.querySelector('.ec-badge__content')).toHaveClass('is-fixed');
  });

  it('renders inline (not fixed) when there are no children', () => {
    const { container } = render(<Badge value={1} />);
    const content = container.querySelector('.ec-badge__content');
    expect(content).toBeInTheDocument();
    expect(content).not.toHaveClass('is-fixed');
  });

  it('applies a custom background color', () => {
    const { container } = render(
      <Badge value={1} color="rgb(0, 128, 0)">
        c
      </Badge>,
    );
    const content = container.querySelector('.ec-badge__content') as HTMLElement;
    expect(content.style.backgroundColor).toBe('rgb(0, 128, 0)');
  });

  it('applies an offset via transform', () => {
    const { container } = render(
      <Badge value={1} offset={[5, -3]}>
        c
      </Badge>,
    );
    const content = container.querySelector('.ec-badge__content') as HTMLElement;
    expect(content.style.transform).toContain('translate(5px, -3px)');
  });

  it('renders an empty value as no badge', () => {
    const { container } = render(<Badge>c</Badge>);
    expect(container.querySelector('.ec-badge__content')).not.toBeInTheDocument();
  });
});

describe('Badge color variants use contrast tokens', () => {
  const TYPES = ['primary', 'success', 'warning', 'danger', 'info'] as const;

  function block(selector: string): string {
    const start = badgeCss.indexOf(selector);
    expect(start, `${selector} block not found`).toBeGreaterThanOrEqual(0);
    const open = badgeCss.indexOf('{', start);
    const close = badgeCss.indexOf('}', open);
    return badgeCss.slice(open, close);
  }

  it.each(TYPES)('%s variant pairs the contrast token with the type fill', (type) => {
    const css = block(`.ec-badge__content--${type} {`);
    expect(css).toContain(`--ec-badge-bg-color: var(--ec-color-${type})`);
    expect(css).toContain(`--ec-badge-text-color: var(--ec-color-${type}-contrast)`);
  });
});
