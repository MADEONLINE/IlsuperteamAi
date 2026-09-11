/**
 * Immagini Open Graph generate a build time (1200×630) per le pagine principali,
 * con titolo reale della pagina. Nessun servizio esterno.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { clinica } from '@lib/clinica';
import { radura, lockup, coloriMarchio } from '@lib/marchio';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Manda a capo e sceglie il corpo in base alla larghezza stimata.
 *
 * Il testo qui è reso da sharp con i font di sistema, che cambiano da macchina
 * a macchina (in locale "Georgia, serif" diventa DejaVu Serif, molto più largo).
 * Per questo la misura non si fida del numero di caratteri: stima la larghezza
 * con un rapporto prudente e rimpicciolisce finché il titolo non sta dentro.
 */
const LARGHEZZA_UTILE = 1040;
/** Rapporto larghezza/corpo per carattere, tarato sul serif più largo plausibile. */
const RAPPORTO = 0.62;

function spezza(testo: string, maxCaratteri: number): string[] {
  const righe: string[] = [];
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

/** Restituisce le righe e il corpo più grande con cui il titolo sta nel riquadro. */
function impagina(titolo: string): { righe: string[]; dim: number } {
  for (const dim of [72, 64, 56, 48, 42]) {
    const maxCaratteri = Math.floor(LARGHEZZA_UTILE / (dim * RAPPORTO));
    const righe = spezza(titolo, maxCaratteri);
    if (righe.length <= 3 && righe.every((r) => r.length <= maxCaratteri)) return { righe, dim };
  }
  const dim = 42;
  const maxCaratteri = Math.floor(LARGHEZZA_UTILE / (dim * RAPPORTO));
  return { righe: spezza(titolo, maxCaratteri).slice(0, 4), dim };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const servizi = await getCollection('servizi');
  const articoli = await getCollection('articoli');
  const zone = await getCollection('zone');
  const campagne = await getCollection('campagne');
  const statiche: Array<[string, string, string]> = [
    [
      'pronto-soccorso',
      'Pronto soccorso veterinario 24 ore su 24',
      'Siamo aperti adesso · Portici',
    ],
    ['prenota', 'Prenota una visita', 'Ti richiamiamo entro 24 ore'],
    ['piani-salute', 'Piani Salute', 'Prevenzione programmata per cani e gatti'],
    [
      'per-i-colleghi',
      'TAC, endoscopia e chirurgia in service',
      'Il paziente torna sempre al collega',
    ],
    ['la-struttura', 'La struttura', 'Ospedale veterinario h24 a Portici'],
    ['equipe', 'Équipe medica', 'Medici presenti, non reperibili'],
    ['servizi', 'Tutti i servizi', 'Dalla visita alla terapia intensiva'],
    ['magazine', 'Magazine', 'Guide scritte dai nostri medici'],
    ['contatti', 'Contatti e come arrivare', clinica.contatti.telefono.visualizzato],
    ['domande-frequenti', 'Domande frequenti', 'Urgenze, visite, costi, esami'],
  ];
  return [
    ...statiche.map(([slug, titolo, sotto]) => ({ params: { slug }, props: { titolo, sotto } })),
    ...servizi.map((s) => ({
      params: { slug: `servizi/${s.id}` },
      props: { titolo: s.data.titoloBreve, sotto: s.data.sottotitolo },
    })),
    ...articoli.map((a) => ({
      params: { slug: `magazine/${a.id}` },
      props: { titolo: a.data.titolo, sotto: 'Magazine · guida clinica' },
    })),
    ...campagne.map((c) => ({
      params: { slug: `campagne/${c.id}` },
      props: { titolo: c.data.titolo, sotto: `Campagna · ${c.data.periodo}` },
    })),
    ...zone.map((z) => ({
      params: { slug: `veterinario-a/${z.id}` },
      props: { titolo: `Veterinario a ${z.data.nome}`, sotto: 'Aperto 24 ore su 24' },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const { titolo, sotto } = props as { titolo: string; sotto: string };
  const { righe, dim } = impagina(titolo);
  // Lockup ufficiale in versione reverse (monocromatica off-white), tracciati
  // vettoriali: nessun font da risolvere, resa identica su qualsiasi macchina.
  const scalaMarchio = lockup.marchio.larghezza / 1624;
  const marchioReverse = `<g transform="translate(80 54) scale(0.62)" fill="${coloriMarchio.offWhite}">
      <g transform="scale(${scalaMarchio.toFixed(6)})">
        <path fill-rule="evenodd" d="${radura.fronda}"/>
        <path fill-rule="evenodd" d="${radura.petrolio}"/>
        <path fill-rule="evenodd" d="${radura.sabbia}"/>
      </g>
      <rect x="${lockup.filetto.x}" y="${lockup.filetto.y}" width="${lockup.filetto.larghezza}" height="${lockup.filetto.altezza}"/>
      <path d="${lockup.sopra}"/>
      <path d="${lockup.nome}"/>
    </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="${coloriMarchio.petrolioCupo}"/>
    <circle cx="1040" cy="120" r="300" fill="${coloriMarchio.petrolio}"/>
    ${marchioReverse}
    <rect x="80" y="168" width="64" height="3" fill="${coloriMarchio.sabbia}"/>
    ${righe.map((r, i) => `<text x="80" y="${250 + i * (dim + 14)}" font-family="Georgia, serif" font-size="${dim}" font-weight="600" fill="${coloriMarchio.offWhite}">${escape(r)}</text>`).join('')}
    <text x="80" y="${250 + righe.length * (dim + 14) + 16}" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="${coloriMarchio.sabbia}">${escape(sotto.slice(0, 70))}</text>
    <text x="80" y="580" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${coloriMarchio.offWhite}" opacity="0.85">Pronto soccorso 24/7 · ${escape(clinica.contatti.telefono.visualizzato)} · Portici (NA)</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
