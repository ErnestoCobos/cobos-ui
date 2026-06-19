/**
 * Copies the repo-root `registry/` artifacts into this package so they ship
 * with the published `@cobos/mcp` package. Copies:
 *   - registry/registry.json -> packages/mcp/registry/registry.json
 *   - registry/tokens.json   -> packages/mcp/registry/tokens.json
 *   - registry/r/*.json      -> packages/mcp/registry/r/*.json
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');
const repoRoot = join(pkgRoot, '..', '..');
const srcRegistry = join(repoRoot, 'registry');
const destRegistry = join(pkgRoot, 'registry');

async function main() {
  // Start from a clean destination so removed components do not linger.
  await rm(destRegistry, { recursive: true, force: true });
  await mkdir(join(destRegistry, 'r'), { recursive: true });

  await cp(join(srcRegistry, 'registry.json'), join(destRegistry, 'registry.json'));
  await cp(join(srcRegistry, 'tokens.json'), join(destRegistry, 'tokens.json'));

  const entries = await readdir(join(srcRegistry, 'r'));
  const jsonFiles = entries.filter((file) => file.endsWith('.json'));
  for (const file of jsonFiles) {
    await cp(join(srcRegistry, 'r', file), join(destRegistry, 'r', file));
  }

  process.stdout.write(
    `copy-registry: copied registry.json, tokens.json and ${jsonFiles.length} component file(s) into ${destRegistry}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`copy-registry failed: ${String(error)}\n`);
  process.exit(1);
});
