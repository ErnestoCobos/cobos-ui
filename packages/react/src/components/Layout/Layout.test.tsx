import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Col } from './Col';
import { Row } from './Row';

describe('Row', () => {
  it('renders its children', () => {
    render(<Row data-testid="row">content</Row>);
    expect(screen.getByTestId('row')).toHaveClass('ec-row');
  });

  it('applies justify via inline style', () => {
    render(
      <Row data-testid="row" justify="space-between">
        x
      </Row>,
    );
    expect(screen.getByTestId('row')).toHaveStyle({ justifyContent: 'space-between' });
  });

  it('applies a negative margin from the gutter', () => {
    render(
      <Row data-testid="row" gutter={20}>
        x
      </Row>,
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveStyle({ marginLeft: '-10px', marginRight: '-10px' });
  });

  it('renders a custom tag', () => {
    render(
      <Row data-testid="row" tag="section">
        x
      </Row>,
    );
    expect(screen.getByTestId('row').tagName).toBe('SECTION');
  });
});

describe('Col', () => {
  it('applies the span class', () => {
    render(
      <Col data-testid="col" span={12}>
        x
      </Col>,
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('ec-col');
    expect(col).toHaveClass('ec-col-12');
  });

  it('applies offset and responsive classes', () => {
    render(
      <Col data-testid="col" span={6} offset={2} md={{ span: 8, offset: 1 }} lg={4}>
        x
      </Col>,
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('ec-col-6');
    expect(col).toHaveClass('ec-col-offset-2');
    expect(col).toHaveClass('ec-col-md-8');
    expect(col).toHaveClass('ec-col-md-offset-1');
    expect(col).toHaveClass('ec-col-lg-4');
  });

  it('applies base push and pull classes', () => {
    render(
      <Col data-testid="col" span={6} push={2} pull={1}>
        x
      </Col>,
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('ec-col-push-2');
    expect(col).toHaveClass('ec-col-pull-1');
  });

  it('applies responsive push and pull classes', () => {
    render(
      <Col data-testid="col" span={6} md={{ span: 8, push: 2, pull: 1 }}>
        x
      </Col>,
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('ec-col-md-8');
    expect(col).toHaveClass('ec-col-md-push-2');
    expect(col).toHaveClass('ec-col-md-pull-1');
  });

  it('inherits horizontal padding from the row gutter', () => {
    render(
      <Row gutter={20}>
        <Col data-testid="col" span={12}>
          x
        </Col>
      </Row>,
    );
    expect(screen.getByTestId('col')).toHaveStyle({
      paddingLeft: '10px',
      paddingRight: '10px',
    });
  });
});
