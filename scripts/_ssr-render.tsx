// SSR-render each docs demo to a static-HTML Design System card for claude.ai/design.
// Bundled with esbuild (it imports TSX demos) then run with node.
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as demosMod from '../apps/docs/src/demos/index';
import catalog from '../registry/catalog.json';

const root = process.cwd();
const outDir = resolve(root, 'registry/ds-cards/cobos-ui');
mkdirSync(outDir, { recursive: true });

const demos = ((demosMod as Record<string, unknown>).demos ??
  (demosMod as Record<string, unknown>).default) as Record<string, ComponentType>;

// Shared stylesheet: built component styles (with tokens) + all brand themes.
const styles = readFileSync(resolve(root, 'packages/react/dist/styles.css'), 'utf8');
const themeFiles = ['cobos', 'enkiflow', 'getdecant', 'voltaflow']
  .map((n) => readFileSync(resolve(root, `packages/themes/dist/${n}.css`), 'utf8'))
  .join('\n');
writeFileSync(resolve(outDir, '_styles.css'), `${styles}\n${themeFiles}`);

const PAGE = `body{margin:0;padding:32px;font-family:var(--ec-font-family);background:var(--ec-bg-color);color:var(--ec-text-color-primary);line-height:1.5}
h2{font-size:22px;margin:0 0 4px;font-weight:600}.ds-sub{color:var(--ec-text-color-secondary);margin:0 0 8px;font-size:13px}`;

const card = (group: string, title: string, sub: string, body: string) =>
  `<!-- @dsCard group="${group}" -->
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><link rel="stylesheet" href="./_styles.css"><style>${PAGE}</style></head>
<body><h2>${title}</h2><p class="ds-sub">${sub}</p>${body}</body></html>
`;

// Foundations card (hand-authored swatches + theme blocks).
const TYPES = ['primary', 'success', 'warning', 'danger', 'info'];
const RAMP = ['light-9', 'light-7', 'light-5', 'light-3', '', 'dark-2'];
const swatches = TYPES.map(
  (t) =>
    `<div style="margin-bottom:10px"><div style="font-size:12px;color:var(--ec-text-color-secondary);margin-bottom:4px">${t}</div>` +
    `<div style="display:flex;gap:6px">` +
    RAMP.map(
      (r) =>
        `<div style="width:52px;height:40px;border-radius:8px;border:1px solid var(--ec-border-color-lighter);background:var(--ec-color-${t}${r ? '-' + r : ''})"></div>`,
    ).join('') +
    `</div></div>`,
).join('');
const themeBlocks = ['cobos', 'enkiflow', 'getdecant', 'voltaflow']
  .map(
    (n) =>
      `<div data-theme="${n}" style="padding:16px;border:1px solid var(--ec-border-color-light);border-radius:12px"><div style="font-size:13px;margin-bottom:10px">${n}</div>` +
      `<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">` +
      `<button class="ec-button ec-button--primary"><span>Primary</span></button>` +
      `<button class="ec-button ec-button--primary is-plain"><span>Plain</span></button>` +
      `<span class="ec-tag ec-tag--primary ec-tag--dark"><span class="ec-tag__content">Tag</span></span>` +
      `</div></div>`,
  )
  .join('');
writeFileSync(
  resolve(outDir, 'foundations.dc.html'),
  card(
    'Foundations',
    'Cobos UI — Foundations',
    'Token-driven color ramps and the four brand themes.',
    `<div style="display:flex;gap:36px;flex-wrap:wrap;align-items:flex-start"><div>${swatches}</div></div>` +
      `<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:18px">${themeBlocks}</div>`,
  ),
);

let ok = 0;
const fail: string[] = [];
for (const c of catalog.components as Array<Record<string, string>>) {
  if (c.status !== 'stable') continue;
  const Demo = demos[c.key];
  if (!Demo) {
    fail.push(`${c.key}:no-demo`);
    continue;
  }
  try {
    const body = renderToStaticMarkup(createElement(Demo));
    writeFileSync(
      resolve(outDir, `${c.key}.dc.html`),
      card(c.category, `Cobos UI — ${c.name}`, c.description ?? '', body),
    );
    ok++;
  } catch (e) {
    fail.push(`${c.key}:${String(e).slice(0, 70)}`);
  }
}
console.log(`SSR cards: ${ok} ok, ${fail.length} fail`);
if (fail.length) console.log('fails:', JSON.stringify(fail, null, 1));
