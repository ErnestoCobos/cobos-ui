import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Space } from './Space';

describe('Space', () => {
  it('renders its children', () => {
    render(
      <Space data-testid="space">
        <span>a</span>
        <span>b</span>
      </Space>,
    );
    const space = screen.getByTestId('space');
    expect(space).toHaveClass('ec-space');
    expect(space).toHaveClass('ec-space--horizontal');
  });

  it('defaults to the small (8px) gap and centered alignment', () => {
    render(
      <Space data-testid="space">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ gap: '8px', alignItems: 'center' });
  });

  it('maps named sizes to a pixel gap', () => {
    render(
      <Space data-testid="space" size="large">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ gap: '16px' });
  });

  it('accepts a numeric gap', () => {
    render(
      <Space data-testid="space" size={24}>
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ gap: '24px' });
  });

  it('applies the vertical modifier', () => {
    render(
      <Space data-testid="space" direction="vertical">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveClass('ec-space--vertical');
  });

  it('toggles wrap and fill state classes', () => {
    render(
      <Space data-testid="space" wrap fill>
        <span>a</span>
      </Space>,
    );
    const space = screen.getByTestId('space');
    expect(space).toHaveClass('is-wrap');
    expect(space).toHaveClass('is-fill');
  });

  it('applies cross-axis alignment via the alignment prop', () => {
    render(
      <Space data-testid="space" alignment="end">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ alignItems: 'flex-end' });
  });

  it('supports the deprecated align alias', () => {
    render(
      <Space data-testid="space" align="start">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ alignItems: 'flex-start' });
  });

  it('prefers alignment over the deprecated align alias', () => {
    render(
      <Space data-testid="space" alignment="baseline" align="start">
        <span>a</span>
      </Space>,
    );
    expect(screen.getByTestId('space')).toHaveStyle({ alignItems: 'baseline' });
  });
});
