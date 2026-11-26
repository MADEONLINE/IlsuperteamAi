/**
 * Versione di icone e immagini di condivisione: un'impronta dei file che genera
 * scripts/genera-og.mjs, messa in coda agli indirizzi (?v=…).
 *
 * Browser, iPhone e WhatsApp tengono in memoria favicon e anteprime dei link anche quando il
 * file sul server cambia: con un indirizzo nuovo sono costretti a riscaricarli. L'impronta
 * cambia da sola quando si rigenerano le icone, non c'è niente da aggiornare a mano.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const impronta = createHash('sha256');
for (const file of [
  'public/favicon.svg',
  'public/favicon.ico',
  'public/apple-touch-icon.png',
  'public/icon-192.png',
  'public/og/default.png',
]) {
  impronta.update(readFileSync(resolve(process.cwd(), file)));
}

export const versioneIcone = impronta.digest('hex').slice(0, 10);

/** "/favicon.svg" → "/favicon.svg?v=…" */
export const conVersione = (percorso: string) => `${percorso}?v=${versioneIcone}`;
