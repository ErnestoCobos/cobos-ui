# @cobos/tokens

Design tokens for **Cobos UI** — the single source of truth for colors, sizing, typography,
radius, shadows and motion. Authored by Ernesto Cobos.

```bash
npm install @cobos/tokens
```

## Usage

Ship the CSS variables (applies `:root` light theme + `html.dark` overrides):

```ts
import '@cobos/tokens/tokens.css';
```

Read the tokens as data (for tooling, theming, or a JSON-driven renderer):

```ts
import { lightVars, darkVars, tokens, mix } from '@cobos/tokens';
// or the raw JSON:
import tokensJson from '@cobos/tokens/tokens.json';
```

## Exports

- `@cobos/tokens` — `{ lightVars, darkVars, tokens, BRAND_COLORS, mix, hexToRgb, rgbToHex }`
- `@cobos/tokens/tokens.css` — light + dark CSS variables
- `@cobos/tokens/tokens.light.css`, `@cobos/tokens/tokens.dark.css`
- `@cobos/tokens/tokens.json` — `{ light, dark }` variable maps

All variables use the `--ec-*` prefix (e.g. `--ec-color-primary`, `--ec-border-radius-base`).

## License

MIT © Ernesto Cobos
