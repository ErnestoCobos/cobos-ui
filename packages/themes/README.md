# @cobos/themes

Per-brand themes for **Cobos UI**, generated from the `@cobos/tokens` `createTheme` helper.
Each theme overrides only the brand accent(s) — every other token is inherited from
`@cobos/tokens` — and the `-contrast` token keeps text accessible automatically. Authored by
Ernesto Cobos.

```bash
npm install @cobos/themes
```

## Themes

| Name        | Accents                       | Character           |
| ----------- | ----------------------------- | ------------------- |
| `cobos`     | cyan `#00d4ff` + violet `#7c3aed` | operator-console |
| `enkiflow`  | lime `#a3e635`                | bright productivity |
| `getdecant` | warm espresso `#4a4239`       | editorial, refined  |
| `voltaflow` | deep navy `#0d2c54` + sky `#4ea5d9` | grounded, technical |

## Usage

Import the theme CSS once, then activate it with `data-theme` on any container:

```ts
import '@cobos/tokens/tokens.css'; // base tokens (light + dark)
import '@cobos/themes/enkiflow.css'; // enkiflow accent overrides
```

```html
<div data-theme="enkiflow">
  <!-- Cobos UI components here use the enkiflow accent -->
</div>
```

The `.theme-<name>` class works as an alternative selector:

```html
<div class="theme-enkiflow">…</div>
```

With the React package, `ConfigProvider` sets the attribute for you:

```tsx
import { ConfigProvider } from '@cobos/react';

<ConfigProvider theme="enkiflow">
  <App />
</ConfigProvider>;
```

## Light & dark

Themes compose with the base light/dark modes from `@cobos/tokens`. Each theme CSS ships two
blocks: one for the light ramp and one scoped to `html.dark`. Toggle dark mode the same way you
do globally — the theme accent follows automatically:

```html
<html class="dark">
  <body>
    <div data-theme="voltaflow">…</div>
  </body>
</html>
```

The dark block matches `html.dark[data-theme="<name>"]`, `html.dark .theme-<name>`, and
`[data-theme="<name>"].dark`, so it works whether the dark flag lives on `<html>` or on the
themed container itself.

## Load every theme at once

```ts
import '@cobos/themes/all.css';
```

This `@import`s all four theme stylesheets, so switching is just a matter of changing the
`data-theme` value.

## JSON-driven theming

Every theme is also available as data, for dynamic or server-driven theming:

```ts
import enkiflow from '@cobos/themes/enkiflow.json';
// { name, seeds, light: { '--ec-color-primary': '#a3e635', … }, dark: { … } }

import manifest from '@cobos/themes/themes.json';
// [{ name, label, description, seeds }, …]
```

Or read the metadata from the package entry point:

```ts
import { themes, themeNames, themeSeeds } from '@cobos/themes';
import { createTheme } from '@cobos/tokens';

const vars = createTheme(themeSeeds.voltaflow); // recompute the light override map
```

Apply the variables at runtime by writing them onto an element's inline style:

```ts
for (const [key, value] of Object.entries(enkiflow.light)) {
  el.style.setProperty(key, value);
}
```

## Exports

- `@cobos/themes` — `{ themes, themeNames, themeSeeds }` plus `ThemeName` / `ThemeMeta` types
- `@cobos/themes/<name>.css` — accent overrides for one theme (light + dark)
- `@cobos/themes/<name>.json` — `{ name, seeds, light, dark }` for one theme
- `@cobos/themes/all.css` — every theme stylesheet
- `@cobos/themes/themes.json` — manifest of `{ name, label, description, seeds }`

`<name>` is one of `cobos`, `enkiflow`, `getdecant`, `voltaflow`.

## License

MIT © Ernesto Cobos
