import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider data-testid="divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('ec-divider');
    expect(divider).toHaveClass('ec-divider--horizontal');
    expect(divider).toHaveClass('is-center');
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders a text label with the content position class', () => {
    render(
      <Divider data-testid="divider" contentPosition="left">
        Section
      </Divider>,
    );
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('is-left');
    expect(screen.getByText('Section')).toHaveClass('ec-divider__text');
  });

  it('renders the vertical variant without a text label', () => {
    render(
      <Divider data-testid="divider" direction="vertical">
        ignored
      </Divider>,
    );
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('ec-divider--vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });

  it('exposes the border style via a CSS variable', () => {
    render(<Divider data-testid="divider" borderStyle="dashed" />);
    expect(screen.getByTestId('divider')).toHaveStyle({
      '--ec-divider-border-style': 'dashed',
    });
  });
});
