import { Container, Header, Aside, Main, Footer } from '@cobos/react';
import { Example, DemoStack } from './_demo';

const headerStyle: React.CSSProperties = {
  background: 'var(--ec-color-primary-light-7)',
  color: 'var(--ec-color-primary-dark-2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 500,
};
const asideStyle: React.CSSProperties = {
  background: 'var(--ec-color-primary-light-8)',
  color: 'var(--ec-color-primary-dark-2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const mainStyle: React.CSSProperties = {
  background: 'var(--ec-fill-color-light)',
  color: 'var(--ec-text-color-regular)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
};
const footerStyle: React.CSSProperties = { ...headerStyle, background: 'var(--ec-color-primary-light-8)' };

const frame: React.CSSProperties = {
  border: 'var(--ec-border)',
  borderRadius: 'var(--ec-border-radius-base)',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 520,
};

export default function ContainerDemo() {
  return (
    <DemoStack>
      <Example title="Header / Main / Footer" description="Vertical layout when a Header or Footer is present.">
        <Container style={frame}>
          <Header style={headerStyle}>Header</Header>
          <Main style={mainStyle}>Main</Main>
          <Footer style={footerStyle}>Footer</Footer>
        </Container>
      </Example>

      <Example title="Aside + Main" description="A sidebar layout: nest containers freely.">
        <Container style={frame}>
          <Header style={headerStyle}>Header</Header>
          <Container>
            <Aside width="140px" style={asideStyle}>
              Aside
            </Aside>
            <Main style={mainStyle}>Main</Main>
          </Container>
          <Footer style={footerStyle}>Footer</Footer>
        </Container>
      </Example>
    </DemoStack>
  );
}
