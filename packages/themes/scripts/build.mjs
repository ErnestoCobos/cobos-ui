import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createTheme, mix, readableText } from '@cobos/tokens';

import { themes } from '../dist/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '../dist');
mkdirSync(dist, { recursive: true });

const WHITE = '#ffffff';
const BLACK = '#000000';
/** Base background used to derive color ramps in dark mode (matches @cobos/tokens). */
const DARK_BG = '#141414';
/** Seed types emitted, in a stable order. */
const SEED_ORDER = ['primary', 'success', 'warning', 'danger', 'info'];

/**
 * Dark-mode override vars for one seeded color: the `light-1..9` ramp mixes
 * toward the dark background, and `dark-2` mixes toward white, while the base
 * and `-contrast` colors stay identical to the light theme.
 */
function darkSeedVars(name, seed) {
  const vars = {};
  vars[`--ec-color-${name}`] = seed;
  for (let i = 1; i <= 9; i++) {
    vars[`--ec-color-${name}-light-${i}`] = mix(DARK_BG, seed, i / 10);
  }
  vars[`--ec-color-${name}-dark-2`] = mix(WHITE, seed, 0.2);
  vars[`--ec-color-${name}-contrast`] = readableText(seed);
  return vars;
}

/** Build the dark-mode override map for a full set of seeds. */
function createDarkTheme(seeds) {
  const vars = {};
  for (const name of SEED_ORDER) {
    const seed = seeds[name];
    if (!seed) continue;
    Object.assign(vars, darkSeedVars(name, seed));
    // Mirror `error` from `danger` to match @cobos/tokens createTheme.
    if (name === 'danger') {
      Object.assign(vars, darkSeedVars('error', seed));
    }
  }
  return vars;
}

const declarations = (vars) =>
  Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

const block = (selector, vars) => `${selector} {\n${declarations(vars)}\n}\n`;

const header = '/* Cobos UI theme — generated, do not edit by hand. */\n';

const manifest = [];

for (const theme of themes) {
  const { name, label, description, seeds } = theme;

  const light = createTheme(seeds);
  const dark = createDarkTheme(seeds);

  const lightSelector = `:root[data-theme="${name}"],\n.theme-${name}`;
  const darkSelector = `html.dark[data-theme="${name}"],\nhtml.dark .theme-${name},\n[data-theme="${name}"].dark`;

  const css = `${header}${block(lightSelector, light)}\n${block(darkSelector, dark)}`;
  writeFileSync(resolve(dist, `${name}.css`), css);

  writeFileSync(
    resolve(dist, `${name}.json`),
    `${JSON.stringify({ name, seeds, light, dark }, null, 2)}\n`,
  );

  manifest.push({ name, label, description, seeds });
}

const allCss = `${header}${themes.map((t) => `@import './${t.name}.css';`).join('\n')}\n`;
writeFileSync(resolve(dist, 'all.css'), allCss);

writeFileSync(resolve(dist, 'themes.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `@cobos/themes: wrote ${themes.map((t) => `${t.name}.css/${t.name}.json`).join(', ')}, all.css, themes.json`,
);
