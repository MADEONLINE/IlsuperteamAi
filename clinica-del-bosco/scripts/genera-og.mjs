#!/usr/bin/env node
/**
 * Genera icone e immagini di condivisione dal logo ORIGINALE della clinica
 * (l'albero con cane, pappagallo, coniglio e gatto: public/logo/marchio.svg e
 * public/logo/logo-orizzontale-inverso.svg). Il vecchio marchio «Radura» non si usa più.
 *
 *   public/favicon.svg           il marchio vettoriale, per le schede del browser
 *   public/favicon.ico           16, 32 e 48 px
 *   public/apple-touch-icon.png  180×180, fondo bianco
 *   public/icon-192.png          192×192, fondo bianco
 *   public/icon-512.png          512×512, fondo bianco
 *   public/icon-maskable-512.png 512×512, marchio dentro l'area sicura
 *   public/og/logo.png           512×512, logo dei dati strutturati
 *   public/og/default.png        1200×630, immagine di condivisione di riserva
 *
 * Uso: node scripts/genera-og.mjs  (il .ico lo scrive questo script, senza dipendenze)
 */
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { schedaCondivisione } from '../src/lib/scheda-og.mjs';

const pub = new URL('../public/', import.meta.url);
mkdirSync(new URL('og/', pub), { recursive: true });
const marchio = readFileSync(new URL('logo/marchio.svg', pub));

/** Il marchio centrato su un quadrato pieno, con un margine in proporzione al lato. */
async function icona(lato, margine, sfondo = '#ffffff') {
  const interno = Math.round(lato - margine * 2);
  const simbolo = await sharp(marchio, { density: 600 })
    .resize(interno, interno, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width: lato, height: lato, channels: 4, background: sfondo } })
    .composite([{ input: simbolo, gravity: 'center' }])
    .png({ compressionLevel: 9 });
}

/** Il marchio su fondo trasparente, per il .ico. */
const trasparente = (lato) =>
  sharp(marchio, { density: 600 })
    .resize(lato, lato, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

/** Contenitore ICO con le immagini PNG dentro (supportato da tutti i browser attuali). */
function ico(pngs) {
  const testa = Buffer.alloc(6);
  testa.writeUInt16LE(0, 0);
  testa.writeUInt16LE(1, 2);
  testa.writeUInt16LE(pngs.length, 4);
  const voci = [];
  let offset = 6 + 16 * pngs.length;
  for (const { lato, dati } of pngs) {
    const v = Buffer.alloc(16);
    v.writeUInt8(lato >= 256 ? 0 : lato, 0);
    v.writeUInt8(lato >= 256 ? 0 : lato, 1);
    v.writeUInt8(0, 2);
    v.writeUInt8(0, 3);
    v.writeUInt16LE(1, 4);
    v.writeUInt16LE(32, 6);
    v.writeUInt32LE(dati.length, 8);
    v.writeUInt32LE(offset, 12);
    offset += dati.length;
    voci.push(v);
  }
  return Buffer.concat([testa, ...voci, ...pngs.map((p) => p.dati)]);
}

writeFileSync(new URL('favicon.svg', pub), marchio);
const pezziIco = [];
for (const lato of [16, 32, 48]) pezziIco.push({ lato, dati: await trasparente(lato) });
writeFileSync(new URL('favicon.ico', pub), ico(pezziIco));
await (await icona(180, 16)).toFile(new URL('apple-touch-icon.png', pub).pathname);
await (await icona(192, 16)).toFile(new URL('icon-192.png', pub).pathname);
await (await icona(512, 44)).toFile(new URL('icon-512.png', pub).pathname);
// Maskable: il sistema può ritagliare fino al 20% per lato, il marchio sta nel 60% centrale.
await (await icona(512, 102)).toFile(new URL('icon-maskable-512.png', pub).pathname);
await (await icona(512, 56)).toFile(new URL('og/logo.png', pub).pathname);

const scheda = await schedaCondivisione({
  titolo: 'Cura, attenzione e rispetto per ogni animale',
  sotto: 'Clinica veterinaria a Portici (NA) · Corso Umberto I 12',
});
writeFileSync(new URL('og/default.png', pub), scheda);
console.log('Icone e immagini di condivisione rigenerate dal logo originale.');
