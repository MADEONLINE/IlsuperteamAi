/**
 * Immagini Open Graph generate a build time (1200×630) per le pagine principali,
 * con titolo reale della pagina. Nessun servizio esterno.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { clinica } from '@lib/clinica';
import { schedaCondivisione } from '@lib/scheda-og.mjs';

export const getStaticPaths: GetStaticPaths = async () => {
  const servizi = await getCollection('servizi');
  const articoli = await getCollection('articoli');
  const campagne = await getCollection('campagne');
  const statiche: Array<[string, string, string]> = [
    [
      'pronto-soccorso',
      'Pronto soccorso veterinario 24 ore su 24',
      'Siamo aperti adesso · Portici',
    ],
    ['prenota', 'Prenota una visita', 'Visite, vaccini e controlli su appuntamento'],
    [
      'per-i-colleghi',
      'TC, endoscopia e chirurgia in service',
      'Il paziente torna sempre al collega',
    ],
    ['la-struttura', 'La struttura', 'Clinica veterinaria h24 a Portici'],
    ['equipe', 'I nostri medici', 'Medici veterinari e specialisti'],
    ['servizi', 'Tutti i servizi', 'Dalla visita alla terapia intensiva'],
    ['magazine', 'Magazine', 'Guide scritte dal nostro team'],
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
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const { titolo, sotto } = props as { titolo: string; sotto: string };
  // Logo originale (albero con i quattro animali) in versione chiara su fondo scuro.
  const png: Buffer = await schedaCondivisione({
    titolo,
    sotto,
    piede: `Pronto soccorso 24 ore su 24 · ${clinica.contatti.telefono.visualizzato} · Portici (NA)`,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
