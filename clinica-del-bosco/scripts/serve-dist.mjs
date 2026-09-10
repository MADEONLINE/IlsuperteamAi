#!/usr/bin/env node
/**
 * Server statico minimale per dist/ con compressione brotli e header simili alla produzione
 * (Netlify/Vercel comprimono sempre). Usato da Lighthouse CI per misure realistiche.
 * Uso: node scripts/serve-dist.mjs [porta]   (default 4173)
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url).pathname;
const porta = Number(process.argv[2] ?? process.env['PORT'] ?? 4173);
const tipi = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};
const comprimibili = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.txt',
  '.svg',
  '.webmanifest',
]);
const cache = new Map();

createServer((req, res) => {
  let percorso = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (percorso.endsWith('/')) percorso += 'index.html';
  let file = normalize(join(dist, percorso));
  if (!file.startsWith(dist)) {
    res.writeHead(403);
    return res.end();
  }
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404');
  }
  const ext = extname(file);
  const tipo = tipi[ext] ?? 'application/octet-stream';
  const immutabile = percorso.startsWith('/_astro/') || percorso.startsWith('/fonts/');
  const testa = {
    'Content-Type': tipo,
    'Cache-Control': immutabile
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
    Vary: 'Accept-Encoding',
  };
  const accetta = req.headers['accept-encoding'] ?? '';
  if (comprimibili.has(ext) && accetta.includes('br')) {
    let corpo = cache.get(file);
    if (!corpo) {
      corpo = brotliCompressSync(readFileSync(file), {
        params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
      });
      cache.set(file, corpo);
    }
    res.writeHead(200, { ...testa, 'Content-Encoding': 'br', 'Content-Length': corpo.length });
    return res.end(corpo);
  }
  res.writeHead(200, { ...testa, 'Content-Length': statSync(file).size });
  createReadStream(file).pipe(res);
}).listen(porta, () => console.log(`dist/ servito su http://localhost:${porta} (brotli)`));
