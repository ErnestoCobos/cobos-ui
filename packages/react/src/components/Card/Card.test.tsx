import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders its body children', () => {
    render(<Card>Body</Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders the header when provided', () => {
    const { container } = render(<Card header="Title">Body</Card>);
    const headerEl = container.querySelector('.ec-card__header');
    expect(headerEl).toHaveTextContent('Title');
  });

  it('omits the header when not provided', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('.ec-card__header')).toBeNull();
  });

  it('renders the footer when provided', () => {
    const { container } = render(<Card footer="Foot">Body</Card>);
    expect(container.querySelector('.ec-card__footer')).toHaveTextContent('Foot');
  });

  it('applies the always-shadow class by default', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('.ec-card')).toHaveClass('is-always-shadow');
  });

  it('applies the chosen shadow class', () => {
    const { container } = render(<Card shadow="hover">Body</Card>);
    expect(container.querySelector('.ec-card')).toHaveClass('is-hover-shadow');
  });

  it('applies bodyClass and bodyStyle to the body', () => {
    const { container } = render(
      <Card bodyClass="custom-body" bodyStyle={{ padding: '0px' }}>
        Body
      </Card>,
    );
    const body = container.querySelector('.ec-card__body') as HTMLElement;
    expect(body).toHaveClass('custom-body');
    expect(body.style.padding).toBe('0px');
  });
});
