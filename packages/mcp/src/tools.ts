/**
 * Registers all Cobos UI tools (and the registry resource) on an `McpServer`.
 * Each tool returns a single text content block holding either JSON or markdown.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { buildExample } from './examples.js';
import {
  findEntry,
  loadComponentDetail,
  loadIndex,
  loadTokens,
  type RegistryIndexEntry,
} from './registry.js';

/** Wrap a string payload in the MCP text-content envelope. */
function text(payload: string) {
  return { content: [{ type: 'text' as const, text: payload }] };
}

/** Wrap a value as pretty-printed JSON text content. */
function json(value: unknown) {
  return text(JSON.stringify(value, null, 2));
}

/** Project an index entry to the compact summary shape used by list/search. */
function summarize(entry: RegistryIndexEntry) {
  return {
    key: entry.key,
    name: entry.name,
    category: entry.category,
    status: entry.status,
    description: entry.description,
  };
}

const statusEnum = z.enum(['stable', 'planned']);
const themeEnum = z.enum(['light', 'dark']);

/** Register every Cobos UI MCP tool and resource on the given server. */
export function registerTools(server: McpServer): void {
  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description:
        'List the Cobos UI component catalog, optionally filtered by category, status (stable or planned) or wave. Returns the component index entries (key, name, category, status, description).',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Filter by category, e.g. Basic, Configuration, Form, Data, Navigation, Feedback, Others.',
          ),
        status: statusEnum.optional().describe('Filter by lifecycle status.'),
        wave: z.number().int().optional().describe('Filter by implementation wave number.'),
      },
    },
    async ({ category, status, wave }) => {
      const index = await loadIndex();
      const categoryNeedle = category?.trim().toLowerCase();
      const matches = index.components.filter((entry) => {
        if (categoryNeedle && entry.category.toLowerCase() !== categoryNeedle) return false;
        if (status && entry.status !== status) return false;
        if (wave !== undefined && entry.wave !== wave) return false;
        return true;
      });
      return json({
        total: matches.length,
        components: matches.map(summarize),
      });
    },
  );

  server.registerTool(
    'search_components',
    {
      title: 'Search components',
      description:
        'Case-insensitive search over component name, description and category. Returns ranked matches.',
      inputSchema: {
        query: z.string().min(1).describe('Search text to match against name, description and category.'),
      },
    },
    async ({ query }) => {
      const index = await loadIndex();
      const needle = query.trim().toLowerCase();
      const ranked = index.components
        .map((entry) => {
          const name = entry.name.toLowerCase();
          const key = entry.key.toLowerCase();
          const description = entry.description.toLowerCase();
          const cat = entry.category.toLowerCase();
          let score = 0;
          if (name === needle || key === needle) score += 100;
          if (name.startsWith(needle) || key.startsWith(needle)) score += 40;
          if (name.includes(needle) || key.includes(needle)) score += 25;
          if (description.includes(needle)) score += 10;
          if (cat.includes(needle)) score += 5;
          return { entry, score };
        })
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));
      return json({
        query,
        total: ranked.length,
        results: ranked.map((row) => ({ ...summarize(row.entry), score: row.score })),
      });
    },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get component',
      description:
        'Get a component by key or display name. For a stable component, returns the full registry detail including source files and usage. For a planned component, returns its status, description and Element Plus reference.',
      inputSchema: {
        name: z.string().min(1).describe('Component key or display name (case-insensitive).'),
      },
    },
    async ({ name }) => {
      const entry = await findEntry(name);
      if (!entry) {
        return text(`No component found matching "${name}". Use list_components or search_components to discover available components.`);
      }
      if (entry.status === 'stable') {
        const detail = await loadComponentDetail(entry.key);
        if (detail) return json(detail);
        return text(`Component "${entry.name}" is marked stable but its detail document could not be loaded.`);
      }
      return text(
        [
          `# ${entry.name} (planned)`,
          '',
          `Status: planned${entry.wave !== undefined ? ` (wave ${entry.wave})` : ''}`,
          `Category: ${entry.category}`,
          '',
          entry.description,
          '',
          'This component is not implemented in Cobos UI yet, so there is no source to install.',
          entry.elementPlus
            ? `For the intended behavior and API, see the Element Plus reference: ${entry.elementPlus}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
      );
    },
  );

  server.registerTool(
    'get_component_demo',
    {
      title: 'Get component demo',
      description:
        'Get the canonical import/usage snippet plus a short illustrative TSX example for a component.',
      inputSchema: {
        name: z.string().min(1).describe('Component key or display name (case-insensitive).'),
      },
    },
    async ({ name }) => {
      const entry = await findEntry(name);
      if (!entry) {
        return text(`No component found matching "${name}".`);
      }
      const example = buildExample(entry);
      let usage: string | undefined;
      if (entry.status === 'stable') {
        const detail = await loadComponentDetail(entry.key);
        usage = detail?.usage;
      }
      const sections = [`# ${entry.name} demo`, ''];
      if (entry.status !== 'stable') {
        sections.push(
          '> This component is planned and not implemented yet; the example below is illustrative.',
          '',
        );
      } else if (usage) {
        sections.push('## Import', '```tsx', usage, '```', '');
      }
      sections.push('## Example', '```tsx', example, '```');
      return text(sections.join('\n'));
    },
  );

  server.registerTool(
    'get_component_metadata',
    {
      title: 'Get component metadata',
      description:
        'Get metadata for a component: category, status, wave, export name, dependencies and Element Plus reference URL.',
      inputSchema: {
        name: z.string().min(1).describe('Component key or display name (case-insensitive).'),
      },
    },
    async ({ name }) => {
      const entry = await findEntry(name);
      if (!entry) {
        return text(`No component found matching "${name}".`);
      }
      let dependencies: string[] = [];
      let registryDependencies: string[] = [];
      if (entry.status === 'stable') {
        const detail = await loadComponentDetail(entry.key);
        dependencies = detail?.dependencies ?? [];
        registryDependencies = detail?.registryDependencies ?? [];
      }
      return json({
        key: entry.key,
        name: entry.name,
        category: entry.category,
        status: entry.status,
        wave: entry.wave ?? null,
        export: entry.export ?? null,
        dependencies,
        registryDependencies,
        elementPlus: entry.elementPlus ?? null,
      });
    },
  );

  server.registerTool(
    'get_tokens',
    {
      title: 'Get design tokens',
      description:
        'Get the Cobos UI design tokens as a CSS-variable map. Returns both light and dark themes by default, or a single theme when specified.',
      inputSchema: {
        theme: themeEnum.optional().describe('Return only this theme. Omit to return both.'),
      },
    },
    async ({ theme }) => {
      const tokens = await loadTokens();
      if (theme) {
        return json({ [theme]: tokens[theme] });
      }
      return json(tokens);
    },
  );

  server.registerTool(
    'get_theme',
    {
      title: 'Get theming guide',
      description:
        'Get guidance on theming Cobos UI: importing the stylesheet, overriding --ec-* CSS variables, and enabling dark mode. Includes the full token list.',
    },
    async () => {
      const tokens = await loadTokens();
      const guide = [
        '# Theming Cobos UI',
        '',
        '## 1. Import the stylesheet',
        'Import the design-system styles once at the root of your app:',
        '```ts',
        "import '@cobos/react/styles.css';",
        '```',
        '',
        '## 2. Override design tokens',
        'All tokens are CSS custom properties prefixed with `--ec-`. Override them on `:root` (or any scope) to retheme:',
        '```css',
        ':root {',
        '  --ec-color-primary: #7c3aed;',
        '  --ec-border-radius-base: 8px;',
        '}',
        '```',
        '',
        '## 3. Enable dark mode',
        'Add the `dark` class to the `<html>` element (or any ancestor) to activate the dark token set:',
        '```html',
        '<html class="dark">',
        '```',
        '```ts',
        "document.documentElement.classList.toggle('dark');",
        '```',
        '',
        '## Token reference',
        'The CSS-variable maps below define the light and dark themes.',
        '```json',
        JSON.stringify(tokens, null, 2),
        '```',
      ].join('\n');
      return text(guide);
    },
  );

  // Optional: expose the raw registry index as an MCP resource.
  server.registerResource(
    'registry',
    'cobos-ui://registry.json',
    {
      title: 'Cobos UI registry index',
      description: 'The full Cobos UI component catalog index.',
      mimeType: 'application/json',
    },
    async (uri) => {
      const index = await loadIndex();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(index, null, 2),
          },
        ],
      };
    },
  );
}
