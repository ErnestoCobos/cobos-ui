# @cobos/react

React component library for **Cobos UI** — a token-first design system by Ernesto Cobos.

```bash
npm install @cobos/react @cobos/tokens
```

```tsx
import { Button, ConfigProvider } from '@cobos/react';
import '@cobos/react/styles.css';

export function App() {
  return (
    <ConfigProvider>
      <Button type="primary">Hello</Button>
    </ConfigProvider>
  );
}
```

## Theming

All components are styled with CSS variables (`--ec-*`). Override any token at `:root` or any
scope:

```css
:root {
  --ec-color-primary: #7c3aed;
  --ec-border-radius-base: 8px;
}
```

Dark mode: add the `dark` class to `<html>`.

## Documentation

Full component docs and live demos: <https://ui.cobos.io>

## License

MIT © Ernesto Cobos
