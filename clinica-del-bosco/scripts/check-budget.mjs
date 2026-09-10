#!/usr/bin/env node
/**
 * Budget di peso: JS totale compresso (brotli) per pagina.
 *  - home: < 90 KB   - /pronto-soccorso: < 40 KB   - ogni altra pagina: < 90 KB
 * Stima: somma degli script referenziati nell'HTML + script inline, compressi con brotli.
 * Uso: node scripts/check-budget.mjs (dopo il build)
 */
import { brotliCompressSync } from 'node:zlib';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pagine = [
  ['index.html', 90],
  ['pronto-soccorso.html', 40],
  ['servizi/chirurgia.html', 90],
  ['prenota.html', 90],
];
const kb = (b) => (brotliCompressSync(b).length / 1024).toFixed(1);
let errori = 0;
for (const [pagina, limite] of pagine) {
  const percorso = join(dist, pagina);
  if (!existsSync(percorso)) {
    console.log(`– ${pagina}: non presente (pagina ancora da creare)`);
    continue;
  }
  const html = readFileSync(percorso, 'utf8');
  let totale = 0;
  for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (src.startsWith('http')) continue; // script terzi (Plausible ~1 KB) esclusi dal budget interno
    const f = join(dist, src.replace(/^\//, ''));
    if (existsSync(f)) totale += brotliCompressSync(readFileSync(f)).length;
  }
  for (const [, inline] of html.matchAll(
    /<script(?![^>]*src=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    totale += brotliCompressSync(Buffer.from(inline)).length;
  }
  const tot = totale / 1024;
  const ok = tot < limite;
  if (!ok) errori++;
  console.log(
    `${ok ? '✓' : '✗'} ${pagina}: ${tot.toFixed(1)} KB JS (brotli) — limite ${limite} KB — HTML ${kb(Buffer.from(html))} KB`,
  );
}
if (errori) {
  console.error(`\n${errori} pagine oltre il budget JS.`);
  process.exit(1);
}
