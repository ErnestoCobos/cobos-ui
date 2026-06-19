# @cobos/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the **Cobos UI** design system to AI agents and MCP-aware editors. It lets an agent browse the component catalog, read component source, fetch design tokens and learn how to theme the system — all from the registry bundled with this package, so it works fully offline.

## Run it

The server speaks JSON-RPC over stdio and is published with its registry, so no extra setup is required:

```bash
npx -y @cobos/mcp
```

## Configure your MCP client

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "cobos-ui": {
      "command": "npx",
      "args": ["-y", "@cobos/mcp"]
    }
  }
}
```

After reloading the client, the `cobos-ui` server and its tools become available.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_components` | `{ category?, status?, wave? }` | Filtered catalog index (key, name, category, status, description). |
| `search_components` | `{ query }` | Ranked, case-insensitive matches over name, description and category. |
| `get_component` | `{ name }` | Full source + usage for a stable component, or status/description/Element Plus reference for a planned one. Accepts a key or display name. |
| `get_component_demo` | `{ name }` | The import/usage snippet plus a short illustrative TSX example. |
| `get_component_metadata` | `{ name }` | Category, status, wave, export name, dependencies and Element Plus URL. |
| `get_tokens` | `{ theme? }` | The design tokens as a CSS-variable map (both themes by default). |
| `get_theme` | `{}` | Theming guidance (stylesheet import, `--ec-*` overrides, dark mode) plus the full token list. |

`status` is one of `stable` or `planned`. The `theme` argument is `light` or `dark`.

## Resource

The raw catalog index is also exposed as an MCP resource at `cobos-ui://registry.json`.

## How an agent uses it

A typical flow:

1. `search_components` or `list_components` to find a component.
2. `get_component` to pull its source files and usage.
3. `get_component_demo` for a ready-to-paste example.
4. `get_tokens` / `get_theme` to match the project's theme.

## Theming quick reference

```ts
import '@cobos/react/styles.css';
```

Override any token (all are prefixed `--ec-`):

```css
:root {
  --ec-color-primary: #7c3aed;
}
```

Enable dark mode by adding the `dark` class to `<html>`:

```ts
document.documentElement.classList.toggle('dark');
```

## Development

```bash
pnpm -F @cobos/mcp build      # copy registry, then bundle with tsup
pnpm -F @cobos/mcp typecheck  # tsc --noEmit
pnpm -F @cobos/mcp test       # vitest
```

The build copies `registry/registry.json`, `registry/tokens.json` and `registry/r/*.json` from the repo root into this package via `scripts/copy-registry.mjs`, so the published package is self-contained.

## License

MIT © Ernesto Cobos
