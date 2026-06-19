import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works both at the custom domain (ui.cobos.io, root)
// and at the GitHub Pages project subpath (ernestocobos.github.io/cobos-ui/).
// Safe because the docs app uses hash-based routing.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
