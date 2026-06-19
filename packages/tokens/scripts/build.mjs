import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { darkVars, lightVars } from '../dist/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '../dist');
mkdirSync(dist, { recursive: true });

const block = (selector, vars) =>
  `${selector} {\n${Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}\n`;

const header = '/* Cobos UI design tokens — generated, do not edit by hand. */\n';
const lightCss = block(':root', lightVars);
const darkSelector = "html.dark,\n.ec-dark,\n[data-theme='dark']";
const darkCss = block(darkSelector, darkVars);

writeFileSync(resolve(dist, 'tokens.light.css'), header + lightCss);
writeFileSync(resolve(dist, 'tokens.dark.css'), header + darkCss);
writeFileSync(resolve(dist, 'tokens.css'), `${header}${lightCss}\n${darkCss}`);
writeFileSync(
  resolve(dist, 'tokens.json'),
  `${JSON.stringify({ light: lightVars, dark: darkVars }, null, 2)}\n`,
);

console.log('@cobos/tokens: wrote tokens.css, tokens.light.css, tokens.dark.css, tokens.json');
