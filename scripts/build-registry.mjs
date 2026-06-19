import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const reactSrc = resolve(root, 'packages/react/src');
const registryDir = resolve(root, 'registry');
const rDir = resolve(registryDir, 'r');

const catalog = JSON.parse(readFileSync(resolve(registryDir, 'catalog.json'), 'utf8'));

function readSourceFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...readSourceFiles(full));
      continue;
    }
    if (name.endsWith('.test.tsx') || name.endsWith('.test.ts')) continue;
    if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.css')) {
      out.push(full);
    }
  }
  return out;
}

mkdirSync(rDir, { recursive: true });
for (const f of readdirSync(rDir)) rmSync(join(rDir, f), { recursive: true, force: true });

const index = [];

for (const component of catalog.components) {
  const elementPlus = component.elementPlus
    ? `https://element-plus.org/en-US/component/${component.elementPlus}`
    : undefined;

  const summary = {
    key: component.key,
    name: component.name,
    category: component.category,
    status: component.status,
    wave: component.wave,
    description: component.description,
    export: component.export,
    elementPlus,
  };
  index.push(summary);

  if (component.status !== 'stable' || !component.dir) continue;

  const dir = resolve(reactSrc, component.dir);
  const files = existsSync(dir)
    ? readSourceFiles(dir).map((full) => ({
        path: `@cobos/react/${relative(reactSrc, full)}`,
        type: full.endsWith('.css') ? 'css' : 'source',
        content: readFileSync(full, 'utf8'),
      }))
    : [];

  const item = {
    ...summary,
    dependencies: ['@cobos/react', '@cobos/tokens'],
    registryDependencies: [],
    usage: `import { ${component.export} } from '@cobos/react';\nimport '@cobos/react/styles.css';`,
    files,
  };
  writeFileSync(resolve(rDir, `${component.key}.json`), `${JSON.stringify(item, null, 2)}\n`);
}

const registry = {
  name: catalog.name,
  homepage: catalog.homepage,
  description: catalog.description,
  categories: catalog.categories,
  total: index.length,
  stable: index.filter((c) => c.status === 'stable').length,
  components: index,
};
writeFileSync(resolve(registryDir, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);

const tokensJson = resolve(root, 'packages/tokens/dist/tokens.json');
if (existsSync(tokensJson)) {
  writeFileSync(resolve(registryDir, 'tokens.json'), readFileSync(tokensJson, 'utf8'));
}

console.log(`registry: ${registry.stable} stable / ${registry.total} components written to registry/`);
