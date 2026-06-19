// Generates self-contained Design System preview cards for claude.ai/design.
// Each card is a standalone HTML file whose first line is a @dsCard marker; the
// built Cobos UI stylesheet (tokens + components) and all themes are inlined so
// the card renders without any external dependency.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = resolve(root, 'registry/ds-cards/cobos-ui');
mkdirSync(outDir, { recursive: true });

const stylesCss = readFileSync(resolve(root, 'packages/react/dist/styles.css'), 'utf8');
const themesCss = readFileSync(resolve(root, 'packages/themes/dist/all.css'), 'utf8').replace(
  /@import[^;]+;/g,
  '',
); // all.css @imports siblings; inline the real files instead
const themeFiles = ['cobos', 'enkiflow', 'getdecant', 'voltaflow']
  .map((n) => readFileSync(resolve(root, `packages/themes/dist/${n}.css`), 'utf8'))
  .join('\n');

const page = `
  body { margin: 0; padding: 32px; font-family: var(--ec-font-family); background: var(--ec-bg-color); color: var(--ec-text-color-primary); }
  h2 { font-size: 22px; margin: 0 0 4px; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--ec-text-color-secondary); margin: 28px 0 12px; }
  .ds-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  .ds-swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; max-width: 760px; }
  .ds-sw { height: 44px; border-radius: 8px; border: 1px solid var(--ec-border-color-lighter); }
  .ds-theme { padding: 16px; border: 1px solid var(--ec-border-color-light); border-radius: 12px; background: var(--ec-bg-color); }
  .ds-theme h4 { margin: 0 0 10px; font-size: 13px; }
`;

const card = (group, title, body) => `<!-- @dsCard group="${group}" -->
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${stylesCss}\n${themeFiles}\n${page}</style></head>
<body>${body}</body></html>
`;

const TYPES = ['primary', 'success', 'warning', 'danger', 'info'];
const RAMP = ['light-9', 'light-7', 'light-5', 'light-3', '', 'dark-2'];

const swatches = TYPES.map(
  (t) =>
    `<div><div style="font-size:12px;color:var(--ec-text-color-secondary);margin-bottom:6px">${t}</div>` +
    `<div class="ds-swatches" style="grid-template-columns:repeat(6,52px)">` +
    RAMP.map(
      (r) =>
        `<div class="ds-sw" style="background:var(--ec-color-${t}${r ? '-' + r : ''})"></div>`,
    ).join('') +
    `</div></div>`,
).join('');

const themeBlocks = ['cobos', 'enkiflow', 'getdecant', 'voltaflow']
  .map(
    (n) =>
      `<div class="ds-theme" data-theme="${n}"><h4>${n}</h4><div class="ds-row">` +
      `<button class="ec-button ec-button--primary"><span>Primary</span></button>` +
      `<button class="ec-button ec-button--primary is-plain"><span>Plain</span></button>` +
      `<span class="ec-tag ec-tag--primary ec-tag--dark"><span class="ec-tag__content">Tag</span></span>` +
      `<span class="ec-tag ec-tag--success ec-tag--light"><span class="ec-tag__content">success</span></span>` +
      `</div></div>`,
  )
  .join('');

writeFileSync(
  resolve(outDir, 'foundations.dc.html'),
  card(
    'Foundations',
    'Cobos UI — Foundations',
    `<h2>Cobos UI — Foundations</h2>
     <p style="color:var(--ec-text-color-secondary);margin:0">Token-driven color ramps and the four brand themes.</p>
     <h3>Color ramps</h3><div class="ds-row" style="gap:28px;align-items:flex-start">${swatches}</div>
     <h3>Brand themes</h3><div class="ds-row" style="gap:16px;align-items:stretch">${themeBlocks}</div>`,
  ),
);

const btnRow = (extra) =>
  TYPES.map(
    (t) =>
      `<button class="ec-button ec-button--${t}${extra}"><span>${t}</span></button>`,
  ).join('');

writeFileSync(
  resolve(outDir, 'button.dc.html'),
  card(
    'Components',
    'Cobos UI — Button',
    `<h2>Button</h2>
     <p style="color:var(--ec-text-color-secondary);margin:0">Types, plain, round, sizes and shapes.</p>
     <h3>Types</h3><div class="ds-row"><button class="ec-button"><span>default</span></button>${btnRow('')}</div>
     <h3>Plain</h3><div class="ds-row">${btnRow(' is-plain')}</div>
     <h3>Round</h3><div class="ds-row">${btnRow(' is-round')}</div>
     <h3>Sizes</h3><div class="ds-row">
       <button class="ec-button ec-button--primary ec-button--large"><span>Large</span></button>
       <button class="ec-button ec-button--primary"><span>Default</span></button>
       <button class="ec-button ec-button--primary ec-button--small"><span>Small</span></button>
     </div>`,
  ),
);

console.log('ds-cards: wrote foundations.dc.html, button.dc.html');
