# Cobos UI Documentation

Cobos UI is a React component library that ports the full Element Plus surface to React on top of a token-first foundation. This `docs/` folder holds the human-readable reference for the library.

## Where to start

- [Component reference](./components/README.md) — an index of every component, grouped by category, with links to per-component pages covering imports, usage, props, events, and accessibility.

## Wave-based roadmap

Cobos UI ships incrementally in waves so that the most-used primitives land first and the long tail follows with a consistent, predictable API:

- **Wave 1 — Stable now (25 components):** the foundational set is implemented and documented from source. It spans the Basic, Configuration, Form, Data, Navigation, Feedback, and Others categories — including Button, Layout, Input, Select, Form, Table, Tabs, Menu, Dropdown, and Dialog.
- **Wave 2 — Planned:** higher-level data, feedback, and navigation components (for example Alert, Tooltip, Drawer, Steps, Progress, Tree, and the imperative Message / Notification / MessageBox APIs).
- **Wave 3 — Planned:** the remaining specialized and virtualized components (for example Cascader, ColorPicker, Transfer, Calendar, Carousel, and the virtualized Select / Table / Tree variants).

Planned components are documented with their target category, wave, and the Element Plus component their API will mirror. As each wave lands, its pages are upgraded from a roadmap note to a full source-derived reference.

## Token-first architecture

Cobos UI is built token-first: visual decisions — color, spacing, sizing, borders, typography, and elevation — are expressed as design tokens rather than hard-coded values. Components consume these tokens through CSS custom properties (the `--ec-*` variables seen throughout the source), which means:

- **Theming is centralized.** Adjusting tokens re-themes every component at once; individual components rarely need bespoke overrides.
- **Per-instance overrides are first-class.** Many components expose convenience props (for example a Button `color`, a Switch `width`, or a Dialog `width`) that resolve to the same CSS variables, so local customization stays consistent with the global system.
- **Consistency is enforced by construction.** Sizing and disabled state flow through a shared `ConfigProvider` context, keeping density and behaviour uniform across a subtree.

To use the library, import the component(s) and the bundled stylesheet:

```ts
import { Button } from '@cobos/react';
import '@cobos/react/styles.css';
```

---

Authored and maintained by Ernesto Cobos.
