#!/usr/bin/env node
/**
 * Genera favicon PNG/ICO, icone manifest e immagine Open Graph di default dal favicon.svg.
 * Uso: node scripts/genera-icone.mjs   (eseguito automaticamente prima del build)
 */
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));
const pub = new URL('../public/', import.meta.url);
mkdirSync(new URL('og/', pub), { recursive: true });

async function png(dim, nome, padding = 0) {
  const interno = await sharp(svg)
    .resize(dim - padding * 2)
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: dim,
      height: dim,
      channels: 4,
      background: padding ? '#1e5f41' : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: interno, left: padding, top: padding }])
    .png()
    .toFile(new URL(nome, pub).pathname);
}

await png(32, 'favicon-32.png');
await png(180, 'apple-touch-icon.png', 20);
await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(512, 'og/logo.png');

// favicon.ico (contenitore ICO con una sola immagine PNG 32x32)
const png32 = readFileSync(new URL('favicon-32.png', pub));
const header = Buffer.alloc(6 + 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(new URL('favicon.ico', pub).pathname, Buffer.concat([header, png32]));

// Open Graph di default 1200×630 (testo in SVG: sostituire con fotografia reale, vedi BRIEF-FOTO.md)
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#09211a"/>
  <circle cx="1010" cy="140" r="260" fill="#123a29"/>
  <g transform="translate(90 90) scale(2.6)">${svg.toString().replace(/<\/?svg[^>]*>/g, '')}</g>
  <text x="90" y="330" font-family="Georgia, serif" font-size="64" fill="#faf7f1" font-weight="600">Clinica Veterinaria</text>
  <text x="90" y="410" font-family="Georgia, serif" font-size="88" font-style="italic" fill="#8ec9a8" font-weight="700">del Bosco</text>
  <text x="90" y="490" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#faf7f1" opacity="0.9">Pronto soccorso veterinario 24 ore su 24 · Portici (NA)</text>
  <text x="90" y="545" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#8ec9a8">081 7763859 · Corso Umberto I 10</text>
</svg>`;
await sharp(Buffer.from(og))
  .png({ compressionLevel: 9 })
  .toFile(new URL('og/default.png', pub).pathname);
console.log('Icone e immagine OG generate in public/.');
