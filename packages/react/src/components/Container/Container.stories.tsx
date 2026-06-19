import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';
import { Header } from './Header';
import { Aside } from './Aside';
import { Main } from './Main';
import { Footer } from './Footer';

const headerStyle: CSSProperties = {
  background: 'var(--ec-color-primary-light-7)',
  color: 'var(--ec-color-primary-dark-2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 500,
};
const asideStyle: CSSProperties = {
  background: 'var(--ec-color-primary-light-8)',
  color: 'var(--ec-color-primary-dark-2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const mainStyle: CSSProperties = {
  background: 'var(--ec-fill-color-light)',
  color: 'var(--ec-text-color-regular)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
};
const footerStyle: CSSProperties = { ...headerStyle, background: 'var(--ec-color-primary-light-8)' };
const frame: CSSProperties = {
  border: 'var(--ec-border)',
  borderRadius: 'var(--ec-border-radius-base)',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 520,
};

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeaderMainFooter: Story = {
  name: 'Header / Main / Footer',
  render: () => (
    <Container style={frame}>
      <Header style={headerStyle}>Header</Header>
      <Main style={mainStyle}>Main</Main>
      <Footer style={footerStyle}>Footer</Footer>
    </Container>
  ),
};

export const WithAside: Story = {
  name: 'Aside + Main',
  render: () => (
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
  ),
};
