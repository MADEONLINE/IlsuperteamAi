#!/usr/bin/env node
/**
 * Genera un file HTML autonomo (font e script incorporati) di una pagina compilata, per
 * condividerla come anteprima senza hosting. Uso:
 *   node scripts/anteprima-artifact.mjs dist/index.html out.html "Titolo" [mappa-link.json]
 * mappa-link.json: { "/pronto-soccorso": "https://…", "/prenota": "https://…" } — i link interni
 * alle pagine presenti nella mappa vengono riscritti verso le rispettive anteprime; gli altri
 * restano relativi (non attivi). Esclude ClientRouter e la CSP.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [src, out, titoloForzato, mappaFile] = process.argv.slice(2);
const dist = new URL('../dist/', import.meta.url).pathname;
let html = readFileSync(src, 'utf8');
const mappa = mappaFile && existsSync(mappaFile) ? JSON.parse(readFileSync(mappaFile, 'utf8')) : {};

const titolo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Anteprima';
let stili = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
stili = stili.replace(/url\('?(\/fonts\/[^')]+)'?\)/g, (_, p) => {
  const b64 = readFileSync(join(dist, p)).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});
stili += `\nbody{background:var(--sfondo);color:var(--testo);font-family:var(--font-sans);font-size:var(--text-base);line-height:var(--text-base--line-height);margin:0}`;

const inlineHead = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? '';
const bodyClass = html.match(/<body class="([^"]*)"/)?.[1] ?? '';

// Riscrive i link interni verso le anteprime disponibili (conserva ancore e query)
/**
 * Le immagini vengono incorporate come data URI (ridimensionate a 900 px di lato lungo):
 * l'anteprima resta un unico file apribile senza server.
 */
const cacheImmagini = new Map();
function inlineImmagine(percorso) {
  if (cacheImmagini.has(percorso)) return cacheImmagini.get(percorso);
  const file = join(dist, percorso.split('?')[0]);
  if (!existsSync(file)) return null;
  const ridotta = execFileSync(
    process.execPath,
    [
      '-e',
      `const s=require('sharp');s(process.argv[1]).resize({width:900,withoutEnlargement:true}).jpeg({quality:66,mozjpeg:true}).toBuffer().then(b=>process.stdout.write(b.toString('base64')))`,
      file,
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  ).toString();
  const uri = `data:image/jpeg;base64,${ridotta}`;
  cacheImmagini.set(percorso, uri);
  return uri;
}
// <source srcset> dei <picture>: si rimuovono, resta il fallback <img> incorporato
body = body.replace(/<source[^>]*>/g, '');
body = body.replace(/(<img[^>]*\ssrc=")(\/_astro\/[^"]+)(")/g, (m, a, percorso, b) => {
  const uri = inlineImmagine(percorso);
  return uri ? `${a}${uri}${b}` : m;
});
body = body.replace(/\ssrcset="[^"]*"/g, '');

body = body.replace(/href="(\/[^"#?]*)([#?][^"]*)?"/g, (m, path, resto = '') => {
  const chiave = path.replace(/\/$/, '') || '/';
  if (mappa[chiave]) return `href="${mappa[chiave]}${resto.startsWith('#') ? resto : ''}"`;
  return m;
});
// Immagini/PDF locali → non disponibili nell'anteprima: lasciati com'è (segnaposto)

const pagine = Object.keys(mappa).length;
const avviso = `<div style="background:#fff4d6;color:#8a5a00;font:600 13px/1.4 system-ui;padding:8px 16px;text-align:center">Anteprima statica (${pagine ? `${pagine} pagine collegate tra loro` : 'pagina singola'}; il sito completo ha 61 pagine). Foto: segnaposto in attesa del servizio fotografico. I form non inviano.</div>`;

const output = `<title>${titoloForzato ?? titolo.replace(/ \| .*$/, '')}</title>
<style>${stili}</style>
<script>${inlineHead}document.body&&document.body.classList.add(${JSON.stringify(bodyClass)});</script>
${avviso}
<div class="${bodyClass}" style="display:flex;flex-direction:column;min-height:100dvh">${body}</div>`;
writeFileSync(out, output);
console.log(`Anteprima scritta in ${out} (${(output.length / 1024).toFixed(0)} KB)`);
