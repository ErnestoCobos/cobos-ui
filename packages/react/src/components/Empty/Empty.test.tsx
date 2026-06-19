import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Empty } from './Empty';

describe('Empty', () => {
  it('renders the default description', () => {
    render(<Empty />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders a custom description', () => {
    render(<Empty description="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryByText('No Data')).not.toBeInTheDocument();
  });

  it('renders the built-in illustration by default', () => {
    const { container } = render(<Empty />);
    expect(container.querySelector('.ec-empty__image svg')).toBeInTheDocument();
  });

  it('renders a custom image when `image` is provided', () => {
    const { container } = render(<Empty image="/cat.png" />);
    const img = container.querySelector('.ec-empty__image img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/cat.png');
    expect(container.querySelector('.ec-empty__image svg')).not.toBeInTheDocument();
  });

  it('applies the image size', () => {
    const { container } = render(<Empty imageSize={200} />);
    const image = container.querySelector('.ec-empty__image') as HTMLElement;
    expect(image.style.width).toBe('200px');
  });

  it('renders children below the description', () => {
    render(
      <Empty>
        <button type="button">Refresh</button>
      </Empty>,
    );
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('omits the description when explicitly empty', () => {
    const { container } = render(<Empty description="" />);
    expect(container.querySelector('.ec-empty__description')).not.toBeInTheDocument();
  });
});
