import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
mkdirSync(dist, { recursive: true });

const chartCss = readFileSync(resolve(root, 'src/styles.css'), 'utf8');

const header = '/* @cobos/charts styles — generated, do not edit by hand. */\n';

writeFileSync(resolve(dist, 'styles.css'), [header, chartCss].join('\n'));

console.log('@cobos/charts: wrote styles.css');
