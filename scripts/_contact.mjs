// Build a contact sheet that iframes every Design System card for visual validation.
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dir = resolve(root, 'registry/ds-cards/cobos-ui');
const cards = readdirSync(dir)
  .filter((f) => f.endsWith('.dc.html'))
  .sort();

const cells = cards
  .map(
    (f) =>
      `<figure class="cell"><figcaption>${f.replace('.dc.html', '')}</figcaption>` +
      `<iframe loading="lazy" src="cobos-ui/${f}"></iframe></figure>`,
  )
  .join('\n');

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cobos UI — card contact sheet</title>
<style>
  body{margin:0;padding:20px;background:#e9e9ee;font-family:ui-monospace,monospace}
  h1{font:600 16px ui-sans-serif;margin:0 0 16px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .cell{margin:0;background:#fff;border:1px solid #ccc;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  figcaption{font-size:12px;padding:6px 10px;background:#f4f4f7;border-bottom:1px solid #e2e2e8;color:#333}
  iframe{width:100%;height:300px;border:0;display:block;background:#fff}
</style></head>
<body><h1>Cobos UI — ${cards.length} cards</h1><div class="grid">${cells}</div></body></html>`;

writeFileSync(resolve(root, 'registry/ds-cards/_contact.html'), html);
console.log('contact sheet:', cards.length, 'cards');
