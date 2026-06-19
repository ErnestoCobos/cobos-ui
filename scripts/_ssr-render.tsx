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

// Static "open state" previews for portal/interactive components — SSR only
// renders their trigger, so we append a rendition of the open panel using the
// real component classes so the card is a useful visual reference.
const spinner =
  '<span class="ec-loading__icon ec-icon is-loading"><svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v160a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v160a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H768a32 32 0 1 1 0-64h160a32 32 0 0 1 32 32m-704 0a32 32 0 0 1-32 32H64a32 32 0 1 1 0-64h160a32 32 0 0 1 32 32"/></svg></span>';
const OVERLAY_PREVIEWS: Record<string, string> = {
  dialog: `<div class="ec-dialog" style="position:relative;margin:0;width:420px;max-width:100%"><div class="ec-dialog__header"><span class="ec-dialog__title">Confirm action</span><button class="ec-dialog__headerbtn" aria-label="Close">✕</button></div><div class="ec-dialog__body">A modal dialog shown in its open state, with a focus trap and dismissal in the live component.</div><div class="ec-dialog__footer"><button class="ec-button"><span>Cancel</span></button><button class="ec-button ec-button--primary"><span>Confirm</span></button></div></div>`,
  drawer: `<div class="ec-drawer ec-drawer--rtl" style="position:relative;width:320px;max-width:100%;height:240px;box-shadow:var(--ec-box-shadow)"><div class="ec-drawer__header"><span class="ec-drawer__title">Settings</span><button class="ec-drawer__close" aria-label="Close">✕</button></div><div class="ec-drawer__body">A slide-in panel, shown open.</div></div>`,
  tooltip: `<div style="display:flex;gap:16px;flex-wrap:wrap"><span class="ec-popper ec-tooltip ec-tooltip--dark" style="position:relative;display:inline-block"><span class="ec-tooltip__content">Dark tooltip</span></span><span class="ec-popper ec-tooltip ec-tooltip--light" style="position:relative;display:inline-block"><span class="ec-tooltip__content">Light tooltip</span></span></div>`,
  popover: `<div class="ec-popper ec-popover" style="position:relative;display:inline-block;width:260px"><div class="ec-popover__title">Popover title</div><div class="ec-popover__content">Rich content shown inside a popover panel.</div></div>`,
  popconfirm: `<div class="ec-popper ec-popconfirm" style="position:relative;display:inline-block;width:260px"><div class="ec-popconfirm__main"><span class="ec-popconfirm__icon">!</span><span class="ec-popconfirm__title">Delete this item?</span></div><div class="ec-popconfirm__action"><button class="ec-button ec-button--small"><span>No</span></button><button class="ec-button ec-button--primary ec-button--small"><span>Yes</span></button></div></div>`,
  message: `<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start"><div class="ec-message ec-message--success" style="position:relative"><span class="ec-message__icon">✓</span><span class="ec-message__content">Saved successfully</span></div><div class="ec-message ec-message--warning" style="position:relative"><span class="ec-message__icon">!</span><span class="ec-message__content">Check your input</span></div></div>`,
  notification: `<div class="ec-notification" style="position:relative;width:340px;max-width:100%"><span class="ec-notification__icon ec-notification--success">✓</span><div class="ec-notification__content"><div class="ec-notification__title">Shipped to production</div><div>Lighthouse 99 · &lt;1s load</div></div><button class="ec-notification__closebtn" aria-label="Close">✕</button></div>`,
  loading: `<div class="ec-loading-parent" style="position:relative;height:160px;border:1px solid var(--ec-border-color-lighter);border-radius:10px;overflow:hidden"><div style="padding:16px;color:var(--ec-text-color-secondary)">Content behind the mask…</div><div class="ec-loading ec-loading__mask" style="position:absolute;inset:0"><div class="ec-loading__spinner">${spinner}<span class="ec-loading__text">Loading…</span></div></div></div>`,
};

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
    let body = renderToStaticMarkup(createElement(Demo));
    const preview = OVERLAY_PREVIEWS[c.key];
    if (preview) {
      body += `<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--ec-text-color-secondary);margin:28px 0 12px">Open state</h3><div style="position:relative;padding:4px 0">${preview}</div>`;
    }
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
