import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  sourcemap: true,
  dts: false,
  // Prepend the shebang so the built entry is directly executable via `npx`.
  banner: {
    js: '#!/usr/bin/env node',
  },
});
