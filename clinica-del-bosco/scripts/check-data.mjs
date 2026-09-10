#!/usr/bin/env node
/**
 * Controllo dati mancanti.
 * Cerca il segnaposto {{DA_CONFERMARE}} nell'output di build (dist/) e in src/data/*.json.
 *
 *  - In sviluppo e nelle anteprime: AVVISA (exit 0) elencando i punti da sanare.
 *  - In produzione (Netlify CONTEXT=production, Vercel VERCEL_ENV=production) o con
 *    CHECK_DATA_STRICT=1: FALLISCE il build (exit 1) se un segnaposto finisce nelle pagine pubbliche.
 *
 * L'elenco completo dei dati da raccogliere è in TODO-DATI.md.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const SEGNAPOSTO = '{{DA_CONFERMARE}}';
const radice = new URL('..', import.meta.url).pathname;
const dist = join(radice, 'dist');
const dati = join(radice, 'src', 'data');

// ANTEPRIMA=1 (variabile impostata sul progetto Netlify di anteprima) disattiva il blocco:
// l'anteprima si pubblica anche con i segnaposto, il sito definitivo no.
const anteprima = process.env.ANTEPRIMA === '1';
const strict =
  !anteprima &&
  (process.env.CHECK_DATA_STRICT === '1' ||
    process.env.CONTEXT === 'production' ||
    process.env.VERCEL_ENV === 'production');

function* file(dir, estensioni) {
  if (!existsSync(dir)) return;
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) yield* file(p, estensioni);
    else if (estensioni.some((e) => nome.endsWith(e))) yield p;
  }
}

function chiaviConSegnaposto(oggetto, prefisso = '') {
  const out = [];
  for (const [k, v] of Object.entries(oggetto)) {
    const percorso = prefisso ? `${prefisso}.${k}` : k;
    if (k.startsWith('_')) continue; // chiavi di commento (_nota)
    if (typeof v === 'string' && v.includes(SEGNAPOSTO)) out.push(percorso);
    else if (v && typeof v === 'object') out.push(...chiaviConSegnaposto(v, percorso));
  }
  return out;
}

// 1) File dati
console.log('\n● Dati sorgente (src/data)');
let mancantiDati = 0;
for (const f of file(dati, ['.json'])) {
  const chiavi = chiaviConSegnaposto(JSON.parse(readFileSync(f, 'utf8')));
  if (chiavi.length) {
    mancantiDati += chiavi.length;
    console.log(`  ${relative(radice, f)}:`);
    chiavi.forEach((c) => console.log(`    – ${c}`));
  }
}
if (!mancantiDati) console.log('  nessun segnaposto.');

// 2) Output pubblico
console.log('\n● Output pubblico (dist)');
const inDist = [];
for (const f of file(dist, ['.html', '.xml', '.txt', '.json', '.js', '.md'])) {
  const testo = readFileSync(f, 'utf8');
  const n = testo.split(SEGNAPOSTO).length - 1;
  if (n) inDist.push({ f: relative(radice, f), n });
}
if (!existsSync(dist)) console.log('  dist/ non presente: esegui prima `npm run build`.');
else if (!inDist.length) console.log('  nessun segnaposto nelle pagine pubblicate.');
else {
  console.log(`  ${inDist.length} file contengono segnaposto:`);
  inDist.slice(0, 15).forEach(({ f, n }) => console.log(`    – ${f} (${n})`));
  if (inDist.length > 15) console.log(`    … e altri ${inDist.length - 15}`);
}

const totale = inDist.reduce((s, x) => s + x.n, 0);
if (inDist.length) {
  const msg = `${totale} occorrenze di ${SEGNAPOSTO} in ${inDist.length} pagine pubbliche. Vedi TODO-DATI.md.`;
  if (strict) {
    console.error(`\n✗ BUILD BLOCCATO (produzione): ${msg}`);
    process.exit(1);
  }
  console.warn(
    `\n⚠ AVVISO: ${msg}\n  In produzione questo controllo blocca il deploy (CHECK_DATA_STRICT=1 per provarlo).`,
  );
} else {
  console.log('\n✓ Nessun dato da confermare nelle pagine pubbliche.');
}
