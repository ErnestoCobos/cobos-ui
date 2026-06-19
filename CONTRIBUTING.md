# Contributing to Cobos UI

Thanks for your interest in Cobos UI.

## Setup

```bash
pnpm install
pnpm build
pnpm dev
```

Requires Node >= 20 and pnpm 9.

## Project layout

- `packages/tokens` — design tokens (the single source of truth)
- `packages/react` — React components
- `packages/icons` — icon components
- `packages/mcp` — MCP server
- `apps/docs` — documentation site
- `registry/` — generated component manifests
- `docs/components` — per-component specifications

## Conventions

- Components live in `packages/react/src/components/<Name>/`.
- CSS classes and variables use the `ec-` prefix and BEM-style naming.
- Style with CSS variables only — never hardcode token values in component CSS.
- Every component ships types, a stylesheet, tests, and a docs demo.

## Workflow

1. Create a branch.
2. Make your change with tests.
3. Run `pnpm typecheck && pnpm test && pnpm lint`.
4. Add a changeset: `pnpm changeset`.
5. Open a pull request.

## License

By contributing you agree your contributions are licensed under the [MIT License](./LICENSE).
