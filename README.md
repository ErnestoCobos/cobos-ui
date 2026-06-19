<div align="center">

# Cobos UI

**A token-first React design system.**

Consistent, themeable, accessible components — built to power every Cobos product
and yours too.

[![npm](https://img.shields.io/npm/v/@cobos/react.svg)](https://www.npmjs.com/package/@cobos/react)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

[Documentation](https://ui.cobos.io) · [Storybook](https://ui.cobos.io/storybook) · [MCP server](#mcp-server)

</div>

---

## Why Cobos UI

- **Token-first.** Every color, size, radius, shadow and motion value is a design token
  that compiles to CSS variables (`--ec-*`) and to JSON. Restyle an entire app by swapping
  tokens — no component rewrites.
- **Framework-agnostic styling.** Plain CSS + CSS variables. No Tailwind or runtime CSS-in-JS,
  so your app never inherits a styling framework it didn't ask for.
- **Accessible by default.** Keyboard navigation and ARIA semantics baked into every component.
- **AI-ready.** A machine-readable component registry powers an [MCP server](#mcp-server) so
  AI agents can discover and use the system with accurate props — no hallucinations.

## Packages

| Package | Description |
| --- | --- |
| [`@cobos/react`](./packages/react) | React component library |
| [`@cobos/tokens`](./packages/tokens) | Design tokens → CSS variables + JSON |
| `@cobos/icons` | SVG icon set as React components _(Wave 2 — planned)_ |
| [`@cobos/mcp`](./packages/mcp) | Model Context Protocol server for AI agents |

## Installation

```bash
npm install @cobos/react @cobos/tokens
```

## Usage

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

### Theming

Override any token at the `:root` (or any scope) level:

```css
:root {
  --ec-color-primary: #7c3aed;
  --ec-border-radius-base: 8px;
}
```

Dark mode ships out of the box — add the `dark` class to `<html>`:

```html
<html class="dark">
```

## MCP server

Let AI coding agents (Cursor, VS Code, and any MCP-compatible client) use Cobos UI with live, accurate component data:

```json
{
  "mcpServers": {
    "cobos-ui": { "command": "npx", "args": ["-y", "@cobos/mcp"] }
  }
}
```

Exposes tools: `list_components`, `search_components`, `get_component`, `get_component_demo`,
`get_component_metadata`, `get_tokens`, `get_theme`.

## Development

```bash
pnpm install      # install workspace
pnpm build        # build all packages
pnpm dev          # run the docs site
pnpm test         # run tests
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © Ernesto Cobos
