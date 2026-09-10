#!/usr/bin/env node
/**
 * Genera un file HTML autonomo (font e script incorporati) di una pagina compilata,
 * per condividerla come anteprima senza hosting. Uso:
 *   node scripts/anteprima-artifact.mjs dist/index.html out.html
 * Esclude ClientRouter/prefetch (inutili in una pagina singola) e la CSP.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [src, out] = process.argv.slice(2);
const dist = new URL('../dist/', import.meta.url).pathname;
let html = readFileSync(src, 'utf8');

const titolo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Anteprima';
let stili = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
stili = stili.replace(/url\('?(\/fonts\/[^')]+)'?\)/g, (_, p) => {
  const b64 = readFileSync(join(dist, p)).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});
// Il reset dell'host non è in un @layer: ribadiamo lo stile del body fuori dai layer.
stili += `\nbody{background:var(--sfondo);color:var(--testo);font-family:var(--font-sans);font-size:var(--text-base);line-height:var(--text-base--line-height);margin:0}`;

const inlineHead = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? '';
const bodyClass = html.match(/<body class="([^"]*)"/)?.[1] ?? '';

const avviso = `<div style="background:#fff4d6;color:#8a5a00;font:600 13px/1.4 system-ui;padding:8px 16px;text-align:center">Anteprima statica della home (Fase 1). I link alle altre pagine non sono ancora attivi. Foto: segnaposto.</div>`;

const output = `<title>${titolo.replace(/ \| .*$/, '')}</title>
<style>${stili}</style>
<script>${inlineHead}document.body&&document.body.classList.add(${JSON.stringify(bodyClass)});</script>
${avviso}
<div class="${bodyClass}" style="display:flex;flex-direction:column;min-height:100dvh">${body}</div>`;
writeFileSync(out, output);
console.log(`Anteprima scritta in ${out} (${(output.length / 1024).toFixed(0)} KB)`);
