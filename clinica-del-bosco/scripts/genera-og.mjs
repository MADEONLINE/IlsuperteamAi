#!/usr/bin/env node
/**
 * Genera le due immagini di condivisione statiche a partire dal marchio ufficiale:
 *   public/og/logo.png    512×512  — logo dell'organizzazione nei dati strutturati
 *   public/og/default.png 1200×630 — immagine Open Graph di riserva
 *
 * Uso: node scripts/genera-og.mjs
 *
 * Le favicon NON si generano più da qui: arrivano dal kit ufficiale di identità
 * visiva (cartella favicon/), che per le misure minime usa una variante
 * semplificata del marchio disegnata apposta. Rigenerarle da questo script
 * significherebbe sovrascrivere il disegno approvato.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { radura, lockup, coloriMarchio } from '../src/lib/marchio.js';

const pub = new URL('../public/', import.meta.url);
mkdirSync(new URL('og/', pub), { recursive: true });

const scalaMarchio = lockup.marchio.larghezza / 1624;

/** Il lockup completo, in un colore solo. */
const lockupSvg = (colore) => `<g fill="${colore}">
    <g transform="scale(${scalaMarchio.toFixed(6)})">
      <path fill-rule="evenodd" d="${radura.fronda}"/>
      <path fill-rule="evenodd" d="${radura.petrolio}"/>
      <path fill-rule="evenodd" d="${radura.sabbia}"/>
    </g>
    <rect x="${lockup.filetto.x}" y="${lockup.filetto.y}" width="${lockup.filetto.larghezza}" height="${lockup.filetto.altezza}"/>
    <path d="${lockup.sopra}"/>
    <path d="${lockup.nome}"/>
  </g>`;

// --- Logo per i dati strutturati: la Radura a colori su fondo chiaro.
// Google lo mostra su fondo bianco, quindi niente versione reverse.
const LATO = 512;
const MARGINE = 64; // area di rispetto attorno al marchio
const scalaLogo = (LATO - MARGINE * 2) / 1737; // il marchio è più alto che largo
const logoX = (LATO - 1624 * scalaLogo) / 2;
const logoY = (LATO - 1737 * scalaLogo) / 2;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="${LATO}" height="${LATO}">
  <rect width="${LATO}" height="${LATO}" fill="${coloriMarchio.offWhite}"/>
  <g transform="translate(${logoX.toFixed(2)} ${logoY.toFixed(2)}) scale(${scalaLogo.toFixed(6)})">
    <path fill="${coloriMarchio.verde}" fill-rule="evenodd" d="${radura.fronda}"/>
    <path fill="${coloriMarchio.petrolio}" fill-rule="evenodd" d="${radura.petrolio}"/>
    <path fill="${coloriMarchio.sabbia}" fill-rule="evenodd" d="${radura.sabbia}"/>
  </g>
</svg>`;
await sharp(Buffer.from(logo))
  .png({ compressionLevel: 9 })
  .toFile(new URL('og/logo.png', pub).pathname);

// --- Open Graph di riserva: lockup reverse su petrolio cupo.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${coloriMarchio.petrolioCupo}"/>
  <circle cx="1040" cy="120" r="300" fill="${coloriMarchio.petrolio}"/>
  <g transform="translate(80 54) scale(0.62)">${lockupSvg(coloriMarchio.offWhite)}</g>
  <rect x="80" y="168" width="64" height="3" fill="${coloriMarchio.sabbia}"/>
  <text x="80" y="266" font-family="Georgia, serif" font-size="66" font-weight="600" fill="${coloriMarchio.offWhite}">Pronto soccorso</text>
  <text x="80" y="344" font-family="Georgia, serif" font-size="66" font-weight="600" fill="${coloriMarchio.offWhite}">24 ore su 24</text>
  <text x="80" y="424" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="${coloriMarchio.sabbia}">Ospedale veterinario a Portici (NA)</text>
  <text x="80" y="580" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${coloriMarchio.offWhite}" opacity="0.85">081 7763859 · Corso Umberto I 10</text>
</svg>`;
await sharp(Buffer.from(og))
  .png({ compressionLevel: 9 })
  .toFile(new URL('og/default.png', pub).pathname);

console.log('Generati public/og/logo.png e public/og/default.png dal marchio ufficiale.');
