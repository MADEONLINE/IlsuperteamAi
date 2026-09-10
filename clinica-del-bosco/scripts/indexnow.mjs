#!/usr/bin/env node
/**
 * IndexNow: notifica immediata a Bing/Yandex (e motori aderenti) delle URL nuove o aggiornate.
 * Uso: node scripts/indexnow.mjs [url1 url2 ...]   (senza argomenti: tutte le URL della sitemap)
 * Richiede misurazione.indexNowKey in clinica.json e il file public/<key>.txt (creato da questo script).
 * In CI: eseguito dopo il deploy di produzione (vedi .github/workflows/ci.yml, job "indexnow").
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const clinica = JSON.parse(
  readFileSync(new URL('../src/data/clinica.json', import.meta.url), 'utf8'),
);
const chiave = clinica.misurazione.indexNowKey;
if (!chiave) {
  console.log('IndexNow: nessuna chiave configurata (misurazione.indexNowKey). Salto.');
  process.exit(0);
}
const host = new URL(clinica.dominio.canonico).host;
const fileChiave = new URL(`../public/${chiave}.txt`, import.meta.url);
if (!existsSync(fileChiave)) {
  writeFileSync(fileChiave, chiave);
  console.log(`Creato public/${chiave}.txt: ricordati di fare commit e deploy prima di inviare.`);
}

let urls = process.argv.slice(2);
if (!urls.length) {
  const sitemap = new URL('../dist/sitemap-0.xml', import.meta.url);
  if (!existsSync(sitemap)) {
    console.error('dist/sitemap-0.xml non trovata: esegui prima npm run build.');
    process.exit(1);
  }
  urls = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const risposta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key: chiave,
    keyLocation: `${clinica.dominio.canonico}/${chiave}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: ${urls.length} URL inviate, risposta HTTP ${risposta.status}`);
process.exit(risposta.ok || risposta.status === 202 ? 0 : 1);
