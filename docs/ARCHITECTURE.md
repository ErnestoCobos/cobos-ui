# Architecture

Cobos UI is built **token-first** so that the same foundation powers every Cobos product
today and a dynamic, JSON-driven site builder tomorrow.

## Layers

```
┌──────────────────────────────────────────────────────────────┐
│  Products:  cobos.io · enkiflow · getdecant · client sites     │
├──────────────────────────────────────────────────────────────┤
│  Future:  JSON→UI renderer · visual editing toolbar · CRM ·    │
│           store · payments · token billing                     │
├──────────────────────────────────────────────────────────────┤
│  @cobos/mcp   ·   CLI (planned)   ·   docs site (ui.cobos.io)  │  consumers
├──────────────────────────────────────────────────────────────┤
│  registry/  (registry.json + r/*.json + tokens.json)          │  the backbone
├──────────────────────────────────────────────────────────────┤
│  @cobos/react   (components, CSS variables, prefix `ec-`)      │
├──────────────────────────────────────────────────────────────┤
│  @cobos/tokens  (source of truth → CSS variables + JSON)      │
└──────────────────────────────────────────────────────────────┘
```

## 1. Tokens are the source of truth

`@cobos/tokens` defines every color, size, radius, shadow, and motion value once in
TypeScript and compiles them to:

- **CSS variables** (`--ec-*`) in `tokens.css` — what components actually consume.
- **JSON** (`tokens.json`) — a machine-readable `{ light, dark }` map.

Because components only ever read CSS variables, restyling an entire application is a matter
of overriding variables — no component code changes. This is what lets us:

- **Homologate the Cobos look** across projects: they all import the same tokens.
- **Theme per tenant**: scope variable overrides to a container or `:root`.
- **Dark mode**: a parallel variable set under `html.dark`.

## 2. The registry is the backbone

`scripts/build-registry.mjs` reads `registry/catalog.json` (the full 80-component surface)
plus the source of every implemented component and emits:

- `registry/registry.json` — the catalog index (name, category, status, wave, description).
- `registry/r/<key>.json` — per-component source files, usage, and dependencies.
- `registry/tokens.json` — a copy of the design tokens.

**One artifact, four consumers** — this is the strategic core:

1. **`@cobos/mcp`** — AI agents discover and use components with accurate, live data.
2. **CLI (planned)** — `npx @cobos/ui add button`, shadcn-style.
3. **JSON→UI renderer (planned)** — a page is `{ tokens, tree }`; the renderer maps the tree
   to `@cobos/react` components. The JSON you inject *is* tokens + a component tree.
4. **Visual editing toolbar (planned)** — a v0-style overlay that edits token values and
   component props live; both are just JSON, written back through the same schema.

## 3. Styling conventions

- Class and variable prefix: **`ec-`** (e.g. `.ec-button`, `--ec-color-primary`).
- BEM-style naming: block `ec-button`, element `ec-button__icon`, modifier
  `ec-button--primary`, state `is-disabled`.
- Components declare component-scoped variables (e.g. `--ec-button-bg-color`) that default to
  global tokens, so a single component can be retargeted without touching the global theme.
- Plain CSS only — no Tailwind, no runtime CSS-in-JS. Consumers stay framework-agnostic.

## 4. Component API porting (Vue → React)

Components are fresh React implementations whose API mirrors Element Plus:

| Vue (Element Plus) | React (Cobos UI) |
| --- | --- |
| `v-model` | controlled `value` + `onChange`, plus uncontrolled `defaultValue` |
| `emits` | `on*` callbacks |
| slots | `children` / `render*` props |
| directives (`v-loading`) | components / hooks |
| services (`ElMessage`) | imperative API on a portal root |
| global config | `<ConfigProvider>` (React context) |

## 5. Roadmap

- **Wave 1 (now):** 25 components, tokens, registry, MCP, docs. _Stable._
- **Wave 2:** feedback (Alert, Tooltip, Drawer, Message, Notification, Loading, …),
  high-use form/data (DatePicker, Upload, Progress, Badge, Breadcrumb, Steps, …), icon set.
- **Wave 3:** remaining components up to full Element Plus parity (80 total).

Every planned component is already cataloged in `registry/catalog.json` and documented under
`docs/components/`.
