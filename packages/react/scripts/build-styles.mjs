import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
mkdirSync(dist, { recursive: true });

function walkCss(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walkCss(full));
    else if (name.endsWith('.css')) files.push(full);
  }
  return files;
}

const tokensCss = readFileSync(resolve(root, '../tokens/dist/tokens.css'), 'utf8');
const baseCss = readFileSync(resolve(root, 'src/styles/base.css'), 'utf8');
const componentCss = walkCss(resolve(root, 'src/components'))
  .sort()
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

const header = '/* Cobos UI styles — generated, do not edit by hand. */\n';

writeFileSync(resolve(dist, 'styles.css'), [header, tokensCss, baseCss, componentCss].join('\n'));
writeFileSync(
  resolve(dist, 'components.css'),
  [header, baseCss, componentCss].join('\n'),
);

console.log('@cobos/react: wrote styles.css (with tokens) and components.css');
