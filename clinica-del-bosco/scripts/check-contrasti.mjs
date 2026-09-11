#!/usr/bin/env node
/**
 * Verifica i rapporti di contrasto WCAG 2.1 delle coppie di token semantici.
 * Uso: npm run check:contrasti
 * Soglie: corpo del testo ≥ 7:1 (AAA, richiesto dal brief), UI/pulsanti ≥ 4.5:1 (AA).
 */
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function blocco(selettore) {
  const i = css.indexOf(selettore);
  const inizio = css.indexOf('{', i);
  let prof = 0;
  for (let j = inizio; j < css.length; j++) {
    if (css[j] === '{') prof++;
    if (css[j] === '}') prof--;
    if (prof === 0) return css.slice(inizio + 1, j);
  }
  return '';
}
function variabili(testo) {
  const m = {};
  for (const [, k, v] of testo.matchAll(/--([\w-]+):\s*([^;]+);/g)) m[k] = v.trim();
  return m;
}
const palette = variabili(blocco('@theme {'));
const light = variabili(blocco(':root {'));
const dark = variabili(blocco(":root[data-theme='dark']"));

function risolvi(v, tema) {
  let val = v;
  for (let i = 0; i < 6 && /var\(/.test(val); i++) {
    val = val.replace(/var\(--([\w-]+)\)/g, (_, n) => tema[n] ?? palette[n] ?? '');
  }
  return val.trim();
}
function rgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.slice(0, 6),
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lum(hex) {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrasto(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const coppie = [
  ['testo', 'sfondo', 7],
  ['testo', 'sfondo-rialzato', 7],
  ['testo', 'sfondo-tinta', 7],
  ['testo-secondario', 'sfondo', 7],
  ['testo-secondario', 'sfondo-rialzato', 7],
  ['testo-secondario', 'sfondo-tinta', 4.5],
  ['testo-inverso', 'sfondo-inverso', 7],
  ['accento-inverso', 'sfondo-inverso', 4.5],
  ['primario-link', 'sfondo', 4.5],
  ['primario-link', 'sfondo-rialzato', 4.5],
  ['primario-testo', 'primario', 4.5],
  ['urgenza-testo', 'urgenza', 4.5],
  ['urgenza-testo-su-chiaro', 'urgenza-tenue', 4.5],
  ['urgenza-testo-su-chiaro', 'sfondo', 4.5],
  ['successo', 'sfondo', 4.5],
  ['errore', 'sfondo', 4.5],
  ['errore', 'sfondo-rialzato', 4.5],
  ['avviso', 'avviso-tenue', 4.5],
  ['istituzionale', 'sfondo', 4.5],
  ['istituzionale', 'sfondo-rialzato', 4.5],
  ['istituzionale-testo', 'istituzionale', 4.5],
  ['oro-scuro', 'oro-tenue', 4.5],
  ['focus', 'sfondo', 3],
  ['bordo-forte', 'sfondo', 1.5],
];

let errori = 0;
for (const [nome, tema] of [
  ['LIGHT', light],
  ['DARK', dark],
]) {
  console.log(`\n${nome}`);
  for (const [fg, bg, min] of coppie) {
    const a = risolvi(tema[fg], tema);
    const b = risolvi(tema[bg], tema);
    if (!/^#/.test(a) || !/^#/.test(b)) {
      console.log(`  ? ${fg} / ${bg}: impossibile risolvere (${a} / ${b})`);
      continue;
    }
    const c = contrasto(a, b);
    const ok = c >= min;
    if (!ok) errori++;
    console.log(
      `  ${ok ? '✓' : '✗'} ${fg.padEnd(24)} su ${bg.padEnd(16)} ${c.toFixed(2)}:1  (min ${min})`,
    );
  }
}
if (errori) {
  console.error(`\n${errori} coppie sotto soglia.`);
  process.exit(1);
}
console.log('\nTutti i contrasti rispettano le soglie.');
