import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Aside } from './Aside';
import { Container } from './Container';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';

describe('Container', () => {
  it('renders horizontally by default', () => {
    render(
      <Container data-testid="c">
        <Aside>side</Aside>
        <Main>body</Main>
      </Container>,
    );
    const container = screen.getByTestId('c');
    expect(container).toHaveClass('ec-container');
    expect(container).not.toHaveClass('is-vertical');
  });

  it('auto-detects vertical direction when a Header is present', () => {
    render(
      <Container data-testid="c">
        <Header>top</Header>
        <Main>body</Main>
      </Container>,
    );
    expect(screen.getByTestId('c')).toHaveClass('is-vertical');
  });

  it('honors an explicit direction', () => {
    render(
      <Container data-testid="c" direction="horizontal">
        <Header>top</Header>
        <Main>body</Main>
      </Container>,
    );
    expect(screen.getByTestId('c')).not.toHaveClass('is-vertical');
  });

  it('applies height and width via CSS variables', () => {
    render(
      <>
        <Header data-testid="header" height="80px">
          top
        </Header>
        <Aside data-testid="aside" width="220px">
          side
        </Aside>
        <Footer data-testid="footer" height="40px">
          bottom
        </Footer>
      </>,
    );
    expect(screen.getByTestId('header')).toHaveStyle({ '--ec-header-height': '80px' });
    expect(screen.getByTestId('aside')).toHaveStyle({ '--ec-aside-width': '220px' });
    expect(screen.getByTestId('footer')).toHaveStyle({ '--ec-footer-height': '40px' });
  });

  it('renders Main as a <main> element', () => {
    render(<Main data-testid="main">body</Main>);
    expect(screen.getByTestId('main').tagName).toBe('MAIN');
  });

  it('renders the container root as a <section> element', () => {
    render(
      <Container data-testid="c">
        <Main>body</Main>
      </Container>,
    );
    expect(screen.getByTestId('c').tagName).toBe('SECTION');
  });
});
