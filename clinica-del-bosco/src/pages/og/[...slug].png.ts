/**
 * Immagini Open Graph generate a build time (1200×630) per le pagine principali,
 * con titolo reale della pagina. Nessun servizio esterno.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { clinica } from '@lib/clinica';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function spezza(testo: string, max = 30): string[] {
  const parole = testo.split(' ');
  const righe: string[] = [];
  let riga = '';
  for (const p of parole) {
    if ((riga + ' ' + p).trim().length > max) {
      righe.push(riga.trim());
      riga = p;
    } else riga += ' ' + p;
  }
  if (riga.trim()) righe.push(riga.trim());
  return righe.slice(0, 4);
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
  const righe = spezza(titolo);
  const dim = righe.length > 2 ? 60 : 72;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#09211a"/>
    <circle cx="1040" cy="120" r="300" fill="#123a29"/>
    <g transform="translate(80 70)"><circle cx="24" cy="24" r="24" fill="#8ec9a8"/><path d="M24 8c-5.4 5-10.8 10-10.8 16.8a10.8 10.8 0 0 0 21.6 0C34.8 18 29.4 13 24 8Z" fill="#09211a"/><path d="M24 17v16M15.6 25h16.8" stroke="#8ec9a8" stroke-width="3.6" stroke-linecap="round"/></g>
    <text x="140" y="104" font-family="Georgia, serif" font-size="30" fill="#faf7f1">Clinica Veterinaria <tspan font-style="italic" font-weight="700" fill="#8ec9a8">del Bosco</tspan></text>
    ${righe.map((r, i) => `<text x="80" y="${250 + i * (dim + 14)}" font-family="Georgia, serif" font-size="${dim}" font-weight="600" fill="#faf7f1">${escape(r)}</text>`).join('')}
    <text x="80" y="${250 + righe.length * (dim + 14) + 16}" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#8ec9a8">${escape(sotto.slice(0, 70))}</text>
    <text x="80" y="580" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#faf7f1" opacity="0.85">Pronto soccorso 24/7 · ${escape(clinica.contatti.telefono.visualizzato)} · Portici (NA)</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
