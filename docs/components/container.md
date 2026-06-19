# Container

Page scaffolding: Container, Header, Aside, Main, Footer.

**Category:** Basic · **Status:** Stable · **Element Plus reference:** https://element-plus.org/en-US/component/container

## Import

```ts
import { Container, Header, Aside, Main, Footer } from '@cobos/react';
import '@cobos/react/styles.css';
```

## Usage

```tsx
import { Container, Header, Aside, Main, Footer } from '@cobos/react';

export function Example() {
  return (
    <Container>
      <Header>Header</Header>
      <Container>
        <Aside width="240px">Sidebar</Aside>
        <Main>Content</Main>
      </Container>
      <Footer>Footer</Footer>
    </Container>
  );
}
```

When `direction` is omitted, `Container` lays out vertically if it has a direct `Header` or `Footer` child, otherwise horizontally.

## Props

### Container Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | auto (vertical if a direct child is a `Header`/`Footer`, otherwise horizontal) | Layout direction. |
| `children` | `ReactNode` | — | Container content. |

`Container` forwards all native `<div>` attributes.

### Header Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `string` | `'60px'` | Header height. |
| `children` | `ReactNode` | — | Header content. |

Renders a `<header>` element and forwards all native attributes.

### Aside Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `string` | `'300px'` | Aside width. |
| `children` | `ReactNode` | — | Aside content. |

Renders an `<aside>` element and forwards all native attributes.

### Main Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Main content. |

Renders a `<main>` element and forwards all native attributes.

### Footer Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `string` | `'60px'` | Footer height. |
| `children` | `ReactNode` | — | Footer content. |

Renders a `<footer>` element and forwards all native attributes.

## Events / Callbacks

None specific to these components. Native handlers are forwarded to the host elements.

## Accessibility

The sub-components render semantic landmark elements: `Header` → `<header>`, `Aside` → `<aside>`, `Main` → `<main>`, `Footer` → `<footer>`. Using them gives assistive technology meaningful page regions out of the box.
