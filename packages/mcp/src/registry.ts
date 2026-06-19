/**
 * Lazy, cached loader for the Cobos UI registry that is bundled with this
 * package. The registry lives at the package root (one level above `dist`),
 * so paths are resolved relative to this module via `import.meta.url`.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Lifecycle status of a component in the catalog. */
export type ComponentStatus = 'stable' | 'planned';

/** A single entry in the registry index (`registry.json`). */
export interface RegistryIndexEntry {
  key: string;
  name: string;
  category: string;
  status: ComponentStatus;
  wave?: number;
  description: string;
  export?: string;
  elementPlus?: string;
}

/** The full registry index document. */
export interface RegistryIndex {
  name: string;
  homepage: string;
  description: string;
  categories: string[];
  total: number;
  stable: number;
  components: RegistryIndexEntry[];
}

/** One source file shipped with a stable component. */
export interface ComponentFile {
  path: string;
  type: string;
  content: string;
}

/** The full detail document for a stable component (`r/<key>.json`). */
export interface ComponentDetail {
  key: string;
  name: string;
  category: string;
  status: ComponentStatus;
  wave?: number;
  description: string;
  export?: string;
  elementPlus?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  usage?: string;
  files?: ComponentFile[];
}

/** The design token document (`tokens.json`). */
export interface Tokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

/**
 * Resolve a path inside the bundled registry directory. From the built file at
 * `<pkg>/dist/index.js`, the registry sits at `<pkg>/registry`, i.e. `../registry`.
 */
function registryPath(relative: string): string {
  return fileURLToPath(new URL(`../registry/${relative}`, import.meta.url));
}

async function readJson<T>(relative: string): Promise<T> {
  const raw = await readFile(registryPath(relative), 'utf8');
  return JSON.parse(raw) as T;
}

let indexCache: RegistryIndex | undefined;
let tokensCache: Tokens | undefined;
const detailCache = new Map<string, ComponentDetail>();

/** Load and cache the registry index. */
export async function loadIndex(): Promise<RegistryIndex> {
  if (!indexCache) {
    indexCache = await readJson<RegistryIndex>('registry.json');
  }
  return indexCache;
}

/** Load and cache the design tokens. */
export async function loadTokens(): Promise<Tokens> {
  if (!tokensCache) {
    tokensCache = await readJson<Tokens>('tokens.json');
  }
  return tokensCache;
}

/** Load and cache the detail document for a stable component by its key. */
export async function loadComponentDetail(key: string): Promise<ComponentDetail | undefined> {
  const cached = detailCache.get(key);
  if (cached) return cached;
  try {
    const detail = await readJson<ComponentDetail>(`r/${key}.json`);
    detailCache.set(key, detail);
    return detail;
  } catch {
    return undefined;
  }
}

/**
 * Find an index entry by key or display name (case-insensitive). The display
 * name is also matched without spaces (e.g. "Input Number" -> "inputnumber").
 */
export async function findEntry(query: string): Promise<RegistryIndexEntry | undefined> {
  const index = await loadIndex();
  const needle = query.trim().toLowerCase();
  const compact = needle.replace(/[\s-]+/g, '');
  return index.components.find((entry) => {
    const key = entry.key.toLowerCase();
    const name = entry.name.toLowerCase();
    return (
      key === needle ||
      name === needle ||
      key.replace(/-/g, '') === compact ||
      name.replace(/\s+/g, '') === compact
    );
  });
}
