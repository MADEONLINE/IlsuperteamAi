/**
 * Scheda di condivisione 1200×630 (Open Graph) con il logo ORIGINALE della clinica,
 * usata dalla rotta src/pages/og/[...slug].png.ts e da scripts/genera-og.mjs.
 *
 * Il testo è reso da sharp con i font di sistema, che cambiano da macchina a macchina:
 * la misura del titolo è prudente e rimpicciolisce finché il titolo non sta nel riquadro.
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FONDO = '#05262b';
const ALONE = '#0d4249';
const TESTO = '#f3f6f4';
const SOTTO = '#a9d6c4';
const QUATTRO = ['#459fdd', '#b42095', '#9ab521', '#2a7f61'];

const LARGHEZZA_UTILE = 1040;
const RAPPORTO = 0.62;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function spezza(testo, maxCaratteri) {
  const righe = [];
  let riga = '';
  for (const parola of testo.split(' ')) {
    if (riga && (riga + ' ' + parola).length > maxCaratteri) {
      righe.push(riga);
      riga = parola;
    } else riga = riga ? riga + ' ' + parola : parola;
  }
  if (riga) righe.push(riga);
  return righe;
}

function impagina(titolo) {
  for (const dim of [68, 60, 54, 48, 42]) {
    const maxCaratteri = Math.floor(LARGHEZZA_UTILE / (dim * RAPPORTO));
    const righe = spezza(titolo, maxCaratteri);
    if (righe.length <= 3 && righe.every((r) => r.length <= maxCaratteri)) return { righe, dim };
  }
  const dim = 42;
  return { righe: spezza(titolo, Math.floor(LARGHEZZA_UTILE / (dim * RAPPORTO))).slice(0, 4), dim };
}

let logoInCache;
/** Logo orizzontale in versione chiara, letto da public/ (la build parte dalla radice del progetto). */
async function logo() {
  if (!logoInCache) {
    const svg = readFileSync(resolve(process.cwd(), 'public/logo/logo-orizzontale-inverso.svg'));
    logoInCache = await sharp(svg, { density: 300 }).resize({ width: 380 }).png().toBuffer();
  }
  return logoInCache;
}

/**
 * @param {{ titolo: string, sotto?: string, piede?: string }} dati
 * @returns {Promise<Buffer>} PNG 1200×630
 */
export async function schedaCondivisione({ titolo, sotto = '', piede = 'Pronto soccorso 24 ore su 24 · 081 7763859 · Portici (NA)' }) {
  const { righe, dim } = impagina(titolo);
  const inizio = 290;
  const passo = dim + 12;
  const ySotto = inizio + (righe.length - 1) * passo + 58;
  // Sottotitolo: al massimo due righe, tagliate a fine parola con i puntini.
  let righeSotto = sotto ? spezza(sotto, 62) : [];
  if (righeSotto.length > 2) {
    const seconda = righeSotto[1].replace(/[\s,;:.–-]+$/, '');
    righeSotto = [righeSotto[0], `${seconda}…`];
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <radialGradient id="alone" cx="1" cy="0" r="0.9">
        <stop offset="0" stop-color="${ALONE}"/>
        <stop offset="1" stop-color="${FONDO}"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#alone)"/>
    ${righe
      .map(
        (r, i) =>
          `<text x="80" y="${inizio + i * passo}" font-family="Georgia, 'Times New Roman', serif" font-size="${dim}" font-weight="600" fill="${TESTO}">${escape(r)}</text>`,
      )
      .join('')}
    ${righeSotto
      .map(
        (r, i) =>
          `<text x="80" y="${ySotto + i * 38}" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="${SOTTO}">${escape(r)}</text>`,
      )
      .join('')}
    <text x="80" y="574" font-family="Helvetica, Arial, sans-serif" font-size="25" fill="${TESTO}" fill-opacity="0.82">${escape(piede)}</text>
    ${QUATTRO.map((c, i) => `<rect x="${i * 300}" y="620" width="300" height="10" fill="${c}"/>`).join('')}
  </svg>`;
  return sharp(Buffer.from(svg))
    .composite([{ input: await logo(), left: 80, top: 62 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
